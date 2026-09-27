"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BarChart3,
  Clock,
  LogIn,
  MousePointerClick,
  TrendingUp,
  Users,
} from "lucide-react";
import { useLanguage } from "@/i18n";
import {
  Button,
  Card,
  EmptyState,
  LoadingBlock,
  SectionHanzi,
  SelectField,
  StatusMark,
  TableFrame,
  Td,
  Th,
} from "@/components/ui";
import { AdminShell } from "@/features/academy/components/admin/AdminShell";

/**
 * The owner's view of who is using the site.
 *
 * Two levels, chosen to stay small enough to be fast and useful rather than a
 * complete surveillance log:
 *
 *  - Aggregate traffic: page views, sign-ins and the most-used pages and
 *    buttons, rolled up per day.
 *  - One row per student: how many times they signed in, when they last were
 *    here, and roughly how long they have spent on the site in total.
 *
 * The public traffic board on the home page reads the same rolled-up numbers;
 * only this page is behind the admin passcode.
 */

const ADMIN_PASSCODE = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "8131";

type Traffic = {
  today: {
    day: string;
    pageViews: number;
    clicks: number;
    logins: number;
    newVisitors: number;
    uniqueVisitors: number;
  };
  daily: Array<{ day: string; pageViews: number; clicks: number; logins: number; uniqueVisitors: number }>;
  topPages: Array<{ label: string; count: number }>;
  topButtons: Array<{ label: string; count: number }>;
  totals: { pageViews: number; uniqueVisitorsAllTime: number; sessions: number };
};

type StudentRow = {
  whatsapp: string;
  rollNumber: number | null;
  name: string;
  logins: number;
  totalSeconds: number;
  lastLoginAt: string | null;
  lastLogoutAt: string | null;
  active: boolean;
  topPaths: Array<{ path: string; count: number }>;
};

