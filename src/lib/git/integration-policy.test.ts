import { describe, expect, it } from "vitest";
import { evaluatePullRequest, GIT_INTEGRATION_POLICY } from "./integration-policy";

const validPullRequest = {
  baseBranch: "main",
  headBranch: "integration/example-change",
  mergeMethod: "merge" as const,
  baseIsUpToDate: true,
  checks: { lint: true, test: true, build: true },
};

describe("PRSL-AI Git integration policy v7.5.6.0", () => {
  it("declares merge commits as the only permitted merge method", () => {
    expect(GIT_INTEGRATION_POLICY.merge.allowedMethods).toEqual(["merge"]);
    expect(GIT_INTEGRATION_POLICY.merge.preserveCommitAncestry).toBe(true);
    expect(GIT_INTEGRATION_POLICY.merge.allowSquash).toBe(false);
    expect(GIT_INTEGRATION_POLICY.merge.allowRebase).toBe(false);
  });

  it("accepts a validated integration branch pull request", () => {
    expect(evaluatePullRequest(validPullRequest)).toEqual({
      allowed: true,
      reasons: [],
    });
  });

  it("rejects unapproved source branch names", () => {
    const result = evaluatePullRequest({
      ...validPullRequest,
      headBranch: "random-work",
    });
    expect(result.allowed).toBe(false);
    expect(result.reasons).toContain("Source branch does not use an approved branch prefix.");
  });

  it("rejects a pull request whose source is not up to date", () => {
    const result = evaluatePullRequest({
      ...validPullRequest,
      baseIsUpToDate: false,
    });
    expect(result.allowed).toBe(false);
    expect(result.reasons).toContain(
      "Source branch must be updated against the current target branch.",
    );
  });

  it("rejects missing or unsuccessful required checks", () => {
    const result = evaluatePullRequest({
      ...validPullRequest,
      checks: { lint: true, test: false },
    });
    expect(result.allowed).toBe(false);
    expect(result.reasons).toContain("Required check is missing or unsuccessful: test.");
    expect(result.reasons).toContain("Required check is missing or unsuccessful: build.");
  });

  it("rejects squash and rebase merge methods", () => {
    const squash = evaluatePullRequest({
      ...validPullRequest,
      mergeMethod: "squash",
    });
    const rebase = evaluatePullRequest({
      ...validPullRequest,
      mergeMethod: "rebase",
    });
    expect(squash.allowed).toBe(false);
    expect(rebase.allowed).toBe(false);
  });

  it("rejects draft pull requests", () => {
    const result = evaluatePullRequest({
      ...validPullRequest,
      isDraft: true,
    });
    expect(result.allowed).toBe(false);
    expect(result.reasons).toContain("Draft pull requests cannot be merged.");
  });

  it("does not permit a protected branch as the source", () => {
    const result = evaluatePullRequest({
      ...validPullRequest,
      headBranch: "main",
    });
    expect(result.allowed).toBe(false);
    expect(result.reasons).toContain("Source branch does not use an approved branch prefix.");
    expect(result.reasons).toContain("A protected branch cannot be used as a pull request source.");
  });
});
