export type ModelCategory =
  "general" | "reasoning" | "coding" | "embedding" | "translation" | "speech" | "classification";
export interface ModelContract {
  id: string;

  family: string;

  category: ModelCategory;

  local: boolean;

  enabled: boolean;
}
