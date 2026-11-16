import { useState } from "react";
import { Globe } from "lucide-react";
import { engineFavicon, type SearchEngine } from "@/lib/engines";
import { cn } from "@/lib/utils";

/** Favicon tile; falls back to a letter (always, when offline-only/private). */
export function EngineIcon({ engine, className, offline }: { engine?: SearchEngine | undefined; className?: string; offline?: boolean }) {
  const [failed, setFailed] = useState(false);
  const src = engine && !offline ? engineFavicon(engine) : undefined;
  return (
    <span className={cn("grid size-5 shrink-0 place-items-center overflow-hidden rounded-md bg-glass-strong text-[10px] font-semibold text-muted-foreground", className)}>
      {!engine ? (
        <Globe className="size-3" />
      ) : src && !failed ? (
        <img src={src} alt="" className="size-full object-contain p-0.5" loading="lazy" onError={() => setFailed(true)} />
      ) : (
        engine.title[0]
      )}
    </span>
  );
}
