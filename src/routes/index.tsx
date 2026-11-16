import { createFileRoute, Link } from "@tanstack/react-router";
import { UserAvatar } from "@/components/shell/UserAvatar";
import { useEffect, useState } from "react";
import { ArrowUp, Mic, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { PresenceOrb } from "@/components/presence/PresenceOrb";
import { TrafficLights } from "@/components/shell/TrafficLights";
import { EngineIcon } from "@/components/shell/EngineIcon";
import { bangInProgress, openEngine, parseBang, suggestEngines } from "@/lib/engines";
import { useT } from "@/lib/i18n";
import { markSettingsHydrated } from "@/lib/store/settings";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "iRiel — Ask or Search" },
      { name: "description", content: "iRiel is a Personal Intelligence Environment by Robert Software Labs. Human first. Always." },
      { property: "og:title", content: "iRiel — Ask or Search" },
      { property: "og:description", content: "A Personal Intelligence Environment with native intelligence from the first second." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const PILLS = ["suggest.summarize", "suggest.web", "suggest.files", "suggest.plan", "suggest.brainstorm"] as const;

function Home() {
  const t = useT();
  const [text, setText] = useState("");
  useEffect(() => markSettingsHydrated(), []);
  const partial = bangInProgress(text);
  const suggestions = partial !== null ? suggestEngines(partial, 6) : [];

  const submit = () => {
    const bang = parseBang(text);
    if (bang && bang.query) {
      openEngine(bang.engine, bang.query);
      toast(t("engines.opened", { engine: bang.engine.title }));
      setText("");
    }
  };

  return (
    <div className="relative flex min-h-dvh flex-col bg-background stage-bg">
      <header className="flex h-16 items-center justify-between px-5 md:px-6">
        <div className="flex items-center gap-5">
          <div className="hidden xl:block">
            <TrafficLights onMinimize={() => {}} />
          </div>
          <span className="text-lg font-medium tracking-tight">iRiel</span>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" aria-label={t("nav.search")} className="grid size-9 place-items-center rounded-full text-muted-foreground hover:text-foreground">
            <Search className="size-[18px]" />
          </button>
          <Link to="/ispace/$section" params={{ section: "profile" }} className="hidden h-9 items-center rounded-full border border-hairline-strong bg-glass px-4 text-sm hover:bg-glass-strong md:inline-flex">iSpace</Link>
          <UserAvatar />
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-5 pb-10">
        <PresenceOrb className="h-[64px] w-[122px] md:h-[118px] md:w-[224px]" transitionName="presence" />
        <h1 className="mt-8 max-w-md text-center font-display text-3xl font-light leading-tight tracking-tight text-balance md:text-[44px]">
          {t("hero.title")}
        </h1>

        <form
          className="relative mt-14 w-full max-w-[620px]"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          {suggestions.length > 0 && (
            <ul className="absolute bottom-full mb-2 w-full rounded-2xl glass-strong p-1.5">
              {suggestions.map(({ e, s }) => (
                <li key={e.title}>
                  <button
                    type="button"
                    onClick={() => setText(text.replace(/!([a-z0-9]*)$/i, `!${s} `))}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm hover:bg-glass-strong"
                  >
                    <EngineIcon engine={e} />
                    <span className="flex-1 truncate">{e.title}</span>
                    <span className="text-xs text-muted-foreground">!{s}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="flex h-14 items-center gap-2 rounded-full glass px-2">
            <button type="button" aria-label={t("composer.attach")} className="grid size-10 place-items-center rounded-full border border-hairline-strong text-muted-foreground hover:text-foreground">
              <Plus className="size-5" />
            </button>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t("composer.placeholder")}
              className="min-w-0 flex-1 bg-transparent px-2 text-[15px] outline-none placeholder:text-muted-foreground"
            />
            <button type="button" aria-label={t("composer.voice")} className="grid size-10 place-items-center rounded-full text-muted-foreground hover:text-foreground">
              <Mic className="size-5" />
            </button>
            <button type="submit" aria-label={t("composer.send")} className="grid size-10 place-items-center rounded-full bg-secondary text-foreground hover:bg-accent">
              <ArrowUp className="size-5" />
            </button>
          </div>
        </form>

        <div className="mt-6 hidden flex-wrap justify-center gap-3 md:flex">
          {PILLS.map((k) => (
            <button key={k} type="button" className="rounded-full glass px-4 py-2 text-xs text-muted-foreground hover:text-foreground">
              {t(k)}
            </button>
          ))}
        </div>
      </main>

      <footer className="hidden items-center justify-between px-6 pb-5 text-xs text-muted-foreground md:flex">
        <span>
          <span className="mr-3 text-foreground">iRiel</span>
          {t("footer.tagline")}
        </span>
        <span>{t("footer.creation")}</span>
      </footer>
    </div>
  );
}
