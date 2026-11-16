import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowLeft, Brain, ChevronRight, Cpu, Info, Library, Link2, Lock, Monitor, Search, Smartphone, Sparkles, SlidersHorizontal, Tablet, Trash2, User,
} from "lucide-react";
import { toast } from "sonner";
import { PresenceOrb } from "@/components/presence/PresenceOrb";
import { UserAvatar } from "@/components/shell/UserAvatar";
import { EngineIcon } from "@/components/shell/EngineIcon";
import { LANGUAGES, languageLabel, useT, type MessageKey } from "@/lib/i18n";
import { markSettingsHydrated, updateSettings, useSettings } from "@/lib/store/settings";
import { addMemory, clearMemories, deleteMemory, loadData, useData } from "@/lib/store/data";
import { AGENTS, EXPERIENCES } from "@/lib/experiences";
import { COLLECTIONS, KNOWLEDGE_SOURCES } from "@/lib/knowledge/sources";
import { searchEngines } from "@/lib/engines";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "profile", key: "ispace.profile", icon: User },
  { id: "memory", key: "ispace.memory", icon: Brain },
  { id: "connections", key: "ispace.connections", icon: Link2 },
  { id: "devices", key: "ispace.devices", icon: Smartphone },
  { id: "agents", key: "ispace.agents", icon: Sparkles },
  { id: "customization", key: "ispace.customization", icon: SlidersHorizontal },
  { id: "search", key: "ispace.search", icon: Search },
  { id: "knowledge", key: "ispace.knowledge", icon: Library },
  { id: "privacy", key: "ispace.privacy", icon: Lock },
  { id: "about", key: "ispace.about", icon: Info },
] as const satisfies readonly { id: string; key: MessageKey; icon: unknown }[];
type SectionId = (typeof SECTIONS)[number]["id"];

