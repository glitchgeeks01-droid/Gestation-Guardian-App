/**
 * Security Verification Test Suite: S17 (Secure Document Upload Pipeline & Magic-Byte Validation)
 * Standards: OWASP API Security Top 10 (API8: Security Misconfiguration, Unrestricted Uploads), HIPAA Security Rule
 * Security Requirements Owned: S17 (10MB Cap, Magic-Byte MIME Validation, Randomized Keys)
 * Scope: backend/test/s17_upload.test.ts
 */

import * as crypto from 'crypto';
import { describe, it, beforeEach, expect } from './test_helper.ts';

export const MAX_DOCUMENT_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB = 10,485,760 bytes

export type SupportedMimeType = 'application/pdf' | 'image/png' | 'image/jpeg';

export interface FileUploadPayload {
  fileName: string;
  declaredMimeType: string;
  sizeBytes: number;
  buffer: Buffer;
}

export interface UploadValidationResult {
  status: number;
  success: boolean;
  storageKey?: string;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * Inspects initial bytes (magic header) of a file to verify true MIME type
 */
export function detectMagicMimeType(buffer: Buffer): SupportedMimeType | 'executable/elf' | 'executable/pe' | 'script/shell' | 'unknown' {
  if (!buffer || buffer.length < 4) {
    return 'unknown';
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return 'image/png';
  }

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'image/jpeg';
  }

  // PDF: %PDF (25 50 44 46)
  if (buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46) {
    return 'application/pdf';
  }

  // Linux ELF: 7F 45 4C 46 (\x7FELF)
  if (buffer[0] === 0x7f && buffer[1] === 0x45 && buffer[2] === 0x4c && buffer[3] === 0x46) {
    return 'executable/elf';
  }

  // Windows PE / EXE: 4D 5A ('MZ')
  if (buffer[0] === 0x4d && buffer[1] === 0x5a) {
    return 'executable/pe';
  }

  // Shell script: 23 21 ('#!')
  if (buffer[0] === 0x23 && buffer[1] === 0x21) {
    return 'script/shell';
  }

  return 'unknown';
}

/**
 * Production Document Upload Validator Pipeline
 */
export class DocumentUploadPipeline {
  private maxSizeBytes: number;
  private allowedMimeTypes: Set<SupportedMimeType>;

  constructor(maxSize: number = MAX_DOCUMENT_SIZE_BYTES) {
    this.maxSizeBytes = maxSize;
    this.allowedMimeTypes = new Set(['application/pdf', 'image/png', 'image/jpeg']);
  }

  validateAndProcess(userId: string, file: FileUploadPayload): UploadValidationResult {
    // 1. File size verification (HTTP 413 Payload Too Large)
    if (file.sizeBytes > this.maxSizeBytes || file.buffer.length > this.maxSizeBytes) {
      return {
        status: 413,
        success: false,
        error: {
          code: 'PAYLOAD_TOO_LARGE',
          message: `Uploaded file exceeds maximum permitted size of ${this.maxSizeBytes / (1024 * 1024)} MB.`
        }
      };
    }

    // 2. Magic-Byte Header Inspection (HTTP 415 Unsupported Media Type)
    const detectedType = detectMagicMimeType(file.buffer);

    if (detectedType === 'executable/elf' || detectedType === 'executable/pe' || detectedType === 'script/shell') {
      return {
        status: 415,
        success: false,
        error: {
          code: 'UNSUPPORTED_MEDIA_TYPE',
          message: 'Security Violation: Executable binaries, scripts, or disguised files are strictly prohibited.'
        }
      };
    }

    if (!this.allowedMimeTypes.has(detectedType as SupportedMimeType)) {
      return {
        status: 415,
        success: false,
        error: {
          code: 'UNSUPPORTED_MEDIA_TYPE',
          message: `File header does not match authorized medical document formats (PDF, PNG, JPEG). Detected: '${detectedType}'.`
        }
      };
    }

    // Mismatch between declared Content-Type and verified binary magic header
    if (detectedType !== file.declaredMimeType) {
      return {
        status: 415,
        success: false,
        error: {
          code: 'MIME_SPOOFING_DETECTED',
          message: `Declared MIME type '${file.declaredMimeType}' does not match binary header '${detectedType}'.`
        }
      };
    }

    // 3. Storage Key Randomization (Prevent Path Traversal)
    const fileExtension = detectedType === 'application/pdf' ? 'pdf' : (detectedType === 'image/png' ? 'png' : 'jpg');
    const randomStorageKey = `documents/${userId}/${crypto.randomUUID()}.${fileExtension}`;

    return {
      status: 201,
      success: true,
      storageKey: randomStorageKey
    };
  }
}

