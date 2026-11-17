import { getData } from "@/lib/store/data";
import type { Memory } from "@/lib/store/types";

export interface LocalMemoryMatch {
  memory: Memory;
  score: number;
}

function terms(value: string): string[] {
  return (
    value
      .toLocaleLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .match(/[\p{L}\p{N}]{2,}/gu) ?? []
  );
}

/** Searches the existing user-owned IndexedDB memory store; no remote embeddings. */
export function searchLocalMemories(query: string, limit = 5): LocalMemoryMatch[] {
  const normalizedLimit = Number.isFinite(limit) ? Math.max(1, Math.min(20, Math.floor(limit))) : 5;
  const queryTerms = [...new Set(terms(query))];
  if (!queryTerms.length) return [];

  return getData()
    .memories.map((memory) => {
      const memoryTerms = new Set(terms(memory.text));
      const matches = queryTerms.reduce((count, term) => count + Number(memoryTerms.has(term)), 0);
      return { memory, score: matches / queryTerms.length };
    })
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score || b.memory.createdAt - a.memory.createdAt)
    .slice(0, normalizedLimit);
}
