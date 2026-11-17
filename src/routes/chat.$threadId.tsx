import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";
import { ArrowLeft, ArrowUp, ShieldCheck, Square } from "lucide-react";
import { toast } from "sonner";
import { ExperiencePicker } from "@/components/shell/ExperiencePicker";
import { executionMode } from "@/lib/experiences";
import { LocalRuntimeTransport } from "@/lib/runtime/local";
import {
  getData,
  loadData,
  saveMessages,
  updateThread,
  useData,
} from "@/lib/store/data";
import {
  getSettings,
  markSettingsHydrated,
  useSettings,
  type Settings,
} from "@/lib/store/settings";
import type { Thread } from "@/lib/store/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat/$threadId")({
  component: ChatRoute,
});

function ChatRoute() {
  const { threadId } = Route.useParams();
  const ready = useData((state) => state.ready);
  const thread = useData((state) =>
    state.threads.find((item) => item.id === threadId),
  );

  useEffect(() => {
    markSettingsHydrated();
    void loadData();
  }, []);

  if (!ready) {
    return (
      <div className="grid min-h-dvh place-items-center text-sm text-muted-foreground">
        Loading conversation…
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="grid min-h-dvh place-items-center px-6 text-center">
        <div>
          <p className="text-sm">
            This conversation is not available on this device.
          </p>
          <Link
            to="/"
            className="mt-4 inline-block text-sm underline"
          >
            Start a new chat
          </Link>
        </div>
      </div>
    );
  }

  return <ChatSession key={thread.id} thread={thread} />;
}

