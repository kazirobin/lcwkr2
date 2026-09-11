"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { RotateCw } from "lucide-react";
import { useLanguage } from "@/i18n";
import { Button } from "@/components/ui";
import {
  DERIVATIVE_STROKES,
  FUNDAMENTAL_STROKES,
  STANDARD_STROKES,
  type StandardStroke,
} from "../data/strokes";

/**
 * The full 32-stroke standard chart (Unicode CJK Strokes): learn mode shows
 * every stroke grouped as fundamental / derivative with symbol, name and
 * example characters — each with a writing-practice canvas; quiz mode shows
 * a random stroke symbol and the learner picks its name.
 */

function StrokeGlyph({
  stroke,
  size = 72,
  className = "",
}: {
  stroke: StandardStroke;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      {stroke.svgPath ? (
        <path
          d={stroke.svgPath}
          fill="none"
          stroke="currentColor"
          strokeWidth="13"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="84"
          fill="currentColor"
        >
          {stroke.symbol}
        </text>
      )}
    </svg>
  );
}

type Point = { x: number; y: number };

function StrokeCard({
  stroke,
  onWrite,
  writeLabel,
}: {
  stroke: StandardStroke;
  onWrite: (s: StandardStroke) => void;
  writeLabel: string;
}) {
  return (
    <li className="flex flex-col items-center gap-1 rounded-2xl border border-text/12 bg-background p-3.5 text-center">
      <StrokeGlyph stroke={stroke} size={64} className="text-text" />
      <p lang="zh" className="text-base font-bold text-text">
        {stroke.symbol}
      </p>
      <p className="font-mono text-xs text-secondary">{stroke.zh}</p>
      <p className="text-xs font-semibold text-text">{stroke.bn}</p>
      <p className="text-[10px] leading-4 text-text/50">
        {stroke.en}
        <span className="mt-0.5 block font-chinese text-[11px] text-text/45">
          {stroke.examples}
        </span>
      </p>
      <button
        type="button"
        onClick={() => onWrite(stroke)}
        className="mt-1 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 px-2 py-1.5 text-[11px] font-semibold text-primary transition-colors hover:bg-primary/20 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
      >
        ✍ {writeLabel}
      </button>
    </li>
  );
}

