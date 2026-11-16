import { describe, expect, it } from "vitest";
import { matchKnowledge } from "./sources";

describe("Knowledge engine matching", () => {
  it("recommends React docs for a React hooks question", () => {
    const m = matchKnowledge("How do React hooks like useEffect work?");
    expect(m[0]?.source.url).toBe("https://reactplay.io");
  });
  it("does not treat the everyday word 'go' as the Go language", () => {
    expect(matchKnowledge("Should I go to the beach today?")).toHaveLength(0);
  });
  it("matches Go in the Developer experience", () => {
    expect(matchKnowledge("go channels", { developer: true })[0]?.source.id).toBe("go");
  });
  it("skips disabled collections", () => {
    expect(matchKnowledge("docker compose basics", { disabled: ["practice"] })).toHaveLength(0);
  });
});
