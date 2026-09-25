"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Copy, Check, Lock, MapPin, Phone, RefreshCw, Search, X } from "lucide-react";
import { IStudent, ICourse } from "@/features/academy";
import { isSubAdminPasscode } from "@/features/academy/subAdminPasswords";
import { useLanguage } from "@/i18n";
import {
  Breadcrumb,
  Button,
  Card,
  Dialog,
  EmptyState,
  Eyebrow,
  Field,
  IconButton,
  InlineSelect,
  LoadingBlock,
  PageHeader,
  SectionHanzi,
  StatusMark,
} from "@/components/ui";

export default function ScholarsDirectoryPage() {
  const { language } = useLanguage();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );

  const [students, setStudents] = useState<IStudent[]>([]);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [marks, setMarks] = useState<
    Record<string, { mark: number; level: number; lesson: number }>
  >({});
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [track, setTrack] = useState("all");
  const [sortBy, setSortBy] = useState<"roll" | "attendance">("roll");

  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const ADMIN_SECRET_PIN = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "8131";

  useEffect(() => {
    queueMicrotask(() => {
      try {
        setAdminUnlocked(sessionStorage.getItem("academy_admin_unlocked") === "true");
      } catch {
        /* storage unavailable */
      }
    });
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [s, c, m] = await Promise.all([
        fetch("/api/academy/students?status=Approved", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/academy/courses", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/hw/marks", { cache: "no-store" }).then((r) => r.json()).catch(() => null),
      ]);
      if (s.success && Array.isArray(s.students)) setStudents(s.students);
      if (c.success && Array.isArray(c.courses)) setCourses(c.courses);
      if (m?.success && Array.isArray(m.marks)) {
        const map: Record<string, { mark: number; level: number; lesson: number }> = {};
        for (const item of m.marks) {
          map[String(item.rollNumber)] = {
            mark: item.mark,
            level: item.level,
            lesson: item.lesson,
          };
        }
        setMarks(map);
      }
    } catch (err) {
      console.error("Failed to load directory:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchData();
    });
  }, [fetchData]);

  const enrolledIds = (s: IStudent): string[] => {
    if (Array.isArray(s.enrolledCourseIds) && s.enrolledCourseIds.length)
      return s.enrolledCourseIds.map((id) => String(id).trim());
    const legacy = (s as { enrolledCourseId?: string }).enrolledCourseId;
    return legacy ? [String(legacy).trim()] : [];
  };

  const attendance = useCallback(
    (roll: string | number, ids: string[]) => {
      let held = 0;
      let attended = 0;
      const target = String(roll).trim();
      courses.forEach((c) => {
        if (ids.some((id) => id.toLowerCase() === c.courseId.toLowerCase())) {
          const cls = c.classes ?? [];
          held += cls.length;
          attended += cls.filter((s) =>
            s.presentStudents?.some((r) => String(r).trim() === target),
          ).length;
        }
      });
      return { held, attended, rate: held > 0 ? Math.round((attended / held) * 100) : null };
    },
    [courses],
  );

  const rows = useMemo(() => {
    const q = query.toLowerCase().trim();
    return students
      .map((s) => {
        const ids = enrolledIds(s);
        return { s, ids, att: attendance(s.rollNumber, ids) };
      })
      .filter(({ s, ids }) => {
        const matchesQ =
          !q ||
          (s.nameEnglish || "").toLowerCase().includes(q) ||
          String(s.rollNumber).includes(q) ||
          (s.location || "").toLowerCase().includes(q);
        const matchesTrack =
          track === "all" || ids.some((id) => id.toLowerCase() === track.toLowerCase());
        return matchesQ && matchesTrack;
      })
      .sort((a, b) => {
        if (sortBy === "attendance") return (b.att.rate ?? -1) - (a.att.rate ?? -1);
        return Number(a.s.rollNumber) - Number(b.s.rollNumber);
      });
  }, [students, query, track, sortBy, attendance]);

  const filtersActive = query !== "" || track !== "all" || sortBy !== "roll";

  const maskPhone = (num: string): string => {
    const digits = (num || "").replace(/\D/g, "");
    if (digits.length <= 6) return digits;
    return `${digits.slice(0, 3)}***${digits.slice(-2)}`;
  };

  const submitPin = (e: React.FormEvent) => {
    e.preventDefault();
    const v = pin.trim();
    if (v === ADMIN_SECRET_PIN.trim() || isSubAdminPasscode(v)) {
      setAdminUnlocked(true);
      sessionStorage.setItem("academy_admin_unlocked", "true");
      setPinOpen(false);
    } else {
      setPinError(t("ভুল পাসকোড।", "Incorrect passcode."));
    }
  };

  const copyNumber = async (num: string) => {
    try {
      await navigator.clipboard.writeText(num || "");
      setCopied(num);
      setTimeout(() => setCopied(null), 1500);
    } catch { /* ignore */ }
  };

  return (
    <div className="relative isolate mx-auto max-w-6xl px-4 pt-28 pb-20 sm:px-6 lg:px-8">
      <SectionHanzi char="生" className="-top-10 right-0" />

      <Breadcrumb
        items={[
          { label: t("একাডেমি", "Academy"), href: "/academy" },
          { label: t("শিক্ষার্থী", "Scholars") },
        ]}
      />

      <PageHeader
        className="mt-6"
        eyebrow={<Eyebrow seal="生" label={t("শিক্ষার্থী তালিকা", "Scholars")} detail={`${students.length}`} />}
        title={t("যাঁরা একসাথে শিখছেন", "The people learning together")}
        lede={t(
          "চলমান ব্যাচের শিক্ষার্থী ও তাঁদের ক্লাস উপস্থিতি।",
          "Everyone in the running cohorts, and how their attendance is going.",
        )}
        actions={
          <div className="flex items-center gap-2">
            {adminUnlocked ? (
              <StatusMark tone="done">{t("অ্যাডমিন মোড", "Admin mode")}</StatusMark>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setPin(""); setPinError(""); setPinOpen(true); }}
                iconLeft={<Lock className="h-3.5 w-3.5" />}
              >
                {t("সাব-অ্যাডমিন লগইন", "Sub-admin login")}
              </Button>
            )}
            <IconButton
              label={t("তালিকা রিফ্রেশ করুন", "Refresh list")}
              size="sm"
              spinning={loading}
              onClick={fetchData}
            >
              <RefreshCw className="h-4 w-4" />
            </IconButton>
          </div>
        }
      />

      {/* Controls */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="relative flex-1">
          <label htmlFor="dir-search" className="sr-only">
            {t("নাম, রোল বা অবস্থান খুঁজুন", "Search by name, roll, or location")}
          </label>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text/40" aria-hidden="true" />
          <input
            id="dir-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("নাম, রোল বা অবস্থান…", "Name, roll, or location…")}
            className="w-full rounded-xl border border-text/15 bg-card py-2.5 pl-9 pr-9 text-sm text-text placeholder:text-text/40 focus:border-text/40 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label={t("সার্চ মুছুন", "Clear search")}
              className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-text/40 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
        <InlineSelect label={t("ট্র্যাক", "Track")} value={track} onChange={(e) => setTrack(e.target.value)}>
          <option value="all">{t("সব ট্র্যাক", "All tracks")}</option>
          {courses.map((c) => (
            <option key={c.courseId} value={c.courseId}>
              {c.courseId}
            </option>
          ))}
        </InlineSelect>
        <InlineSelect
          label={t("সাজান", "Sort")}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "roll" | "attendance")}
        >
          <option value="roll">{t("রোল অনুযায়ী", "By roll")}</option>
          <option value="attendance">{t("উপস্থিতি অনুযায়ী", "By attendance")}</option>
        </InlineSelect>
      </div>

      <div className="mt-4 flex items-center justify-between px-1 text-xs text-text/50" aria-live="polite">
        <span className="tabular-nums">
          {t(
            `${students.length} জনের মধ্যে ${rows.length} জন`,
            `Showing ${rows.length} of ${students.length}`,
          )}
        </span>
        {filtersActive && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setTrack("all");
              setSortBy("roll");
            }}
            className="font-medium text-text underline decoration-text/25 underline-offset-2 hover:decoration-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
          >
            {t("ফিল্টার বাদ দিন", "Clear filters")}
          </button>
        )}
      </div>

      <div className="mt-6">
        {loading ? (
          <LoadingBlock label={t("তালিকা লোড হচ্ছে", "Loading directory")} rows={3} />
        ) : rows.length === 0 ? (
          <EmptyState
            title={t("কোনো শিক্ষার্থী পাওয়া যায়নি", "No scholars found")}
            description={t("অন্য নাম দিয়ে খুঁজুন বা ফিল্টার বাদ দিন।", "Try a different name, or clear the filters.")}
          />
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map(({ s, ids, att }) => (
              <li key={String(s.rollNumber)}>
                <Card interactive className="flex h-full flex-col p-5">
                  <div className="flex items-center gap-3">
                    <span className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-text/10 bg-text/5">
                      <Image
                        src={
                          s.avatarUrl ||
                          `https://api.dicebear.com/10.x/adventurer/svg?seed=${encodeURIComponent(s.nameEnglish || "student")}`
                        }
                        alt=""
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                    </span>
                    <div className="min-w-0">
                      <h3 className="flex items-center gap-1.5 truncate text-sm font-bold text-text">
                        <span className="truncate">{s.nameEnglish}</span>
                        {s.isPro && (
                          <span className="inline-flex shrink-0 items-center rounded-full bg-amber-400/15 px-1.5 py-0.5 text-[10px] font-bold text-amber-500">
                            ⭐ Pro
                          </span>
                        )}
                      </h3>
                      <p className="text-xs tabular-nums text-text/45">
                        {t("রোল", "Roll")} #{s.rollNumber}
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 flex items-center gap-1.5 text-xs text-text/55">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-text/35" aria-hidden="true" />
                    <span className="truncate">{s.location || t("অবস্থান নেই", "Location not set")}</span>
                  </p>

                  {s.whatsapp && (
                    <div className="mt-3 flex items-center gap-2 rounded-xl border border-text/10 bg-text/[0.03] px-3.5 py-2.5">
                      <Phone className="h-4 w-4 shrink-0 text-text/35" aria-hidden="true" />
                       <a
                         href={`https://wa.me/${s.whatsapp.replace(/\D/g, "")}`}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="min-w-0 flex-1 truncate font-mono text-sm font-bold tabular-nums text-text hover:text-text/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
                         title={t("হোয়াটসঅ্যাপ কল করুন", "Call on WhatsApp")}
                       >
                        {adminUnlocked ? s.whatsapp : maskPhone(s.whatsapp)}
                      </a>
                      {adminUnlocked && (
                        <button
                          type="button"
                          onClick={() => copyNumber(s.whatsapp)}
                          aria-label={t("নম্বর কপি করুন", "Copy number")}
                          title={t("কপি করুন", "Copy")}
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-text/15 text-text/50 transition-colors hover:border-text/30 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
                        >
                          {copied === s.whatsapp ? (
                            <Check className="h-3.5 w-3.5 text-ok" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  )}
                  {!adminUnlocked && s.whatsapp && (
                    <p className="mt-1.5 text-[10px] text-text/40">
                      {t("পুরো নম্বর দেখতে সাব-অ্যাডমিন লগইন করুন।", "Login as sub-admin to see full number.")}
                    </p>
                  )}

                  <dl className="mt-4 space-y-2 rounded-xl border border-text/10 bg-text/3 p-3 text-xs">
                    <div className="flex items-center justify-between">
                      <dt className="text-text/50">{t("সংলাপ মার্ক", "Dialogue mark")}</dt>
                      <dd>
                        {marks[String(s.rollNumber)] ? (
                          <span className="inline-flex items-center gap-1.5">
                            <StatusMark tone="done">
                              <span className="tabular-nums">
                                {marks[String(s.rollNumber)].mark}/10
                              </span>
                            </StatusMark>
                            <span className="font-mono text-[10px] text-text/40">
                              HSK{marks[String(s.rollNumber)].level}
                              {marks[String(s.rollNumber)].lesson > 0
                                ? `·L${marks[String(s.rollNumber)].lesson}`
                                : ""}
                            </span>
                          </span>
                        ) : (
                          <span className="text-text/45">{t("এখনও নেই", "—")}</span>
                        )}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-text/50">{t("উপস্থিতি", "Attendance")}</dt>
                      <dd>
                        {att.rate === null ? (
                          <span className="text-text/45">{t("এখনও নেই", "—")}</span>
                        ) : (
                          <StatusMark tone={att.rate >= 75 ? "done" : "neutral"}>
                            <span className="tabular-nums">{att.rate}%</span>
                          </StatusMark>
                        )}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-text/50">{t("ক্লাসে উপস্থিত", "Sessions attended")}</dt>
                      <dd className="font-semibold tabular-nums text-text">
                        {att.attended} / {att.held}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between border-t border-text/10 pt-2">
                      <dt className="text-text/50">{t("ট্র্যাক", "Track")}</dt>
                      <dd className="font-semibold text-text">{ids.length ? ids.join(", ") : "—"}</dd>
                    </div>
                  </dl>

                  <Link
                    href={`/academy/students/${s.rollNumber}`}
                    className="mt-4 inline-flex items-center gap-1 self-start border-t border-text/10 pt-3 text-sm font-semibold text-text underline decoration-text/25 underline-offset-4 transition-colors hover:decoration-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
                  >
                    {t("প্রোফাইল ও উপস্থিতি", "Profile & attendance")}
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* PIN dialog */}
      <Dialog
        open={pinOpen}
        onClose={() => setPinOpen(false)}
        title={t("সাব-অ্যাডমিন যাচাই", "Sub-admin verification")}
        description={t("পুরো হোয়াটসঅ্যাপ নম্বর দেখতে পাসকোড দিন।", "Enter passcode to see full phone numbers.")}
        size="sm"
      >
        <form onSubmit={submitPin} className="space-y-4">
          <Field
            type="password"
            label={t("পাসকোড", "Passcode")}
            autoFocus
            value={pin}
            error={pinError}
            onChange={(e) => { setPin(e.target.value); setPinError(""); }}
            className="text-center tracking-widest"
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => setPinOpen(false)}>
              {t("বাতিল", "Cancel")}
            </Button>
            <Button type="submit" size="sm">{t("আনলক", "Unlock")}</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
