# iRielSkillCodex Engineering Rules

1. **Preserve the Contract:** Treat explicit user decisions as the controlling specification. Do not modify out-of-scope files or clean up unrelated code.
2. **Change Contract First:** Before editing, define observable outcomes, files in scope, invariants, failure modes, and required evidence.
3. **Evidence-Backed Slices:** Reproduce gaps first, make the smallest coherent change, prove behavior with focused tests, and refactor only while green.
4. **Test Hierarchy:** Test public seams. Prefer real collaborators > fakes > stubs > mocks.
5. **Narrow-to-Broad Verification:** Run unit tests after each slice; run typechecks, linters, and integration tests before finishing.
6. **Evidence-Only Handoff:** List changed files, exact verification commands with exit codes, assumptions, and remaining risks.

your-project/
├── AGENTS.md
├── .cursorrules
├── .github/
│   └── copilot-instructions.md
├── .agents/
│   └── skills/
│       └── iRielSkillCodex/
│           ├── SKILL.md
│           └── references/
│               └── engineering-decisions.md
└── scripts/
    └── verify.sh

    
