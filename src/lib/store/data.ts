import { useSyncExternalStore } from "react";
import type { UIMessage } from "ai";
import * as idb from "./db";
import type {
  ExperienceId,
  AgentId,
  Memory,
  Project,
  Thread,
  VaultFile,
  VaultCategory,
} from "./types";
import { getSettings } from "./settings";
import { PLANS } from "@/lib/vault";
import { extractText, isTextLike } from "@/lib/files";

interface DataState {
  ready: boolean;
  threads: Thread[];
  files: VaultFile[];
  memories: Memory[];
  projects: Project[];
}

let state: DataState = { ready: false, threads: [], files: [], memories: [], projects: [] };
const EMPTY: DataState = state;
const listeners = new Set<() => void>();
let loading: Promise<void> | null = null;

function set(patch: Partial<DataState>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

export function uid() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 16);
}

export function loadData() {
  if (typeof window === "undefined") return Promise.resolve();
  if (!loading) {
    loading = (async () => {
      try {
        const [threads, files, memories, projects] = await Promise.all([
          idb.getAll("threads"),
          idb.getAll("files"),
          idb.getAll("memories"),
          idb.getAll("projects"),
        ]);
        // Files interrupted mid-index finish indexing on next load.
        for (const f of files) if (f.status !== "indexed") void runIndexing(f.id);
        set({
          ready: true,
          threads: threads.sort((a, b) => b.updatedAt - a.updatedAt),
          files: files.sort((a, b) => b.createdAt - a.createdAt),
          memories: memories.sort((a, b) => b.createdAt - a.createdAt),
          projects: projects.sort((a, b) => b.createdAt - a.createdAt),
        });
      } catch (e) {
        console.error("iRiel storage unavailable", e);
        set({ ready: true });
      }
    })();
  }
  return loading;
}

export function getData() {
  return state;
}

export function useData<T>(selector: (s: DataState) => T): T {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => selector(state),
    () => selector(EMPTY),
  );
}

/* ---------------- Threads ---------------- */

export function titleFrom(text: string) {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > 48 ? `${clean.slice(0, 46).trimEnd()}…` : clean;
}

export async function createThread(opts: {
  experience: ExperienceId;
  agentId?: AgentId | undefined;
  projectId?: string | undefined;
  title?: string;
}) {
  const now = Date.now();
  const thread: Thread = {
    id: uid(),
    title: opts.title ?? "",
    experience: opts.experience,
    agentId: opts.agentId,
    projectId: opts.projectId,
    createdAt: now,
    updatedAt: now,
    messages: [],
  };
  set({ threads: [thread, ...state.threads] });
  await idb.put("threads", thread);
  return thread;
}

export async function updateThread(id: string, patch: Partial<Thread>) {
  const existing = state.threads.find((t) => t.id === id);
  if (!existing) return;
  const next = { ...existing, ...patch };
  set({
    threads: [next, ...state.threads.filter((t) => t.id !== id)].sort(
      (a, b) => b.updatedAt - a.updatedAt,
    ),
  });
  await idb.put("threads", next);
}

export async function saveMessages(id: string, messages: UIMessage[]) {
  const existing = state.threads.find((t) => t.id === id);
  if (!existing) return;
  const firstUser = messages.find((m) => m.role === "user");
  const firstText = firstUser?.parts.find((p) => p.type === "text");
  const title =
    existing.title ||
    (firstText && "text" in firstText ? titleFrom(firstText.text) : "") ||
    (firstUser?.parts.find((p) => p.type === "file") as { filename?: string } | undefined)
      ?.filename ||
    "";
  const changed =
    messages.length !== existing.messages.length ||
    JSON.stringify(messages) !== JSON.stringify(existing.messages);
  if (!changed && title === existing.title) return;
  await updateThread(id, { messages, title, updatedAt: changed ? Date.now() : existing.updatedAt });
}

