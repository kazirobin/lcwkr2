"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

/* ─────────────────────────────────────────────────────────────────
   FACTS TO CONFIRM — edit here before shipping.
   Every claim a visitor reads lives in this one block. The prose
   below describes what Kazi Robin does for the community; the hard
   specifics (his Chinese name, the pull-quote wording) are his and
   should be checked with him.
   ───────────────────────────────────────────────────────────────── */
const FOUNDER = {
  photo: "/assets/kr.jpeg",
  photoAlt: {
    bn: "কাজী রবিন — কমিউনিটির প্রতিষ্ঠাতা",
    en: "Kazi Robin, founder of the community",
  },
  name: { bn: "কাজী রবিন", en: "Kazi Robin" },
  hanzi: "罗宾", // TODO: confirm his Chinese name
  seal: "罗", // his name chop — first character of the Chinese name
  role: {
    bn: "প্রতিষ্ঠাতা ও কমিউনিটি পরিচালক",
    en: "Founder & community lead",
  },

  // Non-numeric, verifiable facts about how the community runs.
  marks: [
    { bn: "সপ্তাহে ৫ দিন লাইভ ক্লাস", en: "Live class 5 days a week" },
    { bn: "শূন্য থেকে HSK ৬ রোডম্যাপ", en: "Zero-to-HSK-6 roadmap" },
    { bn: "বাংলায় বুঝিয়ে পড়ানো", en: "Taught in Bangla" },
    { bn: "সম্পূর্ণ বিনামূল্যে", en: "Completely free" },
  ],

  // TODO: confirm this wording with Kazi Robin before publishing.
  quote: {
    bn: "টাকার অভাবে কেউ যেন ভাষা শেখা থেকে পিছিয়ে না থাকে — এই একটা কথা থেকেই কমিউনিটিটা শুরু।",
    en: "No one should fall behind on a language because of money. That one idea is where this community started.",
  },
};

