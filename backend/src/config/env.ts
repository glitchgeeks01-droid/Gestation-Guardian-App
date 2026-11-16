import { z, ZodError } from 'zod';

declare const process: {
  env: Record<string, string | undefined>;
  exit: (code?: number) => never;
  loadEnvFile?: () => void;
};

/**
 * Gestation Guardian - Environment Configuration & Schema Validation
 *
 * Implements S1 (No hardcoded secrets) and S7/API4 (Strict schema validation).
 * Fails fast at application startup if any required environment variable is missing or malformed.
 */

// Attempt to load .env file if running in Node.js 20.6+ native environment
try {
  if (typeof process.loadEnvFile === 'function') {
    process.loadEnvFile();
  }
} catch {
  // .env file not present or already loaded; continue to schema parsing
}

export const envSchema = z.object({
  // Runtime Environment
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z
    .coerce
    .number()
    .int()
    .min(1, 'PORT must be between 1 and 65535')
    .max(65535, 'PORT must be between 1 and 65535')
    .default(3000),

  // Database Connection (PostgreSQL 16)
  DATABASE_URL: z
    .string({
      required_error: 'DATABASE_URL is required',
    })
    .min(1, 'DATABASE_URL cannot be empty')
    .refine(
      (url: string) => url.startsWith('postgresql://') || url.startsWith('postgres://'),
      {
        message: 'DATABASE_URL must be a valid PostgreSQL connection string starting with postgresql://',
      }
    ),

  // Authentication & Session Security (S4)
  JWT_SECRET: z
    .string({
      required_error: 'JWT_SECRET is required for token signing',
    })
    .min(32, 'JWT_SECRET must be at least 32 characters long to ensure cryptographic entropy'),
  JWT_EXPIRES_IN: z
    .string()
    .default('15m'),
  REFRESH_TOKEN_EXPIRES_IN: z
    .string()
    .default('7d'),

  // Envelope Encryption & Cloud KMS (S14)
  KMS_KEY_ID: z
    .string({
      required_error: 'KMS_KEY_ID is required for envelope encryption',
    })
    .min(1, 'KMS_KEY_ID cannot be empty'),
  AWS_REGION: z
    .string()
    .default('us-east-1'),
  AWS_ENDPOINT_URL: z
    .string()
    .url('AWS_ENDPOINT_URL must be a valid URL')
    .optional(),

  // Network & CORS Policy (S15, API5)
  CORS_ORIGIN: z
    .string({
      required_error: 'CORS_ORIGIN is required to prevent unauthorized cross-origin access',
    })
    .min(1, 'CORS_ORIGIN cannot be empty')
    .refine((origin: string) => origin.trim() !== '*', {
      message: "Wildcard CORS origin '*' is strictly prohibited for maternal health telemetry",
    }),

  // Rate Limiting (S6, API3)
  RATE_LIMIT_WINDOW_MS: z
    .coerce
    .number()
    .int()
    .positive('RATE_LIMIT_WINDOW_MS must be a positive integer')
    .default(900000), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: z
    .coerce
    .number()
    .int()
    .positive('RATE_LIMIT_MAX_REQUESTS must be a positive integer')
    .default(100),
  AUTH_RATE_LIMIT_MAX_REQUESTS: z
    .coerce
    .number()
    .int()
    .positive('AUTH_RATE_LIMIT_MAX_REQUESTS must be a positive integer')
    .default(5),

  // Encrypted Diagnostic Storage Pipeline (S17, API8)
  UPLOAD_BUCKET_NAME: z
    .string({
      required_error: 'UPLOAD_BUCKET_NAME is required for document storage',
    })
    .min(1, 'UPLOAD_BUCKET_NAME cannot be empty'),
  MAX_UPLOAD_FILE_SIZE_BYTES: z
    .coerce
    .number()
    .int()
    .positive('MAX_UPLOAD_FILE_SIZE_BYTES must be a positive integer')
    .default(10485760), // 10 MB
});

export type EnvConfig = z.infer<typeof envSchema>;

/**
 * Validates the provided environment variables against the schema.
 * Fails fast by logging formatted diagnostics and exiting or throwing ZodError.
 */
export function validateEnv(rawEnv: Record<string, unknown> = process.env): EnvConfig {
  const result = envSchema.safeParse(rawEnv);

  if (!result.success) {
    const errorDetails = result.error.errors.map((err) => ({
      variable: err.path.join('.'),
      error: err.message,
    }));

    console.error('================================================================================');
    console.error('🚨 FATAL: Environment Configuration Validation Failed');
    console.error('================================================================================');
    for (const item of errorDetails) {
      console.error(`  - [${item.variable}]: ${item.error}`);
    }
    console.error('================================================================================');
    console.error('Please verify your .env file against .env.example');
    console.error('================================================================================');

    // In non-test environments, immediately exit process with failure code 1
    if (rawEnv.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }

    throw new ZodError(result.error.errors);
  }

  return result.data;
}

// Automatically validate and export typed config object at module initialization
let validatedEnv: EnvConfig;
try {
  validatedEnv = validateEnv(process.env);
} catch (error) {
  // If in test environment without full process.env, provide a lazy-validated proxy or preserve error
  if (process.env.NODE_ENV === 'test') {
    validatedEnv = {} as EnvConfig;
  } else {
    throw error;
  }
}

export const env: EnvConfig = validatedEnv;
export default env;
