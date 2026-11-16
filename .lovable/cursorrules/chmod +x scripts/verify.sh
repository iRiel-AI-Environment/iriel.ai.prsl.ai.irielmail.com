#!/usr/bin/env bash
set -euo pipefail

echo "=== 1. Formatting & Linting ==="
# Replace with your stack's commands (e.g., npm run lint, ruff check .)
echo "Skipping lint (configure in scripts/verify.sh)"

echo "=== 2. Type Checking ==="
# Replace with your stack's commands (e.g., npx tsc --noEmit, mypy .)
echo "Skipping typecheck (configure in scripts/verify.sh)"

echo "=== 3. Unit & Integration Tests ==="
# Replace with your stack's commands (e.g., npm test, pytest)
echo "Skipping tests (configure in scripts/verify.sh)"

echo "=== Verification Complete ==="
