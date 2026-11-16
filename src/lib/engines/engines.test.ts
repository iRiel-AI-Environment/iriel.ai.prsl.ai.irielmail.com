import { describe, expect, it } from "vitest";
import { bangInProgress, engineUrl, parseBang, findEngine } from "./index";

describe("Search engine shortcuts", () => {
  it("routes !gh to GitHub search", () => {
    const r = parseBang("!gh tanstack router");
    expect(r?.engine.title).toBe("Github");
    expect(engineUrl(r!.engine, r!.query)).toBe("https://github.com/search?q=tanstack%20router");
  });
  it("accepts the shortcut at the end of the prompt", () => {
    expect(parseBang("lisbon !w")?.query).toBe("lisbon");
  });
  it("ignores unknown shortcuts", () => {
    expect(parseBang("hello !nope")).toBeNull();
  });
  it("detects a shortcut being typed", () => {
    expect(bangInProgress("find this !cl")).toBe("cl");
  });
  it("knows !ddg and !d are DuckDuckGo", () => {
    expect(findEngine("ddg")?.title).toBe("DuckDuckGo");
    expect(findEngine("d")?.title).toBe("DuckDuckGo");
  });
});
