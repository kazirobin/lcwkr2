"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

type Bilingual = { bn: string; en: string };

/* ─────────────────────────────────────────────────────────────────
   PLACEHOLDER CONTENT — replace before shipping.

   These quotes and numbers are stand-ins so the section can be
   reviewed with real structure. Swap in testimonials actually
   collected from the WhatsApp community (with each learner's
   permission to use their words and first name), and set the
   outcome figures to numbers you can stand behind.
   ───────────────────────────────────────────────────────────────── */

const OUTCOMES: { value: Bilingual; label: Bilingual }[] = [
  {
    value: { bn: "৪,০০০+", en: "4,000+" },
    label: { bn: "শিক্ষার্থী ক্লাস করছে", en: "learners in class" },
  },
  {
    value: { bn: "৯২%", en: "92%" },
    label: { bn: "গড় ক্লাস উপস্থিতি", en: "average attendance" },
  },
  {
    value: { bn: "৩০০+", en: "300+" },
    label: { bn: "HSK ৩ পেরিয়েছে", en: "past HSK 3" },
  },
];

const TESTIMONIALS: {
  name: string;
  initials: string;
  location: Bilingual;
  level: string;
  quote: Bilingual;
  feature?: boolean;
}[] = [
  {
    name: "Nusrat J.",
    initials: "NJ",
    location: { bn: "ঢাকা", en: "Dhaka" },
    level: "HSK 3",
    feature: true,
    quote: {
      bn: "পিনইন দিয়ে শুরু করেছিলাম, কিছুই জানতাম না। রবিন স্যার বাংলায় এমনভাবে বোঝান যে আটকে থাকার সুযোগই নেই। এক বছরে HSK ৩-এ পৌঁছে গেছি — একটা টাকাও লাগেনি।",
      en: "I started at Pinyin knowing nothing. Robin sir explains in Bangla so clearly there's no room to get stuck. In a year I reached HSK 3 — and it cost me nothing.",
    },
  },
  {
    name: "Tanvir A.",
    initials: "TA",
    location: { bn: "চট্টগ্রাম", en: "Chittagong" },
    level: "Level 4",
    quote: {
      bn: "লাইভ ক্লাসে সরাসরি প্রশ্ন করা যায়, উত্তরও পাই সাথে সাথে। এটাই আমাকে ধরে রেখেছে।",
      en: "You can ask questions live and get an answer on the spot. That's what kept me going.",
    },
  },
  {
    name: "Sadia R.",
    initials: "SR",
    location: { bn: "সিলেট", en: "Sylhet" },
    level: "Level 2",
    quote: {
      bn: "উচ্চারণ জমা না দিলে লেভেল ১-এ ঢুকতে দেয় না — প্রথমে বিরক্ত লেগেছিল, এখন বুঝি কেন। ভিতটা শক্ত হয়ে গেছে।",
      en: "You can't enter Level 1 until your pronunciation is checked. It annoyed me at first; now I get it. The foundation is solid.",
    },
  },
  {
    name: "Rakib H.",
    initials: "RH",
    location: { bn: "রাজশাহী", en: "Rajshahi" },
    level: "HSK 2",
    quote: {
      bn: "সপ্তাহে পাঁচ দিন ক্লাস, বৃহস্পতিবার পরীক্ষা। এই রুটিনটাই আমাকে নিয়মিত রেখেছে।",
      en: "Five days of class, an exam on Thursday. The routine is the thing that kept me consistent.",
    },
  },
  {
    name: "Mim F.",
    initials: "MF",
    location: { bn: "খুলনা", en: "Khulna" },
    level: "Level 3",
    quote: {
      bn: "বাংলাদেশে বিনামূল্যে এভাবে গুছিয়ে চাইনিজ শেখানোর জায়গা আর পাইনি।",
      en: "I couldn't find anywhere else in Bangladesh teaching Chinese this structured, for free.",
    },
  },
];

