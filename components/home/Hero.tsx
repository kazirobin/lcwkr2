"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

type Props = {
  /** Optional real instructor portrait. Omitted → an initials mark is used instead. */
  photoSrc?: string;
};

/**
 * Vocabulary hidden in the paper — revealed on cursor pointer move.
 */
const SCATTER_CHARS = [
  { ch: "学", top: "3%", left: "43%", size: "text-8xl", rotate: "-rotate-6" },
  { ch: "好", top: "11%", left: "64%", size: "text-2xl", rotate: "rotate-3" },
  { ch: "听", top: "20%", left: "90%", size: "text-6xl", rotate: "rotate-6" },
  { ch: "读", top: "47%", left: "60%", size: "text-3xl", rotate: "-rotate-4" },
  { ch: "写", top: "56%", left: "94%", size: "text-7xl", rotate: "rotate-2" },
  { ch: "说", top: "71%", left: "65%", size: "text-4xl", rotate: "-rotate-6" },
  { ch: "你好", top: "87%", left: "37%", size: "text-xl", rotate: "rotate-2" },
  { ch: "加油", top: "2%", left: "3%", size: "text-5xl", rotate: "-rotate-3" },
  { ch: "谢谢", top: "92%", left: "6%", size: "text-2xl", rotate: "rotate-4" },
  { ch: "习", top: "34%", left: "2%", size: "text-7xl", rotate: "rotate-6" },
  { ch: "语", top: "62%", left: "24%", size: "text-8xl", rotate: "-rotate-3" },
  { ch: "我", top: "42%", left: "82%", size: "text-2xl", rotate: "rotate-5" },
  { ch: "问", top: "80%", left: "84%", size: "text-5xl", rotate: "-rotate-2" },
  { ch: "字", top: "15%", left: "12%", size: "text-3xl", rotate: "rotate-3" },
];