function ChatSession({ thread }: { thread: Thread }) {
  const settings = useSettings((state) => state);
  const [draft, setDraft] = useState("");
  const [experience, setExperience] = useState(thread.experience);
  const initialResponseStarted = useRef(false);
  const mode = executionMode(experience, settings.federation);

  const transport = useMemo(() => {
    if (mode === "local") {
      return new LocalRuntimeTransport();
    }

    return new DefaultChatTransport({
      api: "/api/chat",
      body: () => {
        const current: Settings = getSettings();
        const data = getData();
        const language =
          current.profile.language === "pt"
            ? "European Portuguese"
            : current.profile.language === "es"
              ? "Spanish"
              : current.profile.language === "fr"
                ? "French"
                : current.profile.language === "de"
                  ? "German"
                  : current.profile.language === "it"
                    ? "Italian"
                    : current.profile.language === "ja"
                      ? "Japanese"
                      : current.profile.language === "zh"
                        ? "Simplified Chinese"
                        : "English";

        return {
          experience,
          agentId: thread.agentId,
          language,
          profile: {
            name: current.profile.name,
            timezone: current.profile.timezone,
          },
          memories: current.memoryEnabled
            ? data.memories.slice(0, 30).map((memory) => memory.text)
            : [],
          memoryEnabled: current.memoryEnabled,
          responseStyle: current.responseStyle,
          webSearch: experience === "research" && current.webAccess,
          knowledge: [],
        };
      },
    });
  }, [experience, mode, thread.agentId]);

  const {
    messages,
    sendMessage,
    regenerate,
    status,
    stop,
    error,
  } = useChat({
    id: thread.id,
    messages: thread.messages,
    transport,
  });

  useEffect(() => {
    if (
      status === "ready" &&
      messages.length === 1 &&
      messages[0]?.role === "user" &&
      !initialResponseStarted.current
    ) {
      initialResponseStarted.current = true;
      void regenerate();
    }
  }, [messages, regenerate, status]);

  useEffect(() => {
    if (
      messages.length &&
      (status === "ready" || status === "submitted" || status === "error")
    ) {
      void saveMessages(thread.id, messages);
    }
  }, [messages, status, thread.id]);

  useEffect(() => {
    if (thread.experience !== experience) {
      void updateThread(thread.id, { experience });
    }
  }, [experience, thread.experience, thread.id]);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = draft.trim();

    if (!text || status === "submitted" || status === "streaming") {
      return;
    }

    setDraft("");

    try {
      await sendMessage({ text });
    } catch {
      setDraft(text);
      toast.error(
        "The message could not be sent. Your draft has been restored.",
      );
    }
  };

  return (
    <div className="flex min-h-dvh flex-col bg-background stage-bg">
      <header className="flex h-16 items-center gap-3 border-b border-hairline px-4 md:px-6">
        <Link
          to="/"
          aria-label="Back to iRiel"
          className="grid size-9 place-items-center rounded-full text-muted-foreground hover:bg-glass hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">
            {thread.title || "New conversation"}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {mode === "local"
              ? "On-device runtime · No federation"
              : "iRiel ecosystem · Hybrid execution"}
          </p>
        </div>
        <ExperiencePicker
          value={experience}
          onChange={setExperience}
          compact
        />
      </header>

      {experience === "private" && (
        <div className="flex items-center justify-center gap-2 border-b border-private/20 bg-private/5 px-4 py-2 text-xs text-private">
          <ShieldCheck className="size-3.5" />
          Private session · messages stay on this device
        </div>
      )}

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-5 overflow-y-auto px-4 py-8">
        {messages.length === 0 && (
          <div className="my-auto py-16 text-center">
            <p className="text-2xl font-light">
              What would you like to work on?
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {mode === "local"
                ? "This conversation is processed locally on this device."
                : "iRiel will coordinate the capabilities enabled for this experience."}
            </p>
          </div>
        )}

        {messages.map((message) => (
          <article
            key={message.id}
            className={cn(
              "max-w-[92%] rounded-2xl px-4 py-3",
              message.role === "user"
                ? "ml-auto bg-secondary"
                : "mr-auto glass",
            )}
          >
            <p className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
              {message.role === "user" ? "You" : "iRiel"}
            </p>
            <div className="whitespace-pre-wrap break-words text-sm leading-7">
              {message.parts.map((part, index) =>
                part.type === "text" ? <span key={index}>{part.text}</span> : null,
              )}
            </div>
          </article>
        ))}

        {status === "submitted" && (
          <p className="text-xs text-muted-foreground">
            iRiel is preparing a response…
          </p>
        )}

        {error && (
          <p
            role="alert"
            className="rounded-xl border border-destructive/30 p-3 text-sm text-destructive"
          >
            The response failed. Check your connection or retry your message.
          </p>
          <button
            type="button"
            onClick={() => void regenerate()}
            className="mt-2 text-xs underline"
          >
            Retry response
          </button>
        )}
      </main>

      <div className="sticky bottom-0 border-t border-hairline bg-background/90 px-4 py-4 backdrop-blur-xl">
        <form
          onSubmit={submit}
          className="mx-auto flex w-full max-w-3xl items-end gap-2 rounded-2xl glass p-2"
        >
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey &&
                !event.nativeEvent.isComposing
              ) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
            rows={1}
            placeholder="Message iRiel…"
            aria-label="Message iRiel"
            className="max-h-40 min-h-11 flex-1 resize-y bg-transparent px-3 py-3 text-sm outline-none placeholder:text-muted-foreground"
          />

          {status === "submitted" || status === "streaming" ? (
            <button
              type="button"
              onClick={stop}
              aria-label="Stop response"
              className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary"
            >
              <Square className="size-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!draft.trim()}
              aria-label="Send message"
              className="grid size-10 shrink-0 place-items-center rounded-full bg-foreground text-background disabled:opacity-40"
            >
              <ArrowUp className="size-4" />
            </button>
          )}
        </form>

        <p className="mx-auto mt-2 max-w-3xl text-center text-[10px] text-muted-foreground">
          {mode === "local"
            ? "Local execution selected. No chat request is sent to the server."
            : "Hybrid execution may send conversation content to the configured AI gateway."}
        </p>
      </div>
    </div>
  );
}
