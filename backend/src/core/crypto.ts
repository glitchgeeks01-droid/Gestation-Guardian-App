/**
 * Field-Level Envelope Encryption Module
 * Standards: OWASP MASVS L2 (M10), HIPAA Security Rule (45 CFR § 164.312(a)(2)(iv)), NIST SP 800-57
 * Security Requirements Owned: S14 (Envelope Encryption), S5 (Tenant-bound Cryptographic Isolation via AAD)
 */

import * as crypto from 'crypto';

/**
 * Standard Encrypted Payload structure stored in JSONB columns
 */
export interface EncryptedFieldPayload {
  keyVersion: number;
  iv: string;         // base64
  authTag: string;    // base64
  ciphertext: string; // base64
  wrappedDek: string; // base64
}

/**
 * Explicit Authentication Verification Error thrown when ciphertext, auth tag,
 * or AAD (user_id/field_name) tampering is detected.
 */
export class AuthenticationVerificationError extends Error {
  constructor(message: string = 'Authentication verification failed: ciphertext, auth tag, or AAD has been tampered with') {
    super(message);
    this.name = 'AuthenticationVerificationError';
    Object.setPrototypeOf(this, AuthenticationVerificationError.prototype);
  }
}

// Master Key Store for Envelope Encryption (Mock KMS / Key Provider)
// In production, wrapping/unwrapping delegates to AWS KMS / GCP KMS / HashiCorp Vault.
const masterKeyRegistry = new Map<number, Buffer>();

// Default fallback development/test key: 32 bytes (256-bit)
const DEFAULT_DEV_KEK = crypto.createHash('sha256').update('gestation-guardian-dev-master-kek-2026').digest();
masterKeyRegistry.set(1, DEFAULT_DEV_KEK);

// Allow environment variable override: MASTER_KEY_HEX or MASTER_KEK_V1
if (process.env.MASTER_KEY_HEX) {
  masterKeyRegistry.set(1, Buffer.from(process.env.MASTER_KEY_HEX, 'hex'));
}
if (process.env.MASTER_KEK_V1) {
  masterKeyRegistry.set(1, Buffer.from(process.env.MASTER_KEK_V1, 'hex'));
}
if (process.env.MASTER_KEK_V2) {
  masterKeyRegistry.set(2, Buffer.from(process.env.MASTER_KEK_V2, 'hex'));
}

let activeKeyVersion = 1;

/**
 * Register or update a Master Key Encryption Key (KEK) for a specific version.
 * Keys must be 32 bytes (256 bits).
 */
export function registerMasterKey(version: number, key: string | Buffer): void {
  const buf = typeof key === 'string'
    ? (key.length === 64 ? Buffer.from(key, 'hex') : Buffer.from(key, 'base64'))
    : key;

  if (buf.length !== 32) {
    throw new Error(`Master KEK must be exactly 32 bytes (256 bits). Received ${buf.length} bytes.`);
  }
  masterKeyRegistry.set(version, buf);
}

/**
 * Retrieve the active master key version.
 */
export function getActiveKeyVersion(): number {
  return activeKeyVersion;
}

/**
 * Set the active master key version used for new encryptions.
 */
export function setActiveKeyVersion(version: number): void {
  if (!masterKeyRegistry.has(version)) {
    throw new Error(`Cannot set active key version to ${version}: Key not found in registry.`);
  }
  activeKeyVersion = version;
}

/**
 * Retrieve the Master KEK for a given version.
 */
function getMasterKey(version: number): Buffer {
  const key = masterKeyRegistry.get(version);
  if (!key) {
    throw new Error(`Master KEK version ${version} not found in KMS registry.`);
  }
  return key;
}

/**
 * Construct Additional Authenticated Data (AAD) binding ciphertext to a specific tenant and field.
 * S5 + S14: Prevents cross-tenant ciphertext swapping and field substitution attacks.
 */
export function buildAAD(userId: string, fieldName: string): Buffer {
  if (!userId || !fieldName) {
    throw new Error('Both userId and fieldName are required to construct AAD.');
  }
  return Buffer.from(`${userId}:${fieldName}`, 'utf8');
}

/**
 * Wrap an ephemeral 256-bit DEK using the Master KEK (AES-256-GCM authenticated wrapping).
 * Returns a base64-encoded string containing: wrapIv (12 bytes) + wrapTag (16 bytes) + wrappedDek (32 bytes).
 */
export function wrapDek(dek: Buffer, kek: Buffer): string {
  const wrapIv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', kek, wrapIv);
  const wrapped = Buffer.concat([cipher.update(dek), cipher.final()]);
  const wrapTag = cipher.getAuthTag();

  return Buffer.concat([wrapIv, wrapTag, wrapped]).toString('base64');
}

/**
 * Unwrap a DEK using the Master KEK.
 * Throws AuthenticationVerificationError if the wrapped DEK has been tampered with.
 */
export function unwrapDek(wrappedDekB64: string, kek: Buffer): Buffer {
  try {
    const raw = Buffer.from(wrappedDekB64, 'base64');
    if (raw.length < 12 + 16 + 16) {
      throw new AuthenticationVerificationError('Malformed wrapped DEK payload.');
    }

    const wrapIv = raw.subarray(0, 12);
    const wrapTag = raw.subarray(12, 28);
    const wrappedDekCiphertext = raw.subarray(28);

    const decipher = crypto.createDecipheriv('aes-256-gcm', kek, wrapIv);
    decipher.setAuthTag(wrapTag);
    const dek = Buffer.concat([decipher.update(wrappedDekCiphertext), decipher.final()]);
    return dek;
  } catch (err: any) {
    if (err instanceof AuthenticationVerificationError) {
      throw err;
    }
    throw new AuthenticationVerificationError(`Failed to unwrap DEK: ${err.message}`);
  }
}

