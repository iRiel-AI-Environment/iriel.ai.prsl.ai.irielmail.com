import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, stepCountIs, streamText, tool, type UIMessage } from "ai";
import { z } from "zod";
import {
  createLovableAiGatewayRunIdFetch,
  getLovableAiGatewayRunId,
  withLovableAiGatewayRunIdHeader,
} from "./run-id";

const GATEWAY = "https://ai.gateway.lovable.dev/v1";
const MODEL = "openai/gpt-6-astra";

export const chatBodySchema = z.object({
  messages: z.array(z.any()).min(1),
  experience: z.enum(["everyday", "thinking", "research", "creative", "developer"]),
  agentId: z.string().optional(),
  language: z.string().max(40).default("English"),
  profile: z.object({ name: z.string().max(80), timezone: z.string().max(60) }).optional(),
  memories: z.array(z.string().max(500)).max(50).default([]),
  memoryEnabled: z.boolean().default(true),
  responseStyle: z.enum(["concise", "balanced", "detailed"]).default("balanced"),
  webSearch: z.boolean().default(false),
  knowledge: z.array(z.object({ topic: z.string(), url: z.string() })).max(6).default([]),
});

export type ChatBody = z.infer<typeof chatBodySchema>;

const EXPERIENCE_PROMPTS: Record<ChatBody["experience"], string> = {
  everyday: "Experience: Everyday. Be quick, warm and practical. Prefer short answers that get the person moving.",
  thinking:
    "Experience: Thinking. Reason carefully, weigh trade-offs, structure the analysis and end with a clear recommendation or plan.",
  research:
    "Experience: Research. Use web search to find current information, verify across sources, and cite sources inline as markdown links. Say when sources disagree.",
  creative: "Experience: Creative. Be exploratory and generative; offer varied, original options with vivid language.",
  developer:
    "Experience: Developer. Be precise. Use fenced code blocks with language tags, valid syntax, and correct schemas (JSON Schema/OpenAPI when relevant).",
};

const AGENT_PROMPTS: Record<string, string> = {
  planner: "You are acting as the Planner agent: turn goals into ordered steps with owners, timing and next actions.",
  researcher: "You are acting as the Researcher agent: find current facts and always cite where they came from.",
  writer: "You are acting as the Writer agent: draft and polish text, matching the person's voice.",
  coder: "You are acting as the Code Partner agent: write, review and explain code and API schemas.",
  daily: "You are acting as the Daily Assistant agent: quick answers, reminders and everyday tasks.",
};

const STYLE: Record<ChatBody["responseStyle"], string> = {
  concise: "Keep answers brief.",
  balanced: "Keep answers focused; expand only when it helps.",
  detailed: "Give thorough, well-structured answers.",
};

export function buildInstructions(body: ChatBody, now = new Date()) {
  const parts = [
    "You are iRiel, a Personal Intelligence Environment created by Robert Software Labs (PRSL-AI ecosystem). Human first, always.",
    "Never mention models, model families, quantizations, inference engines or providers; you are simply iRiel.",
    EXPERIENCE_PROMPTS[body.experience],
    body.agentId && AGENT_PROMPTS[body.agentId] ? AGENT_PROMPTS[body.agentId] : "",
    STYLE[body.responseStyle],
    `Reply in ${body.language} unless the person writes in another language; then match theirs.`,
    body.profile
      ? `You are talking with ${body.profile.name}. Their timezone is ${body.profile.timezone}. Current time: ${now.toISOString()}.`
      : "",
    body.memoryEnabled && body.memories.length
      ? `Things the person asked you to remember:\n- ${body.memories.join("\n- ")}`
      : "",
    body.memoryEnabled
      ? "When the person explicitly asks you to remember something about them, call save_memory with one short sentence."
      : "",
    body.knowledge.length
      ? `Canonical documentation from the person's Knowledge Collections (prefer these and cite them inline as markdown links when relevant):\n${body.knowledge
          .map((k) => `- ${k.topic}: ${k.url}`)
          .join("\n")}`
      : "",
    [
      "Formatting: use clean markdown.",
      "When an answer naturally splits into 2–4 parallel key points (overviews, roundups, comparisons, options), write one short intro sentence, then a fenced block exactly like:",
      '```cards\n[{"title":"1. Short title","body":"One or two sentences."}]\n```',
      "Keep each body under 220 characters. You may add a short closing line after the block. Otherwise answer normally without cards.",
    ].join("\n"),
  ];
  return parts.filter(Boolean).join("\n\n");
}

