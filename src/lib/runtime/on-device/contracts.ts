import type { UIMessage } from "ai";

export type OnDeviceCapability = "local-chat" | "local-memory" | "local-inference" | "offline-assets";

export type ExecutionBoundary = "local" | "federated";

export interface ExecutionRequest {
  boundary: ExecutionBoundary;
  capability: OnDeviceCapability;
  signal?: AbortSignal;
}

export interface LocalInferenceBackend {
  readonly id: string;
  readonly label: string;
  isAvailable(): Promise<boolean>;
  generate(messages: readonly UIMessage[], signal?: AbortSignal): Promise<string>;
}

export interface RuntimeCapabilityStatus {
  capability: OnDeviceCapability;
  available: boolean;
  detail: string;
}

export interface OnDeviceRuntimeStatus {
  state: "not-started" | "starting" | "ready" | "failed";
  capabilities: RuntimeCapabilityStatus[];
  inferenceBackend: string | null;
  lastError: string | null;
}
