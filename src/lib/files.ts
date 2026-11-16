export const TEXT_EXT = /\.(txt|md|markdown|csv|tsv|json|xml|yaml|yml|toml|html?|css|js|jsx|ts|tsx|py|rb|go|rs|java|kt|swift|c|cc|cpp|h|hpp|cs|php|sql|sh|ini|log|env)$/i;

export function isTextLike(type: string, name: string) {
  return type.startsWith("text/") || /json|xml|yaml|javascript|typescript/.test(type) || TEXT_EXT.test(name);
}

export async function extractText(blob: Blob, limit = 60_000) {
  try {
    const t = await blob.text();
    return t.slice(0, limit);
  } catch {
    return undefined;
  }
}

export function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const v = bytes / 1024 ** i;
  return `${v >= 100 || i === 0 ? Math.round(v) : v.toFixed(1)} ${units[i]}`;
}

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });
}

export function dataUrlToText(url: string) {
  const comma = url.indexOf(",");
  const meta = url.slice(0, comma);
  const data = url.slice(comma + 1);
  if (meta.includes(";base64")) {
    const bin = atob(data);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }
  return decodeURIComponent(data);
}
