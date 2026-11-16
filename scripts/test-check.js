#!/usr/bin/env node

/**
 * Gestation Guardian - SecOps Verification Test Suite
 *
 * Verifies that scripts/check.js correctly:
 * 1. Flags a seeded fake secret (e.g., 'AKIAIOSFODNN7EXAMPLE') and exits with error code 1.
 * 2. Flags a seeded fake private key and exits with error code 1.
 * 3. Passes cleanly on sanitized files with exit code 0.
 * 4. Flags an insecure AndroidManifest with allowBackup="true" and exits with code 1.
 * 5. Generates and verifies a valid CycloneDX SBOM (S3).
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawnSync } = require('child_process');

const SCRIPT_PATH = path.resolve(__dirname, 'check.js');
let testCount = 0;
let passedCount = 0;

function assert(condition, message) {
  testCount++;
  if (!condition) {
    console.error(`  ❌ FAILED: ${message}`);
    throw new Error(`Test assertion failed: ${message}`);
  }
  passedCount++;
  console.log(`  ✔ PASSED: ${message}`);
}

function runCheck(args = []) {
  const result = spawnSync(process.execPath, [SCRIPT_PATH, ...args], {
    encoding: 'utf8',
    env: { ...process.env },
  });
  return {
    status: result.status,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    output: `${result.stdout || ''}\n${result.stderr || ''}`,
  };
}

console.log('================================================================================');
console.log('🧪 Running SecOps Script Verification Test Suite');
console.log('================================================================================\n');

// Create isolated temporary directory for test fixtures
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'secops-check-test-'));

try {
  // --------------------------------------------------------------------------
  // Test 1: S1 flags seeded AWS fake secret ('AKIAIOSFODNN7EXAMPLE') with exit 1
  // --------------------------------------------------------------------------
  console.log('Test 1: S1 flags seeded AWS fake secret with exit code 1');
  const secretFile = path.join(tempDir, 'aws-credentials.js');
  fs.writeFileSync(
    secretFile,
    '// Seeded test secret\nconst AWS_KEY = "AKIAIOSFODNN7EXAMPLE";\nmodule.exports = { AWS_KEY };\n',
    'utf8'
  );

  const res1 = runCheck([`--check=s1`, `--target=${secretFile}`]);
  assert(res1.status === 1, `Expected exit code 1 for seeded fake secret, got ${res1.status}`);
  assert(
    res1.output.includes('AWS Access Key ID'),
    'Expected output to identify AWS Access Key ID violation'
  );
  assert(
    res1.output.includes('AKIA...MPLE'),
    'Expected output to display safely redacted secret preview'
  );

  // --------------------------------------------------------------------------
  // Test 2: S1 flags seeded fake private key with exit code 1
  // --------------------------------------------------------------------------
  console.log('\nTest 2: S1 flags seeded fake RSA private key block with exit code 1');
  const keyFile = path.join(tempDir, 'id_rsa.txt');
  fs.writeFileSync(
    keyFile,
    '-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA0fakekeydata...\n-----END RSA PRIVATE KEY-----\n',
    'utf8'
  );

  const res2 = runCheck([`--check=s1`, `--target=${keyFile}`]);
  assert(res2.status === 1, `Expected exit code 1 for private key block, got ${res2.status}`);
  assert(
    res2.output.includes('Cryptographic Private Key Block'),
    'Expected output to identify Private Key violation'
  );

  // --------------------------------------------------------------------------
  // Test 3: S1 passes on clean code with exit code 0
  // --------------------------------------------------------------------------
  console.log('\nTest 3: S1 passes on clean code with exit code 0');
  const cleanDir = path.join(tempDir, 'clean_src');
  fs.mkdirSync(cleanDir, { recursive: true });
  fs.writeFileSync(
    path.join(cleanDir, 'safe.ts'),
    'export const config = { port: process.env.PORT || 3000 };\n',
    'utf8'
  );

  const res3 = runCheck([`--check=s1`, `--target=${cleanDir}`]);
  assert(res3.status === 0, `Expected exit code 0 on clean code, got ${res3.status}`);
  assert(
    res3.output.includes('[S1 PASSED]'),
    'Expected output to confirm S1 PASSED'
  );

  // --------------------------------------------------------------------------
  // Test 4: S12 flags insecure AndroidManifest with allowBackup="true"
  // --------------------------------------------------------------------------
  console.log('\nTest 4: S12 flags insecure allowBackup="true" with exit code 1');
  const insecureManifest = path.join(tempDir, 'InsecureManifest.xml');
  fs.writeFileSync(
    insecureManifest,
    `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <application android:allowBackup="true">
        <activity android:name=".MainActivity" android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`,
    'utf8'
  );

  const res4 = runCheck([`--check=s12`, `--target=${insecureManifest}`]);
  assert(res4.status === 1, `Expected exit code 1 for allowBackup="true", got ${res4.status}`);
  assert(
    res4.output.includes('Insecure android:allowBackup="true"'),
    'Expected output to report allowBackup error'
  );

  // --------------------------------------------------------------------------
  // Test 5: S12 flags debuggable="true" with exit code 1
  // --------------------------------------------------------------------------
  console.log('\nTest 5: S12 flags debuggable="true" with exit code 1');
  const debuggableManifest = path.join(tempDir, 'DebuggableManifest.xml');
  fs.writeFileSync(
    debuggableManifest,
    `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <application android:allowBackup="false" android:debuggable="true">
        <activity android:name=".MainActivity" android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`,
    'utf8'
  );

  const res5 = runCheck([`--check=s12`, `--target=${debuggableManifest}`]);
  assert(res5.status === 1, `Expected exit code 1 for debuggable="true", got ${res5.status}`);
  assert(
    res5.output.includes('android:debuggable="true" detected'),
    'Expected output to report debuggable error'
  );

  // --------------------------------------------------------------------------
  // Test 6: S12 passes on hardened AndroidManifest
  // --------------------------------------------------------------------------
  console.log('\nTest 6: S12 passes on hardened AndroidManifest');
  const hardenedManifest = path.join(tempDir, 'HardenedManifest.xml');
  fs.writeFileSync(
    hardenedManifest,
    `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />
    <application android:allowBackup="false" android:debuggable="false">
        <activity android:name=".MainActivity" android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`,
    'utf8'
  );

  const res6 = runCheck([`--check=s12`, `--target=${hardenedManifest}`]);
  assert(res6.status === 0, `Expected exit code 0 for hardened manifest, got ${res6.status}`);
  assert(
    res6.output.includes('[S12 PASSED]'),
    'Expected output to confirm S12 PASSED'
  );

  // --------------------------------------------------------------------------
  // Test 7: S3 runs CycloneDX SBOM generation & dependency check
  // --------------------------------------------------------------------------
  console.log('\nTest 7: S3 runs CycloneDX SBOM generation and verification');
  const res7 = runCheck([`--check=s3`]);
  assert(res7.status === 0, `Expected exit code 0 for S3 SBOM check, got ${res7.status}`);
  assert(
    res7.output.includes('CycloneDX SBOM v1.5 generated successfully'),
    'Expected output to confirm SBOM generation'
  );

  console.log('\n================================================================================');
  console.log(`🎉 All ${passedCount}/${testCount} test assertions passed successfully!`);
  console.log('================================================================================\n');
} finally {
  // Clean up temporary test files
  try {
    fs.rmSync(tempDir, { recursive: true, force: true });
  } catch {
    // Ignore cleanup errors
  }
}
