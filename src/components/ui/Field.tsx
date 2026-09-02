"use client";

import { useId } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

const control =
  "w-full rounded-xl border border-text/15 bg-card px-3.5 py-3 text-sm text-text transition-colors placeholder:text-text/40 focus:border-text/40 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text disabled:opacity-60 aria-invalid:border-danger";

function Shell({
  id,
  label,
  hint,
  error,
  required,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-semibold text-text">
        {label}
        {required && (
          <span className="ml-1 text-danger" aria-hidden="true">
            *
          </span>
        )}
        {required && <span className="sr-only"> (required)</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="text-xs text-text/55">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={`${id}-error`} className="text-xs font-medium text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function describedBy(id: string, hint?: string, error?: string) {
  return [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
}

type FieldProps = {
  label: string;
  hint?: string;
  error?: string;
};

export function Field({
  label,
  hint,
  error,
  required,
  className = "",
  ...rest
}: FieldProps & ComponentPropsWithoutRef<"input">) {
  const id = useId();
  return (
    <Shell id={id} label={label} hint={hint} error={error} required={required}>
      <input
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={`${control} ${className}`}
        {...rest}
      />
    </Shell>
  );
}

export function TextArea({
  label,
  hint,
  error,
  required,
  className = "",
  ...rest
}: FieldProps & ComponentPropsWithoutRef<"textarea">) {
  const id = useId();
  return (
    <Shell id={id} label={label} hint={hint} error={error} required={required}>
      <textarea
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={`${control} min-h-24 resize-y ${className}`}
        {...rest}
      />
    </Shell>
  );
}

export function SelectField({
  label,
  hint,
  error,
  required,
  className = "",
  children,
  ...rest
}: FieldProps & ComponentPropsWithoutRef<"select">) {
  const id = useId();
  return (
    <Shell id={id} label={label} hint={hint} error={error} required={required}>
      <select
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={`${control} cursor-pointer ${className}`}
        {...rest}
      >
        {children}
      </select>
    </Shell>
  );
}

/* Standalone labelled select for toolbars (label can be visually hidden). */
export function InlineSelect({
  label,
  hideLabel = false,
  className = "",
  children,
  ...rest
}: { label: string; hideLabel?: boolean } & ComponentPropsWithoutRef<"select">) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className={hideLabel ? "sr-only" : "text-[11px] font-semibold uppercase tracking-wide text-text/50"}
      >
        {label}
      </label>
      <select
        id={id}
        className={`rounded-lg border border-text/15 bg-card px-3 py-2 text-sm text-text focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text ${className}`}
        {...rest}
      >
        {children}
      </select>
    </div>
  );
}