export function Hero({ photoSrc }: Props) {
  const { language } = useLanguage();
  const t = (bn: string, en: string) => (language === "bn" ? bn : en);

  const root = useRef<HTMLElement>(null);
  const torchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const torch = torchRef.current;
    if (!el || !torch) return;

    const onTorchMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--tx", `${e.clientX - r.left}px`);
      el.style.setProperty("--ty", `${e.clientY - r.top}px`);
      torch.style.opacity = "0.22";
    };

    const onTorchLeave = () => {
      torch.style.opacity = "0";
    };

    el.addEventListener("pointermove", onTorchMove);
    el.addEventListener("pointerleave", onTorchLeave);

    return () => {
      el.removeEventListener("pointermove", onTorchMove);
      el.removeEventListener("pointerleave", onTorchLeave);
    };
  }, []);

  return (
    <section
      ref={root}
      aria-labelledby="hl-title"
      className={`relative isolate min-h-screen w-full overflow-hidden bg-background text-text transition-colors duration-300 ${
        language === "bn" ? "font-bn" : "font-en"
      }`}
    >
      {/* Colour wash gradients */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_100%_0%,var(--color-secondary)/0.15,transparent_55%),radial-gradient(100%_80%_at_0%_100%,var(--color-primary)/0.18,transparent_60%)]"
      />

      {/* Ruled practice-sheet grid pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0_63px,var(--color-text)/0.05_63px_64px),repeating-linear-gradient(to_right,transparent_0_63px,var(--color-text)/0.05_63px_64px)] [mask-image:radial-gradient(75%_75%_at_50%_30%,black,transparent_92%)]"
      />

      {/* Vocabulary hidden in the paper — revealed on cursor pointer move */}
      <div
        ref={torchRef}
        aria-hidden="true"
        style={{ opacity: 0 }}
        className="pointer-events-none absolute inset-0 z-10 text-text transition-opacity duration-300 ease-out [mask-image:radial-gradient(circle_240px_at_var(--tx,-9999px)_var(--ty,-9999px),black_0%,black_35%,transparent_78%)]"
      >
        {SCATTER_CHARS.map((c, i) => (
          <span
            key={i}
            lang="zh"
            className={`absolute font-bold select-none ${c.size} ${c.rotate}`}
            style={{ top: c.top, left: c.left }}
          >
            {c.ch}
          </span>
        ))}
      </div>

      <div className="relative z-20 mx-auto flex min-h-screen w-full max-w-[1360px] flex-col px-5 pt-24 pb-8 sm:px-8 sm:pt-28 lg:px-12">
        <div className="grid flex-1 grid-cols-1 items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          {/* ---------------- Left Content ---------------- */}
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span
                aria-hidden="true"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-secondary text-sm font-bold text-background shadow-[2px_2px_0_var(--color-text)/0.18]"
              >
                汉
              </span>
              <span className="h-px w-6 sm:w-8 bg-text/25" aria-hidden="true" />
              <span className="font-mono text-xs font-medium tracking-wider text-secondary uppercase">
                {t("শিক্ষা সবার জন্য উন্মুক্ত", "Education Must Be Free")}
              </span>
              <span className="hidden sm:inline text-text/30">·</span>
              <span className="font-mono text-xs tracking-[0.14em] text-text/60">
                {t("পাঠ ০১ · বিনামূল্যে কোর্স", "Lesson 01 · Free Course")}
              </span>
            </div>

            <h1
              id="hl-title"
              className="mt-6 flex flex-col text-[2.5rem] leading-[1.1] font-bold tracking-tight sm:text-6xl lg:text-[4.5rem]"
            >
              <span className="block pb-1">
                {t("চাইনিজ শেখা শুরু,", "Start Learning Chinese,")}
              </span>
              <span className="inline-flex items-baseline pb-2">
                <span className="text-secondary">
                  {t("একদম বিনামূল্যে।", "Completely Free.")}
                </span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className="ml-3 mb-2 h-7 w-7 shrink-0 self-center text-secondary"
                >
                  <path
                    d="M4 13 L9.5 18.5 L20 5"
                    stroke="currentColor"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="mt-6 max-w-[46ch] text-base leading-[1.75] text-text/75 sm:text-lg">
              {t(
                "শূন্য থেকে সাবলীল পর্যন্ত — কাজী রবিনের সাথে প্রতি সপ্তাহে লাইভ ক্লাসে, ধাপে ধাপে।",
                "From zero to fluency — step-by-step in weekly live classes with Kazi Robin."
              )}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <span className="relative inline-block">
                <span
                  aria-hidden="true"
                  className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-sm bg-text"
                />
                <a
                  href="#live"
                  className="relative inline-flex items-center gap-2 rounded-sm bg-secondary px-6 py-3.5 text-[15px] font-semibold text-background transition-transform duration-200 ease-out hover:-translate-x-0.5 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                >
                  {t("লাইভ ক্লাসে যোগ দিন", "Join Live Class")} <span aria-hidden="true">→</span>
                </a>
              </span>

              <a
                href="#pdf"
                className="rounded-sm border border-text/25 px-6 py-3.5 text-[15px] font-medium text-text transition-colors hover:border-secondary hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
              >
                {t("PDF নোট ডাউনলোড", "Download PDF Notes")}
              </a>

              <a
                href="#intro"
                className="inline-flex items-center gap-1.5 text-[15px] text-text/70 underline decoration-text/30 underline-offset-4 transition-colors hover:text-secondary hover:decoration-secondary"
              >
                {t("ভাষা পরিচিতি দেখুন", "Explore Language Intro")} <span aria-hidden="true">→</span>
              </a>
            </div>

            <p className="mt-10 font-mono text-[13px] tracking-wide text-text/60">
              {t(
                "৪.৯ ★ শিক্ষার্থী রেটিং  ·  ১২,০০০+ শিক্ষার্থী  ·  HSK ১–৬ রোডম্যাপ  ·  ১০০% ফ্রি",
                "4.9 ★ Student Rating  ·  12,000+ Students  ·  HSK 1–6 Roadmap  ·  100% Free"
              )}
            </p>
          </div>

          {/* ---------------- Right Practice Cell ---------------- */}
          <div className="flex flex-col items-center lg:items-end">
            <div className="relative aspect-square w-full max-w-[300px] overflow-hidden rounded-[3px] border border-text/15 bg-background/50 shadow-[10px_10px_0_var(--color-text)/0.06] sm:max-w-[340px]">
              <div className="absolute inset-0">
                {/* 田字格 guide lines */}
                <svg
                  viewBox="0 0 100 100"
                  className="absolute inset-0 h-full w-full text-secondary/30"
                  aria-hidden="true"
                >
                  <path d="M50 4 L50 96" stroke="currentColor" strokeWidth={0.6} strokeDasharray="3 3" />
                  <path d="M4 50 L96 50" stroke="currentColor" strokeWidth={0.6} strokeDasharray="3 3" />
                  <path d="M8 8 L92 92" stroke="currentColor" strokeWidth={0.4} strokeDasharray="2 3" />
                  <path d="M92 8 L8 92" stroke="currentColor" strokeWidth={0.4} strokeDasharray="2 3" />
                </svg>

                {/* 中 (zhōng) Character Strokes */}
                <svg viewBox="0 0 100 140" className="absolute inset-[14%] h-[72%] w-[72%]" aria-hidden="true">
                  <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={8}>
                    <path d="M25 35 L25 95" className="stroke-text" />
                    <path d="M25 35 L75 35 L75 95" className="stroke-text" />
                    <path d="M25 95 L75 95" className="stroke-text" />
                    <path d="M50 15 L50 115" className="stroke-secondary" />
                  </g>
                  {[
                    [15, 30],
                    [34, 25],
                    [15, 100],
                    [50, 6],
                  ].map(([cx, cy], i) => (
                    <g key={i} transform={`translate(${cx} ${cy})`}>
                      <circle r={7} className="fill-secondary" />
                      <text x={0} y={2.5} textAnchor="middle" fontSize={8} fontWeight={700} className="fill-background">
                        {i + 1}
                      </text>
                    </g>
                  ))}
                </svg>

                <p className="absolute bottom-4 left-4 font-mono text-xs text-text/60">
                  zhōng
                  <span className="ml-1 text-text/45">
                    · {t("মধ্য / চীন", "Middle / China")}
                  </span>
                </p>

                <span
                  aria-hidden="true"
                  className="absolute top-4 right-4 rounded-sm bg-secondary px-2 py-1 font-mono text-[10px] tracking-widest text-background"
                >
                  中文
                </span>
              </div>
            </div>

            {/* Instructor Credit */}
            <div className="mt-5 flex w-full max-w-[300px] items-center gap-3 sm:max-w-[340px]">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-sm border border-text/20 bg-background/50">
                {photoSrc ? (
                  <Image
                    src={photoSrc}
                    alt={t("শিক্ষক কাজী রবিন", "Instructor Kazi Robin")}
                    fill
                    sizes="48px"
                    className="object-cover grayscale"
                    unoptimized
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-sm font-bold text-text/70">
                    {t("কর", "KR")}
                  </span>
                )}
                <span
                  aria-hidden="true"
                  className="absolute -right-1.5 -bottom-1.5 flex h-5 w-5 items-center justify-center rounded-sm bg-secondary text-[9px] font-bold text-background"
                >
                  名
                </span>
              </div>
              <p className="text-[13px] leading-snug text-text/70">
                <strong className="block font-semibold text-text">
                  {t("কাজী রবিন", "Kazi Robin")}
                </strong>
                {t(
                  "কমিউনিটি চাইনিজের প্রতিষ্ঠাতা এবং কনটেন্ট ক্রিয়েটর।",
                  "Founder of Community Chinese and Content Creator."
                )}
              </p>
            </div>
          </div>
        </div>

        {/* ---------------- Bottom Footer Anchor ---------------- */}
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-text/15 pt-5 sm:flex-row sm:items-center">
          <span className="font-mono text-[11px] tracking-[0.14em] text-text/50">
            {t(
              "বিস্তারিত জানতে সম্পূর্ণ ওয়েব সাইট ভিজিট করুন",
              "Explore the full website to learn more"
            )}
          </span>
          <a
            href="#next"
            className="inline-flex items-center gap-2 text-xs tracking-wide text-text/60 transition-colors hover:text-secondary"
          >
            {t("নিচে স্ক্রল করুন", "Scroll down")} <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}