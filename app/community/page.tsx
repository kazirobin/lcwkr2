"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Clock, MessageCircle } from "lucide-react";

import { useLanguage } from "../../context/LanguageContext";
import {
  communityMembers,
  getCommunityStats,
  type CommunityMember,
} from "@/data/communityData";
import CommunityRules from "@/components/CommunityRules";

/**
 * The `/community` route — who runs the community and how to reach them.
 *
 * Built in the home / `/intro` sumi-e register: rice-paper hero, one oversized
 * Hanzi per section, the `[seal] SMALL-CAPS · detail` eyebrow, hairline-
 * separated rosters rather than card grids, and the shared `.reveal-group`
 * entrance choreography (no-JS and reduced-motion safe). Guidelines live in
 * `<CommunityRules />` below.
 */

// ── i18n ────────────────────────────────────────────────────────────
const T = {
  en: {
    eyebrow: "The people behind it",
    titleLead: "The people behind",
    titleAccent: "the community",
    lede: "Founders, managers and teachers keeping the classes, the level track and the groups running — six days a week, for free.",
    tally: {
      founder: "Founder",
      coAdmins: "Co-admins",
      managers: "Managers",
      teachers: "Teachers",
    },
    leadership: {
      eyebrow: "Leadership",
      title: "Who keeps it running",
    },
    management: {
      eyebrow: "Management",
      title: "Management team",
      note: "Behind the scenes, keeping every group organised.",
    },
    teachers: {
      eyebrow: "Teachers",
      title: "Who teaches",
      note: "Experienced mentors who guide each live class.",
    },
    roles: {
      founder: "Founder & lead admin",
      "co-admin": "Co-admin",
      manager: "Manager",
      teacher: "Teacher",
    },
    manages: "Manages",
    whatsapp: "WhatsApp",
  },
  bn: {
    eyebrow: "যাঁরা এটি চালান",
    titleLead: "কমিউনিটির পেছনে",
    titleAccent: "যাঁরা আছেন",
    lede: "প্রতিষ্ঠাতা, ম্যানেজার আর শিক্ষক — ক্লাস, লেভেল ট্র্যাক আর গ্রুপগুলো সচল রাখেন। সপ্তাহে ছয় দিন, বিনামূল্যে।",
    tally: {
      founder: "প্রতিষ্ঠাতা",
      coAdmins: "সহ-অ্যাডমিন",
      managers: "ম্যানেজার",
      teachers: "শিক্ষক",
    },
    leadership: {
      eyebrow: "নেতৃত্ব",
      title: "যাঁরা এটি চালান",
    },
    management: {
      eyebrow: "ম্যানেজমেন্ট",
      title: "ম্যানেজমেন্ট টিম",
      note: "পর্দার আড়ালে প্রতিটি গ্রুপ গুছিয়ে রাখেন।",
    },
    teachers: {
      eyebrow: "শিক্ষক",
      title: "যাঁরা পড়ান",
      note: "প্রতিটি লাইভ ক্লাসে পথ দেখান অভিজ্ঞ মেন্টররা।",
    },
    roles: {
      founder: "প্রতিষ্ঠাতা ও প্রধান অ্যাডমিন",
      "co-admin": "সহকারী অ্যাডমিন",
      manager: "ম্যানেজার",
      teacher: "শিক্ষক",
    },
    manages: "সামলান",
    whatsapp: "হোয়াটসঅ্যাপ",
  },
} as const;

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
const toBn = (n: number) =>
  String(n).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);

const formatWhatsApp = (number: string) =>
  number.startsWith("880")
    ? `+${number.slice(0, 4)} ${number.slice(4, 8)}-${number.slice(8)}`
    : number;

// ── one orchestrated entrance per section (mirrors IntroContent) ─────
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.classList.add("reveal-armed");

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
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
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

function Eyebrow({ seal, label }: { seal: string; label: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
      <span
        lang="zh"
        aria-hidden="true"
        className="flex size-7 items-center justify-center rounded-md bg-text text-[11px] font-bold text-background"
      >
        {seal}
      </span>
      <span className="text-xs font-semibold uppercase tracking-[0.15em] text-text/60">
        {label}
      </span>
    </div>
  );
}

