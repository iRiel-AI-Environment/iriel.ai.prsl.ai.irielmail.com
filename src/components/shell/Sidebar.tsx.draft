import { Link, useNavigate, useParams, useRouterState } from "@tanstack/react-router";
import {
  Bot,
  FileText,
  Folder,
  FolderInput,
  Lock,
  MoreHorizontal,
  Pencil,
  Search,
  Settings,
  SquarePen,
  Smartphone,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";
import { deleteThread, updateThread, useData } from "@/lib/store/data";
import type { Thread } from "@/lib/store/types";
import { cn } from "@/lib/utils";
import { TrafficLights } from "./TrafficLights";
import { useShell } from "./shell-context";

const itemCls =
  "flex h-8 w-full items-center gap-2.5 rounded-lg px-2.5 text-[13px] text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:opacity-80";
const activeCls = "bg-sidebar-accent text-sidebar-accent-foreground";

export function SidebarNav({ showLights, onNavigate }: { showLights?: boolean; onNavigate?: () => void }) {
  const t = useT();
  const { setSidebarOpen, openSearch, newChat } = useShell();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const threads = useData((s) => s.threads);
  const params = useParams({ strict: false }) as { threadId?: string };
  const isActive = (p: string) => pathname === p || pathname.startsWith(`${p}/`);

  return (
    <div className="flex h-full flex-col">
      {showLights && (
        <div className="flex h-14 shrink-0 items-center px-4">
          <TrafficLights muted onMinimize={() => setSidebarOpen(false)} />
        </div>
      )}
      <nav className="flex flex-col gap-0.5 px-2.5 pt-1">
        <button
          type="button"
          className={cn(itemCls, (pathname === "/" || pathname.startsWith("/chat")) && activeCls)}
          onClick={() => {
            onNavigate?.();
            void newChat();
          }}
        >
          <SquarePen /> {t("nav.newChat")}
        </button>
        <button
          type="button"
          className={itemCls}
          onClick={() => {
            onNavigate?.();
            openSearch();
          }}
        >
          <Search /> {t("nav.search")}
        </button>
        <Link to="/files" onClick={onNavigate} className={cn(itemCls, isActive("/files") && activeCls)}>
          <FileText /> {t("nav.files")}
        </Link>
        <Link to="/projects" onClick={onNavigate} className={cn(itemCls, isActive("/projects") && activeCls)}>
          <Folder /> {t("nav.projects")}
        </Link>
        <Link to="/agents" onClick={onNavigate} className={cn(itemCls, isActive("/agents") && activeCls)}>
          <Bot /> {t("nav.agents")}
        </Link>
        <Link to="/devices" onClick={onNavigate} className={cn(itemCls, isActive("/devices") && activeCls)}>
          <Smartphone /> {t("nav.devices")}
        </Link>
        <Link
          to="/ispace/$section"
          params={{ section: "profile" }}
          onClick={onNavigate}
          className={cn(itemCls, isActive("/ispace") && activeCls)}
        >
          <Settings /> {t("nav.settings")}
        </Link>
      </nav>

      <div className="mt-5 min-h-0 flex-1 overflow-y-auto px-2.5 pb-4 scrollbar-none">
        <div className="px-2.5 pb-1.5 text-[11px] font-medium uppercase tracking-wider text-faint">{t("nav.recent")}</div>
        {threads.length === 0 ? (
          <p className="px-2.5 text-xs leading-relaxed text-faint">{t("nav.noChats")}</p>
        ) : (
          <ul className="flex flex-col gap-0.5">
            {threads.slice(0, 40).map((th) => (
              <ThreadRow key={th.id} thread={th} active={params.threadId === th.id} onNavigate={onNavigate} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function ThreadRow({ thread, active, onNavigate }: { thread: Thread; active: boolean; onNavigate?: () => void }) {
  const t = useT();
  const navigate = useNavigate();
  const projects = useData((s) => s.projects);
  const [renaming, setRenaming] = useState(false);
  const [name, setName] = useState(thread.title);
  return (
    <li className={cn("group/row relative flex items-center rounded-lg", active && activeCls, "hover:bg-sidebar-accent")}>
      <Link
        to="/chat/$threadId"
        params={{ threadId: thread.id }}
        onClick={onNavigate}
        className="flex h-8 min-w-0 flex-1 items-center gap-2 px-2.5 text-[13px] text-sidebar-foreground/75 hover:text-sidebar-accent-foreground"
      >
        {thread.experience === "private" && <Lock className="size-3 shrink-0 text-private" />}
        <span className="truncate">{thread.title || t("thread.untitled")}</span>
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={thread.title}
          className="mr-1 grid size-6 shrink-0 place-items-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-glass-strong focus-visible:opacity-100 group-hover/row:opacity-100 data-[state=open]:opacity-100"
        >
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 border-hairline-strong bg-popover/95 backdrop-blur-xl">
          <DropdownMenuItem onSelect={() => setRenaming(true)}>
            <Pencil /> {t("thread.rename")}
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <FolderInput className="mr-2 size-4" /> {t("thread.moveToProject")}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="border-hairline-strong bg-popover/95 backdrop-blur-xl">
              <DropdownMenuItem onSelect={() => updateThread(thread.id, { projectId: undefined })}>
                {t("thread.noProject")}
              </DropdownMenuItem>
              {projects.map((p) => (
                <DropdownMenuItem key={p.id} onSelect={() => updateThread(thread.id, { projectId: p.id })}>
                  {p.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator className="bg-hairline" />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onSelect={async () => {
              await deleteThread(thread.id);
              toast(t("thread.deleted"));
              if (active) navigate({ to: "/" });
            }}
          >
            <Trash2 /> {t("thread.delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={renaming} onOpenChange={setRenaming}>
        <DialogContent className="max-w-sm border-hairline-strong bg-popover">
          <DialogHeader>
            <DialogTitle className="font-normal">{t("thread.rename")}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (name.trim()) void updateThread(thread.id, { title: name.trim() });
              setRenaming(false);
            }}
          >
            <Input autoFocus value={name} onChange={(e) => setName(e.target.value)} className="border-hairline-strong bg-glass" />
            <DialogFooter className="mt-4">
              <Button type="button" variant="ghost" onClick={() => setRenaming(false)}>
                {t("common.cancel")}
              </Button>
              <Button type="submit">{t("profile.save")}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </li>
  );
}
