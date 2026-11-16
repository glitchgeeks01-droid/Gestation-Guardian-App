/**
 * Security Verification Test Suite: S1 (Secret Scanning & Hardcoded Credential Prohibition)
 * Standards: OWASP MASVS L2 (M1), HIPAA Security Rule (45 CFR § 164.312(a)(2)(iv))
 * Scope: backend/test/s1_secret_scan.test.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { spawnSync } from 'child_process';
import { describe, it, beforeEach, afterEach, expect } from './test_helper.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const CHECK_SCRIPT_PATH = path.resolve(__dirname, '../../scripts/check.js');

describe('S1: Secret Scanning & Hardcoded Credential Prohibition', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gg-s1-adversarial-'));
  });

  afterEach(() => {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup failures
    }
  });

  function runCli(target: string): { status: number | null; stdout: string; stderr: string; output: string } {
    const res = spawnSync(process.execPath, [CHECK_SCRIPT_PATH, '--check=s1', `--target=${target}`], {
      encoding: 'utf8',
      env: { ...process.env }
    });
    return {
      status: res.status,
      stdout: res.stdout || '',
      stderr: res.stderr || '',
      output: `${res.stdout || ''}\n${res.stderr || ''}`
    };
  }

  it('flags seeded fake AWS Access Key ID and exits with code 1', () => {
    const fixtureFile = path.join(tempDir, 'aws_config.ts');
    fs.writeFileSync(
      fixtureFile,
      `export const awsConfig = {\n  accessKeyId: "AKIAIOSFODNN7EXAMPLE",\n  region: "us-east-1"\n};\n`,
      'utf8'
    );

    const res = runCli(fixtureFile);
    expect(res.status).toBe(1);
    expect(res.output).toContain('AWS Access Key ID');
    expect(res.output).toContain('AKIA...MPLE');
  });

  it('flags seeded fake AWS Secret Access Key and exits with code 1', () => {
    const fixtureFile = path.join(tempDir, 'aws_secret.js');
    fs.writeFileSync(
      fixtureFile,
      `const aws_secret_access_key = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";\nmodule.exports = { aws_secret_access_key };\n`,
      'utf8'
    );

    const res = runCli(fixtureFile);
    expect(res.status).toBe(1);
    expect(res.output).toContain('AWS Secret Access Key');
  });

  it('flags seeded Cryptographic Private Key block and exits with code 1', () => {
    const fixtureFile = path.join(tempDir, 'server_key.pem');
    fs.writeFileSync(
      fixtureFile,
      `-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA0fakeadversarialrsaprivatekeydata...\n-----END RSA PRIVATE KEY-----\n`,
      'utf8'
    );

    const res = runCli(fixtureFile);
    expect(res.status).toBe(1);
    expect(res.output).toContain('Cryptographic Private Key Block');
  });

  it('flags seeded Google API Key and exits with code 1', () => {
    const fixtureFile = path.join(tempDir, 'google_maps.ts');
    // Google API keys are AIza followed by exactly 35 chars (39 chars total)
    const validGoogleKey = "AIzaSyD1234567890AbCdEfGhIjKlMnOpQrStU9";
    fs.writeFileSync(
      fixtureFile,
      `const mapsKey = "${validGoogleKey}";\n`,
      'utf8'
    );

    const res = runCli(fixtureFile);
    expect(res.status).toBe(1);
    expect(res.output).toContain('Google API Key');
  });

  it('flags seeded hardcoded cleartext database password and exits with code 1', () => {
    const fixtureFile = path.join(tempDir, 'database_creds.ts');
    // Secret password that does not contain excluded placeholder substrings like 'password'
    fs.writeFileSync(
      fixtureFile,
      `export const dbConfig = {\n  user: 'admin',\n  db_password: "LiveSuperSecretProductionToken2026!#",\n};\n`,
      'utf8'
    );

    const res = runCli(fixtureFile);
    expect(res.status).toBe(1);
    expect(res.output).toContain('Hardcoded Cleartext Password');
  });

  it('passes cleanly with exit code 0 when codebase is sanitized', () => {
    const cleanDir = path.join(tempDir, 'clean_src');
    fs.mkdirSync(cleanDir, { recursive: true });
    fs.writeFileSync(
      path.join(cleanDir, 'service.ts'),
      `// Production clean code\nexport function calculateGestationalAge(lmp: Date): number {\n  const diff = Date.now() - lmp.getTime();\n  return Math.floor(diff / (1000 * 60 * 60 * 24 * 7));\n}\n`,
      'utf8'
    );
    fs.writeFileSync(
      path.join(cleanDir, 'env.example'),
      `JWT_SECRET=replace_with_32_byte_hex_string_in_production\nDATABASE_URL=postgresql://user:password@localhost:5432/gestation_guardian\n`,
      'utf8'
    );

    const res = runCli(cleanDir);
    expect(res.status).toBe(0);
    expect(res.output).toContain('Zero secrets detected');
  });

  it('can be invoked programmatically via exported runS1Check function', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { runS1Check } = require(CHECK_SCRIPT_PATH);

    const cleanDir = path.join(tempDir, 'clean_prog');
    fs.mkdirSync(cleanDir, { recursive: true });
    fs.writeFileSync(
      path.join(cleanDir, 'clean.ts'),
      `export const APP_NAME = "Gestation Guardian";\n`,
      'utf8'
    );

    const passed = runS1Check(cleanDir);
    expect(passed).toBe(true);

    const dirtyFile = path.join(tempDir, 'dirty.ts');
    // AKIA followed by exactly 16 uppercase alphanumeric characters
    fs.writeFileSync(dirtyFile, `const key = "AKIAIOSFODNN7EXAMPLE";\n`, 'utf8');
    const failed = runS1Check(dirtyFile);
    expect(failed).toBe(false);
  });
});
