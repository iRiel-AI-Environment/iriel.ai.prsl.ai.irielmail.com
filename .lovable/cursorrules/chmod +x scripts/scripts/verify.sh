#!/usr/bin/env bash
set -euo pipefail

# Detect package manager
if [ -f "pnpm-lock.yaml" ]; then
  PM="pnpm"
elif [ -f "yarn.lock" ]; then
  PM="yarn"
elif [ -f "bun.lockb" ] || [ -f "bun.lock" ]; then
  PM="bun"
else
  PM="npm"
fi

echo "Using package manager: $PM"

echo "=== 1. Formatting & Linting ==="
if $PM run | grep -qE "^\s*lint"; then
  $PM run lint
else
  echo "No 'lint' script found in package.json — skipping."
fi

echo "=== 2. Type Checking ==="
if $PM run | grep -qE "^\s*typecheck"; then
  $PM run typecheck
else
  npx tsc --noEmit
fi

echo "=== 3. Unit & Integration Tests ==="
if $PM run | grep -qE "^\s*test"; then
  # Pass --run or CI=true to prevent watch-mode hangs
  CI=true $PM test
else
  echo "No 'test' script found in package.json — skipping."
fi

echo "=== 4. Build Validation ==="
if $PM run | grep -qE "^\s*build"; then
  $PM run build
else
  echo "No 'build' script found in package.json — skipping."
fi

echo "=== Verification Complete ==="
