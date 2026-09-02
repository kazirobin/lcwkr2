import type { HTMLAttributes, ReactNode } from "react";

/* ── Eyebrow ─────────────────────────────────────────────
   [Hanzi chip] SMALL-CAPS LABEL · detail  — the house pattern
   from /intro. `seal` is a decorative Hanzi (aria-hidden). */
export function Eyebrow({
  seal,
  label,
  detail,
  className = "",
}: {
  seal?: string;
  label: string;
  detail?: ReactNode;
  className?: string;
}) {
  return (
    <p className={`flex items-center gap-2.5 ${className}`}>
      {seal && (
        <span
          aria-hidden="true"
          lang="zh"
          className="flex size-7 items-center justify-center rounded-md bg-text text-[11px] font-bold text-background"
        >
          {seal}
        </span>
      )}
      <span className="text-xs font-semibold uppercase tracking-[0.15em] text-text/60">
        {label}
      </span>
      {detail && (
        <>
          <span aria-hidden="true" className="text-text/25">·</span>
          <span className="text-xs tracking-wide text-text/55 tabular-nums">{detail}</span>
        </>
      )}
    </p>
  );
}

/* ── Section watermark ───────────────────────────────────
   One oversized Hanzi behind a section. Desktop only, purely
   decorative. Parent must be `relative` / `isolate`. */
export function SectionHanzi({
  char,
  className = "",
}: {
  char: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      lang="zh"
      className={`pointer-events-none absolute -z-10 hidden select-none text-[16rem] leading-none font-bold text-text/[0.04] lg:block ${className}`}
    >
      {char}
    </span>
  );
}

/* ── Page header ─────────────────────────────────────────
   h1 + optional lede + right-aligned actions slot. */
export function PageHeader({
  eyebrow,
  title,
  lede,
  actions,
  className = "",
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between ${className}`}>
      <div className="max-w-2xl">
        {eyebrow}
        <h1 className="mt-3 text-[2rem] font-bold leading-[1.12] tracking-tight text-text sm:text-4xl text-balance">
          {title}
        </h1>
        {lede && (
          <p className="mt-3 max-w-[52ch] text-[15px] leading-[1.75] text-text/70">{lede}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

/* ── Card ────────────────────────────────────────────────
   One radius, one border, one system. */
export function Card({
  interactive = false,
  className = "",
  children,
  ...rest
}: {
  interactive?: boolean;
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-text/10 bg-card ${
        interactive ? "transition-colors hover:border-text/25" : ""
      } ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

/* ── Progress ────────────────────────────────────────────
   Real <progress> semantics via ARIA; ink fill, not gradient. */
export function ProgressBar({
  value,
  max = 100,
  label,
}: {
  value: number;
  max?: number;
  label: string;
}) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
      className="h-1.5 w-full overflow-hidden rounded-full bg-text/10"
    >
      <div
        className="h-full rounded-full bg-text transition-[width] duration-500 motion-reduce:transition-none"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/* ── Skeleton + loading block ───────────────────────────── */
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`block animate-pulse rounded-md bg-text/10 motion-reduce:animate-none ${className}`}
    />
  );
}

export function LoadingBlock({ label, rows = 3 }: { label: string; rows?: number }) {
  return (
    <div role="status" aria-live="polite" className="space-y-3">
      <span className="sr-only">{label}</span>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-text/10 bg-card p-5">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="mt-3 h-3 w-2/3" />
          <Skeleton className="mt-4 h-2 w-full" />
        </div>
      ))}
    </div>
  );
}

/* ── Empty state ────────────────────────────────────────── */
export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-text/15 bg-text/2 px-6 py-14 text-center">
      {icon && <div className="text-text/40">{icon}</div>}
      <p className="text-[15px] font-semibold text-text">{title}</p>
      {description && (
        <p className="max-w-sm text-sm leading-relaxed text-text/60">{description}</p>
      )}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
