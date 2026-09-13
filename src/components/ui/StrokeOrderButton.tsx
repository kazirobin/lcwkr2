"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Loader2,
  Pause,
  PenLine,
  Play,
  Repeat,
  Video,
  X,
} from "lucide-react";

import { useLanguage } from "@/i18n";

type QuizCallbacks = {
  onCorrectStroke?: (e: { strokeNum: number }) => void;
  onMistake?: (e: { mistakesOnStroke: number }) => void;
  onComplete?: () => void;
};

type Writer = {
  animateCharacter: (opts?: { onComplete?: () => void }) => void;
  animateStroke: (strokeNum: number, opts?: { onComplete?: () => void }) => void;
  loopCharacterAnimation: () => void;
  pauseAnimation: () => void;
  resumeAnimation: () => void;
  showCharacter: () => void;
  hideCharacter: () => void;
  showStroke: (strokeNum: number) => void;
  quiz: (opts?: QuizCallbacks) => void;
  setCharacter: (char: string, onComplete?: () => void) => void;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function StrokeOrderButton({
  hanzi,
  className = "size-7",
}: {
  hanzi: string;
  className?: string;
}) {
  const { language } = useLanguage();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );

  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<Writer | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [paused, setPaused] = useState(false);
  const [looping, setLooping] = useState(false);
  const [mode, setMode] = useState<"animate" | "quiz">("animate");
  const [charIdx, setCharIdx] = useState(0);
  const [animStroke, setAnimStroke] = useState(0);
  const [totalStrokes, setTotalStrokes] = useState<number | null>(null);
  const [strokeTypes, setStrokeTypes] = useState<string[]>([]);
  const [quizCorrect, setQuizCorrect] = useState(0);
  const [quizMistakes, setQuizMistakes] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  const chars = useMemo(() => {
    const list = Array.from(hanzi).filter((c) =>
      /[\u3400-\u9fff\uf900-\ufaff]/.test(c),
    );
    return list.length > 0 ? list : [hanzi];
  }, [hanzi]);
  const safeIdx = Math.min(charIdx, chars.length - 1);
  const currentChar = chars[safeIdx] ?? hanzi;
  const isMulti = chars.length > 1;

  const pausedRef = useRef(false);
  const seqToken = useRef<{ cancelled: boolean } | null>(null);

  const cancelSequence = () => {
    if (seqToken.current) seqToken.current.cancelled = true;
    seqToken.current = null;
  };

  const loadWriter = useCallback(
    async (char: string) => {
      cancelSequence();
      setStatus("loading");
      setPaused(false);
      pausedRef.current = false;
      setLooping(false);
      setMode("animate");
      setAnimStroke(0);
      setTotalStrokes(null);
      setStrokeTypes([]);
      setQuizCorrect(0);
      setQuizMistakes(0);
      setQuizDone(false);
      try {
        const HW = (await import("hanzi-writer")).default;
        
        // hanzi-writer-data থেকে ক্যারেক্টার ডেটা ফেচ করা
        const data = (await HW.loadCharacterData(char)) as {
          strokes: unknown[];
          strokeTypes?: string[];
        };
        if (!boxRef.current) return;
        
        const strokesArr = Array.isArray(data.strokes) ? data.strokes : [];
        setTotalStrokes(strokesArr.length);
        
        // সিডিএন থেকে আসা আসল স্ট্রোক টাইপ বা নামগুলো নেওয়া (না থাকলে ফাঁকা রাখা)
        const apiTypes = Array.isArray(data.strokeTypes) ? data.strokeTypes : [];
        setStrokeTypes(apiTypes);
        
        boxRef.current.innerHTML = "";
        const writer = HW.create(boxRef.current, char, {
          width: 280,
          height: 280,
          padding: 12,
          strokeAnimationSpeed: 0.5,
          delayBetweenStrokes: 700,
          highlightColor: "#f97316",
          strokeColor: "#1f2937",
        }) as unknown as Writer;
        writerRef.current = writer;
        setStatus("ready");
      } catch {
        setStatus("error");
      }
    },
    [],
  );

  useEffect(() => {
    if (open && currentChar) {
      queueMicrotask(() => loadWriter(currentChar));
    }
    const box = boxRef.current;
    return () => {
      writerRef.current = null;
      if (box) box.innerHTML = "";
    };
  }, [open, currentChar, loadWriter]);

  const runSequence = useCallback(
    async (from: number, parent?: { cancelled: boolean }): Promise<boolean> => {
      const token = { cancelled: false };
      seqToken.current = token;
      const total = totalStrokes ?? 0;

      if (from === 0) writerRef.current?.hideCharacter();

      for (let i = from; i < total; i++) {
        if (token.cancelled || parent?.cancelled) return false;
        while (pausedRef.current && !token.cancelled && !parent?.cancelled) {
          await sleep(120);
        }
        if (token.cancelled || parent?.cancelled || !writerRef.current) return false;

        await new Promise<void>((resolve) => {
          let done = false;
          const finish = () => {
            if (!done) {
              done = true;
              resolve();
            }
          };
          try {
            writerRef.current?.animateStroke(i, { onComplete: finish });
            setTimeout(finish, 4000);
          } catch {
            finish();
          }
        });

        if (token.cancelled || parent?.cancelled) return false;
        setAnimStroke(i + 1);
      }
      return !token.cancelled && !parent?.cancelled;
    },
    [totalStrokes],
  );

  const play = useCallback(() => {
    if (!writerRef.current) return;
    cancelSequence();
    setLooping(false);
    setPaused(false);
    pausedRef.current = false;
    setMode("animate");
    setAnimStroke(0);
    void runSequence(0);
  }, [runSequence]);

  const loop = useCallback(() => {
    if (!writerRef.current) return;
    cancelSequence();
    setLooping(true);
    setPaused(false);
    pausedRef.current = false;
    setMode("animate");
    const parent = { cancelled: false };
    seqToken.current = parent;
    void (async () => {
      setAnimStroke(0);
      while (!parent.cancelled) {
        const completed = await runSequence(0, parent);
        if (!completed || parent.cancelled) break;
        await sleep(500);
        if (parent.cancelled) break;
        setAnimStroke(0);
      }
    })();
  }, [runSequence]);

  const togglePause = useCallback(() => {
    const w = writerRef.current;
    if (!w) return;
    if (paused) {
      w.resumeAnimation();
      pausedRef.current = false;
      setPaused(false);
    } else {
      w.pauseAnimation();
      pausedRef.current = true;
      setPaused(true);
    }
  }, [paused]);

  const practice = useCallback(() => {
    const w = writerRef.current;
    if (!w) return;
    cancelSequence();
    setLooping(false);
    setPaused(false);
    pausedRef.current = false;
    setMode("quiz");
    setQuizCorrect(0);
    setQuizMistakes(0);
    setQuizDone(false);
    w.showCharacter();
    w.quiz({
      onCorrectStroke: (e) => setQuizCorrect(e.strokeNum + 1),
      onMistake: () => setQuizMistakes((m) => m + 1),
      onComplete: () => setQuizDone(true),
    });
  }, []);

  const ctlBtn =
    "inline-flex items-center justify-center gap-1.5 rounded-xl border border-text/15 bg-background px-3 py-2 text-xs font-semibold text-text transition-colors hover:border-primary/50 hover:text-primary disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text";

  const animRemaining =
    totalStrokes != null ? Math.max(0, totalStrokes - animStroke) : null;

  // শুধু তখনই স্ট্রোকের নাম দেখাবে যদি অফিশিয়াল ডেটায় সেটি থাকে, না থাকলে সিম্পল স্ট্রোক নম্বর দেখাবে
  const currentStrokeName =
    animStroke > 0 && strokeTypes[animStroke - 1]
      ? strokeTypes[animStroke - 1]
      : null;

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
          setCharIdx(0);
        }}
        title={t("স্ট্রোক অর্ডার দেখুন", "Watch stroke order")}
        aria-label={t(
          `${hanzi} এর স্ট্রোক অর্ডার দেখুন`,
          `Watch stroke order for ${hanzi}`,
        )}
        className={`inline-flex shrink-0 items-center justify-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text border-text/15 bg-card/60 text-text/50 hover:border-primary/50 hover:text-primary ${className}`}
      >
        <Video className="h-[55%] w-[55%]" aria-hidden="true" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/60 p-4"
          onClick={() => {
            cancelSequence();
            setOpen(false);
          }}
        >
          <div
            className="relative w-full max-w-sm rounded-3xl border border-text/12 bg-card p-5 shadow-2xl sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                cancelSequence();
                setOpen(false);
              }}
              aria-label={t("বন্ধ করুন", "Close")}
              className="absolute -top-3 -right-3 flex size-9 items-center justify-center rounded-full border border-text/12 bg-card text-text shadow-lg transition-colors hover:bg-text/5"
            >
              <X className="size-4" aria-hidden="true" />
            </button>

            <div className="text-center">
              <p lang="zh" className="font-chinese text-4xl font-bold text-text">
                {hanzi}
              </p>
              {isMulti && (
                <p className="mt-1 text-xs font-mono tabular-nums text-text/55">
                  {t("ক্যারেক্টার", "Character")} {safeIdx + 1} / {chars.length} ·{" "}
                  {currentChar}
                </p>
              )}
              <p className="mt-1 text-xs text-text/55">
                {t("স্ট্রোক অর্ডার দেখুন ও অনুশীলন করুন", "Watch the stroke order, then practice")}
              </p>
            </div>

            {/* writer canvas + ‹ › navigation */}
            <div className="relative mx-auto mt-4 flex max-w-[340px] items-center justify-center gap-2 rounded-2xl border border-text/12 bg-background p-2">
              {isMulti && (
                <button
                  type="button"
                  onClick={() => {
                    cancelSequence();
                    setCharIdx((i) => Math.max(0, i - 1));
                  }}
                  disabled={safeIdx === 0}
                  aria-label={t("আগের ক্যারেক্টার", "Previous character")}
                  className="flex size-10 shrink-0 items-center justify-center rounded-full border border-text/15 text-text/60 transition-colors hover:border-primary/50 hover:text-primary disabled:opacity-35"
                >
                  ‹
                </button>
              )}

              <div className="relative flex h-[280px] w-[280px] max-w-full items-center justify-center">
                <div
                  ref={boxRef}
                  aria-label={t(
                    `${currentChar} স্ট্রোক অ্যানিমেশন`,
                    `${currentChar} stroke animation`,
                  )}
                />
                {status === "loading" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="size-6 animate-spin text-text/40" aria-hidden="true" />
                  </div>
                )}
                {status === "error" && (
                  <div className="flex flex-col items-center justify-center px-6 text-center">
                    <p className="text-sm font-semibold text-danger">
                      {t("ডেটা লোড করা যায়নি", "Couldn't load the character")}
                    </p>
                    <p className="mt-1 text-xs text-text/50">
                      {t(
                        "ইন্টারনেট সংযোগ চেক করে আবার চেষ্টা করুন।",
                        "Check your internet connection and try again.",
                      )}
                    </p>
                  </div>
                )}
              </div>

              {isMulti && (
                <button
                  type="button"
                  onClick={() => {
                    cancelSequence();
                    setCharIdx((i) => Math.min(chars.length - 1, i + 1));
                  }}
                  disabled={safeIdx >= chars.length - 1}
                  aria-label={t("পরের ক্যারেক্টার", "Next character")}
                  className="flex size-10 shrink-0 items-center justify-center rounded-full border border-text/15 text-text/60 transition-colors hover:border-primary/50 hover:text-primary disabled:opacity-35"
                >
                  ›
                </button>
              )}
            </div>

            {/* stroke counter */}
            <div className="mt-4 rounded-xl border border-text/12 bg-background px-4 py-3 text-center">
              {mode === "quiz" ? (
                <p className="text-sm font-semibold tabular-nums text-text">
                  {t("সঠিক স্ট্রোক", "Correct strokes")}:{" "}
                  <span className="text-ok">
                    {quizCorrect}/{totalStrokes ?? "—"}
                  </span>{" "}
                  · {t("ভুল", "Mistakes")}:{" "}
                  <span className="text-danger">{quizMistakes}</span>
                  {quizDone && (
                    <span className="ml-2 text-ok">🎉 {t("সম্পন্ন!", "Complete!")}</span>
                  )}
                </p>
              ) : (
                <div className="flex flex-col items-center justify-center gap-0.5">
                  <p className="text-xs font-medium text-primary">
                    {status === "ready" && animStroke > 0 ? (
                      <span className="flex items-center gap-1.5">
                        <span>{t("স্ট্রোক", "Stroke")} #{animStroke}:</span>
                        <strong className="text-xs font-bold uppercase tracking-wider text-text">
                          {currentStrokeName ? currentStrokeName : `${t("স্ট্রোক", "Stroke")} ${animStroke}`}
                        </strong>
                      </span>
                    ) : (
                      <span>{t("স্ট্রোক দেখানো হয়েছে", "Strokes shown")}: {status === "ready" ? animStroke : 0}/{totalStrokes ?? "—"}</span>
                    )}
                  </p>
                  <p className="text-[11px] text-text/55">
                    {t("বাকি", "Remaining")}: <span className="text-warn">{animRemaining ?? "—"}</span>
                  </p>
                </div>
              )}
            </div>

            {/* controls */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <button type="button" onClick={play} disabled={status !== "ready"} className={ctlBtn}>
                <Play className="size-3.5" aria-hidden="true" />
                {t("প্লে", "Play")}
              </button>
              <button
                type="button"
                onClick={loop}
                disabled={status !== "ready"}
                className={`${ctlBtn} ${looping ? "border-primary/60 text-primary" : ""}`}
              >
                <Repeat className="size-3.5" aria-hidden="true" />
                {t("লুপ", "Loop")}
              </button>
              <button
                type="button"
                onClick={togglePause}
                disabled={status !== "ready" || mode === "quiz"}
                className={`${ctlBtn} ${paused ? "border-primary/60 text-primary" : ""}`}
              >
                {paused ? (
                  <Play className="size-3.5" aria-hidden="true" />
                ) : (
                  <Pause className="size-3.5" aria-hidden="true" />
                )}
                {paused ? t("রিজিউম", "Resume") : t("পজ", "Pause")}
              </button>
              <button
                type="button"
                onClick={practice}
                disabled={status !== "ready"}
                className={`${ctlBtn} ${mode === "quiz" ? "border-primary/60 text-primary" : ""}`}
              >
                <PenLine className="size-3.5" aria-hidden="true" />
                {t("অনুশীলন", "Practice")}
              </button>
            </div>

            {status === "ready" && mode === "quiz" && (
              <p className="mt-3 text-center text-[11px] leading-5 text-text/50">
                {t(
                  "মোড: অনুশীলন — ক্যানভাসে মাউস/আঙুল দিয়ে স্ট্রোক আঁকুন, হানজি রাইটার সঠিক-ভুল বলবে।",
                  "Practice mode — draw the strokes on the canvas with your mouse/finger; Hanzi Writer checks them.",
                )}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
