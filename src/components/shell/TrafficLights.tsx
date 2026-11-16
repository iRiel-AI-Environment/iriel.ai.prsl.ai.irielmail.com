import { Minus, Plus, X } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** macOS window controls: close conversation, collapse sidebar, full screen. */
export function TrafficLights({ onMinimize, muted }: { onMinimize: () => void; muted?: boolean }) {
  const t = useT();
  const navigate = useNavigate();
  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen?.().catch(() => {});
  };
  const base =
    "grid size-3 place-items-center rounded-full transition-colors [&>svg]:size-2 [&>svg]:opacity-0 group-hover/lights:[&>svg]:opacity-70 text-primary-foreground";
  return (
    <div className="group/lights flex items-center gap-2">
      <button
        type="button"
        aria-label={t("window.close")}
        title={t("window.close")}
        onClick={() => navigate({ to: "/" })}
        className={cn(base, muted ? "bg-hairline-strong group-hover/lights:bg-traffic-red" : "bg-traffic-red")}
      >
        <X strokeWidth={3} />
      </button>
      <button
        type="button"
        aria-label={t("window.minimize")}
        title={t("window.minimize")}
        onClick={onMinimize}
        className={cn(base, muted ? "bg-hairline-strong group-hover/lights:bg-traffic-yellow" : "bg-traffic-yellow")}
      >
        <Minus strokeWidth={3} />
      </button>
      <button
        type="button"
        aria-label={t("window.fullscreen")}
        title={t("window.fullscreen")}
        onClick={toggleFullscreen}
        className={cn(base, muted ? "bg-hairline-strong group-hover/lights:bg-traffic-green" : "bg-traffic-green")}
      >
        <Plus strokeWidth={3} />
      </button>
    </div>
  );
}
