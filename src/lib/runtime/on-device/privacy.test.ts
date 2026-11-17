import { describe, expect, it } from "vitest";
import { assertLocalExecution } from "./privacy";

describe("on-device execution boundary", () => {
  it("allows explicitly local execution", () => {
    expect(() =>
      assertLocalExecution({ boundary: "local", capability: "local-chat" }),
    ).not.toThrow();
  });

  it("rejects federated execution", () => {
    expect(() =>
      assertLocalExecution({ boundary: "federated", capability: "local-chat" }),
    ).toThrow(/rejected non-local execution/);
  });

  it("rejects an already-aborted operation", () => {
    const controller = new AbortController();
    controller.abort();

    expect(() =>
      assertLocalExecution({
        boundary: "local",
        capability: "local-chat",
        signal: controller.signal,
      }),
    ).toThrow(/aborted/i);
  });
});