export default function StudentResults() {
  const { language } = useLanguage();
  const t = (bn: string, en: string) => (language === "bn" ? bn : en);
  const pick = (v: Bilingual) => (language === "bn" ? v.bn : v.en);

  const root = useRef<HTMLDivElement>(null);

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
      { threshold: 0.12 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="results"
      className={`relative scroll-mt-24 overflow-hidden border-y border-text/10 bg-[#f8f3ea] py-20 in-[.dark]:bg-background md:py-28 ${
        language === "bn" ? "font-bn" : "font-en"
      }`}
    >
      {/* atmosphere — the character for "voice" */}
      <span
        aria-hidden="true"
        lang="zh"
        className="pointer-events-none absolute -right-10 -top-16 select-none text-[18rem] font-bold leading-none text-text/4 md:text-[26rem]"
      >
        声
      </span>

      <div ref={root} className="reveal-group relative mx-auto max-w-6xl px-6">
        {/* ---------------- Header ---------------- */}
        <div className="max-w-2xl">
          <div data-reveal className="flex items-center gap-2.5">
            <span
              lang="zh"
              aria-hidden="true"
              className="flex size-7 items-center justify-center rounded-md bg-text text-[11px] font-bold text-background"
            >
              声
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-text/55">
              {t("শিক্ষার্থীদের কথা", "In their words")}
            </span>
          </div>

          <h2
            data-reveal
            style={{ "--r": 1 } as React.CSSProperties}
            className="mt-4 text-3xl font-bold tracking-tight text-text sm:text-4xl"
          >
            {t("শূন্য থেকে শুরু করে যারা এগিয়ে গেছে", "The learners who started from zero")}
          </h2>

          <p
            data-reveal
            style={{ "--r": 2 } as React.CSSProperties}
            className="mt-3 text-[15px] leading-7 text-text/70"
          >
            {t(
              "একই পথ ধরে হাজারো শিক্ষার্থী পিনইন থেকে HSK-এর দিকে এগোচ্ছে। কয়েকজনের অভিজ্ঞতা।",
              "Thousands are moving along the same path, from Pinyin toward HSK. A few of their accounts.",
            )}
          </p>
        </div>

        {/* ---------------- Outcome figures ---------------- */}
        <dl
          data-reveal
          style={{ "--r": 3 } as React.CSSProperties}
          className="mt-10 grid grid-cols-1 divide-y divide-text/10 border-y border-text/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0"
        >
          {OUTCOMES.map((o) => (
            <div key={o.label.en} className="px-1 py-5 sm:px-6 sm:first:pl-0">
              <dt className="text-3xl font-bold tabular-nums tracking-tight text-text sm:text-4xl">
                {pick(o.value)}
              </dt>
              <dd className="mt-1 text-sm text-text/60">{pick(o.label)}</dd>
            </div>
          ))}
        </dl>

        {/* ---------------- Voices ---------------- */}
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((person, i) => (
            <li
              key={person.name}
              data-reveal
              style={{ "--r": 4 + i } as React.CSSProperties}
              className={`group relative flex flex-col rounded-2xl border border-text/10 bg-card p-6 pt-9 transition-transform duration-300 hover:-translate-y-1 motion-reduce:transform-none ${
                person.feature ? "sm:col-span-2" : ""
              }`}
            >
              <span
                lang="zh"
                aria-hidden="true"
                className="absolute left-5 top-3 select-none text-3xl leading-none text-primary/25"
              >
                「
              </span>

              <p
                className={`flex-1 leading-8 text-text/80 ${
                  person.feature ? "text-lg sm:text-xl" : "text-[15px]"
                }`}
              >
                {pick(person.quote)}
              </p>

              <div className="mt-6 flex items-center gap-3 border-t border-text/10 pt-4">
                <span
                  aria-hidden="true"
                  className="flex size-10 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-xs font-bold text-primary"
                >
                  {person.initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-text">
                    {person.name}
                    <span className="font-normal text-text/45"> · {pick(person.location)}</span>
                  </p>
                  <p className="text-xs text-text/50">
                    {t("এখন", "Now at")} {person.level}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <Link
          data-reveal
          style={{ "--r": 4 + TESTIMONIALS.length } as React.CSSProperties}
          href="/academy/students"
          className="group mt-10 inline-flex items-center gap-2 text-[15px] font-semibold text-text transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          {t("শিক্ষার্থী তালিকা দেখুন", "See the scholars directory")}
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none"
            aria-hidden="true"
          />
        </Link>
      </div>
    </section>
  );
}
