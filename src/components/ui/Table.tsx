import type { ReactNode } from "react";

/**
 * Horizontally-scrollable table frame. Replaces the `overflow-hidden` +
 * `min-w-[600px]` pattern that clipped admin tables on mobile — this one
 * actually scrolls, and is keyboard-focusable so it scrolls without a mouse.
 */
export function TableFrame({
  caption,
  head,
  children,
  minWidth = "40rem",
}: {
  caption: string;
  head: ReactNode;
  children: ReactNode;
  minWidth?: string;
}) {
  return (
    <div
      tabIndex={0}
      role="region"
      aria-label={caption}
      className="overflow-x-auto rounded-2xl border border-text/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
    >
      <table className="w-full border-collapse text-left text-sm" style={{ minWidth }}>
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-text/10 bg-text/3">{head}</tr>
        </thead>
        <tbody className="divide-y divide-text/10">{children}</tbody>
      </table>
    </div>
  );
}

export function Th({
  children,
  className = "",
  ...rest
}: { children: ReactNode; className?: string } & React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      scope="col"
      className={`px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-text/50 ${className}`}
      {...rest}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  className = "",
  ...rest
}: { children: ReactNode; className?: string } & React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={`px-4 py-3 align-middle text-text/80 ${className}`} {...rest}>
      {children}
    </td>
  );
}
