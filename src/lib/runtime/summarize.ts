const STOP = new Set(
  "a an the and or but if then so of to in on at for with by from as is are was were be been being it its this that these those i you he she we they them his her our your their not no do does did have has had will would can could should may might must about into over after before than also just very more most such there here what which who whom when where why how all any each few other some".split(
    " ",
  ),
);

export function splitSentences(text: string) {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?。！？])\s+(?=[A-ZÀ-ÖØ-Þ0-9"“(])/u)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);
}

/** Frequency-based extractive summary — runs entirely on device. */
export function summarize(text: string, max = 4) {
  const sentences = splitSentences(text);
  if (sentences.length <= max) return sentences;
  const freq = new Map<string, number>();
  for (const w of text.toLowerCase().match(/[\p{L}\p{N}']+/gu) ?? []) {
    if (w.length < 3 || STOP.has(w)) continue;
    freq.set(w, (freq.get(w) ?? 0) + 1);
  }
  const scored = sentences.map((s, i) => {
    const words = s.toLowerCase().match(/[\p{L}\p{N}']+/gu) ?? [];
    const score = words.reduce((sum, w) => sum + (freq.get(w) ?? 0), 0) / Math.max(4, words.length);
    return { s, i, score: score + (i === 0 ? 0.5 : 0) };
  });
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
    .sort((a, b) => a.i - b.i)
    .map((x) => x.s);
}

export function keywords(text: string) {
  return (text.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []).filter(
    (w) => w.length > 2 && !STOP.has(w),
  );
}
