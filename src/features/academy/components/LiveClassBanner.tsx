"use client";

import { useState, useEffect, useCallback } from "react";
import { Radio, X, ExternalLink, Check, LogIn } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/i18n";
import { Dialog, Button } from "@/components/ui";
import { useAccount } from "@/features/student-auth/context";

type LiveSession = {
  _id: string;
  courseId: string;
  meetLink: string;
  topic?: string;
  date: string;
  time?: string;
  open: boolean;
  attendance: { rollNumber: number; name: string }[];
};

// A persistent "LIVE CLASS" badge shown on every page while a class is running.
// Clicking it opens a popup where a signed-in student marks their own
// attendance with one button, and a Join button that opens the Google Meet link.
//
// It used to be a roll-number dropdown, which meant anyone could put anyone
// else present by picking their number, and the page had to download the whole
// student roster to populate it. The student now marks themselves and the
// server derives the roll from their account, so the roster is never fetched
// here at all.
export default function LiveClassBanner() {
  const { language } = useLanguage();
  const { student } = useAccount();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );

  /** normalize a meet link to a clickable URL (adds https:// when missing). */
  const meetHref = (raw: string | null | undefined) => {
    const v = (raw ?? "").trim();
    if (!v) return v;
    return /^[a-z][a-z0-9+.-]*:\/\//i.test(v) ? v : `https://${v}`;
  };

  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [dismissed, setDismissed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string }>({ ok: false, text: "" });

  const fetchLive = useCallback(async () => {
    try {
      const res = await fetch("/api/academy/live", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        const live: LiveSession[] = (data.sessions || []).filter(
          (s: LiveSession) => s.open && s.meetLink,
        );
        setSessions(live);
        setSelectedId((prev) =>
          live.find((s) => s._id === prev) ? prev : live[0]?._id ?? "",
        );
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    queueMicrotask(fetchLive);
    const iv = setInterval(fetchLive, 20000);
    return () => clearInterval(iv);
  }, [fetchLive]);

  // Clear a stale confirmation when the signed-in account changes.
  useEffect(() => {
    setMsg({ ok: false, text: "" });
  }, [student?.whatsapp]);

  if (sessions.length === 0 || dismissed) return null;

  const selected = sessions.find((s) => s._id === selectedId) ?? sessions[0];
  const myRoll = student?.rollNumber ?? 0;
  const alreadyIn = (selected.attendance || []).some((a) => a.rollNumber === myRoll);

  const markAttendance = async () => {
    if (!student) return;
    setBusy(true);
    try {
      const res = await fetch("/api/academy/live/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: selected.courseId, phone: student.whatsapp }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg({
          ok: true,
          text: data.duplicate
            ? t("আপনার হাজিরা আগেই হয়ে গেছে।", "Attendance already marked.")
            : t("হাজিরা হয়ে গেছে — ধন্যবাদ!", "Attendance marked — thank you!"),
        });
      } else {
        setMsg({ ok: false, text: data.error || t("হাজিরা হয়নি।", "Failed to mark attendance.") });
      }
    } catch {
      setMsg({ ok: false, text: t("সমস্যা হয়েছে।", "Something went wrong.") });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {/* floating LIVE badge */}
      <div className="fixed bottom-4 right-4 z-50 flex max-w-[min(92vw,22rem)] flex-col items-end gap-2">
        <div className="flex w-full items-center gap-2 rounded-2xl border border-danger/50 bg-danger px-4 py-3 shadow-2xl">
          <span className="flex items-center gap-2 text-white">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70" />
              <span className="relative inline-flex size-2.5 rounded-full bg-white" />
            </span>
            <Radio className="h-4 w-4" />
          </span>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="flex min-w-0 flex-1 flex-col text-left text-white"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] opacity-80">
              {t("লাইভ ক্লাস চলছে", "Live class running")}
              {sessions.length > 1 ? ` · ${sessions.length}` : ""}
            </span>
            <span className="truncate text-sm font-bold leading-tight">
              {selected.topic || `${selected.courseId} · ${t("যোগ দিন", "Join now")}`}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label={t("বন্ধ করুন", "Dismiss")}
            className="shrink-0 rounded-lg px-1.5 py-1.5 text-white/80 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* popup: mark attendance + join */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={t("লাইভ ক্লাস", "Live class")}
        description={
          selected ? `${selected.courseId}${selected.topic ? " · " + selected.topic : ""}` : undefined
        }
        size="md"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              {t("বন্ধ করুন", "Close")}
            </Button>
            <Button
              size="sm"
              iconLeft={<ExternalLink className="h-4 w-4" />}
              onClick={() => window.open(meetHref(selected.meetLink), "_blank", "noopener,noreferrer")}
            >
              {t("Join Google Meet", "Join Google Meet")}
            </Button>
          </>
        }
      >
        {sessions.length > 1 && (
          <div className="mb-4">
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.12em] text-text/55">
              {t("কোন ক্লাসে যোগ দেবেন সিলেক্ট করুন", "Select which class to join")}
            </label>
            <select
              value={selectedId}
              onChange={(e) => {
                setSelectedId(e.target.value);
                setMsg({ ok: false, text: "" });
              }}
              className="w-full rounded-xl border border-text/20 bg-card px-3.5 py-2.5 text-sm font-semibold text-text focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text"
            >
              {sessions.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.courseId} · {s.topic || t("লাইভ ক্লাস", "Live class")}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="space-y-3">
          {student ? (
            <>
              {alreadyIn ? (
                <div className="flex items-center gap-2.5 rounded-2xl border border-ok/40 bg-ok/10 px-4 py-3.5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ok text-white">
                    <Check className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-ok">
                      {t("আপনার হাজিরা হয়ে গেছে", "Your attendance is marked")}
                    </p>
                    <p className="text-[11px] text-text/55">
                      {t(
                        "এই ক্লাসে আপনি উপস্থিত আছেন।",
                        "You are counted present for this class.",
                      )}
                    </p>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={markAttendance}
                  loading={busy}
                  iconLeft={<Check className="h-4 w-4" />}
                >
                  {t("আমি উপস্থিত", "I'm present")}
                </Button>
              )}
              {msg.text && (
                <p className={`text-xs font-medium ${msg.ok ? "text-ok" : "text-danger"}`}>{msg.text}</p>
              )}
              <p className="text-[11px] text-text/45">
                {t(
                  "হাজিরা দেওয়ার পর উপরের Join বাটনে ক্লিক করে গুগল মিটে যোগ দিন।",
                  "After marking attendance, click the Join button above to enter Google Meet.",
                )}
              </p>
            </>
          ) : (
            <div className="rounded-2xl border border-text/15 bg-card px-4 py-4">
              <p className="text-sm font-bold text-text">
                {t(
                  "হাজিরা দিতে লগইন করতে হবে",
                  "Sign in to mark your attendance",
                )}
              </p>
              <p className="mt-1 text-[12px] leading-relaxed text-text/60">
                {t(
                  "হাজিরা নিজের নামে দিতে হয়, তাই প্রথমে লগইন করুন। তারপর এক ক্লিকেই উপস্থিত বলে দেওয়া যাবে।",
                  "Attendance is recorded against your own name, so sign in first. Then one tap marks you present.",
                )}
              </p>
              <Link
                href="/login"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
              >
                <LogIn className="h-4 w-4" />
                {t("লগইন করুন", "Sign in")}
              </Link>
            </div>
          )}
        </div>
      </Dialog>
    </>
  );
}
