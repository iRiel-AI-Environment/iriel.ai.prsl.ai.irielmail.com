import type { FileUIPart } from "ai";
import type { AgentId, ExperienceId } from "@/lib/store/types";

export interface PendingPrompt {
  text: string;
  files: FileUIPart[];
  webSearch: boolean;
}

/** First message typed on the home screen, picked up by the new thread page once it mounts. */
const pending = new Map<string, PendingPrompt>();

export function setPending(threadId: string, p: PendingPrompt) {
  pending.set(threadId, p);
}
export function takePending(threadId: string) {
  const p = pending.get(threadId);
  pending.delete(threadId);
  return p;
}

export interface NewChatOptions {
  experience?: ExperienceId;
  agentId?: AgentId;
  projectId?: string;
}
