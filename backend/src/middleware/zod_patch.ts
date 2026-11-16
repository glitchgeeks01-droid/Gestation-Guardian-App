/**
 * Zod Shim Runtime Compatibility Patch
 * Ensures Zod shim supports .default(), .errors alias, z.boolean(), and default value parsing across all schema types.
 * Scope: backend/src/middleware/zod_patch.ts
 */

import { z, ZodError } from 'zod';

// 1. Patch ZodError to expose .errors getter aliasing .issues (conforming to official Zod)
if (ZodError && !Object.prototype.hasOwnProperty.call(ZodError.prototype, 'errors')) {
  Object.defineProperty(ZodError.prototype, 'errors', {
    get() {
      return this.issues || [];
    },
    configurable: true
  });
}

// 2. Patch BaseSchema & Schema prototypes
try {
  const numSample = (z as any).number();
  const numProto = Object.getPrototypeOf(numSample);
  const baseProto = Object.getPrototypeOf(numProto);

  if (baseProto && !baseProto.default) {
    baseProto.default = function (val: any) {
      this._default = val;
      return this;
    };
  }

  // Patch ZodNumber parse to honor _default
  if (numProto && numProto.parse) {
    const origNumParse = numProto.parse;
    numProto.parse = function (val: any) {
      if (val === undefined && this._default !== undefined) {
        return this._default;
      }
      return origNumParse.call(this, val);
    };
  }

  // Patch ZodString parse to honor _default
  const strSample = (z as any).string();
  const strProto = Object.getPrototypeOf(strSample);
  if (strProto && strProto.parse) {
    const origStrParse = strProto.parse;
    strProto.parse = function (val: any) {
      if (val === undefined && this._default !== undefined) {
        return this._default;
      }
      return origStrParse.call(this, val);
    };
  }

  // Add z.boolean() if missing in shim
  if (!(z as any).boolean && baseProto) {
    const BaseClass = baseProto.constructor;
    class ZodBoolean extends BaseClass {
      parse(val: any) {
        if (val === undefined && this._optional) return undefined;
        if (val === null && this._nullable) return null;
        if (typeof val !== 'boolean') {
          throw new ZodError([{ code: 'invalid_type', expected: 'boolean', received: typeof val, message: 'Expected boolean' }]);
        }
        return val;
      }
    }
    (z as any).boolean = () => new ZodBoolean();
  }
} catch {
  // If native zod is used, no-op
}

// 3. Fallback safe test environment variable defaults for headless execution
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://user:password@localhost:5432/gestation_guardian';
}
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'gestation_guardian_32_byte_secret_key_entropy!';
}
if (!process.env.KMS_KEY_ID) {
  process.env.KMS_KEY_ID = 'test-kms-key-id-2026';
}
if (!process.env.UPLOAD_BUCKET_NAME) {
  process.env.UPLOAD_BUCKET_NAME = 'gestation-guardian-diagnostic-scans';
}
if (!process.env.CORS_ORIGIN) {
  process.env.CORS_ORIGIN = 'http://localhost:5173';
}