export default function StrokeTrainer() {
  const { language } = useLanguage();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );
  const writeLabel = t("লিখুন", "Write");

  const [mode, setMode] = useState<"learn" | "quiz">("learn");
  const [order, setOrder] = useState<StandardStroke[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  // writing practice (trace the stroke on a canvas)
  const [practice, setPractice] = useState<StandardStroke | null>(null);
  const [segments, setSegments] = useState<Point[][]>([]);
  const [drawing, setDrawing] = useState(false);
  const [checked, setChecked] = useState<{ score: number } | null>(null);
  const guidePathRef = useRef<SVGPathElement>(null);
  const practiceSvgRef = useRef<SVGSVGElement>(null);

  const shuffle = useCallback((arr: StandardStroke[]): StandardStroke[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }, []);

  const startQuiz = () => {
    setOrder(shuffle(STANDARD_STROKES));
    setQIndex(0);
    setPicked(null);
    setScore(0);
    setDone(false);
    setMode("quiz");
  };

  const current = order[qIndex];
  const options = useMemo(() => {
    if (!current) return [];
    const distractors = shuffle(
      STANDARD_STROKES.filter((s) => s.id !== current.id),
    ).slice(0, 3);
    return shuffle([current, ...distractors]);
    // re-shuffle per question only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const pick = (id: string) => {
    if (picked) return;
    setPicked(id);
    if (current && id === current.id) setScore((s) => s + 1);
    setTimeout(() => {
      if (qIndex + 1 >= order.length) setDone(true);
      else {
        setQIndex((i) => i + 1);
        setPicked(null);
      }
    }, 750);
  };

  // ── writing practice helpers ─────────────────────────────────────────
  const toViewBox = (e: React.PointerEvent) => {
    const svg = practiceSvgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    };
  };

  const startDraw = (e: React.PointerEvent) => {
    const p = toViewBox(e);
    if (!p) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrawing(true);
    setChecked(null);
    setSegments((prev) => [...prev, [p]]);
  };

  const moveDraw = (e: React.PointerEvent) => {
    if (!drawing) return;
    const p = toViewBox(e);
    if (!p) return;
    setSegments((prev) => {
      if (prev.length === 0) return prev;
      const next = [...prev];
      next[next.length - 1] = [...next[next.length - 1], p];
      return next;
    });
  };

  const endDraw = () => setDrawing(false);

  const clearPractice = () => {
    setSegments([]);
    setChecked(null);
  };

  const checkPractice = useCallback(() => {
    const guide = guidePathRef.current;
    if (!guide || !practice?.svgPath || segments.length === 0) {
      setChecked({ score: 0 });
      return;
    }
    const total = guide.getTotalLength();
    const SAMPLES = 40;
    const TOL = 14;
    let matched = 0;
    const userPoints = segments.flat();
    for (let i = 0; i < SAMPLES; i++) {
      const pt = guide.getPointAtLength((total * i) / SAMPLES);
      const hit = userPoints.some(
        (u) => Math.hypot(u.x - pt.x, u.y - pt.y) <= TOL,
      );
      if (hit) matched++;
    }
    setChecked({ score: Math.round((matched / SAMPLES) * 100) });
  }, [segments, practice]);

  const stepPractice = (dir: 1 | -1) => {
    if (!practice) return;
    const idx = STANDARD_STROKES.findIndex((s) => s.id === practice.id);
    const next =
      STANDARD_STROKES[
        (idx + dir + STANDARD_STROKES.length) % STANDARD_STROKES.length
      ];
    setPractice(next);
    setSegments([]);
    setChecked(null);
  };

  return (
    <div className="rounded-3xl border border-text/12 bg-card/70 p-6 sm:p-8">
      {/* tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-text">
          {t(
            "৩২টি স্ট্যান্ডার্ড স্ট্রোক (Unicode CJK)",
            "The 32 standard strokes (Unicode CJK)",
          )}
        </h3>
        <div className="inline-flex rounded-xl border border-text/15 bg-background p-1">
          <button
            type="button"
            onClick={() => {
              setMode("learn");
              setPractice(null);
            }}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              mode === "learn" ? "bg-secondary text-white" : "text-text/60 hover:text-text"
            }`}
          >
            {t("শেখা", "Learn")}
          </button>
          <button
            type="button"
            onClick={startQuiz}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              mode === "quiz" ? "bg-secondary text-white" : "text-text/60 hover:text-text"
            }`}
          >
            {t("কুইজ", "Quiz")}
          </button>
        </div>
      </div>

      {/* ═══ learn mode — the full 32-stroke chart ═══ */}
      {mode === "learn" && (
        <div className="mt-2">
          <p className="text-sm text-text/60">
            {t(
              "প্রতিটি হানজি এই ৩২টি স্ট্যান্ডার্ড স্ট্রোক দিয়ে লেখা হয় — ৫টি মূল আর ২৭টি ভ্যারিয়েন্ট। নাম, প্রতীক আর উদাহরণ মুখস্থ করুন, তারপর ✍ লিখুন বাটনে অনুশীলন করুন।",
              "Every hanzi is written with these 32 standard strokes — 5 core and 27 variants. Memorize each name, symbol and example, then practice with the ✍ Write button.",
            )}
          </p>

          <h4 className="mt-5 flex items-center gap-2 text-sm font-bold text-text">
            <span className="rounded bg-primary/10 px-2 py-0.5 text-primary">1</span>
            {t("মূল স্ট্রোক (৫টি)", "Fundamental strokes (5)")}
          </h4>
          <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {FUNDAMENTAL_STROKES.map((s) => (
              <StrokeCard
                key={s.id}
                stroke={s}
                onWrite={setPractice}
                writeLabel={writeLabel}
              />
            ))}
          </ul>

          <h4 className="mt-6 flex items-center gap-2 text-sm font-bold text-text">
            <span className="rounded bg-primary/10 px-2 py-0.5 text-primary">2</span>
            {t("ডেরিভেটিভ ও কম্পাউন্ড স্ট্রোক (২৭টি)", "Derivative & compound strokes (27)")}
          </h4>
          <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
            {DERIVATIVE_STROKES.map((s) => (
              <StrokeCard
                key={s.id}
                stroke={s}
                onWrite={setPractice}
                writeLabel={writeLabel}
              />
            ))}
          </ul>

          {/* ═══ writing practice canvas ═══ */}
          {practice && (
            <div className="mt-6 rounded-2xl border border-primary/30 bg-background p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <StrokeGlyph stroke={practice} size={44} className="text-primary" />
                  <div>
                    <p className="text-sm font-bold text-text">
                      <span lang="zh" className="mr-1.5">{practice.symbol}</span>
                      {practice.zh}
                    </p>
                    <p className="text-[11px] text-text/55">
                      {practice.bn} · {practice.en} · {t("উদাহরণ", "Examples")}:{" "}
                      <span lang="zh" className="font-chinese">{practice.examples}</span>
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setPractice(null);
                    setSegments([]);
                    setChecked(null);
                  }}
                >
                  {t("বন্ধ করুন", "Close")}
                </Button>
              </div>

              {/* drawing canvas */}
              <div className="mt-3 flex justify-center">
                <svg
                  ref={practiceSvgRef}
                  viewBox="0 0 100 100"
                  className="touch-none rounded-xl border border-text/15 bg-card"
                  style={{ width: 300, height: 300, maxWidth: "100%", cursor: "crosshair" }}
                  onPointerDown={startDraw}
                  onPointerMove={moveDraw}
                  onPointerUp={endDraw}
                  onPointerLeave={endDraw}
                >
                  {/* grid */}
                  <line x1="6" y1="6" x2="94" y2="6" strokeWidth="0.8" className="stroke-text/15" />
                  <line x1="6" y1="50" x2="94" y2="50" strokeWidth="0.8" strokeDasharray="2.5 3.5" className="stroke-text/15" />
                  <line x1="6" y1="94" x2="94" y2="94" strokeWidth="0.8" className="stroke-text/15" />
                  <line x1="6" y1="6" x2="6" y2="94" strokeWidth="0.8" className="stroke-text/15" />
                  <line x1="94" y1="6" x2="94" y2="94" strokeWidth="0.8" className="stroke-text/15" />
                  {/* faint guide stroke */}
                  {practice.svgPath && (
                    <path
                      ref={guidePathRef}
                      d={practice.svgPath}
                      fill="none"
                      className="stroke-text/20"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                  {/* user drawing */}
                  {segments.map((seg, i) => (
                    <polyline
                      key={i}
                      points={seg.map((p) => `${p.x},${p.y}`).join(" ")}
                      fill="none"
                      className="stroke-primary"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ))}
                </svg>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={segments.length === 0}
                  onClick={clearPractice}
                >
                  {t("মুছুন", "Clear")}
                </Button>
                <Button
                  size="sm"
                  disabled={segments.length === 0 || !!checked}
                  onClick={checkPractice}
                >
                  {t("যাচাই করুন", "Check")}
                </Button>
                <Button size="sm" variant="secondary" onClick={() => stepPractice(-1)}>
                  ‹ {t("আগের", "Prev")}
                </Button>
                <Button size="sm" variant="secondary" onClick={() => stepPractice(1)}>
                  {t("পরের", "Next")} ›
                </Button>
              </div>

              {checked && (
                <p
                  role="status"
                  className={`mt-3 rounded-xl border px-4 py-2.5 text-center text-sm font-semibold ${
                    checked.score >= 70
                      ? "border-ok/40 bg-ok-surface text-ok"
                      : "border-warn/40 bg-warn-surface text-warn"
                  }`}
                >
                  {checked.score >= 70
                    ? `✓ ${t("দারুণ! মিল:", "Great! Match:")} ${checked.score}%`
                    : `${t("মিল:", "Match:")} ${checked.score}% — ${t("আবার চেষ্টা করুন, গাইড রেখা অনুসরণ করুন।", "Try again, follow the guide line.")}`}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* ═══ quiz mode ═══ */}
      {mode === "quiz" && (
        <div className="mt-2">
          {!done && current ? (
            <>
              <div className="flex items-center justify-between text-xs font-semibold text-text/55">
                <span>
                  {t("প্রশ্ন", "Question")} {qIndex + 1}/{order.length}
                </span>
                <span className="font-mono text-primary">
                  {t("স্কোর", "Score")}: {score}
                </span>
              </div>

              <div className="mt-4 flex justify-center rounded-2xl border border-text/12 bg-background py-6">
                <StrokeGlyph stroke={current} size={120} className="text-text" />
              </div>
              <p className="mt-3 text-center text-sm font-medium text-text">
                {t("এই স্ট্রোকের নাম কী?", "What is this stroke?")}
              </p>

              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {options.map((opt) => {
                  const isAnswer = opt.id === current.id;
                  const isPicked = picked === opt.id;
                  const revealed = picked !== null;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={revealed}
                      onClick={() => pick(opt.id)}
                      className={`rounded-xl border px-4 py-3 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text ${
                        revealed && isAnswer
                          ? "border-ok/50 bg-ok/10 font-bold text-ok"
                          : revealed && isPicked
                            ? "border-danger/50 bg-danger/10 text-danger"
                            : "border-text/15 bg-background text-text hover:border-primary/50"
                      }`}
                    >
                      <span className="mr-2 font-mono text-base font-bold">{opt.symbol}</span>
                      <span className="font-semibold">{opt.zh}</span>
                      <span className="block text-xs text-text/60">
                        {opt.bn} · {opt.en}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="py-6 text-center">
              <p className="text-3xl font-bold text-text">
                {score}/{order.length}
              </p>
              <p className="mt-2 text-sm text-text/60">
                {score === order.length
                  ? t("নিখুঁত! সব স্ট্রোক চেনেন!", "Perfect! You know every stroke!")
                  : score >= order.length / 2
                    ? t("ভালো! আরেকবার চেষ্টা করুন।", "Well done! Try another round.")
                    : t("শেখা ট্যাব থেকে আবার দেখে নিন।", "Review the Learn tab and retry.")}
              </p>
              <Button
                size="sm"
                className="mt-4"
                iconLeft={<RotateCw className="size-3.5" />}
                onClick={startQuiz}
              >
                {t("আবার কুইজ", "Quiz again")}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
