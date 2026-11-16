#!/usr/bin/env bash
# ==============================================================================
# Gestation Guardian - SecOps Security Verification Script (POSIX / Bash)
# Requirements: S1 (Secret scan), S3 (Dependencies & CycloneDX SBOM), S12 (Manifest)
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

echo "================================================================================"
echo "🛡️  Gestation Guardian - SecOps Compliance & Hardening Verification (Bash Runner)"
echo "================================================================================"

# If Node.js is available, invoke cross-platform engine scripts/check.js
if command -v node >/dev/null 2>&1; then
  echo "Node.js detected. Delegating to scripts/check.js engine..."
  node "${SCRIPT_DIR}/check.js" "$@"
  exit $?
fi

# Fallback: Pure Bash checks if Node is unavailable
echo "Notice: Running in pure Bash fallback mode..."
STATUS=0

echo "[S1 Scan] Scanning for high-entropy secrets and API tokens..."
# Scan for AWS access keys, private keys, and standard API keys
if grep -rnEI --exclude-dir={.git,node_modules,dist,build,playwright-report,test-results,.agents} \
   --exclude={.env.example,package-lock.json,*.apk,*.pdf,*.png,*.jpg,*.sqlite*} \
   "AKIA[0-9A-Z]\{16\}\|-----BEGIN.*PRIVATE KEY-----\|AIza[0-9A-Za-z_-]\{35\}\|gh[pousr]_[A-Za-z0-9_]\{36,\}" "${ROOT_DIR}" 2>/dev/null; then
  echo "❌ [S1 FAILED] Potential hardcoded secret found above."
  STATUS=1
else
  echo "✅ [S1 PASSED] No hardcoded secrets detected."
fi

echo "[S12 Scan] Linting AndroidManifest.xml..."
MANIFEST="${ROOT_DIR}/android-app/app/src/main/AndroidManifest.xml"
if [ -f "${MANIFEST}" ]; then
  if grep -q 'android:allowBackup="true"' "${MANIFEST}"; then
    echo "❌ [S12 FAILED] android:allowBackup is set to 'true'. Must be 'false'."
    STATUS=1
  elif grep -q 'android:debuggable="true"' "${MANIFEST}"; then
    echo "❌ [S12 FAILED] android:debuggable is set to 'true'."
    STATUS=1
  else
    echo "✅ [S12 PASSED] AndroidManifest.xml hardening verified."
  fi
else
  echo "⚠️ [S12 WARNING] AndroidManifest.xml not found."
fi

exit ${STATUS}
