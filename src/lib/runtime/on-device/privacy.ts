import type { ExecutionRequest } from "./contracts";

/**
 * Enforces the execution boundary for the local runtime.
 *
 * This is an application-level guard, not a browser-wide network firewall.
 * Private chat must continue to use LocalRuntimeTransport and must never be
 * routed to /api/chat or an external provider.
 */
export function assertLocalExecution(request: ExecutionRequest): void {
  if (request.boundary !== "local") {
    throw new Error(
      `On-device runtime rejected non-local execution for capability "${request.capability}".`,
    );
  }
  if (request.signal?.aborted) {
    throw new DOMException("The local operation was aborted.", "AbortError");
  }
}
