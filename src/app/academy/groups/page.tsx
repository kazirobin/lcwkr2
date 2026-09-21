"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Hash, Plus, RefreshCw, Users } from "lucide-react";
import { ICourse, IStudent, IStudyGroup } from "@/features/academy";
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
  LoadingBlock,
  PageHeader,
  SectionHanzi,
  SelectField,
  useToast,
} from "@/components/ui";

const ROLL_KEY = "lcwkr_my_roll";

export default function AcademyGroupsPage() {
  const { language } = useLanguage();
  const toast = useToast();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );

  const [groups, setGroups] = useState<IStudyGroup[]>([]);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [students, setStudents] = useState<IStudent[]>([]);
  const [loading, setLoading] = useState(true);

  const [myRoll, setMyRoll] = useState<string>("");
  const [myRollDraft, setMyRollDraft] = useState("");
  const [rollDialog, setRollDialog] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createCourse, setCreateCourse] = useState("");
  const [createLabel, setCreateLabel] = useState("");
  const [createRoll, setCreateRoll] = useState("");

  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(ROLL_KEY);
      if (saved) setMyRoll(saved.trim());
    } catch {
      /* ignore */
    }
  }, []);

  const saveRoll = (roll: string) => {
    setMyRoll(roll);
    try {
      window.localStorage.setItem(ROLL_KEY, roll);
    } catch {
      /* ignore */
    }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [gRes, cRes, sRes] = await Promise.all([
        fetch("/api/academy/groups", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/academy/courses", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/academy/students?status=Approved", { cache: "no-store" }).then((r) => r.json()),
      ]);
      if (gRes.success && Array.isArray(gRes.groups)) setGroups(gRes.groups);
      if (cRes.success && Array.isArray(cRes.courses)) setCourses(cRes.courses);
      if (sRes.success && Array.isArray(sRes.students)) setStudents(sRes.students);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const nameByRoll = useMemo(() => {
    const m = new Map<string, string>();
    students.forEach((s) => m.set(String(s.rollNumber).trim(), s.nameEnglish));
    return m;
  }, [students]);

  const courseById = useMemo(
    () => new Map(courses.map((c) => [c.courseId, c])),
    [courses],
  );

  const byCourse = useMemo(() => {
    const m = new Map<string, IStudyGroup[]>();
    groups.forEach((g) => {
      const list = m.get(g.courseId) ?? [];
      list.push(g);
      m.set(g.courseId, list);
    });
    return Array.from(m.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [groups]);

  const totalMembers = useMemo(
    () => groups.reduce((acc, g) => acc + g.memberRolls.length, 0),
    [groups],
  );

  const openCreate = () => {
    setCreateCourse("");
    setCreateLabel("");
    setCreateRoll(myRoll);
    setCreateOpen(true);
  };

  const ensureMyRoll = () => {
    if (myRoll) return true;
    setMyRollDraft("");
    setRollDialog(true);
    return false;
  };

  const submitRoll = () => {
    const roll = myRollDraft.trim();
    if (!roll) {
      toast(t("রোল নম্বর দিন", "Enter your roll number"), "error");
      return;
    }
    saveRoll(roll);
    setRollDialog(false);
  };

  const createGroup = async () => {
    if (!createCourse) {
      toast(t("একটি কোর্স বেছে নিন", "Choose a course"), "error");
      return;
    }
    const roll = createRoll.trim();
    if (!roll) {
      toast(t("আপনার রোল নম্বর দিন", "Enter your roll number"), "error");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/academy/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: createCourse,
          label: createLabel.trim(),
          rollNumber: roll,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error ?? t("গ্রুপ তৈরি হয়নি", "Could not create group"), "error");
        return;
      }
      saveRoll(roll);
      setCreateOpen(false);
      toast(t("গ্রুপ তৈরি হয়েছে", "Group created"), "success");
      fetchData();
    } catch {
      toast(t("গ্রুপ তৈরি হয়নি", "Could not create group"), "error");
    } finally {
      setCreating(false);
    }
  };

  const joinLeave = async (g: IStudyGroup, action: "join" | "leave") => {
    if (!ensureMyRoll()) return;
    setActionId(g._id ?? null);
    try {
      const res = await fetch(`/api/academy/groups/${g._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, rollNumber: myRoll }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error ?? t("অপারেশনটি ব্যর্থ হয়েছে", "Operation failed"), "error");
        return;
      }
      toast(
        action === "join" ? t("গ্রুপে যোগ হয়েছে", "Joined group") : t("গ্রুপ ত্যাগ করা হয়েছে", "Left group"),
        "success",
      );
      fetchData();
    } catch {
      toast(t("অপারেশনটি ব্যর্থ হয়েছে", "Operation failed"), "error");
    } finally {
      setActionId(null);
    }
  };

  const coursesForSelect = useMemo(
    () =>
      [...courses].sort((a, b) => {
        if (a.status === "Running" && b.status !== "Running") return -1;
        if (b.status === "Running" && a.status !== "Running") return 1;
        return a.courseId.localeCompare(b.courseId);
      }),
    [courses],
  );

  return (
    <div className="relative isolate mx-auto max-w-6xl px-4 pt-28 pb-20 sm:px-6 lg:px-8">
      <SectionHanzi char="组" className="-top-10 right-0" />

      <Breadcrumb
        items={[
          { label: t("হোম", "Home"), href: "/" },
          { label: t("একাডেমি", "Academy"), href: "/academy" },
          { label: t("স্টাডি গ্রুপ", "Study groups") },
        ]}
      />

      <PageHeader
        className="mt-6"
        eyebrow={<Eyebrow seal="组" label={t("স্টাডি গ্রুপ", "Study groups")} detail={`${groups.length}`} />}
        title={t("পরবর্তী ক্লাসের জোড়া", "Next-class pairs")}
        lede={t(
          "প্রতিটি কোর্সের স্টাডি গ্রুপ — নিজের গ্রুপ তৈরি করুন, যোগ দিন বা বের হয়ে যান।",
          "Every course's study groups — create your own, join, or leave any open group.",
        )}
        actions={
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={openCreate}>
              <Plus className="h-4 w-4" />
              {t("নতুন গ্রুপ", "New group")}
            </Button>
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

      <dl className="mt-10 grid grid-cols-3 divide-x divide-text/10 rounded-2xl border border-text/10 bg-card">
        <div className="px-5 py-5">
          <dt className="text-xs font-medium uppercase tracking-wide text-text/50">{t("গ্রুপ", "Groups")}</dt>
          <dd className="mt-1.5 text-2xl font-bold tabular-nums text-text">
            {loading ? <span className="text-text/30">—</span> : groups.length}
          </dd>
        </div>
        <div className="px-5 py-5">
          <dt className="text-xs font-medium uppercase tracking-wide text-text/50">{t("কোর্স", "Courses")}</dt>
          <dd className="mt-1.5 text-2xl font-bold tabular-nums text-text">
            {loading ? <span className="text-text/30">—</span> : byCourse.length}
          </dd>
        </div>
        <div className="px-5 py-5">
          <dt className="text-xs font-medium uppercase tracking-wide text-text/50">{t("শিক্ষার্থী", "Members")}</dt>
          <dd className="mt-1.5 text-2xl font-bold tabular-nums text-text">
            {loading ? <span className="text-text/30">—</span> : totalMembers}
          </dd>
        </div>
      </dl>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-text/10 bg-card/60 px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-text/70">
          <Hash className="h-4 w-4 text-text/40" />
          {myRoll ? (
            <>
              <span className="font-semibold text-text">{t("আপনার রোল", "Your roll")}</span>
              <span className="font-mono tabular-nums">#{myRoll}</span>
            </>
          ) : (
            <span>{t("গ্রুপে যোগ দিতে আপনার রোল নম্বর দরকার।", "Your roll number is needed to join or create groups.")}</span>
          )}
        </div>
        <Button size="sm" variant="ghost" onClick={() => { setMyRollDraft(myRoll); setRollDialog(true); }}>
          {myRoll ? t("রোল পরিবর্তন করুন", "Change roll") : t("রোল দিন", "Set your roll")}
        </Button>
      </div>

      {loading ? (
        <div className="mt-8">
          <LoadingBlock label={t("গ্রুপ লোড হচ্ছে", "Loading study groups")} rows={2} />
        </div>
      ) : byCourse.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title={t("এখনও কোনো স্টাডি গ্রুপ নেই", "No study groups yet")}
            description={t(
              "আপনিই প্রথম গ্রুপ তৈরি করুন — 'নতুন গ্রুপ' বোতামে চাপ দিন। অ্যাডমিন প্যানেল থেকে জোড়া তৈরি করলেও এখানে দেখা যাবে।",
              "Be the first — press 'New group' to create one. Admin-created pairs appear here too.",
            )}
            action={
              <Button size="sm" onClick={openCreate}>
                <Plus className="h-4 w-4" />
                {t("নতুন গ্রুপ", "New group")}
              </Button>
            }
          />
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          {byCourse.map(([courseId, list]) => {
            const course = courseById.get(courseId);
            return (
              <section key={courseId}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Eyebrow seal="组" label={course?.courseName ?? courseId} detail={`${list.length}`} />
                  </div>
                  <Link
                    href={`/academy/courses?course=${encodeURIComponent(courseId)}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-text underline decoration-text/25 underline-offset-4 hover:decoration-text"
                  >
                    {t("কোর্স পেজ", "Course page")}
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((g) => {
                    const isMine = myRoll ? g.memberRolls.includes(Number(myRoll)) : false;
                    return (
                      <Card key={g._id || g.label} className="p-4">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="truncate text-sm font-bold text-text">{g.label}</h3>
                          <span className="inline-flex items-center gap-1 rounded-lg bg-text/5 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-text/55">
                            <Users className="h-3 w-3" />
                            {g.memberRolls.length}
                          </span>
                        </div>
                        <ul className="mt-3 space-y-1.5">
                          {g.memberRolls.map((r) => {
                            const roll = String(r).trim();
                            const name = nameByRoll.get(roll);
                            return (
                              <li
                                key={roll}
                                className="flex items-baseline gap-2 rounded-lg bg-text/[0.03] px-2.5 py-1.5 text-xs"
                              >
                                <span className="w-10 shrink-0 font-mono tabular-nums text-text/40">#{r}</span>
                                <span className={name ? "font-semibold text-text" : "italic text-text/45"}>
                                  {name ?? t("অজানা", "Unknown")}
                                </span>
                                {myRoll && Number(myRoll) === r && (
                                  <span className="ml-auto rounded bg-text/10 px-1.5 py-0.5 text-[10px] font-bold text-text/70">
                                    {t("আপনি", "You")}
                                  </span>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                        <div className="mt-3 border-t border-text/10 pt-3">
                          {isMine ? (
                            <Button
                              size="sm"
                              variant="secondary"
                              loading={actionId === g._id}
                              onClick={() => joinLeave(g, "leave")}
                            >
                              {t("গ্রুপ ত্যাগ করুন", "Leave group")}
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              loading={actionId === g._id}
                              onClick={() => joinLeave(g, "join")}
                            >
                              {t("গ্রুপে যোগ দিন", "Join group")}
                            </Button>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* ══ my roll dialog ══ */}
      <Dialog
        open={rollDialog}
        onClose={() => setRollDialog(false)}
        title={t("আপনার রোল নম্বর", "Your roll number")}
        description={t(
          "'স্টুডেন্ট কনিষ্ঠ' থেকে চেক করে যোগ দিতে পারেন।",
          "Matching an approved student entry lets you join or create groups.",
        )}
        footer={
          <>
            <Button variant="ghost" onClick={() => setRollDialog(false)}>
              {t("বাতিল", "Cancel")}
            </Button>
            <Button onClick={submitRoll}>{t("সংরক্ষণ করুন", "Save")}</Button>
          </>
        }
      >
        <Field label={t("রোল নম্বর", "Roll number")} required hint={t("যেমন 21", "e.g. 21")}>
          <input
            className="w-full rounded-lg border border-text/15 bg-card px-3 py-2 text-sm text-text outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text"
            inputMode="numeric"
            autoFocus
            value={myRollDraft}
            onChange={(e) => setMyRollDraft(e.target.value.replace(/[^0-9]/g, ""))}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitRoll();
            }}
            placeholder="21"
          />
        </Field>
      </Dialog>

      {/* ══ create group dialog ══ */}
      <Dialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={t("নতুন স্টাডি গ্রুপ", "New study group")}
        description={t(
          "যে কোর্সে আপনি ভর্তি হয়েছেন সেটি বেছে নিন — এটি পরীক্ষা করে যাচাই করা হবে।",
          "Pick the course you are enrolled in — it will be verified against your roll.",
        )}
        footer={
          <>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>
              {t("বাতিল", "Cancel")}
            </Button>
            <Button loading={creating} onClick={createGroup}>
              {t("গ্রুপ তৈরি করুন", "Create group")}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <SelectField
            label={t("কোর্স", "Course")}
            required
            value={createCourse}
            onChange={(e) => setCreateCourse(e.target.value)}
          >
            <option value="">{t("কোর্স বেছে নিন…", "Choose a course…")}</option>
            {coursesForSelect.map((c) => (
              <option key={c.courseId} value={c.courseId}>
                {c.courseName} ({c.courseId})
              </option>
            ))}
          </SelectField>

          <Field label={t("গ্রুপের নাম", "Group label")} hint={t("ঐচ্ছিক — যেমন 'সন্ধ্যার বাচ্চারা'", "Optional — e.g. 'Evening squad'")}>
            <input
              className="w-full rounded-lg border border-text/15 bg-card px-3 py-2 text-sm text-text outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text"
              value={createLabel}
              onChange={(e) => setCreateLabel(e.target.value)}
              placeholder={t("মৌলিক জোড়া", "Core pair")}
            />
          </Field>

          <Field label={t("আপনার রোল নম্বর", "Your roll number")} required>
            <input
              className="w-full rounded-lg border border-text/15 bg-card px-3 py-2 text-sm text-text outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text"
              inputMode="numeric"
              value={createRoll}
              onChange={(e) => setCreateRoll(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="21"
            />
          </Field>
        </div>
      </Dialog>
    </div>
  );
}