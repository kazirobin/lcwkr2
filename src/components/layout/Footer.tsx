"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUp,
  FolderOpen,
  GraduationCap,
  Heart,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";

import { useLanguage } from "@/i18n/LanguageContext";

const WHATSAPP_COMMUNITY = "https://chat.whatsapp.com/EBP79wEaAfAEvMtMee6HTY";
const WHATSAPP_SUPPORT = "https://wa.me/8801787881334";
const DRIVE_FOLDER =
  "https://drive.google.com/drive/folders/12fEKjDBRU5NgnpgE4WluoRMer94LIkaQ";

export const footer = {
  en: {
    tagline:
      "A free, structured path to take you from your first Pinyin sound all the way to HSK 6 — guided by teachers and a community that answers back.",
    ctaBadge: "Join the community",
    ctaTitle: "Start learning Chinese with us — today",
    ctaText:
      "Hop into our WhatsApp community. Lessons, practice groups, and moderators are all a tap away.",
    ctaButton: "Join on WhatsApp",
    columns: [
      {
        title: "Learn",
        links: [
          { label: "Academy Hub", href: "/academy" },
          { label: "Mandarin Courses", href: "/academy/courses" },
          { label: "HSK Vocabulary", href: "/hsk" },
          { label: "How it works", href: "/intro" },
        ],
      },
      {
        title: "Resources",
        links: [
          { label: "PDF Library", href: "/pdf" },
          { label: "Suggested Apps", href: "/apps" },
          { label: "Chinese Core Words", href: "/chinese-words", pro: true },
          { label: "Scholars Directory", href: "/academy/students" },
        ],
      },
      {
        title: "Community",
        links: [
          { label: "Community Hub", href: "/community" },
          { label: "Community rules", href: "/community" },
          { label: "WhatsApp Group", href: WHATSAPP_COMMUNITY, external: true },
          { label: "Lesson Drive", href: DRIVE_FOLDER, external: true },
        ],
      },
    ],
    connectTitle: "Connect",
    hours: "Support hours: 10:00 AM – 10:00 PM",
    rights: "All rights reserved.",
    madeWith: "Made with",
    forLearners: "for Chinese learners in Bangladesh",
    backToTop: "Back to top",
  },
  bn: {
    tagline:
      "প্রথম পিনইন উচ্চারণ থেকে HSK 6 পর্যন্ত — শিক্ষক ও সক্রিয় কমিউনিটির সহায়তায় একটি সম্পূর্ণ বিনামূল্যের গোছানো পথ।",
    ctaBadge: "কমিউনিটিতে যোগ দিন",
    ctaTitle: "আজই আমাদের সাথে চাইনিজ শেখা শুরু করুন",
    ctaText:
      "আমাদের WhatsApp কমিউনিটিতে যোগ দিন। ক্লাস, প্র্যাকটিস গ্রুপ ও মডারেটর — সবকিছু এক ট্যাপ দূরে।",
    ctaButton: "WhatsApp-এ যোগ দিন",
    columns: [
      {
        title: "শেখা",
        links: [
          { label: "একাডেমি হাব", href: "/academy" },
          { label: "ম্যান্ডারিন কোর্স", href: "/academy/courses" },
          { label: "HSK ভোকাবুলারি", href: "/hsk" },
          { label: "কীভাবে চলে", href: "/intro" },
        ],
      },
      {
        title: "রিসোর্স",
        links: [
          { label: "পিডিএফ লাইব্রেরি", href: "/pdf" },
          { label: "প্রস্তাবিত অ্যাপস", href: "/apps" },
          { label: "চাইনিজ কোর ওয়ার্ডস", href: "/chinese-words", pro: true },
          { label: "শিক্ষার্থী তালিকা", href: "/academy/students" },
        ],
      },
      {
        title: "কমিউনিটি",
        links: [
          { label: "কমিউনিটি হাব", href: "/community" },
          { label: "কমিউনিটির নিয়ম", href: "/community" },
          { label: "WhatsApp গ্রুপ", href: WHATSAPP_COMMUNITY, external: true },
          { label: "লেসন ড্রাইভ", href: DRIVE_FOLDER, external: true },
        ],
      },
    ],
    connectTitle: "যোগাযোগ",
    hours: "সাপোর্ট সময়: সকাল ১০টা – রাত ১০টা",
    rights: "সর্বস্বত্ব সংরক্ষিত।",
    madeWith: "ভালোবাসা দিয়ে তৈরি",
    forLearners: "বাংলাদেশের চাইনিজ শিক্ষার্থীদের জন্য",
    backToTop: "উপরে যান",
  },
};

