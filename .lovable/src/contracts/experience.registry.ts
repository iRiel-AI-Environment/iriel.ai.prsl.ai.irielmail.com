import { ExperienceContract } from "./experience.contract";

export const EXPERIENCES: ExperienceContract[] = [
  {
    id: "everyday",

    name: "Everyday",

    description:
      "Daily conversations and productivity.",

    capabilityIds: [
      "conversation",
      "tasks",
      "search"
    ],

    preferredExecution: "local",

    allowFederation: true
  },

  {
    id: "thinking",

    name: "Thinking",

    description:
      "Deep analysis and reasoning.",

    capabilityIds: [
      "reasoning",
      "planning",
      "analysis"
    ],

    preferredExecution: "hybrid",

    allowFederation: true
  },

  {
    id: "private",

    name: "Private",

    description:
      "Local-only execution.",

    capabilityIds: [
      "private-memory",
      "private-reasoning"
    ],

    preferredExecution: "local",

    allowFederation: false
  }
];