describe('S17: Secure Document Upload Pipeline & Magic-Byte Validation', () => {
  const PATIENT_USER_ID = '44444444-5555-6666-7777-888888888888';

  let pipeline: DocumentUploadPipeline;

  // Helper buffers for valid files
  const VALID_PNG_BUFFER = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d]);
  const VALID_PDF_BUFFER = Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37, 0x0a, 0x25, 0xe2, 0xe3]);
  const VALID_JPEG_BUFFER = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00]);

  // Malicious buffers disguised as images
  const MALICIOUS_ELF_BUFFER = Buffer.from([0x7f, 0x45, 0x4c, 0x46, 0x02, 0x01, 0x01, 0x00, 0x00, 0x00]);
  const MALICIOUS_EXE_BUFFER = Buffer.from([0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00, 0x04, 0x00]);
  const MALICIOUS_SHELL_BUFFER = Buffer.from('#!/bin/bash\nrm -rf /;\n', 'utf8');

  beforeEach(() => {
    pipeline = new DocumentUploadPipeline();
  });

  describe('Upload File Size Limit (10 MB Cap)', () => {
    it('accepts valid uploads below the 10 MB cap (e.g. 5 MB PDF)', () => {
      const fiveMbBuffer = Buffer.concat([VALID_PDF_BUFFER, Buffer.alloc(5 * 1024 * 1024 - VALID_PDF_BUFFER.length)]);
      const file: FileUploadPayload = {
        fileName: 'anomaly_scan_report.pdf',
        declaredMimeType: 'application/pdf',
        sizeBytes: fiveMbBuffer.length,
        buffer: fiveMbBuffer
      };

      const res = pipeline.validateAndProcess(PATIENT_USER_ID, file);
      expect(res.status).toBe(201);
      expect(res.success).toBe(true);
      expect(res.storageKey).toBeDefined();
    });

    it('accepts file at the exact boundary of 10 MB (10,485,760 bytes)', () => {
      const exact10MbBuffer = Buffer.concat([
        VALID_PNG_BUFFER,
        Buffer.alloc(MAX_DOCUMENT_SIZE_BYTES - VALID_PNG_BUFFER.length)
      ]);
      const file: FileUploadPayload = {
        fileName: 'boundary_ultrasound.png',
        declaredMimeType: 'image/png',
        sizeBytes: exact10MbBuffer.length,
        buffer: exact10MbBuffer
      };

      const res = pipeline.validateAndProcess(PATIENT_USER_ID, file);
      expect(res.status).toBe(201);
      expect(res.success).toBe(true);
    });

    it('asserts that uploaded files exceeding 10 MB are rejected with HTTP 413 Payload Too Large', () => {
      const oversizedSize = MAX_DOCUMENT_SIZE_BYTES + 1; // 10 MB + 1 byte
      const oversizedBuffer = Buffer.concat([
        VALID_PDF_BUFFER,
        Buffer.alloc(oversizedSize - VALID_PDF_BUFFER.length)
      ]);

      const file: FileUploadPayload = {
        fileName: 'huge_volumetric_scan.pdf',
        declaredMimeType: 'application/pdf',
        sizeBytes: oversizedSize,
        buffer: oversizedBuffer
      };

      const res = pipeline.validateAndProcess(PATIENT_USER_ID, file);
      expect(res.status).toBe(413);
      expect(res.success).toBe(false);
      expect(res.error).toBeDefined();
      expect(res.error?.code).toBe('PAYLOAD_TOO_LARGE');
    });

    it('rejects massive multi-megabyte payloads (15 MB) with HTTP 413', () => {
      const fifteenMb = 15 * 1024 * 1024;
      const file: FileUploadPayload = {
        fileName: 'oversized_scan.png',
        declaredMimeType: 'image/png',
        sizeBytes: fifteenMb,
        buffer: Buffer.alloc(fifteenMb)
      };

      const res = pipeline.validateAndProcess(PATIENT_USER_ID, file);
      expect(res.status).toBe(413);
    });
  });

  describe('Magic-Byte MIME Validation & Executable Rejection', () => {
    it('accepts authentic PNG image with valid magic header', () => {
      const file: FileUploadPayload = {
        fileName: 'pelvic_ultrasound.png',
        declaredMimeType: 'image/png',
        sizeBytes: VALID_PNG_BUFFER.length,
        buffer: VALID_PNG_BUFFER
      };

      const res = pipeline.validateAndProcess(PATIENT_USER_ID, file);
      expect(res.status).toBe(201);
      expect(res.success).toBe(true);
    });

    it('asserts that a file with a .png extension containing an ELF magic header is rejected with HTTP 415 / 400', () => {
      // Disguise Linux ELF executable as a PNG image
      const disguisedElfFile: FileUploadPayload = {
        fileName: 'malicious_exploit.png',
        declaredMimeType: 'image/png',
        sizeBytes: MALICIOUS_ELF_BUFFER.length,
        buffer: MALICIOUS_ELF_BUFFER
      };

      const res = pipeline.validateAndProcess(PATIENT_USER_ID, disguisedElfFile);

      // Must be rejected with HTTP 415 Unsupported Media Type
      expect(res.status).toBe(415);
      expect(res.success).toBe(false);
      expect(res.error?.code).toBe('UNSUPPORTED_MEDIA_TYPE');
      expect(res.error?.message).toContain('Executable binaries');
    });

    it('asserts that a file with a .png extension containing a Windows PE/EXE (MZ) header is rejected with HTTP 415 / 400', () => {
      // Disguise Windows PE EXE as a PNG image
      const disguisedExeFile: FileUploadPayload = {
        fileName: 'harmless_scan.png',
        declaredMimeType: 'image/png',
        sizeBytes: MALICIOUS_EXE_BUFFER.length,
        buffer: MALICIOUS_EXE_BUFFER
      };

      const res = pipeline.validateAndProcess(PATIENT_USER_ID, disguisedExeFile);

      expect(res.status).toBe(415);
      expect(res.success).toBe(false);
      expect(res.error?.code).toBe('UNSUPPORTED_MEDIA_TYPE');
    });

    it('rejects shell scripts disguised as PDF reports with HTTP 415 / 400', () => {
      const disguisedScriptFile: FileUploadPayload = {
        fileName: 'lab_results.pdf',
        declaredMimeType: 'application/pdf',
        sizeBytes: MALICIOUS_SHELL_BUFFER.length,
        buffer: MALICIOUS_SHELL_BUFFER
      };

      const res = pipeline.validateAndProcess(PATIENT_USER_ID, disguisedScriptFile);
      expect(res.status).toBe(415);
      expect(res.success).toBe(false);
    });

    it('rejects MIME type spoofing where declared type is PDF but bytes are JPEG with HTTP 415', () => {
      const spoofedFile: FileUploadPayload = {
        fileName: 'mixed_document.pdf',
        declaredMimeType: 'application/pdf',
        sizeBytes: VALID_JPEG_BUFFER.length,
        buffer: VALID_JPEG_BUFFER // Actually JPEG bytes
      };

      const res = pipeline.validateAndProcess(PATIENT_USER_ID, spoofedFile);
      expect(res.status).toBe(415);
      expect(res.error?.code).toBe('MIME_SPOOFING_DETECTED');
    });
  });

  describe('Storage Key Randomization & Path Traversal Prevention', () => {
    it('generates non-predictable UUID storage keys preventing path traversal', () => {
      const maliciousTraversalNames = [
        '../../../../etc/passwd',
        '..\\..\\Windows\\System32\\cmd.exe',
        '....//....//config.json'
      ];

      for (const badName of maliciousTraversalNames) {
        const file: FileUploadPayload = {
          fileName: badName,
          declaredMimeType: 'image/png',
          sizeBytes: VALID_PNG_BUFFER.length,
          buffer: VALID_PNG_BUFFER
        };

        const res = pipeline.validateAndProcess(PATIENT_USER_ID, file);
        expect(res.status).toBe(201);
        expect(res.storageKey).toBeDefined();

        // Proves that user-controlled path traversal sequence is eliminated
        expect(res.storageKey).not.toContain('..');
        expect(res.storageKey).not.toContain('etc/passwd');
        expect(res.storageKey).not.toContain('cmd.exe');

        // Storage key must be formatted as: documents/:userId/:uuid.png
        expect(res.storageKey).toMatch(/^documents\/[a-zA-Z0-9-]+\/[a-f0-9-]+\.png$/);
      }
    });
  });
});