/**
 * Encrypt a field using Envelope Encryption (AES-256-GCM + Ephemeral DEK + KMS KEK).
 * 
 * @param plaintext Plaintext string to encrypt.
 * @param userId Authenticated user UUID for tenant AAD binding.
 * @param fieldName Target column or property name for field AAD binding.
 * @param keyVersion Optional key version (defaults to activeKeyVersion).
 */
export function encryptField(
  plaintext: string,
  userId: string,
  fieldName: string,
  keyVersion: number = activeKeyVersion
): EncryptedFieldPayload {
  const kek = getMasterKey(keyVersion);

  // 1. Generate ephemeral 256-bit DEK
  const dek = crypto.randomBytes(32);

  // 2. Generate 12-byte IV for AES-256-GCM
  const iv = crypto.randomBytes(12);

  // 3. Encrypt plaintext with AES-256-GCM using DEK and AAD
  const cipher = crypto.createCipheriv('aes-256-gcm', dek, iv);
  const aad = buildAAD(userId, fieldName);
  cipher.setAAD(aad);

  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // 4. Wrap DEK with KEK
  const wrappedDek = wrapDek(dek, kek);

  // Securely clear ephemeral DEK from memory if possible
  dek.fill(0);

  return {
    keyVersion,
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64'),
    ciphertext: ciphertext.toString('base64'),
    wrappedDek
  };
}

/**
 * Decrypt a field using Envelope Encryption.
 * Verifies authentication tag and AAD (userId + fieldName).
 * Throws AuthenticationVerificationError if tampered or tenant mismatch.
 * 
 * @param payload Encrypted payload (object or serialized JSON string).
 * @param userId Authenticated user UUID.
 * @param fieldName Target column or property name.
 */
export function decryptField(
  payload: EncryptedFieldPayload | Record<string, any> | string,
  userId: string,
  fieldName: string
): string {
  let parsed: any = payload;
  if (typeof payload === 'string') {
    try {
      parsed = JSON.parse(payload);
    } catch {
      throw new AuthenticationVerificationError('Invalid encrypted payload JSON.');
    }
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new AuthenticationVerificationError('Invalid encrypted payload structure.');
  }

  // Support both camelCase and snake_case properties
  const keyVersion = parsed.keyVersion ?? parsed.key_version;
  const ivB64 = parsed.iv;
  const authTagB64 = parsed.authTag ?? parsed.auth_tag;
  const ciphertextB64 = parsed.ciphertext;
  const wrappedDekB64 = parsed.wrappedDek ?? parsed.wrapped_dek;

  if (!keyVersion || !ivB64 || !authTagB64 || !ciphertextB64 || !wrappedDekB64) {
    throw new AuthenticationVerificationError('Missing required envelope encryption fields.');
  }

  const kek = getMasterKey(Number(keyVersion));

  // 1. Unwrap ephemeral DEK
  const dek = unwrapDek(wrappedDekB64, kek);

  try {
    const iv = Buffer.from(ivB64, 'base64');
    const authTag = Buffer.from(authTagB64, 'base64');
    const ciphertext = Buffer.from(ciphertextB64, 'base64');

    if (iv.length !== 12) {
      throw new AuthenticationVerificationError('Invalid IV length for AES-GCM (must be 12 bytes).');
    }
    if (authTag.length !== 16) {
      throw new AuthenticationVerificationError('Invalid Auth Tag length for AES-GCM (must be 16 bytes).');
    }

    // 2. Decrypt with AES-256-GCM using unwrapped DEK and verify AAD
    const decipher = crypto.createDecipheriv('aes-256-gcm', dek, iv);
    decipher.setAuthTag(authTag);
    const aad = buildAAD(userId, fieldName);
    decipher.setAAD(aad);

    const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return plaintext.toString('utf8');
  } catch (err: any) {
    if (err instanceof AuthenticationVerificationError) {
      throw err;
    }
    throw new AuthenticationVerificationError(
      `Authentication verification failed: ciphertext or auth tag has been tampered with (${err.message})`
    );
  } finally {
    // Clear recovered DEK from memory
    dek.fill(0);
  }
}

/**
 * Re-encrypt an existing encrypted payload under a new Key Version (Key Rotation).
 */
export function rotateField(
  payload: EncryptedFieldPayload | Record<string, any> | string,
  userId: string,
  fieldName: string,
  newKeyVersion: number = activeKeyVersion
): EncryptedFieldPayload {
  const plaintext = decryptField(payload, userId, fieldName);
  return encryptField(plaintext, userId, fieldName, newKeyVersion);
}

/**
 * Helper to encrypt an arbitrary JSON-serializable object.
 */
export function encryptJson(
  data: any,
  userId: string,
  fieldName: string,
  keyVersion?: number
): EncryptedFieldPayload {
  const jsonString = JSON.stringify(data);
  return encryptField(jsonString, userId, fieldName, keyVersion);
}

/**
 * Helper to decrypt and parse an arbitrary JSON object.
 */
export function decryptJson<T = any>(
  payload: EncryptedFieldPayload | Record<string, any> | string,
  userId: string,
  fieldName: string
): T {
  const jsonString = decryptField(payload, userId, fieldName);
  return JSON.parse(jsonString) as T;
}
