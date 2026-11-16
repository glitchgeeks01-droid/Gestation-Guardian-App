/**
 * Document Upload Pipeline & Magic-Byte MIME Validation (F6 & S17)
 * Standards: OWASP API Security Top 10 (API8: Unrestricted Uploads), HIPAA Security Rule
 * Security Requirements Owned: S17 (10MB Cap, Magic-Byte MIME Validation, Randomized Keys)
 * Scope: backend/src/modules/documents/documents.pipeline.ts
 */

import * as crypto from 'crypto';

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

export const documentUploadPipeline = new DocumentUploadPipeline();
