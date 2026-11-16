#!/usr/bin/env bash
set -euo pipefail

# Run the project's standard checks using the package manager represented by
# the lockfile. Dependencies are installed by the workflow before this script.
if [[ -f bun.lock || -f bun.lockb ]]; then
  run=(bun run)
else
  run=(npm run)
fi

"${run[@]}" lint
"${run[@]}" test
"${run[@]}" build
