"use client";

import { useEffect, useRef } from "react";
import { Plus, ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n";

type FAQItem = {
  question: string;
  answer: string;
  action?: { label: string; href: string };
};

type FAQContent = {
  kicker: string;
  title: { first: string; highlight: string };
  subtitle: string;
  items: FAQItem[];
  support: {
    lead: string;
    button: string;
    available: string;
    href: string;
  };
};

const DRIVE_URL =
  "https://drive.google.com/drive/folders/12fEKjDBRU5NgnpgE4WluoRMer94LIkaQ";
const PRACTICE_GROUP_URL = "https://chat.whatsapp.com/EBP79wEaAfAEvMtMee6HTY";
const SUPPORT_URL = "https://wa.me/8801787881334";

/* Chinese numerals — double as a passing glance of the language itself */
const CN_NUMERALS = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];

export const faq: { en: FAQContent; bn: FAQContent } = {
  en: {
    kicker: "问 · Questions",
    title: { first: "Everything you might", highlight: "want to ask" },
    subtitle:
      "The community, the lessons, the practice loop. If your question isn't here, one message gets you a real answer.",
    items: [
      {
        question: "How can I join the Chinese Learning Community?",
        answer:
          'Tap the "Join Community" button on the website. You\'ll be taken to our WhatsApp community, where you can join as a member.',
      },
      {
        question: "Do I need any previous Chinese language knowledge?",
        answer:
          "No. The course is built for complete beginners — you can start from zero.",
      },
      {
        question: "Where can I watch the Pinyin lessons?",
        answer: "All Pinyin lessons live in our shared Google Drive folder.",
        action: { label: "Open Google Drive", href: DRIVE_URL },
      },
      {
        question: "How do I submit my Pinyin pronunciation practice?",
        answer:
          "Record yourself and send it as a voice message in our WhatsApp practice group.",
        action: { label: "Open the practice group", href: PRACTICE_GROUP_URL },
      },
      {
        question: "Will I receive help if I face any problems?",
        answer:
          "Yes. Our teachers and community members are always ready to help.",
      },
      {
        question: "Is the learning community free?",
        answer: "Yes. Joining the Chinese learning community is completely free.",
      },
      {
        question: "How can I improve faster?",
        answer:
          "Practice daily, finish your assignments, send your voice recordings, and take part in community discussions.",
      },
    ],
    support: {
      lead: "Still holding a question?",
      button: "Message support",
      available: "Replies 10:00 AM – 10:00 PM",
      href: SUPPORT_URL,
    },
  },

  bn: {
    kicker: "问 · প্রশ্ন",
    title: { first: "যা কিছু জানতে", highlight: "চান" },
    subtitle:
      "কমিউনিটি, ক্লাস, অনুশীলনের ধাপ — সব এখানে। আপনার প্রশ্ন না থাকলে একটি মেসেজেই সত্যিকারের উত্তর পাবেন।",
    items: [
      {
        question: "আমি কীভাবে চীনা ভাষা শেখার কমিউনিটিতে যোগ দিতে পারি?",
        answer:
          'ওয়েবসাইটের "Join Community" বাটনে ক্লিক করুন। এরপর আপনাকে আমাদের WhatsApp কমিউনিটিতে নিয়ে যাওয়া হবে, যেখানে আপনি সদস্য হতে পারবেন।',
      },
      {
        question: "চীনা ভাষা শেখার জন্য আগে থেকে কিছু জানা কি প্রয়োজন?",
        answer:
          "না। আমাদের কোর্স সম্পূর্ণ নতুনদের জন্য তৈরি — আপনি একদম শুরু থেকেই শিখতে পারবেন।",
      },
      {
        question: "আমি Pinyin-এর ভিডিওগুলো কোথায় পাব?",
        answer: "সব Pinyin ভিডিও আমাদের শেয়ার্ড Google Drive ফোল্ডারে আছে।",
        action: { label: "Google Drive খুলুন", href: DRIVE_URL },
      },
      {
        question: "Pinyin উচ্চারণের ভয়েস কীভাবে জমা দেব?",
        answer:
          "নিজের উচ্চারণ রেকর্ড করে আমাদের WhatsApp প্র্যাকটিস গ্রুপে ভয়েস মেসেজ হিসেবে পাঠিয়ে দিন।",
        action: { label: "প্র্যাকটিস গ্রুপ খুলুন", href: PRACTICE_GROUP_URL },
      },
      {
        question: "পড়ার সময় কোনো সমস্যা হলে কি সাহায্য পাব?",
        answer:
          "অবশ্যই। আমাদের শিক্ষক ও কমিউনিটির সদস্যরা সবসময় সাহায্য করতে প্রস্তুত।",
      },
      {
        question: "কমিউনিটিতে যোগ দিতে কি কোনো ফি দিতে হবে?",
        answer: "না। আমাদের শেখার কমিউনিটিতে যোগদান সম্পূর্ণ বিনামূল্যে।",
      },
      {
        question: "কমিউনিটিতে কীভাবে দ্রুত উন্নতি করব?",
        answer:
          "প্রতিদিন অনুশীলন করুন, অ্যাসাইনমেন্ট সম্পন্ন করুন, নিয়মিত ভয়েস জমা দিন এবং আলোচনায় সক্রিয়ভাবে অংশ নিন।",
      },
    ],
    support: {
      lead: "এখনও কোনো প্রশ্ন রয়ে গেছে?",
      button: "সাপোর্টে মেসেজ",
      available: "উত্তর: সকাল ১০টা – রাত ১০টা",
      href: SUPPORT_URL,
    },
  },
};

function FaqJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.en.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.action ? `${item.answer} ${item.action.href}` : item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export default function FAQ() {
  const { language } = useLanguage();
  const data = language === "bn" ? faq.bn : faq.en;

  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    el.classList.add("faq-anim");

    if (reduced || !("IntersectionObserver" in window)) {
      el.classList.add("faq-in");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.classList.add("faq-in");
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="faq"
      className="relative scroll-mt-24 overflow-hidden bg-background py-24 md:py-32"
    >
      <FaqJsonLd />

      {/* oversized character — pure atmosphere */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-10 select-none font-[system-ui] text-[13rem] font-bold leading-none text-primary/[0.05] md:right-4 md:text-[22rem]"
      >
        问
      </span>

      <div className="mx-auto grid max-w-6xl gap-x-16 gap-y-12 px-5 md:grid-cols-[minmax(0,20rem)_1fr]">
        {/* Left rail */}
        <div className="md:sticky md:top-28 md:self-start">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text/55">
            {data.kicker}
          </p>

          <h2 className="mt-5 text-3xl font-bold leading-[1.15] tracking-tight text-text md:text-[2.5rem]">
            {data.title.first}{" "}
            <span className="underline decoration-primary/70 decoration-2 underline-offset-[6px]">
              {data.title.highlight}
            </span>
          </h2>

          <p className="mt-5 max-w-sm text-[15px] leading-7 text-muted-foreground">
            {data.subtitle}
          </p>

          <div className="mt-8 border-t border-border pt-6">
            <p className="text-sm text-muted-foreground">{data.support.lead}</p>
            <a
              href={data.support.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 rounded-md text-base font-semibold text-text underline decoration-primary/50 underline-offset-4 transition-colors hover:decoration-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
            >
              {data.support.button}
              <ArrowRight size={17} aria-hidden="true" />
            </a>
            <p className="mt-1.5 text-xs text-muted-foreground">
              {data.support.available}
            </p>
          </div>
        </div>

        {/* Questions */}
        <div ref={rootRef} className="faq-accordion md:pt-1">
          {data.items.map((item, index) => (
            <details
              key={item.question}
              open={index === 0}
              className="faq-row group border-b border-border first:border-t"
              style={{ "--i": index } as React.CSSProperties}
            >
              <summary className="flex cursor-pointer list-none items-start gap-5 rounded-lg py-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text">
                <span className="faq-numeral mt-0.5 shrink-0 text-lg font-semibold text-text/25 group-open:text-text/60">
                  {CN_NUMERALS[index] ?? index + 1}
                </span>

                <h3 className="flex-1 text-lg font-semibold leading-snug text-text md:text-xl">
                  {item.question}
                </h3>

                <Plus
                  size={20}
                  aria-hidden="true"
                  className="faq-mark mt-1 shrink-0 text-text/45"
                />
              </summary>

              <div className="pb-8 pl-10 pr-2 text-[15px] leading-8 text-muted-foreground md:max-w-2xl">
                <p>{item.answer}</p>

                {item.action && (
                  <a
                    href={item.action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-text underline decoration-primary/50 underline-offset-4 transition-colors hover:decoration-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
                  >
                    {item.action.label}
                    <ArrowRight size={15} aria-hidden="true" />
                  </a>
                )}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
