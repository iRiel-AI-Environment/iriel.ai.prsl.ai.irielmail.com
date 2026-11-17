import { useState } from "react";
import { Cpu, Download, ShieldCheck } from "lucide-react";
import {
  enableWebLLMBackend,
  isWebGPUAvailable,
  type LocalModelProgress,
} from "@/lib/runtime/on-device/webllm-backend";

export function LocalModelSetup() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<LocalModelProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);
  const supported = isWebGPUAvailable();

  const enable = async () => {
    if (loading || enabled) return;
    setLoading(true);
    setError(null);
    try {
      await enableWebLLMBackend(setProgress);
      setEnabled(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The local model could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-3xl rounded-2xl border border-hairline bg-glass p-4">
      <div className="flex items-start gap-3">
        <div className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary">
          <Cpu className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">On-device AI model</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {enabled
              ? "Qwen2.5 0.5B is loaded in this browser. Private chat uses local inference."
              : "Enable a small WebGPU model for real language-model inference on this device. The first setup downloads the runtime and model files; later sessions can reuse the browser cache."}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
        <ShieldCheck className="size-3.5 shrink-0" />
        Chat prompts are processed in-browser and are not sent to the model host.
      </div>

      {!supported && (
        <p role="status" className="mt-3 text-xs text-destructive">
          WebGPU is not available in this browser. The existing local fallback remains active.
        </p>
      )}

      {progress && (
        <div className="mt-3" aria-live="polite">
          <div className="mb-1 flex justify-between gap-3 text-[11px] text-muted-foreground">
            <span className="truncate">{progress.message}</span>
            <span>{progress.percent}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-foreground transition-[width]"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-3 text-xs text-destructive">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={() => void enable()}
        disabled={!supported || loading || enabled}
        className="mt-4 inline-flex h-9 items-center gap-2 rounded-full bg-foreground px-4 text-xs font-medium text-background disabled:opacity-40"
      >
        <Download className="size-3.5" />
        {enabled ? "Local model enabled" : loading ? "Preparing model…" : "Download and enable model"}
      </button>
      <p className="mt-2 text-[10px] leading-4 text-muted-foreground">
        Consent: selecting this button downloads WebLLM code from esm.run and model assets from the model registry. No model or runtime is downloaded before you select it.
      </p>
    </section>
  );
}
