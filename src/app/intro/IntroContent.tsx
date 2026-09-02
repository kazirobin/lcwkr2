'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/i18n';

/**
 * The `/intro` route — "Start here". A problem → answer read for a Bangla-speaking
 * beginner deciding whether this is for them: where self-teaching stalls, how the
 * class is set up to answer each part, and what it takes to join.
 *
 * Built in the home's sumi-e register — rice-paper ground, a single oversized
 * Hanzi per section, the `[Hanzi chip] SMALL-CAPS · detail` eyebrow, numbered
 * paths and hairline-separated lists rather than card grids, and the shared
 * `.reveal-group` entrance choreography (no-JS and reduced-motion safe).
 */

/* One orchestrated entrance per section, played once on scroll-in. Mirrors
   components/home/Founder.tsx so the motion language stays consistent. */
function useReveal<T extends HTMLElement>() {
    const ref = useRef<T>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        el.classList.add('reveal-armed');

        const reduced = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        ).matches;
        if (reduced || !('IntersectionObserver' in window)) {
            el.classList.add('is-in');
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) {
                    el.classList.add('is-in');
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

function Eyebrow({
    seal,
    label,
    detail,
}: {
    seal: string;
    label: string;
    detail?: string;
}) {
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
            {detail ? (
                <>
                    <span className="text-text/25" aria-hidden="true">
                        ·
                    </span>
                    <span className="text-xs tracking-wide text-text/55">
                        {detail}
                    </span>
                </>
            ) : null}
        </div>
    );
}

const CTA_PRIMARY =
    'group inline-flex items-center justify-center gap-2 rounded-xl bg-text px-5 py-3.5 text-[15px] font-semibold text-background transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:transform-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text';
const CTA_SECONDARY =
    'inline-flex items-center justify-center gap-2 rounded-xl border border-text/15 bg-background px-5 py-3.5 text-[15px] font-medium text-text transition-colors hover:border-text/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text';

