---

## 6. Continuous Integration (CI) Invariants

Keep local agent verification and remote CI execution aligned:

- **Single Source of Truth:** Local agents and `.github/workflows/verify.yml` must execute the same `scripts/verify.sh` entrypoint. Never create divergent test commands between local scripts and CI YAML.
- **Deterministic Lockfiles:** Always install dependencies using frozen lockfiles (`npm ci`, `pnpm install --frozen-lockfile`, `yarn install --frozen-lockfile`, or `bun install --frozen-lockfile`). Do not modify lockfiles unless adding or updating an approved dependency is explicitly in scope.
- **Zero-Warning Policy:** Treat compiler warnings, linter warnings, and unhandled promise rejections as blocking failures in CI.
