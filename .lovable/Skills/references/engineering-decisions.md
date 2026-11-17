# Engineering Decisions Reference

Use this guide when selecting test levels, diagnosing uncertain failures, designing risky changes, or splitting work across parallel executors.

## 1. Test Level Selection Matrix

Choose the lowest test level that exercises the actual risk without mocking away the behavior under test.

| Change Type                   | Primary Test Level     | Collaborator Strategy                           | What to Verify                                                        |
| :---------------------------- | :--------------------- | :---------------------------------------------- | :-------------------------------------------------------------------- |
| **Pure logic / algorithms**   | Unit                   | Real values and data structures                 | Edge cases, invariants, boundary inputs, and error conditions.        |
| **Component / module wiring** | Integration            | Real internal modules; fakes for external I/O   | Data serialization, state transitions, and interface contracts.       |
| **Database / persistence**    | Integration            | Ephemeral real database or transaction rollback | Schema constraints, query accuracy, migrations, and isolation levels. |
| **External API / network**    | Contract / Integration | Recorded fixtures or local stub servers         | Request formatting, timeout handling, retries, and error mapping.     |
| **Critical user flows**       | End-to-End (E2E)       | Full stack in isolated environment              | Authentication, routing, side effects, and visible state changes.     |

### Test Double Hierarchy

1. **Real Collaborators:** Default choice when fast, deterministic, and side-effect free.
2. **Fakes:** Working lightweight implementations (e.g., in-memory database) when real collaborators are too slow or stateful.
3. **Stubs:** Canned responses for external boundaries where behavior is fixed.
4. **Mocks:** Last resort; use only to verify outbound side-effect calls (e.g., sending an email or audit event) where no observable state change exists.

---

## 2. Failure Diagnosis Protocol

When a check fails unexpectedly, isolate the failure category before editing production code:

1. **Product Defect:** The code violates the specification or an invariant.
   - _Action:_ Confirm the test expectation matches the contract, then fix the implementation.
2. **Test Defect:** The test asserts an outdated contract, relies on implementation details, or leaks state.
   - _Action:_ Fix the test isolation or update expectations only if the contract intentionally changed.
3. **Environment Problem:** Missing dependencies, expired credentials, port collisions, or resource exhaustion.
   - _Action:_ Restore environment health and rerun without altering code.
4. **Flaky Result:** Non-deterministic timing, concurrency race conditions, or unordered collections.
   - _Action:_ Reproduce with repeated runs or stress flags; fix the underlying race condition rather than adding arbitrary sleeps.
5. **Unrelated Pre-Existing Failure:** A failure in an untouched module present before your changes.
   - _Action:_ Verify against clean baseline (`git stash` or clean worktree), document it in the handoff, and do not silently ignore or fix out-of-scope code.

---

## 3. Risky Boundary Checklist

Before modifying high-risk boundaries, explicitly verify these failure modes:

- **Security:** Input validation, authorization checks at every entry point, secret redaction in logs, and least-privilege defaults.
- **Concurrency:** Lock ordering, idempotency keys, atomic updates, and behavior under simultaneous duplicate requests.
- **Persistence:** Backward-compatible schema migrations (expand-and-contract), nullability defaults, and transaction boundaries.
- **Time & Clocks:** Timezone normalization (UTC), daylight saving transitions, monotonic clocks for durations, and clock skew tolerance.
- **Network & External I/O:** Explicit connection/read timeouts, bounded retries with jitter, circuit breaking, and partial failure recovery.

---

## 4. Parallel Execution Decision Tree

Use this rubric before spawning concurrent workers:

- **Can the tasks share a write surface?**
  - _Yes_ $\rightarrow$ **Serialize.** Never allow two workers to edit the same file, schema, or lockfile simultaneously.
  - _No_ $\rightarrow$ Proceed to next check.
- **Do the tasks depend on shared mutable runtime state (ports, DBs, temp files)?**
  - _Yes_ $\rightarrow$ **Serialize** or assign isolated workspaces/ports per worker.
  - _No_ $\rightarrow$ Proceed to next check.
- **Is the overhead of isolating and reconciling lower than sequential execution?**
  - _Yes_ $\rightarrow$ **Parallelize** (cap at 2–4 workers) and run a single coordinator pass afterward to verify the integrated diff.
  - _No_ $\rightarrow$ **Execute sequentially.**
