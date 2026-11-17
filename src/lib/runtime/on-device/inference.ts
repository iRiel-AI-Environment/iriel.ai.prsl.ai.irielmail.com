import type { UIMessage } from "ai";
import type { LocalInferenceBackend } from "./contracts";

let backend: LocalInferenceBackend | null = null;
let availability: Promise<boolean> | null = null;

/**
 * Registers an explicitly local inference backend.
 * The application does not silently download a model or fall back to a provider.
 */
export function registerLocalInferenceBackend(next: LocalInferenceBackend): () => void {
  backend = next;
  availability = null;
  return () => {
    if (backend?.id === next.id) {
      backend = null;
      availability = null;
    }
  };
}

export function getRegisteredInferenceBackend(): LocalInferenceBackend | null {
  return backend;
}

export async function isLocalInferenceAvailable(): Promise<boolean> {
  if (!backend) return false;
  if (!availability) {
    availability = backend.isAvailable().catch((error: unknown) => {
      availability = null;
      throw error;
    });
  }
  return availability;
}

export async function generateLocally(
  messages: readonly UIMessage[],
  signal?: AbortSignal,
): Promise<string | null> {
  const selected = backend;
  if (!selected || !(await isLocalInferenceAvailable())) return null;
  if (signal?.aborted) throw new DOMException("The local operation was aborted.", "AbortError");
  const result = await selected.generate(messages, signal);
  if (typeof result !== "string" || !result.trim()) {
    throw new Error(`Local inference backend "${selected.id}" returned an empty response.`);
  }
  return result;
}
