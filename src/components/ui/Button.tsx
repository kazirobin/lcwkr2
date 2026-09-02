import Link from "next/link";
import { Loader2 } from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold whitespace-nowrap transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none motion-reduce:transform-none";

const sizes: Record<Size, string> = {
  sm: "px-3.5 py-2 text-[13px]",
  md: "px-5 py-3.5 text-[15px]",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-text text-background hover:-translate-y-0.5 hover:shadow-lg hover:shadow-text/15 focus-visible:outline-text",
  secondary:
    "border border-text/15 bg-card text-text hover:border-text/40 focus-visible:outline-text",
  ghost:
    "text-text/70 hover:text-text hover:bg-text/5 focus-visible:outline-text",
  danger:
    "border border-danger/30 bg-danger-surface text-danger hover:border-danger/50 focus-visible:outline-danger",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  iconLeft,
  iconRight,
  className = "",
  children,
  disabled,
  ...rest
}: CommonProps & ComponentPropsWithoutRef<"button">) {
  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : iconLeft}
      {children}
      {!loading && iconRight}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  iconLeft,
  iconRight,
  className = "",
  children,
  href,
  ...rest
}: CommonProps & ComponentPropsWithoutRef<typeof Link>) {
  return (
    <Link
      href={href}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </Link>
  );
}

/** Icon-only button. `label` is required and becomes the accessible name. */
export function IconButton({
  label,
  className = "",
  size = "md",
  spinning = false,
  children,
  ...rest
}: {
  label: string;
  size?: Size;
  spinning?: boolean;
  className?: string;
  children: ReactNode;
} & ComponentPropsWithoutRef<"button">) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center rounded-lg border border-text/10 bg-card text-text/70 transition-colors hover:bg-text/5 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text disabled:opacity-50 ${
        size === "sm" ? "h-9 w-9" : "h-11 w-11"
      } ${className}`}
      {...rest}
    >
      <span className={spinning ? "animate-spin motion-reduce:animate-none" : ""}>
        {children}
      </span>
    </button>
  );
}
