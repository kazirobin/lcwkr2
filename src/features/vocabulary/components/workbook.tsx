// src/features/vocabulary/components/workbook.tsx
//
// The shared "workbook" surface for the HSK vocabulary routes — the warm,
// printed-textbook register the whole /hsk tree is built in. Paper ground,
// a reading serif for structure and lesson numbers, the course's real
// numbering as the spine, one restrained accent. Deliberately its own
// thing — not the /apps · /pdf console.

import Link from "next/link";

/** Full-bleed warm page ground; every /hsk view is wrapped in one. */
export function PaperPage({
  isBn,
  children,
}: {
  isBn: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`hsk-page min-h-screen bg-[#f7f2e8] leading-relaxed text-text in-[.dark]:bg-[#17130f] ${
        isBn ? "font-bn" : "font-en"
      }`}
    >
      {children}
    </div>
  );
}

/** Small warm breadcrumb. `trail` is [label, href] pairs; last item is current. */
export function Breadcrumb({
  label,
  trail,
}: {
  label: string;
  trail: { name: string; href?: string }[];
}) {
  return (
    <nav
      aria-label={label}
      className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-text/50"
    >
      {trail.map((crumb, i) => {
        const last = i === trail.length - 1;
        return (
          <span key={i} className="flex items-center gap-x-2">
            {crumb.href && !last ? (
              <Link
                href={crumb.href}
                className="rounded-sm underline decoration-text/20 underline-offset-4 transition-colors hover:text-text hover:decoration-text/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
              >
                {crumb.name}
              </Link>
            ) : (
              <span aria-current={last ? "page" : undefined} className="text-text/70">
                {crumb.name}
              </span>
            )}
            {!last && (
              <span aria-hidden="true" className="text-text/30">
                ›
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}

/** The page opening: eyebrow, serif title (one word may be accented), a line. */
export function PaperHeader({
  seal,
  eyebrow,
  title,
  accent,
  intro,
  aside,
}: {
  seal?: string;
  eyebrow: string;
  title: string;
  accent?: string;
  intro?: string;
  aside?: React.ReactNode;
}) {
  return (
    <header className="mx-auto max-w-3xl px-5 pt-28 sm:px-6 md:pt-32">
      <div className="flex items-center gap-2.5">
        {seal && (
          <span
            lang="zh"
            aria-hidden="true"
            className="flex size-7 items-center justify-center rounded-md bg-secondary text-[13px] font-bold text-white"
          >
            {seal}
          </span>
        )}
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-text/55">
          {eyebrow}
        </span>
      </div>

      <h1 className="mt-5 font-serif text-[2.4rem] font-medium leading-[1.1] tracking-[-0.01em] text-balance sm:text-[3rem]">
        {title}
        {accent && <span className="text-secondary"> {accent}</span>}
      </h1>

      {intro && (
        <p className="mt-4 max-w-[54ch] text-[15px] leading-7 text-text/70">
          {intro}
        </p>
      )}

      {aside && <div className="mt-6">{aside}</div>}
    </header>
  );
}

/** Inline "at a glance" figures — never a spec sheet, just a warm caption row. */
export function Glance({ items }: { items: [string, string][] }) {
  return (
    <dl className="flex flex-wrap gap-x-7 gap-y-2 border-t border-text/12 pt-4 text-sm">
      {items.map(([k, v]) => (
        <div key={k} className="flex items-baseline gap-1.5">
          <dt className="text-text/50">{k}</dt>
          <dd className="font-serif font-medium tabular-nums text-text">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * The numbered sequence itself — a faint vertical spine runs behind the
 * index column so the lessons/texts read as a path, not a loose list.
 */
export function NumberedList({ children }: { children: React.ReactNode }) {
  return (
    <ol className="relative mt-5 border-t border-text/12 before:absolute before:top-0 before:bottom-0 before:left-[0.7rem] before:w-px before:bg-text/12 before:content-['']">
      {children}
    </ol>
  );
}

/**
 * One row in a numbered sequence — the course's own numbering is the spine.
 * A serif index sits in a fixed left rail so the eye runs straight down it.
 */
export function NumberedRow({
  href,
  index,
  title,
  hanzi,
  meta,
  cta,
  disabled = false,
  disabledLabel,
  ariaLabel,
}: {
  href: string;
  index: string;
  title: string;
  hanzi?: string;
  meta?: string;
  cta: string;
  disabled?: boolean;
  disabledLabel?: string;
  ariaLabel?: string;
}) {
  const body = (
    <>
      <span
        aria-hidden="true"
        className={`relative z-10 w-9 shrink-0 bg-[#f7f2e8] py-0.5 font-serif text-[1.35rem] leading-none tabular-nums in-[.dark]:bg-[#17130f] ${
          disabled
            ? "text-text/30"
            : "text-text/45 transition-colors group-hover:text-primary"
        }`}
      >
        {index}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
          <span
            className={`font-serif text-lg font-medium ${
              disabled ? "text-text/40" : "text-text"
            }`}
          >
            {title}
          </span>
          {hanzi && (
            <span lang="zh" className="text-[15px] text-text/45">
              {hanzi}
            </span>
          )}
        </span>
        {meta && (
          <span
            className={`mt-1 block text-[13px] ${
              disabled ? "text-text/40" : "text-text/55"
            }`}
          >
            {meta}
          </span>
        )}
      </span>

      <span
        className={`shrink-0 self-center text-[13px] font-medium ${
          disabled
            ? "text-text/40"
            : "text-text/55 transition-colors group-hover:text-text"
        }`}
      >
        {disabled ? disabledLabel : cta}
        {!disabled && (
          <span
            aria-hidden="true"
            className="ml-1.5 inline-block transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
          >
            →
          </span>
        )}
      </span>
    </>
  );

  if (disabled) {
    return (
      <li className="flex gap-4 border-b border-text/10 py-5">{body}</li>
    );
  }

  return (
    <li>
      <Link
        href={href}
        aria-label={ariaLabel}
        className="group flex gap-4 border-b border-text/10 py-5 transition-colors hover:bg-text/[0.025] focus-visible:bg-text/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-text"
      >
        {body}
      </Link>
    </li>
  );
}