export const Route = createFileRoute("/ispace/$section")({
  head: () => ({
    meta: [
      { title: "iSpace — iRiel" },
      { name: "description", content: "Your personal intelligence environment: profile, memory, connections, devices and privacy." },
      { property: "og:title", content: "iSpace — iRiel" },
      { property: "og:description", content: "Your personal intelligence environment." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ISpace,
});

const TIMEZONES = ["Europe/Lisbon", "Europe/London", "Europe/Madrid", "Europe/Paris", "Europe/Berlin", "America/Sao_Paulo", "America/New_York", "America/Los_Angeles", "Asia/Tokyo", "Asia/Shanghai"];
function tzLabel(tz: string) {
  if (tz === "Europe/Lisbon") return "Lisbon (WET)";
  return tz.split("/").pop()!.replace(/_/g, " ");
}

function ISpace() {
  const t = useT();
  const { section } = Route.useParams();
  const active = (SECTIONS.find((s) => s.id === section)?.id ?? "profile") as SectionId;
  useEffect(() => {
    markSettingsHydrated();
    void loadData();
  }, []);

  return (
    <div className="flex min-h-dvh flex-col bg-background stage-bg">
      <header className="flex h-16 items-center gap-3 px-4 md:px-6">
        <Link to="/" aria-label={t("ispace.back")} className="grid size-9 place-items-center rounded-full text-muted-foreground hover:bg-glass hover:text-foreground">
          <ArrowLeft className="size-[18px]" />
        </Link>
        <div className="min-w-0 flex-1 md:hidden">
          <p className="text-lg font-medium">{t("ispace.title")}</p>
        </div>
        <div className="flex-1 max-md:hidden" />
        <UserAvatar asLink={false} />
      </header>

      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 pb-10 md:flex-row md:px-6">
        <nav aria-label={t("ispace.title")} className="md:w-52 md:shrink-0">
          <ul className="flex gap-1 overflow-x-auto scrollbar-none md:flex-col">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <Link
                  to="/ispace/$section"
                  params={{ section: s.id }}
                  className={cn(
                    "flex items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground",
                    active === s.id && "bg-glass-strong text-foreground",
                  )}
                >
                  <s.icon className="size-4" />
                  {t(s.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <main className="min-w-0 flex-1 md:border-l md:border-hairline md:pl-8">
          <div className="max-md:hidden">
            <h1 className="text-2xl font-light tracking-tight">{t("ispace.title")}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{t("ispace.subtitle")}</p>
          </div>
          <div className="mt-6 space-y-4 animate-fade-up" key={active}>
            {active === "profile" && <Profile />}
            {active === "memory" && <MemorySection />}
            {active === "connections" && <Connections />}
            {active === "devices" && <Devices />}
            {active === "agents" && <Agents />}
            {active === "customization" && <Customization />}
            {active === "search" && <Engines />}
            {active === "knowledge" && <Knowledge />}
            {active === "privacy" && <Privacy />}
            {active === "about" && <About />}
          </div>
        </main>
      </div>
    </div>
  );
}

function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn("rounded-2xl glass", className)}>{children}</section>;
}
function Row({ label, value, onClick }: { label: string; value: ReactNode; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center gap-4 border-b border-hairline px-4 py-3.5 text-left text-sm last:border-0 hover:bg-glass">
      <span className="w-28 shrink-0 text-muted-foreground">{label}</span>
      <span className="min-w-0 flex-1 truncate">{value}</span>
      <ChevronRight className="size-4 text-muted-foreground" />
    </button>
  );
}
function Toggle({ label, desc, checked, onChange }: { label: string; desc?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-4 border-b border-hairline px-4 py-3.5 last:border-0">
      <span className="flex-1">
        <span className="block text-sm">{label}</span>
        {desc && <span className="mt-0.5 block text-xs text-muted-foreground">{desc}</span>}
      </span>
      <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span aria-hidden className="relative h-6 w-10 rounded-full bg-surface transition-colors peer-checked:bg-success after:absolute after:left-0.5 after:top-0.5 after:size-5 after:rounded-full after:bg-foreground after:transition-transform peer-checked:after:translate-x-4" />
    </label>
  );
}
function Segmented<T extends string>({ value, options, onChange }: { value: T; options: { v: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="inline-flex rounded-full border border-hairline p-0.5">
      {options.map((o) => (
        <button key={o.v} type="button" onClick={() => onChange(o.v)} className={cn("rounded-full px-3 py-1 text-xs", value === o.v ? "bg-glass-strong text-foreground" : "text-muted-foreground")}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

function PresenceBadge() {
  return (
    <Card className="flex items-center justify-center gap-5 px-6 py-6">
      <PresenceOrb className="h-[34px] w-[64px]" />
      <div>
        <p className="text-base">iRiel</p>
        <p className="text-xs text-muted-foreground">Always with you.</p>
      </div>
    </Card>
  );
}

function Profile() {
  const t = useT();
  const profile = useSettings((s) => s.profile);
  const [editing, setEditing] = useState<null | "name" | "email" | "timezone" | "language">(null);
  const [draft, setDraft] = useState("");
  const open = (f: NonNullable<typeof editing>) => {
    setDraft(String(profile[f]));
    setEditing(f);
  };
  const save = () => {
    if (editing === "name" && !draft.trim()) return toast.error(t("profile.nameRequired"));
    if (editing === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.trim())) return toast.error(t("profile.invalidEmail"));
    updateSettings((s) => ({ profile: { ...s.profile, [editing!]: draft.trim() } }));
    setEditing(null);
    toast(t("profile.saved"));
    return undefined;
  };

  return (
    <>
      <PresenceBadge />
      <Card>
        <Row label={t("profile.name")} value={profile.name} onClick={() => open("name")} />
        <Row label={t("profile.email")} value={profile.email} onClick={() => open("email")} />
        <Row label={t("profile.timezone")} value={tzLabel(profile.timezone)} onClick={() => open("timezone")} />
        <Row label={t("profile.language")} value={languageLabel(profile.language)} onClick={() => open("language")} />
      </Card>
      {editing && (
        <Card className="space-y-3 p-4">
          <p className="text-sm text-muted-foreground">{t(`profile.${editing}` as MessageKey)}</p>
          {editing === "timezone" || editing === "language" ? (
            <select value={draft} onChange={(e) => setDraft(e.target.value)} className="w-full rounded-xl border border-hairline bg-surface px-3 py-2 text-sm">
              {editing === "timezone"
                ? TIMEZONES.map((z) => <option key={z} value={z}>{tzLabel(z)}</option>)
                : LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
          ) : (
            <input autoFocus value={draft} type={editing === "email" ? "email" : "text"} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && save()} className="w-full rounded-xl border border-hairline bg-surface px-3 py-2 text-sm outline-none focus:border-hairline-strong" />
          )}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setEditing(null)} className="rounded-full px-4 py-1.5 text-sm text-muted-foreground">{t("profile.cancel")}</button>
            <button type="button" onClick={save} className="rounded-full bg-foreground px-4 py-1.5 text-sm text-background">{t("profile.save")}</button>
          </div>
        </Card>
      )}
    </>
  );
}

function MemorySection() {
  const t = useT();
  const enabled = useSettings((s) => s.memoryEnabled);
  const memories = useData((s) => s.memories);
  const [text, setText] = useState("");
  return (
    <>
      <Card><Toggle label={t("memory.use")} desc={t("memory.useDesc")} checked={enabled} onChange={(v) => updateSettings({ memoryEnabled: v })} /></Card>
      <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (text.trim()) { void addMemory(text.trim()); setText(""); } }}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder={t("memory.addPlaceholder")} className="flex-1 rounded-full border border-hairline bg-glass px-4 py-2 text-sm outline-none" />
        <button className="rounded-full bg-foreground px-4 text-sm text-background">{t("memory.add")}</button>
      </form>
      <Card>
        {memories.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">{t("memory.empty")}</p>
        ) : (
          memories.map((m) => (
            <div key={m.id} className="flex items-start gap-3 border-b border-hairline px-4 py-3 last:border-0">
              <div className="flex-1">
                <p className="text-sm">{m.text}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{t(m.source === "chat" ? "memory.fromChat" : "memory.manual")}</p>
              </div>
              <button type="button" aria-label={t("memory.delete")} onClick={() => { void deleteMemory(m.id); toast(t("memory.forgotten")); }} className="text-muted-foreground hover:text-foreground"><Trash2 className="size-4" /></button>
            </div>
          ))
        )}
      </Card>
    </>
  );
}

function Connections() {
  const t = useT();
  const s = useSettings((x) => x);
  return (
    <Card>
      <Toggle label={t("conn.federation")} desc={t("conn.federationDesc")} checked={s.federation} onChange={(v) => updateSettings({ federation: v })} />
      <Toggle label={t("conn.web")} desc={t("conn.webDesc")} checked={s.webAccess} onChange={(v) => updateSettings({ webAccess: v })} />
      <div className="px-4 py-3.5">
        <p className="text-sm">{t("conn.mode")}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{t(s.federation ? "conn.hybridDesc" : "conn.localDesc")}</p>
        <p className="mt-2 text-xs">{t(s.federation ? "conn.hybrid" : "conn.local")}</p>
      </div>
    </Card>
  );
}

function Devices() {
  const t = useT();
  const [info, setInfo] = useState({ browser: "", os: "", screen: "" });
  useEffect(() => {
    const ua = navigator.userAgent;
    const browser = /Edg\//.test(ua) ? "Edge" : /Chrome\//.test(ua) ? "Chrome" : /Safari\//.test(ua) ? "Safari" : /Firefox\//.test(ua) ? "Firefox" : "Browser";
    const os = /iPhone|iPad/.test(ua) ? "iOS" : /Android/.test(ua) ? "Android" : /Mac/.test(ua) ? "macOS" : /Win/.test(ua) ? "Windows" : "Linux";
    setInfo({ browser, os, screen: `${window.screen.width}×${window.screen.height}` });
  }, []);
  return (
    <>
      <Card className="flex items-center justify-center gap-6 py-5 text-muted-foreground">
        <Smartphone className="size-6" /><Monitor className="size-7" /><Tablet className="size-6" />
      </Card>
      <Card>
        <div className="flex items-center justify-between border-b border-hairline px-4 py-3.5 text-sm"><span>{t("devices.this")}</span><span className="text-xs text-success">{t("devices.active")}</span></div>
        <div className="flex border-b border-hairline px-4 py-3 text-sm"><span className="w-28 text-muted-foreground">{t("devices.browser")}</span>{info.browser}</div>
        <div className="flex border-b border-hairline px-4 py-3 text-sm"><span className="w-28 text-muted-foreground">{t("devices.os")}</span>{info.os}</div>
        <div className="flex px-4 py-3 text-sm"><span className="w-28 text-muted-foreground">{t("devices.screen")}</span>{info.screen}</div>
      </Card>
      <p className="text-xs text-muted-foreground">{t("devices.note")}</p>
    </>
  );
}

function Agents() {
  const t = useT();
  const disabled = useSettings((s) => s.disabledAgents);
  return (
    <Card>
      {AGENTS.map((a) => (
        <Toggle key={a.id} label={t(a.name as MessageKey)} desc={t(a.desc as MessageKey)} checked={!disabled.includes(a.id)}
          onChange={(on) => updateSettings((s) => ({ disabledAgents: on ? s.disabledAgents.filter((x) => x !== a.id) : [...s.disabledAgents, a.id] }))} />
      ))}
    </Card>
  );
}

function Customization() {
  const t = useT();
  const s = useSettings((x) => x);
  return (
    <>
      <Card className="flex justify-center py-8"><PresenceOrb className="h-[70px] w-[132px]" /></Card>
      <Card>
        <div className="flex items-center justify-between gap-4 border-b border-hairline px-4 py-3.5">
          <span><span className="block text-sm">{t("custom.motion")}</span><span className="text-xs text-muted-foreground">{t("custom.motionDesc")}</span></span>
          <Segmented value={s.motion} onChange={(v) => updateSettings({ motion: v })} options={[{ v: "full", label: t("custom.full") }, { v: "reduced", label: t("custom.reduced") }]} />
        </div>
        <label className="flex items-center gap-4 border-b border-hairline px-4 py-3.5 text-sm">
          <span className="flex-1">{t("custom.glow")}</span>
          <input type="range" min={0} max={100} value={s.glow} onChange={(e) => updateSettings({ glow: Number(e.target.value) })} className="w-40 accent-foreground" />
        </label>
        <div className="flex items-center justify-between gap-4 border-b border-hairline px-4 py-3.5 text-sm">
          <span>{t("custom.defaultExp")}</span>
          <select value={s.experience} onChange={(e) => updateSettings({ experience: e.target.value as typeof s.experience })} className="rounded-full border border-hairline bg-surface px-3 py-1 text-xs">
            {EXPERIENCES.map((x) => <option key={x.id} value={x.id}>{t(x.label as MessageKey)}</option>)}
          </select>
        </div>
        <div className="flex items-center justify-between gap-4 px-4 py-3.5 text-sm">
          <span>{t("custom.style")}</span>
          <Segmented value={s.responseStyle} onChange={(v) => updateSettings({ responseStyle: v })} options={[{ v: "concise", label: t("custom.concise") }, { v: "balanced", label: t("custom.balanced") }, { v: "detailed", label: t("custom.detailed") }]} />
        </div>
      </Card>
    </>
  );
}

function Engines() {
  const t = useT();
  const def = useSettings((s) => s.defaultEngine);
  const fed = useSettings((s) => s.federatedEngines);
  const [q, setQ] = useState("");
  const list = searchEngines.filter((e) => !q || e.title.toLowerCase().includes(q.toLowerCase()) || e.shortcuts.some((s) => s.includes(q.toLowerCase().replace(/^!/, ""))));
  return (
    <>
      <p className="text-sm text-muted-foreground">{t("engines.subtitle")}</p>
      <Card className="flex items-center justify-between gap-4 px-4 py-3.5 text-sm">
        <span>{t("engines.default")}</span>
        <select value={def} onChange={(e) => updateSettings({ defaultEngine: e.target.value })} className="max-w-48 rounded-full border border-hairline bg-surface px-3 py-1 text-xs">
          <option value="iriel">{t("engines.irielWeb")}</option>
          {searchEngines.map((e) => <option key={e.title} value={e.title}>{e.title}</option>)}
        </select>
      </Card>
      <div>
        <p className="text-sm">{t("engines.federated")}</p>
        <p className="text-xs text-muted-foreground">{t("engines.federatedDesc")}</p>
      </div>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("engines.filter")} className="w-full rounded-full border border-hairline bg-glass px-4 py-2 text-sm outline-none" />
      <Card className="max-h-[420px] overflow-y-auto">
        {list.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">{t("engines.none")}</p>}
        {list.map((e) => {
          const on = fed.includes(e.title);
          return (
            <label key={e.title} className="flex cursor-pointer items-center gap-3 border-b border-hairline px-4 py-2.5 last:border-0">
              <EngineIcon engine={e} className="size-5" />
              <span className="flex-1 text-sm">{e.title}</span>
              <span className="font-mono text-xs text-muted-foreground">{e.shortcuts.map((s) => `!${s}`).join(" ")}</span>
              <input type="checkbox" checked={on} onChange={() => updateSettings((s) => ({ federatedEngines: on ? s.federatedEngines.filter((x) => x !== e.title) : [...s.federatedEngines, e.title] }))} className="accent-foreground" />
            </label>
          );
        })}
      </Card>
    </>
  );
}

function Knowledge() {
  const t = useT();
  const off = useSettings((s) => s.disabledCollections);
  return (
    <>
      <p className="text-sm text-muted-foreground">{t("knowledge.subtitle")}</p>
      <p className="text-xs text-muted-foreground">{t("knowledge.priorityDesc")}</p>
      {COLLECTIONS.map((c) => {
        const items = KNOWLEDGE_SOURCES.filter((s) => s.collection === c);
        const on = !off.includes(c);
        return (
          <Card key={c}>
            <Toggle label={`${t(`knowledge.col.${c}` as MessageKey)} · ${items.length} ${t("knowledge.sources")}`} checked={on}
              onChange={(v) => updateSettings((s) => ({ disabledCollections: v ? s.disabledCollections.filter((x) => x !== c) : [...s.disabledCollections, c] }))} />
            <div className={cn("flex flex-wrap gap-2 px-4 pb-4", !on && "opacity-40")}>
              {items.map((s) => (
                <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="rounded-full border border-hairline px-3 py-1 text-xs hover:bg-glass">{s.topic}</a>
              ))}
            </div>
          </Card>
        );
      })}
    </>
  );
}

function Privacy() {
  const t = useT();
  const defPrivate = useSettings((s) => s.defaultPrivate);
  const settings = useSettings((s) => s);
  const data = useData((s) => s);
  const exportData = () => {
    const blob = new Blob([JSON.stringify({ settings, threads: data.threads, memories: data.memories, projects: data.projects }, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "iriel-export.json";
    a.click();
  };
  return (
    <>
      <Card>
        <Toggle label={t("privacy.defaultPrivate")} desc={t("privacy.defaultPrivateDesc")} checked={defPrivate} onChange={(v) => updateSettings({ defaultPrivate: v })} />
        <div className="flex items-center justify-between px-4 py-3.5">
          <span><span className="block text-sm">{t("privacy.telemetry")}</span><span className="text-xs text-muted-foreground">{t("privacy.telemetryDesc")}</span></span>
          <span className="text-xs text-muted-foreground">{t("privacy.off")}</span>
        </div>
      </Card>
      <Card>
        <Row label={t("privacy.export")} value={<span className="text-xs text-muted-foreground">{t("privacy.exportDesc")}</span>} onClick={exportData} />
        <Row label={t("privacy.clearMemory")} value="" onClick={() => { if (confirm(t("privacy.confirm"))) { void clearMemories(); toast(t("privacy.done")); } }} />
      </Card>
    </>
  );
}

function About() {
  const t = useT();
  return (
    <>
      <PresenceBadge />
      <Card>
        <div className="flex border-b border-hairline px-4 py-3 text-sm"><span className="w-36 text-muted-foreground">{t("about.version")}</span>vNext</div>
        <div className="flex border-b border-hairline px-4 py-3 text-sm"><span className="w-36 text-muted-foreground">{t("about.contract")}</span>IRC-001</div>
        <div className="flex px-4 py-3 text-sm"><span className="w-36 text-muted-foreground">{t("about.maker")}</span>Robert Software Labs</div>
      </Card>
      <p className="flex items-center gap-2 text-xs text-muted-foreground"><Cpu className="size-3.5" />{t("about.principles")}</p>
    </>
  );
}

