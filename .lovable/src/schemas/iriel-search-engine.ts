import { z } from "zod";

export const SearchEngineSchema = z.object({
  title: z.string().min(1, "Title cannot be empty"),
  mobile: z
    .string()
    .min(1)
    .refine((url) => url.includes("%s"), {
      message: "Search URL must contain the %s query placeholder",
    }),
  shortcuts: z.array(z.string().min(1).toLowerCase()).min(1, "At least one shortcut is required"),
  favicon: z.string().min(1).optional(),
  definition: z.string().min(1).optional(),
});

export const SearchEngineListSchema = z.array(SearchEngineSchema).superRefine((engines, ctx) => {
  const seenShortcuts = new Set<string>();

  engines.forEach((engine, engineIndex) => {
    engine.shortcuts.forEach((shortcut) => {
      if (seenShortcuts.has(shortcut)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate shortcut "${shortcut}" found in "${engine.title}"`,
          path: [engineIndex, "shortcuts"],
        });
      }
      seenShortcuts.add(shortcut);
    });
  });
});

export type SearchEngine = z.infer<typeof SearchEngineSchema>;
