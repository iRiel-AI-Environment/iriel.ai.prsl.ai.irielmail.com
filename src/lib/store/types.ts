import type { UIMessage } from "ai";

export type ExperienceId =
  "everyday" | "thinking" | "research" | "creative" | "developer" | "private";

export type AgentId = "planner" | "researcher" | "writer" | "coder" | "daily" | "keeper";

export interface Thread {
  id: string;
  title: string;
  experience: ExperienceId;
  agentId?: AgentId | undefined;
  projectId?: string | undefined;
  createdAt: number;
  updatedAt: number;
  messages: UIMessage[];
}

export type VaultCategory = "docs" | "media" | "projects";
export type IndexStatus = "uploading" | "extracting" | "embedding" | "indexed";

export interface VaultFile {
  id: string;
  name: string;
  type: string;
  size: number;
  category: VaultCategory;
  projectId?: string | undefined;
  blob: Blob;
  text?: string | undefined;
  status: IndexStatus;
  createdAt: number;
}

export interface Memory {
  id: string;
  text: string;
  source: "chat" | "manual";
  createdAt: number;
}

export interface Project {
  id: string;
  name: string;
  createdAt: number;
}

export interface CustomSource {
  id: string;
  topic: string;
  url: string;
}