function human(seconds: number): string {
  if (!seconds || seconds < 60) return `${Math.round(seconds)}s`;
  const m = Math.round(seconds / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

function when(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminAnalyticsPage() {
  const { language } = useLanguage();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );

  const [days, setDays] = useState("14");
  const [traffic, setTraffic] = useState<Traffic | null>(null);
  const [students, setStudents] = useState<StudentRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/analytics/overview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminPasscode: ADMIN_PASSCODE, days: Number(days) || 14 }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || t("তথ্য আনা যায়নি।", "Could not load the figures."));
        return;
      }
      setTraffic(data.traffic as Traffic);
      setStudents(data.students as StudentRow[]);
    } catch {
      setError(t("নেটওয়ার্ক সমস্যা।", "Network problem."));
    } finally {
      setLoading(false);
    }
  }, [days, t]);

  // Deferred through a microtask so the first state update is not a
  // synchronous set inside the effect body.
  useEffect(() => {
    let alive = true;
    queueMicrotask(() => {
      if (alive) void load();
    });
    return () => {
      alive = false;
    };
  }, [load]);

  const maxViews = Math.max(1, ...(traffic?.daily.map((d) => d.pageViews) ?? [1]));

  return (
    <AdminShell
      title={t("ট্রাফিক ও ব্যবহার", "Traffic & usage")}
      crumb={t("অ্যানালিটিক্স", "Analytics")}
      seal="数"
      lede={t(
        "কে কতটা আসছে, কোন পেজ বেশি পড়া হচ্ছে এবং কোন বাটন সবচেয়ে বেশি ব্যবহার হচ্ছে।",
        "Who is coming, which pages get read, and which buttons actually get used.",
      )}
      actions={
        <Button size="sm" variant="secondary" onClick={() => void load()}>
          {t("রিফ্রেশ", "Refresh")}
        </Button>
      }
    >
      <SectionHanzi char="访" className="-top-16 right-4" />

      <div className="mb-6 max-w-xs">
        <SelectField
          label={t("সময়সীমা", "Range")}
          value={days}
          onChange={(e) => setDays(e.target.value)}
        >
          <option value="7">{t("গত ৭ দিন", "Last 7 days")}</option>
          <option value="14">{t("গত ১৪ দিন", "Last 14 days")}</option>
          <option value="30">{t("গত ৩০ দিন", "Last 30 days")}</option>
        </SelectField>
      </div>

      {error && (
        <p role="alert" className="mb-4 text-sm font-medium text-danger">
          {error}
        </p>
      )}

      {loading && !traffic ? (
        <LoadingBlock label={t("তথ্য আসছে…", "Loading figures…")} />
      ) : (
        traffic && (
          <>
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: Users, value: traffic.today.uniqueVisitors, label: t("আজ ভিজিটর", "Visitors today") },
                { icon: BarChart3, value: traffic.today.pageViews, label: t("আজ পেজ ভিউ", "Page views today") },
                { icon: LogIn, value: traffic.today.logins, label: t("আজ লগইন", "Sign-ins today") },
                { icon: TrendingUp, value: traffic.totals.uniqueVisitorsAllTime, label: t("মোট ভিজিটর", "Visitors all time") },
              ].map(({ icon: Icon, value, label }) => (
                <Card key={label} className="px-4 py-4">
                  <Icon className="size-4 text-secondary" aria-hidden="true" />
                  <dd className="mt-2 font-mono text-2xl font-bold tabular-nums text-text">
                    {value.toLocaleString("en-US")}
                  </dd>
                  <dt className="mt-0.5 text-[11px] leading-snug text-text/55">{label}</dt>
                </Card>
              ))}
            </dl>

            {/* Daily bars */}
            <Card className="mt-4 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text/50">
                {t("প্রতিদিনের পেজ ভিউ", "Page views per day")}
              </p>
              <div
                className="mt-4 flex h-32 items-stretch gap-1"
                role="img"
                aria-label={traffic.daily.map((d) => `${d.day}: ${d.pageViews}`).join(", ")}
              >
                {traffic.daily.map((d) => (
                  <div
                    key={d.day}
                    className="group relative flex h-full flex-1 flex-col justify-end"
                  >
                    <div
                      className="w-full rounded-t bg-secondary/70 group-hover:bg-secondary"
                      style={{ height: `${Math.max(3, (d.pageViews / maxViews) * 100)}%` }}
                    />
                    <span className="pointer-events-none absolute -top-6 left-1/2 hidden -translate-x-1/2 rounded bg-text px-1.5 py-0.5 font-mono text-[10px] text-background group-hover:block">
                      {d.pageViews}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex justify-between text-[10px] text-text/40">
                <span>{traffic.daily[0]?.day}</span>
                <span>{traffic.daily[traffic.daily.length - 1]?.day}</span>
              </div>
            </Card>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <Ranked
                title={t("সবচেয়ে বেশি পঠা পেজ", "Most read pages")}
                icon={BarChart3}
                rows={traffic.topPages.map((r) => ({ label: r.label, count: r.count }))}
                empty={t("এখনো কোনো তথ্য নেই।", "No data yet.")}
              />
              <Ranked
                title={t("সবচেয়ে বেশি ক্লিক করা বাটন", "Most clicked buttons")}
                icon={MousePointerClick}
                rows={traffic.topButtons}
                empty={t("এখনো কোনো তথ্য নেই।", "No data yet.")}
              />
            </div>
          </>
        )
      )}

      {/* Per-student sign-in summary */}
      <div className="mt-10">
        <h2 className="flex items-center gap-2 font-serif text-xl font-medium text-text">
          <Clock className="size-5 text-secondary" aria-hidden="true" />
          {t("শিক্ষার্থীদের লগইন ও সময়", "Student sign-ins and time")}
        </h2>
        <p className="mt-1 text-sm text-text/60">
          {t(
            "কতবার লগইন করেছে, শেষ কবে এসেছে এবং মোট কত সময় ছিল।",
            "How many times they signed in, when they were last here, and total time on site.",
          )}
        </p>

        {loading && !students ? (
          <div className="mt-4">
            <LoadingBlock label={t("তথ্য আসছে…", "Loading…")} />
          </div>
        ) : !students || students.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title={t("কোনো লগইন নেই", "No sign-ins yet")}
              description={t(
                "শিক্ষার্থীরা লগইন করলে এখানে দেখা যাবে।",
                "Once students sign in they will appear here.",
              )}
            />
          </div>
        ) : (
          <TableFrame
            caption={t("শিক্ষার্থীদের লগইন ও সময়", "Student sign-ins and time")}
            minWidth="56rem"
            head={
              <>
                <Th>{t("শিক্ষার্থী", "Student")}</Th>
                <Th>{t("লগইন", "Sign-ins")}</Th>
                <Th>{t("মোট সময়", "Total time")}</Th>
                <Th>{t("শেষ লগইন", "Last sign-in")}</Th>
                <Th>{t("শেষ লগআউট", "Last sign-out")}</Th>
                <Th>{t("বেশি দেখা পেজ", "Most read")}</Th>
              </>
            }
          >
            {students.map((s) => (
              <tr key={s.whatsapp}>
                <Td>
                  <span className="block font-semibold text-text">{s.name || "—"}</span>
                  <span className="block font-mono text-[11px] text-text/50">
                    {s.rollNumber != null ? `#${s.rollNumber} · ` : ""}
                    {s.whatsapp}
                  </span>
                </Td>
                <Td className="tabular-nums">{s.logins}</Td>
                <Td className="tabular-nums">{human(s.totalSeconds)}</Td>
                <Td className="whitespace-nowrap">
                  <span className="flex items-center gap-1.5">
                    {when(s.lastLoginAt)}
                    {s.active && (
                      <StatusMark tone="done">
                        {t("অনলাইন", "online")}
                      </StatusMark>
                    )}
                  </span>
                </Td>
                <Td className="whitespace-nowrap text-text/60">{when(s.lastLogoutAt)}</Td>
                <Td className="text-[11px] text-text/60">
                  {s.topPaths.length === 0
                    ? "—"
                    : s.topPaths.slice(0, 2).map((p) => p.path).join(", ")}
                </Td>
              </tr>
            ))}
          </TableFrame>
        )}
      </div>
    </AdminShell>
  );
}

function Ranked({
  title,
  icon: Icon,
  rows,
  empty,
}: {
  title: string;
  icon: typeof BarChart3;
  rows: Array<{ label: string; count: number }>;
  empty: string;
}) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <Card className="p-5">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-text/50">
        <Icon className="size-3.5" aria-hidden="true" />
        {title}
      </p>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-text/50">{empty}</p>
      ) : (
        <ol className="mt-3 space-y-2">
          {rows.map((r) => (
            <li key={r.label} className="text-sm">
              <div className="flex items-baseline justify-between gap-3">
                <span className="truncate text-text/80">{r.label}</span>
                <span className="shrink-0 font-mono text-xs tabular-nums text-text/50">
                  {r.count}
                </span>
              </div>
              <div className="mt-1 h-1 overflow-hidden rounded-full bg-text/8">
                <div
                  className="h-full rounded-full bg-secondary/60"
                  style={{ width: `${Math.max(4, (r.count / max) * 100)}%` }}
                />
              </div>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
