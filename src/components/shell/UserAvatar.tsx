import { Link } from "@tanstack/react-router";
import { useSettings } from "@/lib/store/settings";
import { cn } from "@/lib/utils";

export function UserAvatar({ className, asLink = true }: { className?: string; asLink?: boolean }) {
  const name = useSettings((s) => s.profile.name);
  const initial = (name.trim()[0] ?? "R").toUpperCase();
  const cls = cn(
    "grid size-9 shrink-0 place-items-center rounded-full border border-hairline-strong bg-glass-strong text-sm font-medium text-foreground transition-colors hover:bg-accent",
    className,
  );
  if (!asLink) return <span className={cls}>{initial}</span>;
  return (
    <Link to="/ispace/$section" params={{ section: "profile" }} aria-label={name} className={cls}>
      {initial}
    </Link>
  );
}
