"use client";

import { useState, useEffect, useCallback } from "react";
import { Radio, X, ExternalLink, Check } from "lucide-react";
import { useLanguage } from "@/i18n";
import { Dialog, Button } from "@/components/ui";

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

type AcademyStudent = {
  rollNumber: number;
  nameEnglish: string;
  enrolledCourseId: string;
};

// A persistent "LIVE CLASS" badge shown on every page while a class is running.
// Clicking it opens a popup where a student enters their roll to mark
// attendance, and a Join button that opens the Google Meet link.
export default function LiveClassBanner() {
  const { language } = useLanguage();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );

  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [students, setStudents] = useState<AcademyStudent[]>([]);
  const [dismissed, setDismissed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [roll, setRoll] = useState("");
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
    try {
      const sres = await fetch("/api/academy/students?status=All", { cache: "no-store" });
      const sdata = await sres.json();
      if (sdata.success) setStudents(sdata.students || []);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    queueMicrotask(fetchLive);
    const iv = setInterval(fetchLive, 20000);
    return () => clearInterval(iv);
  }, [fetchLive]);

  if (sessions.length === 0 || dismissed) return null;

  const selected = sessions.find((s) => s._id === selectedId) ?? sessions[0];
  const courseStudents = students
    .filter((s) => s.enrolledCourseId === selected.courseId)
    .sort((a, b) => a.rollNumber - b.rollNumber);
  const attendedRolls = new Set((selected.attendance || []).map((a) => a.rollNumber));

  const markAttendance = async () => {
    if (!roll) {
      setMsg({ ok: false, text: t("রোল নম্বর সিলেক্ট করুন।", "Select your roll number.") });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/academy/live/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: selected.courseId, rollNumber: Number(roll) }),
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
              onClick={() => window.open(selected.meetLink, "_blank", "noopener,noreferrer")}
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
                setRoll("");
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
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.12em] text-text/55">
              {t("আপনার রোল নম্বর", "Your roll number")}
            </label>
            <select
              value={roll}
              onChange={(e) => {
                setRoll(e.target.value);
                setMsg({ ok: false, text: "" });
              }}
              className="w-full rounded-xl border border-text/20 bg-card px-3.5 py-2.5 text-sm font-semibold text-text focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text"
            >
              <option value="">
                {t("রোল সিলেক্ট করুন", "Select your roll")}
              </option>
              {courseStudents.map((s) => (
                <option key={s.rollNumber} value={s.rollNumber}>
                  {s.rollNumber} · {s.nameEnglish}
                  {attendedRolls.has(s.rollNumber) ? " ✓" : ""}
                </option>
              ))}
            </select>
          </div>
          <Button onClick={markAttendance} loading={busy} iconLeft={<Check className="h-4 w-4" />}>
            {t("হাজিরা দিন", "Mark attendance")}
          </Button>
          {msg.text && (
            <p className={`text-xs font-medium ${msg.ok ? "text-ok" : "text-danger"}`}>{msg.text}</p>
          )}
          <p className="text-[11px] text-text/45">
            {t(
              "হাজিরা দেওয়ার পর উপরের Join বাটনে ক্লিক করে গুগল মিটে যোগ দিন।",
              "After marking attendance, click the Join button above to enter Google Meet.",
            )}
          </p>
        </div>
      </Dialog>
    </>
  );
}
