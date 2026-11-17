***

## 5. TypeScript Stack Guidelines

Apply these rules whenever editing TypeScript codebases:

### Type Safety Invariants

- **No Type Escape Hatches:** Never introduce `any`, `@ts-ignore`, `@ts-expect-error`, or unsafe `as` type assertions to silence compiler errors. Narrow types properly using type guards, discriminated unions, or schema validation (e.g., Zod).
- **Strict Null & Undefined Handling:** Respect `strictNullChecks` and `noUncheckedIndexedAccess`. Explicitly handle missing array elements or dictionary lookups.
- **Explicit Public Seams:** Always annotate return types on exported functions, public class methods, and API boundary handlers to prevent accidental contract drift.

### TypeScript Testing Strategy

- **Runner Execution:** Always run Vitest or Jest in non-interactive single-run mode (`vitest run`, `jest --ci`, or `CI=true`) so verification commands terminate cleanly.
- **Boundary Validation:** Test runtime schema parsing (e.g., Zod, Valibot, TypeBox) with invalid payloads, missing fields, and unexpected types—not just valid TypeScript objects.
- **Async & Concurrency:** Always `await` promises inside tests and assert rejections using `expect(fn()).rejects.toThrow(...)` rather than `try/catch` blocks that silently pass if no error is thrown.
- **Module Mocking:** Avoid `vi.mock` or `jest.mock` on internal modules. Inject dependencies via function parameters or factory constructors so real implementations can be tested directly.