const SOCIALS = [
  { icon: MessageCircle, href: WHATSAPP_SUPPORT, label: "WhatsApp" },
  { icon: FolderOpen, href: DRIVE_FOLDER, label: "Google Drive" },
  { icon: Phone, href: "tel:+8801787881334", label: "Phone" },
];

export default function Footer() {
  const { language } = useLanguage();
  const data = language === "bn" ? footer.bn : footer.en;
  const year = new Date().getFullYear();

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-text/10 bg-background">
      {/* ambient texture + glow, echoing the Voice / Hero sections */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-24 h-48 bg-linear-to-b from-primary/10 to-transparent blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 top-10 h-40 w-40 bg-[radial-gradient(hsl(var(--primary)/0.22)_1.5px,transparent_1.5px)] bg-size-[12px_12px] mask-[radial-gradient(closest-side,black,transparent)]"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* CTA band */}
        <div className="relative mt-12 overflow-hidden rounded-3xl border border-primary/15 bg-primary/5 p-6 md:p-9">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-linear-to-br from-primary/30 to-secondary/20 blur-2xl"
          />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                <Send className="h-3.5 w-3.5" aria-hidden="true" />
                {data.ctaBadge}
              </span>
              <h2 className="mt-3 text-2xl font-black leading-tight text-text md:text-3xl">
                {data.ctaTitle}
              </h2>
              <p className="mt-2 leading-7 text-text/70">{data.ctaText}</p>
            </div>

            <a
              href={WHATSAPP_COMMUNITY}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 font-bold text-background shadow-[0_12px_30px_-10px_hsl(var(--primary)/0.6)] transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              {data.ctaButton}
            </a>
          </div>
        </div>

        {/* main grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-14 md:grid-cols-12">
          {/* brand */}
          <div className="col-span-2 md:col-span-12 lg:col-span-3">
            <Link href="/" className="inline-flex items-center gap-2">
              <Image
                src="/assets/logo.png"
                alt="Learn Chinese with Kazi Robin"
                width={232}
                height={100}
                className="h-10 w-auto"
              />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-7 text-text/65">
              {data.tagline}
            </p>

            <div className="mt-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text/50">
                {data.connectTitle}
              </p>
              <div className="flex items-center gap-2.5">
                {SOCIALS.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      href.startsWith("http") ? "noopener noreferrer" : undefined
                    }
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-text/10 bg-text/3 text-text/70 transition hover:border-primary/40 hover:bg-primary/10 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* link columns */}
          {data.columns.map((col) => (
            <nav
              key={col.title}
              className="md:col-span-4 lg:col-span-3"
              aria-label={col.title}
            >
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-text/50">
                {col.title}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((link) => {
                  const isExternal = "external" in link && link.external;
                  const isPro = "pro" in link && link.pro;
                  const className =
                    "group inline-flex items-center gap-1.5 text-sm text-text/70 transition-colors hover:text-primary focus-visible:outline-none focus-visible:text-primary";
                  const inner = (
                    <>
                      <span className="relative">
                        {link.label}
                        <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-primary transition-all duration-200 group-hover:w-full" />
                      </span>
                      {isPro && (
                        <span className="rounded bg-secondary/15 px-1.5 py-0.5 text-[10px] font-bold text-secondary">
                          PRO
                        </span>
                      )}
                    </>
                  );

                  return (
                    <li key={link.label}>
                      {isExternal ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={className}
                        >
                          {inner}
                        </a>
                      ) : (
                        <Link href={link.href} className={className}>
                          {inner}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          ))}
        </div>

        {/* bottom bar */}
        <div className="flex flex-col items-center gap-4 border-t border-text/10 py-6 text-sm text-text/55 sm:flex-row sm:justify-between">
          <p className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-center">
            <span className="inline-flex items-center gap-1.5 font-semibold text-text/70">
              <GraduationCap className="h-4 w-4 text-primary" aria-hidden="true" />
              Learn Chinese with Kazi Robin
            </span>
            <span aria-hidden="true">·</span>
            <span>
              © {year} · {data.rights}
            </span>
          </p>

          <div className="flex items-center gap-4">
            <span className="hidden items-center gap-1 sm:inline-flex">
              {data.madeWith}
              <Heart
                className="h-3.5 w-3.5 fill-secondary text-secondary"
                aria-hidden="true"
              />
              {data.forLearners}
            </span>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 rounded-full border border-text/10 px-3 py-1.5 text-xs font-medium text-text/70 transition hover:border-primary/40 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
              {data.backToTop}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