export default function IntroContent() {
    const { t, language } = useLanguage();
    const c = t.intro;

    const heroRef = useRef<HTMLElement>(null);
    const problemRef = useReveal<HTMLDivElement>();
    const answerRef = useReveal<HTMLDivElement>();
    const needRef = useReveal<HTMLDivElement>();

    /* Gentle pointer parallax on the ink-wash layer — identical to the home hero. */
    useEffect(() => {
        const el = heroRef.current;
        if (!el) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
            return;

        const onMove = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            el.style.setProperty(
                '--px',
                ((e.clientX - r.left) / r.width - 0.5).toFixed(3),
            );
            el.style.setProperty(
                '--py',
                ((e.clientY - r.top) / r.height - 0.5).toFixed(3),
            );
        };
        el.addEventListener('pointermove', onMove);
        return () => el.removeEventListener('pointermove', onMove);
    }, []);

    const isExternal = (href: string) => href.startsWith('http');

    return (
        <div
            className={`bg-background text-text ${language === 'bn' ? 'font-bn' : 'font-en'}`}
        >
            {/* ============================ HERO ============================ */}
            <section
                ref={heroRef}
                aria-labelledby="intro-title"
                className="relative isolate -mt-16 overflow-hidden bg-[#f8f3ea] in-[.dark]:bg-background sm:-mt-20"
                style={{ '--px': '0', '--py': '0' } as React.CSSProperties}
            >
                {/* ink-wash landscape, blended into the theme ground */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                >
                    <div className="absolute inset-0 bg-[#f8f3ea] in-[.dark]:hidden" />
                    <Image
                        src="/assets/ink-landscape.jpg"
                        alt=""
                        width={1672}
                        height={941}
                        priority
                        sizes="100vw"
                        className="absolute inset-x-0 top-0 w-full [mask-image:linear-gradient(to_bottom,black_45%,transparent_90%)] in-[.dark]:opacity-20"
                        style={{
                            transform:
                                'translate3d(calc(var(--px) * -10px), calc(var(--py) * -6px), 0)',
                        }}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,#f8f3ea_0%,rgba(248,243,234,0.78)_28%,rgba(248,243,234,0.15)_60%,transparent_78%)] in-[.dark]:hidden" />
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(0deg,#f8f3ea,transparent)] in-[.dark]:hidden" />
                    <div className="absolute inset-x-0 bottom-0 hidden h-1/3 bg-[linear-gradient(0deg,var(--color-background),transparent)] in-[.dark]:block" />
                </div>

                <span
                    aria-hidden="true"
                    lang="zh"
                    className="pointer-events-none absolute -top-10 right-[6%] hidden select-none text-[24rem] leading-none font-bold text-text/[0.04] lg:block"
                    style={{
                        transform:
                            'translate3d(calc(var(--px) * -14px), calc(var(--py) * -12px), 0)',
                    }}
                >
                    {c.hero.seal}
                </span>

                <div className="relative z-10 mx-auto max-w-6xl px-3 pt-28 pb-16 sm:px-6 md:pt-32 md:pb-24 lg:px-8">
                    <div className="max-w-2xl">
                        <Eyebrow
                            seal={c.hero.seal}
                            label={c.hero.eyebrow}
                            detail={c.hero.detail}
                        />

                        <h1
                            id="intro-title"
                            className="mt-7 text-[2.5rem] leading-[1.12] font-bold tracking-tight sm:text-5xl lg:text-[3.75rem]"
                        >
                            <span className="block">{c.hero.titleLead}</span>
                            <span className="mt-1 block text-secondary">
                                {c.hero.titleAccent}
                            </span>
                        </h1>

                        <p className="mt-6 max-w-[52ch] text-base leading-[1.8] text-text/70 sm:text-lg">
                            {c.hero.lede}
                        </p>

                        <div className="mt-9 flex flex-wrap items-center gap-4">
                            <Link
                                href={c.hero.ctaPrimary.href}
                                className={CTA_PRIMARY}
                            >
                                {c.hero.ctaPrimary.label}
                                <ArrowRight
                                    className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none"
                                    aria-hidden="true"
                                />
                            </Link>

                            <a
                                href={c.hero.ctaSecondary.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={CTA_SECONDARY}
                            >
                                {c.hero.ctaSecondary.label}
                                <ArrowUpRight
                                    className="size-4"
                                    aria-hidden="true"
                                />
                            </a>

                            <Link
                                href={c.hero.ctaText.href}
                                className="inline-flex items-center gap-1.5 text-[15px] text-text/65 underline decoration-text/25 underline-offset-[6px] transition-colors hover:text-text hover:decoration-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-text"
                            >
                                {c.hero.ctaText.label}
                                <ArrowRight
                                    className="size-4"
                                    aria-hidden="true"
                                />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================== PROBLEM ========================== */}
            <section
                aria-labelledby="intro-problem-title"
                className="scroll-mt-24 border-t border-text/10 bg-background py-16 md:py-24"
            >
                <div
                    ref={problemRef}
                    className="reveal-group mx-auto max-w-6xl px-6"
                >
                    <div className="max-w-2xl">
                        <div data-reveal>
                            <Eyebrow
                                seal={c.problem.seal}
                                label={c.problem.eyebrow}
                            />
                        </div>
                        <h2
                            id="intro-problem-title"
                            data-reveal
                            style={{ '--r': 1 } as React.CSSProperties}
                            className="mt-4 text-3xl font-bold tracking-tight text-text sm:text-4xl"
                        >
                            {c.problem.title}
                        </h2>
                        <p
                            data-reveal
                            style={{ '--r': 2 } as React.CSSProperties}
                            className="mt-3 text-[15px] leading-7 text-text/70"
                        >
                            {c.problem.description}
                        </p>
                    </div>

                    <ol
                        data-reveal
                        style={{ '--r': 3 } as React.CSSProperties}
                        className="relative mt-10 max-w-3xl"
                    >
                        <span
                            aria-hidden="true"
                            className="absolute left-5 top-5 bottom-5 w-px bg-text/15"
                        />
                        {c.problem.items.map((item, i) => (
                            <li
                                key={item.title}
                                className="relative flex gap-5 pb-8 last:pb-0"
                            >
                                <span className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border border-text/20 bg-background text-xs font-semibold tabular-nums text-text/70">
                                    {language === 'bn'
                                        ? ['১', '২', '৩', '৪', '৫'][i]
                                        : String(i + 1).padStart(2, '0')}
                                </span>
                                <div className="pt-1.5">
                                    <h3 className="text-[15px] font-semibold text-text">
                                        {item.title}
                                    </h3>
                                    <p className="mt-1 max-w-xl text-sm leading-6 text-text/65">
                                        {item.body}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            {/* ========================== ANSWER ========================== */}
            <section
                aria-labelledby="intro-answer-title"
                className="scroll-mt-24 border-t border-text/10 bg-background py-16 md:py-24"
            >
                <div
                    ref={answerRef}
                    className="reveal-group mx-auto max-w-6xl px-6"
                >
                    <div className="max-w-2xl">
                        <div data-reveal>
                            <Eyebrow
                                seal={c.answer.seal}
                                label={c.answer.eyebrow}
                            />
                        </div>
                        <h2
                            id="intro-answer-title"
                            data-reveal
                            style={{ '--r': 1 } as React.CSSProperties}
                            className="mt-4 text-3xl font-bold tracking-tight text-text sm:text-4xl"
                        >
                            {c.answer.title}
                        </h2>
                        <p
                            data-reveal
                            style={{ '--r': 2 } as React.CSSProperties}
                            className="mt-3 text-[15px] leading-7 text-text/70"
                        >
                            {c.answer.description}
                        </p>
                    </div>

                    <ul
                        data-reveal
                        style={{ '--r': 3 } as React.CSSProperties}
                        className="mt-10 max-w-3xl border-t border-text/10"
                    >
                        {c.answer.items.map((item) => (
                            <li
                                key={item.title}
                                className="flex gap-5 border-b border-text/10 py-6"
                            >
                                <span
                                    lang="zh"
                                    aria-hidden="true"
                                    className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-text/15 text-sm font-semibold text-text/70"
                                >
                                    {item.seal}
                                </span>
                                <div>
                                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                                        <h3 className="text-[15px] font-semibold text-text">
                                            {item.title}
                                        </h3>
                                        <span className="text-[11px] font-medium uppercase tracking-wide text-text/45">
                                            {c.answer.solvesLabel} {item.solves}
                                        </span>
                                    </div>
                                    <p className="mt-1.5 max-w-xl text-sm leading-6 text-text/65">
                                        {item.body}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <p
                        data-reveal
                        style={{ '--r': 4 } as React.CSSProperties}
                        className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-text/70"
                    >
                        <span>{c.answer.linkLead}</span>
                        <Link
                            href={c.answer.pinyinLink.href}
                            className="inline-flex items-center gap-1.5 font-medium text-text underline decoration-text/25 underline-offset-4 transition-colors hover:decoration-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-text"
                        >
                            {c.answer.pinyinLink.label}
                            <ArrowRight
                                className="size-3.5"
                                aria-hidden="true"
                            />
                        </Link>
                        <Link
                            href={c.answer.routineLink.href}
                            className="inline-flex items-center gap-1.5 font-medium text-text underline decoration-text/25 underline-offset-4 transition-colors hover:decoration-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-text"
                        >
                            {c.answer.routineLink.label}
                            <ArrowRight
                                className="size-3.5"
                                aria-hidden="true"
                            />
                        </Link>
                    </p>
                </div>
            </section>

            {/* =========================== NEED =========================== */}
            <section
                aria-labelledby="intro-need-title"
                className="scroll-mt-24 border-t border-text/10 bg-background py-16 md:py-24"
            >
                <div
                    ref={needRef}
                    className="reveal-group mx-auto max-w-6xl px-6"
                >
                    <div className="max-w-2xl">
                        <div data-reveal>
                            <Eyebrow
                                seal={c.need.seal}
                                label={c.need.eyebrow}
                            />
                        </div>
                        <h2
                            id="intro-need-title"
                            data-reveal
                            style={{ '--r': 1 } as React.CSSProperties}
                            className="mt-4 text-3xl font-bold tracking-tight text-text sm:text-4xl"
                        >
                            {c.need.title}
                        </h2>
                    </div>

                    <ul
                        data-reveal
                        style={{ '--r': 2 } as React.CSSProperties}
                        className="mt-9 grid gap-x-10 gap-y-8 sm:grid-cols-3"
                    >
                        {c.need.items.map((item, i) => (
                            <li
                                key={item.title}
                                className="border-t border-text/15 pt-4"
                            >
                                <span className="text-xs font-semibold tabular-nums text-text/40">
                                    {language === 'bn'
                                        ? ['০১', '০২', '০৩'][i]
                                        : String(i + 1).padStart(2, '0')}
                                </span>
                                <h3 className="mt-2 text-[15px] font-semibold text-text">
                                    {item.title}
                                </h3>
                                <p className="mt-1.5 text-sm leading-6 text-text/65">
                                    {item.body}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </div>
    );
}
