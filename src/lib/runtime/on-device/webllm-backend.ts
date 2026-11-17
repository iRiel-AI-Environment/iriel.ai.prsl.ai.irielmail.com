import type { UIMessage } from "ai";
import type { LocalInferenceBackend } from "./contracts";
import { registerLocalInferenceBackend } from "./inference";

const WEBLLM_MODULE_URL = "https://esm.run/@mlc-ai/web-llm@0.2.88";
export const WEBLLM_MODEL_ID = "Qwen2.5-0.5B-Instruct-q4f16_1-MLC";

type WebLLMProgress = { progress?: number; text?: string };
type WebLLMMessage = { role: "user" | "assistant" | "system"; content: string };
type WebLLMEngine = {
  chat: {
    completions: {
      create(input: {
        messages: WebLLMMessage[];
        temperature: number;
        max_tokens: number;
        stream: false;
      }): Promise<{ choices?: Array<{ message?: { content?: string | null } }> }>;
    };
  };
  unload(): Promise<void>;
};
type WebLLMModule = {
  CreateMLCEngine(
    modelId: string,
    options: { initProgressCallback(progress: WebLLMProgress): void },
  ): Promise<WebLLMEngine>;
};

export interface LocalModelProgress {
  percent: number;
  message: string;
}

export function isWebGPUAvailable(): boolean {
  return typeof navigator !== "undefined" && "gpu" in navigator;
}

/**
 * Loads the WebLLM runtime and model only after an explicit user action.
 * Runtime code is fetched from esm.run; model artifacts are fetched by WebLLM
 * from its configured model sources and cached by the browser.
 * Conversation messages are passed only to the in-browser engine.
 */
export async function enableWebLLMBackend(
  onProgress: (progress: LocalModelProgress) => void,
): Promise<() => void> {
  if (!isWebGPUAvailable()) {
    throw new Error("WebGPU is unavailable in this browser or device.");
  }

  onProgress({ percent: 0, message: "Loading the local inference runtime…" });
  const webllm = (await import(/* @vite-ignore */ WEBLLM_MODULE_URL)) as WebLLMModule;
  const engine = await webllm.CreateMLCEngine(WEBLLM_MODEL_ID, {
    initProgressCallback(progress) {
      onProgress({
        percent: Math.max(0, Math.min(100, Math.round((progress.progress ?? 0) * 100))),
        message: progress.text ?? "Preparing the local model…",
      });
    },
  });

  const backend: LocalInferenceBackend = {
    id: "webllm-qwen2.5-0.5b",
    label: "Qwen2.5 0.5B · WebLLM",
    async isAvailable() {
      return true;
    },
    async generate(messages: readonly UIMessage[], signal?: AbortSignal) {
      if (signal?.aborted) {
        throw new DOMException("The local operation was aborted.", "AbortError");
      }

      const prompt: WebLLMMessage[] = messages.flatMap((message) => {
        if (message.role !== "user" && message.role !== "assistant" && message.role !== "system") {
          return [];
        }
        const content = message.parts
          .filter((part): part is Extract<(typeof message.parts)[number], { type: "text" }> => part.type === "text")
          .map((part) => part.text)
          .join("\n")
          .trim();
        return content ? [{ role: message.role, content }] : [];
      });

      const result = await engine.chat.completions.create({
        messages: prompt,
        temperature: 0.6,
        max_tokens: 512,
        stream: false,
      });
      if (signal?.aborted) {
        throw new DOMException("The local operation was aborted.", "AbortError");
      }
      const content = result.choices?.[0]?.message?.content;
      if (typeof content !== "string" || !content.trim()) {
        throw new Error("WebLLM returned an empty response.");
      }
      return content;
    },
  };

  const unregister = registerLocalInferenceBackend(backend);
  onProgress({ percent: 100, message: "Local model is ready on this device." });
  return () => {
    unregister();
    void engine.unload();
  };
}
