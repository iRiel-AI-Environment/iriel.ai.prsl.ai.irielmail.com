import { ModelContract } from "./model.contract";

export const MODELS: ModelContract[] = [
  {
    id: "general-primary",

    family: "qwen",

    category: "general",

    local: true,

    enabled: true
  },

  {
    id: "reasoning-primary",

    family: "deepseek-r1",

    category: "reasoning",

    local: true,

    enabled: true
  },

  {
    id: "coder-primary",

    family: "qwen-coder",

    category: "coding",

    local: true,

    enabled: true
  },

  {
    id: "embedding-primary",

    family: "multilingual-e5",

    category: "embedding",

    local: true,

    enabled: true
  },

  {
    id: "speech-primary",

    family: "whisper",

    category: "speech",

    local: true,

    enabled: true
  }
];