/** Text attachments travel as data URLs; the model reads them as plain text. */
export function inlineTextAttachments(messages: UIMessage[]): UIMessage[] {
  return messages.map((m) => ({
    ...m,
    parts: m.parts.map((p) => {
      if (p.type !== "file") return p;
      const isText = p.mediaType.startsWith("text/") || /json|xml|yaml|javascript|typescript|csv/.test(p.mediaType);
      const supported = p.mediaType.startsWith("image/") || p.mediaType === "application/pdf";
      if (isText && p.url.startsWith("data:")) {
        const comma = p.url.indexOf(",");
        const meta = p.url.slice(0, comma);
        const raw = p.url.slice(comma + 1);
        let text = "";
        try {
          text = meta.includes(";base64")
            ? new TextDecoder().decode(Uint8Array.from(atob(raw), (c) => c.charCodeAt(0)))
            : decodeURIComponent(raw);
        } catch {
          text = "";
        }
        return { type: "text" as const, text: `Attached file "${p.filename ?? "file"}":\n\n${text.slice(0, 60000)}` };
      }
      if (!supported) {
        return { type: "text" as const, text: `[Attached file "${p.filename ?? "file"}" (${p.mediaType}) — contents not readable here]` };
      }
      return p;
    }),
  }));
}

function errorCode(error: unknown) {
  const status = (error as { statusCode?: number })?.statusCode;
  if (status === 429) return "IRIEL_429";
  if (status === 402) return "IRIEL_402";
  if (status === 403) return "IRIEL_403";
  return "IRIEL_ERROR";
}

export async function handleChat(request: Request) {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) return Response.json({ error: "IRIEL_CONFIG" }, { status: 500 });

  let body: ChatBody;
  try {
    body = chatBodySchema.parse(await request.json());
  } catch {
    return Response.json({ error: "IRIEL_400" }, { status: 400 });
  }

  const messages = inlineTextAttachments(body.messages as UIMessage[]);
  const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(request));
  const provider = createOpenAI({
    baseURL: GATEWAY,
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });

  const tools = {
    ...(body.webSearch ? { web_search: provider.tools.webSearch({}) } : {}),
    ...(body.memoryEnabled
      ? {
          save_memory: tool({
            description: "Save one short fact the person explicitly asked iRiel to remember.",
            inputSchema: z.object({ text: z.string().describe("The fact, as one short sentence.") }),
            execute: async ({ text }) => ({ saved: text }),
          }),
        }
      : {}),
  };

  const effort = body.experience === "thinking" ? "high" : body.experience === "everyday" ? "low" : "medium";

  const result = streamText({
    model: provider.responses(MODEL),
    instructions: buildInstructions(body),
    messages: await convertToModelMessages(messages),
    tools,
    stopWhen: stepCountIs(8),
    abortSignal: request.signal,
    providerOptions: {
      openai: {
        store: false,
        forceReasoning: true,
        reasoningEffort: effort,
        reasoningSummary: "auto",
        include: ["reasoning.encrypted_content"],
      },
    },
  });

  return withLovableAiGatewayRunIdHeader(
    result.toUIMessageStreamResponse({
      originalMessages: body.messages as UIMessage[],
      sendReasoning: true,
      sendSources: true,
      onError: (error) => {
        if ((error as Error)?.name === "AbortError") return "IRIEL_ABORT";
        console.error("iRiel chat error", error);
        return errorCode(error);
      },
    }),
    runIdFetch,
  );
}
