"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Check,
  FileText,
  GraduationCap,
  Star,
  Users,
} from "lucide-react";
import { useLanguage } from "@/i18n";

type Props = {
  /** Optional real instructor portrait. Omitted → an initials mark is used instead. */
  photoSrc?: string;
};

/**
 * Landing hero — soft sumi-e (ink-wash) mood: warm paper ground, layered
 * mountain silhouettes, a low sun, drifting birds and a bamboo sprig, with the
 * lesson content and a 田字格 stroke-order card floating above it.
 */
export function Hero({ photoSrc }: Props) {
  const { language } = useLanguage();
  const t = (bn: string, en: string) => (language === "bn" ? bn : en);

  const root = useRef<HTMLElement>(null);

  // Gentle pointer parallax on the ink-wash layers.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty("--px", px.toFixed(3));
      el.style.setProperty("--py", py.toFixed(3));
    };

    el.addEventListener("pointermove", onMove);
    return () => el.removeEventListener("pointermove", onMove);
  }, []);

  const src = photoSrc
    ? photoSrc.startsWith("/") || photoSrc.startsWith("http")
      ? photoSrc
      : `/${photoSrc}`
    : undefined;

  const stats: { icon: typeof Users; value: string; label: string }[] = [
    { icon: Users, value: "8.2k+", label: t("শিক্ষার্থী রেটিং", "Student rating") },
    {
      icon: GraduationCap,
      value: "12,000+",
      label: t("সন্তুষ্ট শিক্ষার্থী", "Happy students"),
    },
    { icon: BookOpen, value: "HSK 1-6", label: t("রোডম্যাপ", "Roadmap") },
    {
      icon: Star,
      value: "100%",
      label: t("ফ্রি রিসোর্স", "Free resources"),
    },
  ];

  return (
    <section
      ref={root}
      aria-labelledby="hl-title"
      className={`relative isolate -mt-16 min-h-screen w-full overflow-hidden bg-[#f8f3ea] text-text transition-colors duration-300 in-[.dark]:bg-background sm:-mt-20 ${
        language === "bn" ? "font-bn" : "font-en"
      }`}
      style={{ "--px": "0", "--py": "0" } as React.CSSProperties}
    >
      {/* ---------- Ink-wash landscape background ---------- */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* warm rice-paper ground so the art blends seamlessly in light mode */}
        <div className="absolute inset-0 bg-[#f8f3ea] in-[.dark]:hidden" />
        {/* Light: ink-wash landscape. Dark: a dedicated night version. The
            theme class is set before first paint, so only the matching image
            is displayed; the hidden one (lazy) is never fetched. */}
        <Image
          src="/assets/ink-landscape.jpg"
          alt=""
          width={1672}
          height={941}
          priority
          sizes="100vw"
          className="absolute inset-x-0 top-0 w-full [mask-image:linear-gradient(to_bottom,black_50%,transparent_92%)] in-[.dark]:hidden"
          style={{
            transform:
              "translate3d(calc(var(--px) * -10px), calc(var(--py) * -6px), 0)",
          }}
        />
        <Image
          src="/assets/dark-hero.png"
          alt=""
          width={1672}
          height={941}
          sizes="100vw"
          className="absolute inset-x-0 top-0 hidden w-full [mask-image:linear-gradient(to_bottom,black_58%,transparent_94%)] in-[.dark]:block"
          style={{
            transform:
              "translate3d(calc(var(--px) * -10px), calc(var(--py) * -6px), 0)",
          }}
        />
        {/* scrims: keep the left column readable, blend the art into the theme background */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#f8f3ea_0%,rgba(248,243,234,0.72)_20%,rgba(248,243,234,0.1)_46%,transparent_66%)] in-[.dark]:hidden" />
        <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,var(--color-background)_0%,var(--color-background)/0.6_24%,transparent_58%)] in-[.dark]:block" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(0deg,#f8f3ea,transparent)] in-[.dark]:hidden" />
        <div className="absolute inset-x-0 bottom-0 hidden h-1/3 bg-[linear-gradient(0deg,var(--color-background),transparent)] in-[.dark]:block" />
      </div>

      {/* ---------- Giant 学 watermark ---------- */}
      <span
        aria-hidden="true"
        lang="zh"
        className="pointer-events-none absolute top-[6%] left-[38%] hidden select-none text-[26rem] leading-none font-bold text-text/[0.03] lg:block"
        style={{
          transform:
            "translate3d(calc(var(--px) * -14px), calc(var(--py) * -14px), 0)",
        }}
      >
        学
      </span>

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-3 pt-28 pb-10 sm:px-6 lg:px-8">
        <div className="grid flex-1 grid-cols-1 items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
          {/* ---------------- Left ---------------- */}
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span
                aria-hidden="true"
                lang="zh"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-sm font-bold text-white shadow-sm"
              >
                汉
              </span>
              <span className="text-xs font-semibold tracking-wide text-secondary uppercase">
                {t("শিক্ষা সবার জন্য উন্মুক্ত", "Education open for all")}
              </span>
              <span className="text-text/25" aria-hidden="true">
                ·
              </span>
              <span className="text-xs tracking-wide text-text/55">
                {t("পাঠ ০১", "Lesson 01")}
              </span>
              <span className="text-text/25" aria-hidden="true">
                ·
              </span>
              <span className="text-xs tracking-wide text-text/55">
                {t("বিনামূল্যে কোর্স", "Free course")}
              </span>
            </div>

            <h1
              id="hl-title"
              className="mt-7 text-[2.6rem] leading-[1.12] font-bold tracking-tight sm:text-6xl lg:text-[4.25rem]"
            >
              <span className="block">
                {t("চাইনিজ শেখা শুরু,", "Start learning Chinese,")}
              </span>
              <span className="mt-1 inline-flex items-center gap-3 text-secondary">
                {t("একদম বিনামূল্যে", "completely free")}
                <span
                  aria-hidden="true"
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[3px] border-secondary"
                >
                  <Check className="h-5 w-5" strokeWidth={3} />
                </span>
              </span>
            </h1>

            <p className="mt-6 max-w-[48ch] text-base leading-[1.8] text-text/70 sm:text-lg">
              {t(
                "শূন্য থেকে সাবলীল পর্যন্ত — কাজী রবিনের সাথে প্রতি সপ্তাহে লাইভ ক্লাসে, ধাপে ধাপে।",
                "From zero to fluency — step-by-step in weekly live classes with Kazi Robin.",
              )}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="https://chat.whatsapp.com/EBP79wEaAfAEvMtMee6HTY"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-secondary px-6 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-secondary/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-secondary/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
              >
                {t("লাইভ ক্লাসে যোগ দিন", "Join live class")}
                <ArrowRight className="h-4 w-4" />
              </a>

              <Link
                href="/pdf"
                className="inline-flex items-center gap-2 rounded-xl border border-text/15 bg-background px-6 py-3.5 text-[15px] font-medium text-text transition-colors hover:border-secondary/50 hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
              >
                <FileText className="h-4 w-4" />
                {t("PDF নোট ডাউনলোড", "Download PDF notes")}
              </Link>

              <Link
                href="/intro"
                className="inline-flex items-center gap-1.5 text-[15px] text-text/65 underline decoration-text/25 underline-offset-[6px] transition-colors hover:text-secondary hover:decoration-secondary"
              >
                {t("কীভাবে চলে দেখুন", "See how it works")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* ---------------- Right ---------------- */}
          <div
            className="flex flex-col items-center gap-5 lg:items-end"
            style={{
              transform:
                "translate3d(calc(var(--px) * -8px), calc(var(--py) * -8px), 0)",
            }}
          >
            {/* Stroke-order card */}
            <div className="relative aspect-square w-full max-w-[360px] rounded-3xl border border-text/10 bg-background shadow-[0_30px_70px_-25px_rgba(0,0,0,0.25)]">
              <span
                aria-hidden="true"
                lang="zh"
                className="absolute top-4 right-4 rounded-lg bg-secondary px-2.5 py-1 text-[11px] font-semibold tracking-widest text-white"
              >
                中文
              </span>

              {/* 田字格 + 中 */}
              <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 h-full w-full"
                aria-hidden="true"
              >
                <g transform="translate(14 14) scale(0.72)">
                  <rect
                    x="1"
                    y="1"
                    width="98"
                    height="98"
                    rx="2"
                    fill="none"
                    className="stroke-secondary/30"
                    strokeWidth="1"
                  />
                  <path
                    d="M50 1 V99 M1 50 H99 M1 1 L99 99 M99 1 L1 99"
                    className="stroke-secondary/25"
                    strokeWidth="0.8"
                    strokeDasharray="4 4"
                  />
                  {/* 中 strokes */}
                  <g
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="8.5"
                  >
                    <path d="M38 36 V66" className="stroke-text" />
                    <path d="M38 36 H62 V66" className="stroke-text" />
                    <path d="M38 66 H62" className="stroke-text" />
                    <path d="M50 19 V83" className="stroke-secondary" />
                  </g>
                  {/* numbered stroke starts */}
                  {(
                    [
                      [29, 33, "1"],
                      [44, 24, "2"],
                      [29, 69, "3"],
                      [51, 9, "4"],
                    ] as const
                  ).map(([cx, cy, n]) => (
                    <g key={n} transform={`translate(${cx} ${cy})`}>
                      <circle r="6.5" className="fill-secondary" />
                      <text
                        x="0"
                        y="2.6"
                        textAnchor="middle"
                        fontSize="8"
                        fontWeight="700"
                        className="fill-white"
                      >
                        {n}
                      </text>
                    </g>
                  ))}
                </g>
              </svg>

              <p className="absolute bottom-5 left-6 text-xs text-text/55">
                <span className="font-medium text-text/75">zhōng</span>
                <span className="mx-1.5">·</span>
                {t("মধ্য / চীন", "middle / China")}
              </p>
            </div>

            {/* Instructor card */}
            <div className="relative w-full max-w-[360px] overflow-hidden rounded-2xl border border-text/10 bg-background p-4 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.2)]">
              <span
                aria-hidden="true"
                className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-secondary/12 text-secondary"
              >
                <Star className="h-3.5 w-3.5 fill-current" />
              </span>
              <div className="flex items-center gap-3.5">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-text/10 bg-text/5">
                  {src ? (
                    <Image
                      src={src}
                      alt={t("শিক্ষক কাজী রবিন", "Instructor Kazi Robin")}
                      fill
                      sizes="48px"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-sm font-bold text-text/70">
                      {t("কর", "KR")}
                    </span>
                  )}
                </div>
                <p className="text-[13px] leading-snug text-text/65">
                  <strong className="block text-sm font-semibold text-text">
                    {t("কাজী রবিন", "Kazi Robin")}
                  </strong>
                  {t(
                    "কমিউনিটি চাইনিজের প্রতিষ্ঠাতা এবং কনটেন্ট ক্রিয়েটর।",
                    "Founder of Community Chinese and content creator.",
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- Stats bar ---------------- */}
        <div className="mt-12 grid grid-cols-2 divide-text/10 rounded-2xl border border-text/10 bg-background/70 backdrop-blur-sm sm:grid-cols-4 sm:divide-x">
          {stats.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 px-5 py-5 sm:px-6"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                <Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-lg font-bold tracking-tight text-text">
                  {value}
                </span>
                <span className="block text-xs text-text/55">{label}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