export default function Founder() {
  const { language } = useLanguage();
  const t = (bn: string, en: string) => (language === "bn" ? bn : en);
  const pick = (v: { bn: string; en: string }) => (language === "bn" ? v.bn : v.en);

  const root = useRef<HTMLDivElement>(null);

  // One entrance, played once when the section is reached.
  useEffect(() => {
    const el = root.current;
    if (!el) return;

    el.classList.add("reveal-armed");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      el.classList.add("is-in");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.classList.add("is-in");
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="founder"
      className={`relative scroll-mt-24 overflow-hidden bg-background py-20 md:py-28 ${
        language === "bn" ? "font-bn" : "font-en"
      }`}
    >
      {/* atmosphere — the character for "learning", bleeding off the edge */}
      <span
        aria-hidden="true"
        lang="zh"
        className="pointer-events-none absolute -left-8 top-1/2 hidden -translate-y-1/2 select-none text-[24rem] font-bold leading-none text-text/[0.035] lg:block"
      >
        学
      </span>

      <div
        ref={root}
        className="reveal-group relative mx-auto grid max-w-6xl gap-12 px-6 md:gap-14 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-center"
      >
        {/* ---------------- Portrait, mounted like a print ---------------- */}
        <div data-reveal className="relative mx-auto w-full max-w-88 lg:mx-0">
          <div className="relative rounded-[1.75rem] border border-text/10 bg-[#f8f3ea] p-3 shadow-[0_28px_70px_-40px_rgba(0,0,0,0.4)] in-[.dark]:bg-text/4">
            <div className="relative aspect-4/5 overflow-hidden rounded-[1.25rem]">
              <Image
                src={FOUNDER.photo}
                alt={pick(FOUNDER.photoAlt)}
                fill
                sizes="(min-width: 640px) 22rem, 80vw"
                className="object-cover"
              />
              {/* copybook registration ticks, one per corner */}
              {[
                "left-2 top-2 border-l-2 border-t-2",
                "right-2 top-2 border-r-2 border-t-2",
                "left-2 bottom-2 border-b-2 border-l-2",
                "right-2 bottom-2 border-b-2 border-r-2",
              ].map((pos) => (
                <span
                  key={pos}
                  aria-hidden="true"
                  className={`absolute h-5 w-5 border-white/70 drop-shadow-[0_0_2px_rgba(0,0,0,0.35)] ${pos}`}
                />
              ))}
            </div>
          </div>

          {/* his name chop — how work gets signed off in Chinese */}
          <span
            aria-hidden="true"
            lang="zh"
            className="absolute -bottom-4 -right-3 rounded-lg bg-secondary px-3 py-2 text-lg font-bold text-white shadow-lg"
            style={{ transform: "rotate(-6deg)" }}
          >
            {FOUNDER.seal}
          </span>
        </div>

        {/* ---------------- Who runs this ---------------- */}
        <div>
          <div data-reveal className="flex items-center gap-2.5" style={{ "--r": 1 } as React.CSSProperties}>
            <span
              lang="zh"
              aria-hidden="true"
              className="flex size-7 items-center justify-center rounded-md bg-text text-[11px] font-bold text-background"
            >
              办
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-text/55">
              {t("যিনি এটি চালান", "The person behind it")}
            </span>
          </div>

          <h2
            data-reveal
            style={{ "--r": 2 } as React.CSSProperties}
            className="mt-5 text-4xl font-bold leading-tight tracking-tight text-text sm:text-5xl"
          >
            <span className="relative inline-block">
              {pick(FOUNDER.name)}
              <span
                aria-hidden="true"
                className="ink-underline absolute -bottom-1 left-0 h-[3px] w-full origin-left rounded-full bg-secondary"
              />
            </span>
            <span lang="zh" className="ml-3 align-middle text-2xl font-medium text-text/40 sm:text-3xl">
              {FOUNDER.hanzi}
            </span>
          </h2>

          <p
            data-reveal
            style={{ "--r": 3 } as React.CSSProperties}
            className="mt-3 text-sm font-medium text-text/55"
          >
            {pick(FOUNDER.role)}
          </p>

          <div
            data-reveal
            style={{ "--r": 4 } as React.CSSProperties}
            className="mt-6 space-y-4 text-[15px] leading-8 text-text/70"
          >
            <p>
              {t(
                "এই কমিউনিটিটা শুরু করেছেন কাজী রবিন — একটাই লক্ষ্য নিয়ে: টাকার অভাবে যেন কেউ চাইনিজ শেখা থেকে পিছিয়ে না থাকে।",
                "Kazi Robin started this community with one aim — that money should never be the reason someone can't learn Chinese.",
              )}
            </p>
            <p>
              {t(
                "নিজে চাইনিজ শিখেছেন, তাই পিনইন থেকে HSK পর্যন্ত পুরো পথটা তাঁর চেনা। এখন সেই পথ ধরে হাজারো শিক্ষার্থীর জন্য লাইভ ক্লাস, লেভেল ট্র্যাক আর মডারেশন — সব একসাথে সচল রাখেন তিনি।",
                "He learned Chinese himself, so the whole road from Pinyin to HSK is one he knows. Now he keeps the live classes, the level track and the moderation running along that road for thousands of learners.",
              )}
            </p>
          </div>

          <ul
            data-reveal
            style={{ "--r": 5 } as React.CSSProperties}
            className="mt-7 flex flex-wrap gap-2"
          >
            {FOUNDER.marks.map((mark) => (
              <li
                key={mark.en}
                className="rounded-full border border-text/15 px-3.5 py-1.5 text-[13px] font-medium text-text/75"
              >
                {pick(mark)}
              </li>
            ))}
          </ul>

          <blockquote
            data-reveal
            style={{ "--r": 6 } as React.CSSProperties}
            className="mt-8 border-l-2 border-secondary/60 pl-4 text-[15px] italic leading-7 text-text/80"
          >
            <span lang="zh" aria-hidden="true" className="mr-1 not-italic text-secondary/70">
              「
            </span>
            {pick(FOUNDER.quote)}
          </blockquote>

          <Link
            data-reveal
            style={{ "--r": 7 } as React.CSSProperties}
            href="/intro"
            className="group mt-8 inline-flex items-center gap-2 text-[15px] font-semibold text-text transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            {t("কমিউনিটি কীভাবে চলে দেখুন", "See how the community runs")}
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
