#!/usr/bin/env node

/**
 * Gestation Guardian - Adversarial Security Test Suite Runner
 * Standards: OWASP MASVS L2, OWASP API Security Top 10, HIPAA Security Rule
 * Executes all 8 security verification suites in backend/test/
 */

const path = require('path');
const url = require('url');
const { spawnSync } = require('child_process');

const BACKEND_TEST_DIR = path.resolve(__dirname, '../../backend/test');
const LOADER_URL = url.pathToFileURL(path.join(BACKEND_TEST_DIR, 'loader.mjs')).href;

const TEST_FILES = [
  's1_secret_scan.test.ts',
  's5_idor.test.ts',
  's6_rate_limit.test.ts',
  's7_validation.test.ts',
  's14_crypto.test.ts',
  's15_headers.test.ts',
  's16_audit.test.ts',
  's17_upload.test.ts',
];

console.log('================================================================================');
console.log('🛡️  Gestation Guardian - Adversarial Security Verification Runner');
console.log('================================================================================\n');

let allPassed = true;
const results = [];

for (const file of TEST_FILES) {
  const filePath = path.join(BACKEND_TEST_DIR, file);
  process.stdout.write(`▶ Running ${file}... `);

  const res = spawnSync(
    process.execPath,
    ['--loader', LOADER_URL, '--test', '--experimental-strip-types', filePath],
    {
      encoding: 'utf8',
      env: { ...process.env },
    }
  );

  if (res.status === 0) {
    console.log('✅ PASSED');
    results.push({ file, status: 'PASSED' });
  } else {
    console.log('❌ FAILED');
    console.error(res.stdout || res.stderr);
    results.push({ file, status: 'FAILED' });
    allPassed = false;
  }
}

console.log('\n================================================================================');
console.log('📊 Security Verification Summary');
console.log('================================================================================');
for (const r of results) {
  console.log(`  ${r.status === 'PASSED' ? '✔' : '✖'} ${r.file}: ${r.status}`);
}
console.log('================================================================================\n');

if (!allPassed) {
  process.exit(1);
} else {
  console.log('🎉 ALL 8 ADVERSARIAL SECURITY TEST SUITES PASSED!\n');
  process.exit(0);
}
