import type { ChatTransport, UIMessage, UIMessageChunk } from "ai";
import { addMemory, getData } from "@/lib/store/data";
import { getSettings } from "@/lib/store/settings";
import { dataUrlToText, formatBytes, isTextLike } from "@/lib/files";
import { keywords, summarize } from "./summarize";

/**
 * On-device runtime used by the Private experience (and whenever federation is off).
 * It never performs network requests: everything below reads local state only.
 */
export function localRespond(messages: UIMessage[]): string {
  const last = [...messages].reverse().find((m) => m.role === "user");
  if (!last) return "I'm here.";
  const text = last.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("\n")
    .trim();
  const files = last.parts.filter((p) => p.type === "file") as {
    filename?: string;
    mediaType: string;
    url: string;
  }[];
  const lower = text.toLowerCase();
  const settings = getSettings();

  // Memory
  const remember = text.match(/^(?:please\s+)?remember(?:\s+that)?\s+(.+)/i);
  if (remember) {
    if (!settings.memoryEnabled)
      return "Memory is turned off in iSpace → Memory, so I won't keep this.";
    const fact = (remember[1] ?? "").replace(/[.!]+$/, "");
    void addMemory(fact, "chat");
    return `Saved to memory, on this device only:\n\n> ${fact}`;
  }
  if (/what do you (know|remember) about me|my memories/.test(lower)) {
    const mems = getData().memories;
    if (!mems.length)
      return "I don't have any memories yet. Say “remember that …” and I'll keep it on this device.";
    return `Here's what I remember:\n\n${mems.map((m) => `- ${m.text}`).join("\n")}`;
  }

  // Attachments
  if (files.length) {
    const out: string[] = [];
    for (const f of files) {
      const name = f.filename ?? "file";
      if (isTextLike(f.mediaType, name) && f.url.startsWith("data:")) {
        const body = dataUrlToText(f.url);
        const points = summarize(body, 4);
        out.push(
          points.length
            ? `**${name}** — key points:\n\n${points.map((p) => `- ${p}`).join("\n")}`
            : `**${name}** is short:\n\n> ${body.slice(0, 400)}`,
        );
      } else {
        out.push(
          `**${name}** is saved in your iVault. Reading ${f.mediaType.startsWith("image/") ? "images" : "this file type"} needs the ecosystem runtime, which Private never calls. Switch to Everyday to analyze it.`,
        );
      }
    }
    return out.join("\n\n");
  }

  // Summarize pasted text
  if (/summari[sz]e|tl;?dr|resume|resumir|résumer|zusammenfass/.test(lower)) {
    const body = text.replace(/^.*?(summari[sz]e[^:]*:|tl;?dr:?)/i, "").trim();
    if (body.length < 120)
      return "Paste the text after your request, or attach a file, and I'll summarize it on this device.";
    const points = summarize(body, 4);
    return `Here's the gist:\n\n${points.map((p) => `- ${p}`).join("\n")}`;
  }

  // iVault search
  if (/\b(file|files|vault|ivault|document|documents|find|search my)\b/.test(lower)) {
    const terms = keywords(text).filter(
      (w) =>
        ![
          "file",
          "files",
          "vault",
          "ivault",
          "find",
          "search",
          "document",
          "documents",
          "work",
        ].includes(w),
    );
    const all = getData().files;
    if (!all.length)
      return "Your iVault is empty. Add files in **Files** and I can search and summarize them here, privately.";
    const scored = all
      .map((f) => {
        const hay = `${f.name} ${f.text ?? ""}`.toLowerCase();
        const score = terms.length ? terms.reduce((s, t) => s + (hay.includes(t) ? 1 : 0), 0) : 1;
        return { f, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
    if (!scored.length) return `Nothing in your iVault matches “${terms.join(" ")}”.`;
    return `${terms.length ? "Matches in your iVault:" : "Your most recent iVault files:"}\n\n${scored
      .map(({ f }) => {
        const snippet = f.text ? ` — “${f.text.replace(/\s+/g, " ").slice(0, 120)}…”` : "";
        return `- **${f.name}** · ${formatBytes(f.size)}${snippet}`;
      })
      .join("\n")}\n\nAttach one with **+** and ask me about it.`;
  }

  // Time
  if (/\b(what time|current time|today'?s date|what day)\b/.test(lower)) {
    const tz = settings.profile.timezone;
    const now = new Date().toLocaleString(settings.profile.language, {
      timeZone: tz,
      dateStyle: "full",
      timeStyle: "short",
    });
    return `It's ${now} (${tz}).`;
  }

  // Arithmetic
  const expr = text.replace(/[=?]/g, "").replace(/x/gi, "*").trim();
  if (/^[\d\s+\-*/().,%^]+$/.test(expr) && /\d/.test(expr) && /[+\-*/^%]/.test(expr)) {
    try {
      const safe = expr.replace(/,/g, ".").replace(/\^/g, "**");
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      const value = Function(`"use strict"; return (${safe});`)() as number;
      if (Number.isFinite(value)) return `**${Number(value.toFixed(10))}**`;
    } catch {
      /* fall through */
    }
  }

  // Planning
  const plan = text.match(/(?:help me )?plan(?:\s+(?:for|my|a|an|the))?\s+(.+)/i);
  if (plan) {
    const goal = (plan[1] ?? "").replace(/[.?!]+$/, "");
    return [
      `A starting plan for **${goal}**:`,
      "",
      `1. **Define done** — write one sentence describing what “${goal}” looks like when it's finished.`,
      "2. **List constraints** — budget, deadline, people involved.",
      "3. **Break it down** — 3–5 milestones, each small enough to finish in a week.",
      "4. **Pick the first step** — something you can do today in under 30 minutes.",
      "5. **Schedule a check-in** — a time to review progress and adjust.",
      "",
      "Tell me the deadline and constraints and I'll fill in the milestones. For deeper planning, switch to **Thinking**.",
    ].join("\n");
  }

  if (/^(hi|hello|hey|olá|ola|hola|bonjour|hallo|ciao|こんにちは|你好)\b/i.test(lower)) {
    return `Hi ${settings.profile.name}. I'm running privately on this device. What do you need?`;
  }

  return [
    "In Private I run only on this device, so I can:",
    "",
    "- Summarize text you paste or files you attach",
    "- Search and quote your iVault",
    "- Remember things you tell me",
    "- Sketch plans and do quick calculations",
    "",
    "For open-ended questions or the web, switch to **Everyday** or **Research**.",
  ].join("\n");
}

const sleep = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(t);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });

export class LocalRuntimeTransport implements ChatTransport<UIMessage> {
  async sendMessages({
    messages,
    abortSignal,
  }: Parameters<ChatTransport<UIMessage>["sendMessages"]>[0]): Promise<
    ReadableStream<UIMessageChunk>
  > {
    const reply = localRespond(messages);
    const id = crypto.randomUUID();
    return new ReadableStream<UIMessageChunk>({
      async start(controller) {
        try {
          controller.enqueue({ type: "start" });
          await sleep(420, abortSignal);
          controller.enqueue({ type: "text-start", id });
          const tokens = reply.match(/\S+\s*|\s+/g) ?? [reply];
          for (const tok of tokens) {
            await sleep(14, abortSignal);
            controller.enqueue({ type: "text-delta", id, delta: tok });
          }
          controller.enqueue({ type: "text-end", id });
          controller.enqueue({ type: "finish" });
          controller.close();
        } catch {
          controller.enqueue({ type: "abort" });
          controller.close();
        }
      },
    });
  }
  async reconnectToStream() {
    return null;
  }
}
