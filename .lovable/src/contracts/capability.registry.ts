export const CAPABILITIES = [
  {
    id: "conversation",

    name: "Conversation",

    requiredModelTypes: ["general"],
  },

  {
    id: "reasoning",

    name: "Reasoning",

    requiredModelTypes: ["reasoning"],
  },

  {
    id: "code",

    name: "Coding",

    requiredModelTypes: ["coding"],
  },

  {
    id: "translation",

    name: "Translation",

    requiredModelTypes: ["translation"],
  },

  {
    id: "semantic-search",

    name: "Semantic Search",

    requiredModelTypes: ["embedding"],
  },
];
