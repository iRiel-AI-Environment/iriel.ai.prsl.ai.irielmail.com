import { useCallback, useEffect, useRef, useState } from "react";

type Recognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: { resultIndex: number; results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
};

const LOCALES: Record<string, string> = {
  en: "en-US",
  pt: "pt-PT",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  it: "it-IT",
  ja: "ja-JP",
  zh: "zh-CN",
};

export type VoiceError = "unsupported" | "denied" | "no-speech";

export function useVoice(opts: {
  language: string;
  onText: (text: string) => void;
  /** Called when the person stops talking (not when they press stop). */
  onDone: (text: string) => void;
  onError: (e: VoiceError) => void;
}) {
  const [listening, setListening] = useState(false);
  const [level, setLevel] = useState(0);
  const recRef = useRef<Recognition | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef(0);
  const textRef = useRef("");
  const manualStop = useRef(false);
  const optsRef = useRef(opts);
  optsRef.current = opts;

  const cleanupAudio = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    void ctxRef.current?.close().catch(() => {});
    ctxRef.current = null;
    setLevel(0);
  }, []);

  const start = useCallback(async () => {
    const Ctor =
      (window as unknown as { SpeechRecognition?: new () => Recognition }).SpeechRecognition ??
      (window as unknown as { webkitSpeechRecognition?: new () => Recognition }).webkitSpeechRecognition;
    if (!Ctor) {
      optsRef.current.onError("unsupported");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = new AudioContext();
      ctxRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      ctx.createMediaStreamSource(stream).connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (const v of data) sum += ((v - 128) / 128) ** 2;
        const rms = Math.sqrt(sum / data.length);
        setLevel((prev) => prev * 0.6 + Math.min(1, rms * 6) * 0.4);
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch {
      optsRef.current.onError("denied");
      cleanupAudio();
      return;
    }

    const rec = new Ctor();
    rec.lang = LOCALES[optsRef.current.language] ?? "en-US";
    rec.interimResults = true;
    rec.continuous = false;
    textRef.current = "";
    manualStop.current = false;
    rec.onresult = (e) => {
      let text = "";
      for (let i = 0; i < e.results.length; i++) text += e.results[i]?.[0]?.transcript ?? "";
      textRef.current = text;
      optsRef.current.onText(text);
    };
    rec.onerror = (e) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") optsRef.current.onError("denied");
      else if (e.error === "no-speech") optsRef.current.onError("no-speech");
    };
    rec.onend = () => {
      setListening(false);
      cleanupAudio();
      recRef.current = null;
      if (!manualStop.current && textRef.current.trim()) optsRef.current.onDone(textRef.current.trim());
    };
    recRef.current = rec;
    setListening(true);
    rec.start();
  }, [cleanupAudio]);

  const stop = useCallback(() => {
    manualStop.current = true;
    recRef.current?.stop();
    setListening(false);
    cleanupAudio();
  }, [cleanupAudio]);

  useEffect(() => () => {
    recRef.current?.abort();
    cleanupAudio();
  }, [cleanupAudio]);

  return { listening, level, start, stop };
}
