/**
 * PRSL-AI / iRiel Git Integration Policy
 * Version: 7.5.6.0
 *
 * This is executable application configuration, not descriptive documentation.
 * The application and automation must consume this contract before proposing
 * or executing repository integration operations.
 */

export type GitMergeMethod = "merge" | "squash" | "rebase";

export type GitCheckName = "lint" | "test" | "build";

export interface PullRequestEvaluationInput {
  baseBranch: string;
  headBranch: string;
  mergeMethod: GitMergeMethod;
  baseIsUpToDate: boolean;
  checks: Partial<Record<GitCheckName, boolean>>;
  isDraft?: boolean;
}

export interface PullRequestEvaluation {
  allowed: boolean;
  reasons: string[];
}

export const GIT_INTEGRATION_POLICY = {
  schemaVersion: "1.0.0",
  ecosystemVersion: "7.5.6.0",
  policyId: "prsl-ai.git.integration",
  repository: "iRiel-AI-Environment/iriel.ai.prsl.ai.irielmail.com",
  provider: "github",
  defaultBranch: "main",

  branches: {
    protected: ["main"],
    acceptedPullRequestPrefixes: [
      "integration/",
      "feature/",
      "fix/",
      "hotfix/",
      "release/",
    ],
    prohibitDirectPushToProtected: true,
    prohibitForcePush: true,
    prohibitHistoryRewriteOnPublishedBranches: true,
  },

  fetch: {
    fetchTags: true,
    pruneStaleRemoteRefs: true,
    mutateWorkingTree: false,
  },

  pull: {
    strategy: "fetch-then-merge",
    requireExplicitIntegration: true,
    allowImplicitAutoPull: false,
  },

  merge: {
    defaultMethod: "merge" as const,
    allowedMethods: ["merge"] as const,
    createMergeCommit: true,
    preserveCommitAncestry: true,
    requirePullRequest: true,
    requireBaseUpToDate: true,
    requireAllChecksPassing: true,
    requiredChecks: ["lint", "test", "build"] as const,
    requiredApprovals: 0,
    allowAutoMerge: false,
    allowSquash: false,
    allowRebase: false,
    allowForce: false,
    conflictResolution: "abort-and-require-human-resolution" as const,
  },

  push: {
    requirePullRequestForProtectedBranches: true,
    force: false,
    forceWithLease: false,
    publishOnlyValidatedCommits: true,
  },

  rebase: {
    allowOnPrivateUnpublishedBranch: true,
    allowOnPublishedSharedBranch: false,
    rewritePublishedCommits: false,
  },

  cherryPick: {
    requireExplicitCommitSelection: true,
    requireValidationAfterApplication: true,
    preserveOriginalCommitReference: true,
  },

  hooks: {
    beforePush: ["lint", "test", "build"],
    beforeMerge: ["branch-policy", "lint", "test", "build"],
    afterMerge: ["verify-merge-commit", "record-integration-result"],
  },

  execution: {
    dryRunByDefault: true,
    requireExplicitAuthorizationForMutation: true,
    neverMergeWithoutSuccessfulChecks: true,
    neverResolveConflictsByDiscardingUnknownChanges: true,
    neverForcePushAutomatically: true,
    neverRewritePublishedHistory: true,
  },
} as const;

const REQUIRED_BRANCH_PREFIXES: readonly string[] =
  GIT_INTEGRATION_POLICY.branches.acceptedPullRequestPrefixes;

export function evaluatePullRequest(
  input: PullRequestEvaluationInput,
): PullRequestEvaluation {
  const reasons: string[] = [];

  if (input.baseBranch !== GIT_INTEGRATION_POLICY.defaultBranch) {
    reasons.push(
      `Target branch must be ${GIT_INTEGRATION_POLICY.defaultBranch}.`,
    );
  }

  if (
    !REQUIRED_BRANCH_PREFIXES.some((prefix) =>
      input.headBranch.startsWith(prefix),
    )
  ) {
    reasons.push("Source branch does not use an approved branch prefix.");
  }

  if (GIT_INTEGRATION_POLICY.branches.protected.includes(input.headBranch)) {
    reasons.push("A protected branch cannot be used as a pull request source.");
  }

  if (
    !GIT_INTEGRATION_POLICY.merge.allowedMethods.includes(
      input.mergeMethod as "merge",
    )
  ) {
    reasons.push("Merge method is not permitted by the active policy.");
  }

  if (GIT_INTEGRATION_POLICY.merge.requireBaseUpToDate && !input.baseIsUpToDate) {
    reasons.push("Source branch must be updated against the current target branch.");
  }

  if (GIT_INTEGRATION_POLICY.merge.requireAllChecksPassing) {
    for (const check of GIT_INTEGRATION_POLICY.merge.requiredChecks) {
      if (input.checks[check] !== true) {
        reasons.push(`Required check is missing or unsuccessful: ${check}.`);
      }
    }
  }

  if (input.isDraft) {
    reasons.push("Draft pull requests cannot be merged.");
  }

  return { allowed: reasons.length === 0, reasons };
}
