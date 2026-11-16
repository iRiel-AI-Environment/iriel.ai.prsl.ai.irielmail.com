import { describe, expect, it } from "vitest";
import { PLANS } from "./vault";

const GB = 1024 ** 3;
describe("iVault plans", () => {
  it("matches IRC-001 quotas", () => {
    expect(PLANS.map((p) => [p.id, p.bytes])).toEqual([
      ["free", 16 * GB],
      ["standard", 50 * GB],
      ["plus", 1024 * GB],
      ["advanced", 2048 * GB],
    ]);
  });
});
