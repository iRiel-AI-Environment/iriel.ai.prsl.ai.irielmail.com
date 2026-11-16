import { openDB, type IDBPDatabase } from "idb";
import type { Memory, Project, Thread, VaultFile } from "./types";

type Stores = {
  threads: Thread;
  files: VaultFile;
  memories: Memory;
  projects: Project;
};

let dbPromise: Promise<IDBPDatabase> | null = null;

function db() {
  if (!dbPromise) {
    dbPromise = openDB("iriel", 1, {
      upgrade(d) {
        for (const name of ["threads", "files", "memories", "projects"]) {
          if (!d.objectStoreNames.contains(name)) d.createObjectStore(name, { keyPath: "id" });
        }
      },
    });
  }
  return dbPromise;
}

export async function getAll<K extends keyof Stores>(store: K): Promise<Stores[K][]> {
  return (await db()).getAll(store) as Promise<Stores[K][]>;
}
export async function put<K extends keyof Stores>(store: K, value: Stores[K]) {
  await (await db()).put(store, value);
}
export async function remove<K extends keyof Stores>(store: K, id: string) {
  await (await db()).delete(store, id);
}
export async function clear<K extends keyof Stores>(store: K) {
  await (await db()).clear(store);
}
