import type { PlanId } from "@/lib/store/settings";

const GB = 1024 ** 3;

export const PLANS: { id: PlanId; name: string; bytes: number; label: string }[] = [
  { id: "free", name: "Free", bytes: 16 * GB, label: "16 GB" },
  { id: "standard", name: "Standard", bytes: 50 * GB, label: "50 GB" },
  { id: "plus", name: "Plus", bytes: 1024 * GB, label: "1 TB" },
  { id: "advanced", name: "Advanced", bytes: 2048 * GB, label: "2 TB" },
];

/**
 * Runtime-owned assets (IRC-001 §12). They live in the runtime's own storage and
 * are never added to iVault usage.
 */
export const RUNTIME_ASSETS = [
  { key: "vault.runtime.weights", detail: "General · Reasoning · Coding · Embedding", bytes: 14.2 * GB },
  { key: "vault.runtime.speech", detail: "Recognition · Voice", bytes: 0.4 * GB },
  { key: "vault.runtime.cache", detail: "KV · Prompt", bytes: 1.1 * GB },
] as const;

/** Vector index grows with indexed text; still runtime-owned. */
export function vectorIndexBytes(textChars: number) {
  const chunks = Math.ceil(textChars / 800);
  return chunks * 768 * 4 + 4096;
}