// ── person roster row ───────────────────────────────────────────────
function PersonRow({
  member,
  roleLabel,
  manageLabel,
  whatsappLabel,
}: {
  member: CommunityMember;
  roleLabel: string;
  manageLabel: string;
  whatsappLabel: string;
}) {
  const { name, image, whatsapp, job, subject, group, schedule } = member;
  const detail = subject
    ? [subject, group].filter(Boolean).join(" · ")
    : `${manageLabel}: ${job}`;

  return (
    <li className="flex flex-col gap-4 border-b border-text/10 py-6 sm:flex-row sm:items-center sm:gap-6">
      <Image
        src={image}
        alt=""
        width={56}
        height={56}
        className="size-14 shrink-0 rounded-full border border-text/15 object-cover"
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-[15px] font-semibold text-text">{name}</h3>
          <span className="text-[11px] font-medium uppercase tracking-wide text-text/45">
            {roleLabel}
          </span>
        </div>
        <p className="mt-1 text-sm leading-6 text-text/65">{detail}</p>
        {schedule && (
          <p className="mt-1 flex items-center gap-1.5 text-xs text-text/50">
            <Clock className="size-3" aria-hidden="true" />
            {schedule}
          </p>
        )}
      </div>

      <a
        href={`https://wa.me/${whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl border border-text/15 bg-background px-4 py-2 text-sm font-medium text-text transition-colors hover:border-text/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text sm:self-center"
      >
        <MessageCircle className="size-4 text-text/50" aria-hidden="true" />
        <span>{whatsappLabel}</span>
        <span className="tabular-nums text-text/45">
          {formatWhatsApp(whatsapp)}
        </span>
      </a>
    </li>
  );
}

function PeopleSection({
  seal,
  eyebrow,
  title,
  note,
  members,
  roleFor,
  manageLabel,
  whatsappLabel,
}: {
  seal: string;
  eyebrow: string;
  title: string;
  note?: string;
  members: CommunityMember[];
  roleFor: (m: CommunityMember) => string;
  manageLabel: string;
  whatsappLabel: string;
}) {
  const ref = useReveal<HTMLDivElement>();
  if (members.length === 0) return null;

  return (
    <section className="scroll-mt-24 border-t border-text/10 bg-background py-16 md:py-24">
      <div ref={ref} className="reveal-group mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <div data-reveal>
            <Eyebrow seal={seal} label={eyebrow} />
          </div>
          <h2
            data-reveal
            style={{ "--r": 1 } as React.CSSProperties}
            className="mt-4 text-3xl font-bold tracking-tight text-text sm:text-4xl"
          >
            {title}
          </h2>
          {note && (
            <p
              data-reveal
              style={{ "--r": 2 } as React.CSSProperties}
              className="mt-3 text-[15px] leading-7 text-text/70"
            >
              {note}
            </p>
          )}
        </div>

        <ul
          data-reveal
          style={{ "--r": 3 } as React.CSSProperties}
          className="mt-10 max-w-3xl border-t border-text/10"
        >
          {members.map((member) => (
            <PersonRow
              key={member.id}
              member={member}
              roleLabel={roleFor(member)}
              manageLabel={manageLabel}
              whatsappLabel={whatsappLabel}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function CommunityPage() {
  const { language } = useLanguage();
  const isBn = language === "bn";
  const c = isBn ? T.bn : T.en;
  const stats = getCommunityStats();
  const num = (n: number) => (isBn ? toBn(n) : String(n));

  const founders = communityMembers.filter((m) => m.role === "founder");
  const coAdmins = communityMembers.filter((m) => m.role === "co-admin");
  const managers = communityMembers.filter((m) => m.role === "manager");
  const teachers = communityMembers.filter((m) => m.role === "teacher");

  const roleFor = (m: CommunityMember) => c.roles[m.role] ?? m.role;

  const tally = [
    { label: c.tally.founder, value: stats.founder },
    { label: c.tally.coAdmins, value: stats.coAdmins },
    { label: c.tally.managers, value: stats.managers },
    { label: c.tally.teachers, value: stats.teachers },
  ];

  return (
    <div className={`bg-background text-text ${isBn ? "font-bn" : "font-en"}`}>
      {/* ============================ HERO ============================ */}
      <section className="relative isolate -mt-16 overflow-hidden bg-[#f8f3ea] in-[.dark]:bg-background sm:-mt-20">
        <span
          aria-hidden="true"
          lang="zh"
          className="pointer-events-none absolute -top-16 right-[4%] hidden select-none text-[22rem] leading-none font-bold text-text/[0.04] lg:block"
        >
          众
        </span>

        <div className="relative z-10 mx-auto max-w-6xl px-3 pt-28 pb-16 sm:px-6 md:pt-32 md:pb-20 lg:px-8">
          <div className="max-w-2xl">
            <Eyebrow seal="众" label={c.eyebrow} />

            <h1 className="mt-7 text-[2.5rem] leading-[1.12] font-bold tracking-tight sm:text-5xl lg:text-[3.5rem]">
              <span className="block">{c.titleLead}</span>
              <span className="mt-1 block text-secondary">{c.titleAccent}</span>
            </h1>

            <p className="mt-6 max-w-[52ch] text-base leading-[1.8] text-text/70 sm:text-lg">
              {c.lede}
            </p>

            <dl className="mt-9 flex max-w-lg flex-wrap gap-x-10 gap-y-4 border-t border-text/10 pt-6">
              {tally.map((item) => (
                <div key={item.label} className="flex flex-col">
                  <dt className="text-xs uppercase tracking-[0.12em] text-text/50">
                    {item.label}
                  </dt>
                  <dd className="mt-1 text-2xl font-bold tabular-nums text-text">
                    {num(item.value)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <PeopleSection
        seal="领"
        eyebrow={c.leadership.eyebrow}
        title={c.leadership.title}
        members={[...founders, ...coAdmins]}
        roleFor={roleFor}
        manageLabel={c.manages}
        whatsappLabel={c.whatsapp}
      />

      <PeopleSection
        seal="理"
        eyebrow={c.management.eyebrow}
        title={c.management.title}
        note={c.management.note}
        members={managers}
        roleFor={roleFor}
        manageLabel={c.manages}
        whatsappLabel={c.whatsapp}
      />

      <PeopleSection
        seal="师"
        eyebrow={c.teachers.eyebrow}
        title={c.teachers.title}
        note={c.teachers.note}
        members={teachers}
        roleFor={roleFor}
        manageLabel={c.manages}
        whatsappLabel={c.whatsapp}
      />

      <CommunityRules />
    </div>
  );
}
