/**
 * Security Verification Test Suite: S14 (Field-Level Envelope Encryption & Key Management)
 * Standards: OWASP MASVS L2 (M10), NIST SP 800-57, HIPAA Security Rule (45 CFR § 164.312(a)(2)(iv))
 * Security Requirements Owned: S14 (AES-256-GCM Envelope Encryption, Tamper Tag Verification, Key Rotation)
 * Scope: backend/test/s14_crypto.test.ts
 */

import * as crypto from 'crypto';
import { describe, it, beforeEach, expect } from './test_helper.ts';
import {
  encryptField,
  decryptField,
  registerMasterKey,
  setActiveKeyVersion,
  getActiveKeyVersion,
  AuthenticationVerificationError,
  buildAAD
} from '../src/core/crypto.ts';

describe('S14: Field-Level Envelope Encryption & Key Management', () => {
  const TEST_USER_ID = '11111111-2222-3333-4444-555555555555';
  const ATTACKER_USER_ID = '99999999-8888-7777-6666-555555555555';
  const FIELD_NAME = 'clinical_notes';

  // Seed deterministic Master KEK version 1 for test repeatability
  const KEK_V1 = crypto.createHash('sha256').update('test-master-kek-version-1-seed-2026').digest();
  const KEK_V2 = crypto.createHash('sha256').update('test-master-kek-version-2-seed-2026').digest();

  beforeEach(() => {
    registerMasterKey(1, KEK_V1);
    setActiveKeyVersion(1);
  });

  describe('Round-Trip Encryption & Decryption Verification', () => {
    it('encrypts and decrypts simple text returning the exact original data', () => {
      const plaintext = 'Patient reports mild Braxton Hicks contractions at 34 weeks gestation.';
      const encrypted = encryptField(plaintext, TEST_USER_ID, FIELD_NAME);

      expect(encrypted).toBeDefined();
      expect(encrypted.keyVersion).toBe(1);
      expect(typeof encrypted.ciphertext).toBe('string');
      expect(typeof encrypted.iv).toBe('string');
      expect(typeof encrypted.authTag).toBe('string');
      expect(typeof encrypted.wrappedDek).toBe('string');

      const decrypted = decryptField(encrypted, TEST_USER_ID, FIELD_NAME);
      expect(decrypted).toBe(plaintext);
    });

    it('encrypts and decrypts multi-byte UTF-8, symbols, and clinical formatting accurately', () => {
      const complexData = JSON.stringify({
        systolic: 124,
        diastolic: 82,
        notes: 'Clinical observations: Fetal HR ~ 145 bpm. 👶 Multi-byte test: ä, ö, ü, ß, 中文, العربية.',
        timestamp: '2026-11-16T12:34:56.789Z'
      });

      const encrypted = encryptField(complexData, TEST_USER_ID, FIELD_NAME);
      const decrypted = decryptField(encrypted, TEST_USER_ID, FIELD_NAME);
      expect(decrypted).toBe(complexData);

      const parsed = JSON.parse(decrypted);
      expect(parsed.systolic).toBe(124);
      expect(parsed.notes).toContain('👶');
    });

    it('generates distinct IVs and ciphertexts for identical plaintext inputs (Semantic Security)', () => {
      const plaintext = 'Identical vital measurement notes';
      const enc1 = encryptField(plaintext, TEST_USER_ID, FIELD_NAME);
      const enc2 = encryptField(plaintext, TEST_USER_ID, FIELD_NAME);

      expect(enc1.iv).not.toBe(enc2.iv);
      expect(enc1.ciphertext).not.toBe(enc2.ciphertext);
      expect(enc1.wrappedDek).not.toBe(enc2.wrappedDek);

      expect(decryptField(enc1, TEST_USER_ID, FIELD_NAME)).toBe(plaintext);
      expect(decryptField(enc2, TEST_USER_ID, FIELD_NAME)).toBe(plaintext);
    });
  });

  describe('Tamper Resistance & Authentication Verification Exceptions', () => {
    it('throws explicit AuthenticationVerificationError when a single byte in ciphertext is tampered with', () => {
      const plaintext = 'Confidential patient ultrasound diagnosis';
      const encrypted = encryptField(plaintext, TEST_USER_ID, FIELD_NAME);

      // Mutate 1 byte in base64 ciphertext
      const rawCipher = Buffer.from(encrypted.ciphertext, 'base64');
      rawCipher[0] = rawCipher[0] ^ 0xff; // Flip bits in first byte
      const tamperedCiphertext = rawCipher.toString('base64');

      const tamperedPayload = {
        ...encrypted,
        ciphertext: tamperedCiphertext
      };

      expect(() => {
        decryptField(tamperedPayload, TEST_USER_ID, FIELD_NAME);
      }).toThrow(AuthenticationVerificationError);
    });

    it('throws explicit AuthenticationVerificationError when a single byte in authTag is tampered with', () => {
      const plaintext = 'Confidential patient lab results';
      const encrypted = encryptField(plaintext, TEST_USER_ID, FIELD_NAME);

      // Mutate 1 byte in auth tag
      const rawTag = Buffer.from(encrypted.authTag, 'base64');
      rawTag[rawTag.length - 1] = rawTag[rawTag.length - 1] ^ 0x01; // Flip bit in last byte
      const tamperedAuthTag = rawTag.toString('base64');

      const tamperedPayload = {
        ...encrypted,
        authTag: tamperedAuthTag
      };

      expect(() => {
        decryptField(tamperedPayload, TEST_USER_ID, FIELD_NAME);
      }).toThrow(AuthenticationVerificationError);
    });

    it('throws explicit AuthenticationVerificationError when IV is tampered with', () => {
      const plaintext = 'Confidential prescription data';
      const encrypted = encryptField(plaintext, TEST_USER_ID, FIELD_NAME);

      const rawIv = Buffer.from(encrypted.iv, 'base64');
      rawIv[0] = rawIv[0] ^ 0x55;
      const tamperedIv = rawIv.toString('base64');

      const tamperedPayload = {
        ...encrypted,
        iv: tamperedIv
      };

      expect(() => {
        decryptField(tamperedPayload, TEST_USER_ID, FIELD_NAME);
      }).toThrow(AuthenticationVerificationError);
    });

    it('throws explicit AuthenticationVerificationError when wrapped DEK is tampered with', () => {
      const plaintext = 'Confidential fetal heart tracing';
      const encrypted = encryptField(plaintext, TEST_USER_ID, FIELD_NAME);

      const rawWrapped = Buffer.from(encrypted.wrappedDek, 'base64');
      rawWrapped[rawWrapped.length - 1] = rawWrapped[rawWrapped.length - 1] ^ 0xaa;
      const tamperedWrapped = rawWrapped.toString('base64');

      const tamperedPayload = {
        ...encrypted,
        wrappedDek: tamperedWrapped
      };

      expect(() => {
        decryptField(tamperedPayload, TEST_USER_ID, FIELD_NAME);
      }).toThrow(AuthenticationVerificationError);
    });

    it('prevents cross-tenant ciphertext swapping via AAD mismatch (throws AuthenticationVerificationError)', () => {
      const plaintext = 'User A confidential medical entry';
      // Encrypt for User A with AAD bound to User A
      const encrypted = encryptField(plaintext, TEST_USER_ID, FIELD_NAME);

      // User B attempts to decrypt User A ciphertext as their own
      expect(() => {
        decryptField(encrypted, ATTACKER_USER_ID, FIELD_NAME);
      }).toThrow(AuthenticationVerificationError);
    });

    it('prevents cross-field ciphertext swapping via AAD mismatch (throws AuthenticationVerificationError)', () => {
      const plaintext = 'Doctor recommendation field data';
      const encrypted = encryptField(plaintext, TEST_USER_ID, 'doctor_notes');

      // Attempting to decrypt under different field name fails AAD check
      expect(() => {
        decryptField(encrypted, TEST_USER_ID, 'patient_symptoms');
      }).toThrow(AuthenticationVerificationError);
    });
  });

  describe('Key Rotation Verification (Dual-Version Support)', () => {
    it('seamlessly decrypts key_version 1 payloads after active key is rotated to key_version 2', () => {
      // Step 1: Encrypt data D1 under active key_version 1
      const dataV1 = 'Historical clinical entry encrypted under KEK v1';
      expect(getActiveKeyVersion()).toBe(1);
      const encryptedV1 = encryptField(dataV1, TEST_USER_ID, FIELD_NAME);
      expect(encryptedV1.keyVersion).toBe(1);

      // Step 2: Register Master KEK v2 and rotate active key to v2
      registerMasterKey(2, KEK_V2);
      setActiveKeyVersion(2);
      expect(getActiveKeyVersion()).toBe(2);

      // Step 3: Encrypt new data D2 under active key_version 2
      const dataV2 = 'New clinical entry encrypted under KEK v2';
      const encryptedV2 = encryptField(dataV2, TEST_USER_ID, FIELD_NAME);
      expect(encryptedV2.keyVersion).toBe(2);

      // Step 4: Verify that legacy data D1 (key_version 1) still decrypts seamlessly
      const decryptedV1 = decryptField(encryptedV1, TEST_USER_ID, FIELD_NAME);
      expect(decryptedV1).toBe(dataV1);

      // Step 5: Verify that new data D2 (key_version 2) decrypts seamlessly
      const decryptedV2 = decryptField(encryptedV2, TEST_USER_ID, FIELD_NAME);
      expect(decryptedV2).toBe(dataV2);
    });

    it('throws when attempting to decrypt with an unregistered key version', () => {
      const encrypted = encryptField('Sample data', TEST_USER_ID, FIELD_NAME);
      const unkownVersionPayload = {
        ...encrypted,
        keyVersion: 999 // Unregistered version
      };

      expect(() => {
        decryptField(unkownVersionPayload, TEST_USER_ID, FIELD_NAME);
      }).toThrow();
    });
  });
});
