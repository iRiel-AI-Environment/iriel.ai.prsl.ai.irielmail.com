import { Check, ChevronDown, ShieldCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EXPERIENCES, getExperience } from "@/lib/experiences";
import { useT } from "@/lib/i18n";
import type { ExperienceId } from "@/lib/store/types";
import { cn } from "@/lib/utils";

export function ExperiencePicker({
  value,
  onChange,
  className,
  compact,
}: {
  value: ExperienceId;
  onChange: (e: ExperienceId) => void;
  className?: string;
  compact?: boolean;
}) {
  const t = useT();
  const current = getExperience(value)!;
  const isPrivate = value === "private";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-xs text-muted-foreground outline-none transition-colors hover:bg-glass-strong hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring",
          isPrivate && "border border-private/30 bg-private/10 text-private hover:bg-private/15 hover:text-private",
          className,
        )}
        aria-label={t("exp.label")}
      >
        {isPrivate ? <ShieldCheck className="size-3.5" /> : <current.icon className="size-3.5" />}
        <span>{isPrivate && !compact ? t("private.badge") : t(current.label)}</span>
        <ChevronDown className="size-3 opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72 border-hairline-strong bg-popover/95 p-1.5 backdrop-blur-xl">
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">{t("exp.label")}</DropdownMenuLabel>
        {EXPERIENCES.map((e) => (
          <DropdownMenuItem
            key={e.id}
            onSelect={() => onChange(e.id)}
            className="items-start gap-3 rounded-lg px-2 py-2"
          >
            <e.icon className={cn("mt-0.5 size-4 shrink-0", e.id === "private" ? "text-private" : "text-muted-foreground")} />
            <div className="min-w-0 flex-1">
              <div className="text-sm text-foreground">{t(e.label)}</div>
              <div className="text-xs text-muted-foreground">{t(e.desc)}</div>
              {e.id === "private" && (
                <div className="mt-1 flex gap-1.5 text-[10px] uppercase tracking-wide text-private">
                  <span>{t("private.zeroTelemetry")}</span>·<span>{t("private.zeroFederation")}</span>
                </div>
              )}
            </div>
            {e.id === value && <Check className="mt-0.5 size-4 shrink-0" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator className="bg-hairline" />
        <p className="px-2 py-1.5 text-[11px] leading-snug text-faint">{t("conn.hybridDesc")}</p>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
