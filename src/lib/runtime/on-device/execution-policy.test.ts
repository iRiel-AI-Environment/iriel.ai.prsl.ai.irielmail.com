import { describe, expect, it } from "vitest";
import { executionMode } from "@/lib/experiences";

describe("execution policy", () => {
  it("keeps the Private experience on the local runtime", () => {
    expect(executionMode("private", true)).toBe("local");
  });

  it("keeps every experience local when federation is disabled", () => {
    expect(executionMode("everyday", false)).toBe("local");
    expect(executionMode("research", false)).toBe("local");
    expect(executionMode("developer", false)).toBe("local");
  });

  it("allows hybrid execution only when federation is enabled for a non-private experience", () => {
    expect(executionMode("everyday", true)).toBe("hybrid");
    expect(executionMode("research", true)).toBe("hybrid");
  });
});
