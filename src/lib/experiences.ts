import type { AgentId, ExperienceId } from "@/lib/store/types";
import type { MessageKey } from "@/lib/i18n";
import { Brain, Code2, Feather, Lock, Microscope, Sun, type LucideIcon } from "lucide-react";

export interface Experience {
  id: ExperienceId;
  label: MessageKey;
  desc: MessageKey;
  icon: LucideIcon;
}

export const EXPERIENCES: Experience[] = [
  { id: "everyday", label: "exp.everyday", desc: "exp.everyday.desc", icon: Sun },
  { id: "thinking", label: "exp.thinking", desc: "exp.thinking.desc", icon: Brain },
  { id: "research", label: "exp.research", desc: "exp.research.desc", icon: Microscope },
  { id: "creative", label: "exp.creative", desc: "exp.creative.desc", icon: Feather },
  { id: "developer", label: "exp.developer", desc: "exp.developer.desc", icon: Code2 },
  { id: "private", label: "exp.private", desc: "exp.private.desc", icon: Lock },
];

export const EXPERIENCE_IDS = EXPERIENCES.map((e) => e.id) as [ExperienceId, ...ExperienceId[]];

export function getExperience(id: ExperienceId) {
  return (EXPERIENCES.find((e) => e.id === id) ?? EXPERIENCES[0])!;
}

/**
 * Execution planner (IRC-001 §7): Private, or federation switched off, runs on the
 * on-device runtime. Everything else is hybrid through the ecosystem.
 */
export function executionMode(experience: ExperienceId, federation: boolean): "local" | "hybrid" {
  return experience === "private" || !federation ? "local" : "hybrid";
}

export interface Agent {
  id: AgentId;
  name: MessageKey;
  desc: MessageKey;
  experience: ExperienceId;
}

export const AGENTS: Agent[] = [
  { id: "daily", name: "agents.daily", desc: "agents.daily.desc", experience: "everyday" },
  { id: "planner", name: "agents.planner", desc: "agents.planner.desc", experience: "thinking" },
  { id: "researcher", name: "agents.researcher", desc: "agents.researcher.desc", experience: "research" },
  { id: "writer", name: "agents.writer", desc: "agents.writer.desc", experience: "creative" },
  { id: "coder", name: "agents.coder", desc: "agents.coder.desc", experience: "developer" },
  { id: "keeper", name: "agents.keeper", desc: "agents.keeper.desc", experience: "private" },
];
