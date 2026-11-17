import type { UIMessage } from "ai";
import type { OnDeviceRuntimeStatus, RuntimeCapabilityStatus } from "./contracts";
import {
  generateLocally,
  getRegisteredInferenceBackend,
  isLocalInferenceAvailable,
} from "./inference";
import { assertLocalExecution } from "./privacy";

let status: OnDeviceRuntimeStatus = {
  state: "not-started",
  capabilities: [],
  inferenceBackend: null,
  lastError: null,
};
let bootPromise: Promise<OnDeviceRuntimeStatus> | null = null;

function capability(
  name: RuntimeCapabilityStatus["capability"],
  available: boolean,
  detail: string,
): RuntimeCapabilityStatus {
  return { capability: name, available, detail };
}

/** Idempotent runtime bootstrap. It does not fetch model weights or contact providers. */
export function bootOnDeviceRuntime(): Promise<OnDeviceRuntimeStatus> {
  if (status.state === "ready") return Promise.resolve(status);
  if (bootPromise) return bootPromise;

  status = { ...status, state: "starting", lastError: null };
  bootPromise = (async () => {
    try {
      const backend = getRegisteredInferenceBackend();
      const inferenceAvailable = await isLocalInferenceAvailable();
      status = {
        state: "ready",
        inferenceBackend: inferenceAvailable ? (backend?.id ?? null) : null,
        lastError: null,
        capabilities: [
          capability("local-chat", true, "Existing LocalRuntimeTransport is available."),
          capability("local-memory", true, "Uses the existing browser IndexedDB memory store."),
          capability(
            "local-inference",
            inferenceAvailable,
            inferenceAvailable
              ? `Local backend "${backend?.label ?? backend?.id}" is ready.`
              : "No local model backend is registered; the existing deterministic local runtime remains active.",
          ),
          capability(
            "offline-assets",
            false,
            "Model and application assets are not pre-cached by this runtime.",
          ),
        ],
      };
      return status;
    } catch (error) {
      status = {
        state: "failed",
        capabilities: [],
        inferenceBackend: null,
        lastError: error instanceof Error ? error.message : "Unknown local runtime error.",
      };
      throw error;
    } finally {
      bootPromise = null;
    }
  })();
  return bootPromise;
}

/** Local inference first, then the existing deterministic on-device response path. */
export async function executeOnDeviceChat(
  messages: readonly UIMessage[],
  fallback: () => string,
  signal?: AbortSignal,
): Promise<string> {
  assertLocalExecution({
    boundary: "local",
    capability: "local-chat",
    ...(signal ? { signal } : {}),
  });
  await bootOnDeviceRuntime();
  assertLocalExecution({
    boundary: "local",
    capability: "local-inference",
    ...(signal ? { signal } : {}),
  });
  return (await generateLocally(messages, signal)) ?? fallback();
}

export function getOnDeviceRuntimeStatus(): OnDeviceRuntimeStatus {
  return status;
}