export async function deleteThread(id: string) {
  set({ threads: state.threads.filter((t) => t.id !== id) });
  await idb.remove("threads", id);
}

export async function clearThreads() {
  set({ threads: [] });
  await idb.clear("threads");
}

/* ---------------- Projects ---------------- */

export async function createProject(name: string) {
  const p: Project = { id: uid(), name: name.trim(), createdAt: Date.now() };
  set({ projects: [p, ...state.projects] });
  await idb.put("projects", p);
  return p;
}

export async function deleteProject(id: string) {
  set({ projects: state.projects.filter((p) => p.id !== id) });
  await idb.remove("projects", id);
  for (const t of state.threads.filter((t) => t.projectId === id))
    await updateThread(t.id, { projectId: undefined });
  for (const f of state.files.filter((f) => f.projectId === id))
    await updateFile(f.id, { projectId: undefined, category: "docs" });
}

/* ---------------- Memory ---------------- */

export async function addMemory(text: string, source: Memory["source"] = "manual") {
  const clean = text.trim();
  if (!clean) return null;
  if (state.memories.some((m) => m.text.toLowerCase() === clean.toLowerCase())) return null;
  const m: Memory = { id: uid(), text: clean, source, createdAt: Date.now() };
  set({ memories: [m, ...state.memories] });
  await idb.put("memories", m);
  return m;
}

export async function deleteMemory(id: string) {
  set({ memories: state.memories.filter((m) => m.id !== id) });
  await idb.remove("memories", id);
}

export async function clearMemories() {
  set({ memories: [] });
  await idb.clear("memories");
}

/* ---------------- iVault ---------------- */

export function vaultUsed(files = state.files) {
  return files.reduce((sum, f) => sum + f.size, 0);
}

export function vaultQuota() {
  return PLANS.find((p) => p.id === getSettings().plan)?.bytes ?? PLANS[0]!.bytes;
}

export function categoryFor(file: File | { type: string }, projectId?: string): VaultCategory {
  if (projectId) return "projects";
  return /^(image|video|audio)\//.test(file.type) ? "media" : "docs";
}

export class VaultFullError extends Error {}

export async function addFiles(files: File[], opts: { projectId?: string | undefined } = {}) {
  const incoming = files.reduce((s, f) => s + f.size, 0);
  if (vaultUsed() + incoming > vaultQuota()) throw new VaultFullError("iVault full");
  const added: VaultFile[] = [];
  for (const file of files) {
    const vf: VaultFile = {
      id: uid(),
      name: file.name,
      type: file.type || "application/octet-stream",
      size: file.size,
      category: categoryFor(file, opts.projectId),
      projectId: opts.projectId,
      blob: file,
      status: "uploading",
      createdAt: Date.now(),
    };
    added.push(vf);
  }
  set({ files: [...added, ...state.files] });
  for (const vf of added) {
    await idb.put("files", vf);
    void runIndexing(vf.id);
  }
  return added;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Semantic indexing pipeline: iVault → extraction → embedding → indexed (IRC-001 §13). */
async function runIndexing(id: string) {
  await wait(350);
  await updateFile(id, { status: "extracting" });
  const file = state.files.find((f) => f.id === id);
  let text: string | undefined;
  if (file && isTextLike(file.type, file.name)) text = await extractText(file.blob);
  await wait(500);
  await updateFile(id, { status: "embedding", text });
  await wait(700);
  await updateFile(id, { status: "indexed" });
}

export async function updateFile(id: string, patch: Partial<VaultFile>) {
  const existing = state.files.find((f) => f.id === id);
  if (!existing) return;
  const next = { ...existing, ...patch };
  set({ files: state.files.map((f) => (f.id === id ? next : f)) });
  await idb.put("files", next);
}

export async function deleteFile(id: string) {
  set({ files: state.files.filter((f) => f.id !== id) });
  await idb.remove("files", id);
}

export async function clearFiles() {
  set({ files: [] });
  await idb.clear("files");
}
