import { createContext, useContext } from "react";
import type { ExperienceId } from "@/lib/store/types";
import type { NewChatOptions } from "@/lib/session";

export interface ShellContextValue {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  openSearch: () => void;
  activeExperience: ExperienceId;
  changeExperience: (e: ExperienceId) => void;
  newChat: (opts?: NewChatOptions) => Promise<void>;
}

export const ShellContext = createContext<ShellContextValue | null>(null);

export function useShell() {
  const ctx = useContext(ShellContext);
  if (!ctx) throw new Error("useShell must be used inside AppShell");
  return ctx;
}
