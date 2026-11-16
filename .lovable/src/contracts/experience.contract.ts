export type ExperienceId =
  | "everyday"
  | "thinking"
  | "research"
  | "creative"
  | "developer"
  | "private";

export interface ExperienceContract {
  id: ExperienceId;

  name: string;

  description: string;

  capabilityIds: string[];

  preferredExecution: ExecutionMode;

  allowFederation: boolean;
}
