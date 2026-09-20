"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Check,
  ChevronDown,
  Pencil,
  Plus,
  Radio,
  RefreshCw,
  Trash2,
  Users,
  BookOpen,
  ClipboardList,
  Link2,
  Save,
  GraduationCap,
  Tags,
} from "lucide-react";
import { useLanguage } from "@/i18n";
import { AdminShell } from "@/features/academy";
import {
  Button,
  Card,
  Dialog,
  EmptyState,
  Field,
  IconButton,
  LoadingBlock,
  SelectField,
  StatusPill,
  TextArea,
  useConfirm,
  useToast,
} from "@/components/ui";

const ADMIN_PASSCODE = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "8131";
const TEACHER_PASSCODE = process.env.TEACHER_PASSCODE || "2026";

type ClassRow = {
  classId: string;
  date?: string;
  time?: string;
  contentCovered?: {
    summary?: string;
    topic?: string;
    fromLesson?: number;
    fromText?: number;
    toLesson?: number;
    toText?: number;
  };
  presentStudents?: (string | number)[];
  absentStudents?: (string | number)[];
};

type Course = {
  courseId: string;
  courseName: string;
  targetLevel: string;
  status: string;
  startDate?: string;
  nextBatchRegistrationDate?: string;
  lessons: { lessonNumber: number; title: string; description?: string }[];
  nextClassTopic?: string;
  topics: string[];
  registrationOpen: boolean;
  registrationLastDate?: string;
  totalLessons: number;
  totalClassesPlanned: number;
  classes?: ClassRow[];
};

type Student = {
  rollNumber: string | number;
  nameEnglish: string;
  enrolledCourseIds?: string[];
  enrolledCourseId?: string;
};

type PendingLog = {
  _id: string;
  courseId: string;
  classId: string;
  date?: string;
  time?: string;
  contentCovered?: { summary?: string; topic?: string };
};

type ClassForm = {
  courseId: string;
  classId: string; // empty for create
  date: string;
  time: string;
  topic: string;
  presentStudents: string[];
};

const EMPTY_COURSE: Course = {
  courseId: "",
  courseName: "",
  targetLevel: "HSK 1",
  status: "Coming Soon",
  startDate: "",
  nextBatchRegistrationDate: "",
  lessons: [],
  nextClassTopic: "",
  topics: [],
  registrationOpen: false,
  registrationLastDate: "",
  totalLessons: 15,
  totalClassesPlanned: 24,
};

const summaryOf = (cc: { topic?: string; fromLesson?: number; toLesson?: number; summary?: string }) =>
  cc.topic?.trim() ||
  (cc.fromLesson != null
    ? `Lesson ${cc.fromLesson}${cc.toLesson != null && cc.toLesson !== cc.fromLesson ? `–${cc.toLesson}` : ""}`
    : cc.summary || "Regular session");

export default function AdminCoursesPage() {
  const { language } = useLanguage();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );
  const toast = useToast();
  const confirm = useConfirm();

  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [pendingLogs, setPendingLogs] = useState<PendingLog[]>([]);
  const [loading, setLoading] = useState(true);
  // collapse state for the (often long) class-log lists, keyed by courseId
  const [logOpen, setLogOpen] = useState<Record<string, boolean>>({});

  // course dialog
  const [form, setForm] = useState<Course | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // class log dialog (create + edit share it)
  const [classForm, setClassForm] = useState<ClassForm | null>(null);
  const [savingClass, setSavingClass] = useState(false);
  const [busyLog, setBusyLog] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [crs, stu, pnd] = await Promise.all([
        fetch("/api/academy/courses", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/academy/students?status=Approved", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/academy/classes/pending", { cache: "no-store" }).then((r) => r.json()),
      ]);
      if (crs.success) setCourses(crs.courses || []);
      if (stu.success) setStudents(stu.students || []);
      if (pnd.success) setPendingLogs(pnd.pendingClasses || []);
    } catch {
      toast(t("ডেটা লোড করা যায়নি।", "Couldn't load data."), "error");
    } finally {
      setLoading(false);
    }
  }, [t, toast]);

  // ── live class sessions ──────────────────────────────────────────────
  const [liveSessions, setLiveSessions] = useState<
    { _id: string; courseId: string; meetLink: string; topic?: string; assignmentPrompt?: string; date: string; time?: string; open: boolean; attendance: { rollNumber: number; name: string }[] }[]
  >([]);
  const [liveOpen, setLiveOpen] = useState<Course | null>(null); // course being turned on
  const [liveForm, setLiveForm] = useState({
    meetLink: "",
    date: new Date().toISOString().slice(0, 10),
    time: "",
    topic: "",
    assignmentPrompt: "",
  });
  const [liveSaving, setLiveSaving] = useState(false);
  const [busyLive, setBusyLive] = useState<string | null>(null);

  // ── saved Google Meet links per course ─────────────────────────────────
  const [linksOpen, setLinksOpen] = useState<Course | null>(null);
  const [links, setLinks] = useState<{ _id: string; courseId: string; label: string; meetLink: string; topic: string }[]>([]);
  const [linkForm, setLinkForm] = useState<{ _id?: string; label: string; meetLink: string; topic: string }>({ label: "", meetLink: "", topic: "" });
  const [linksBusy, setLinksBusy] = useState(false);

  const fetchLinks = useCallback(async (courseId: string) => {
    try {
      const res = await fetch(`/api/academy/live/links?courseId=${encodeURIComponent(courseId)}`, { cache: "no-store" });
      const data = await res.json();
      if (data.success) setLinks(data.links || []);
    } catch {
      /* ignore */
    }
  }, []);

  const openLinks = (course: Course) => {
    setLinksOpen(course);
    setLinkForm({ label: "", meetLink: "", topic: "" });
    fetchLinks(course.courseId);
  };

  const saveLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linksOpen) return;
    if (!linkForm.meetLink.trim()) {
      toast(t("মিট লিংক দিন।", "Enter a Meet link."), "error");
      return;
    }
    setLinksBusy(true);
    try {
      const isEdit = !!linkForm._id;
      const res = await fetch(
        isEdit ? `/api/academy/live/links/${linkForm._id}` : "/api/academy/live/links",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseId: linksOpen.courseId,
            label: linkForm.label,
            meetLink: linkForm.meetLink,
            topic: linkForm.topic,
            adminPasscode: ADMIN_PASSCODE,
          }),
        },
      );
      const data = await res.json();
      if (data.success) {
        toast(isEdit ? t("লিংক আপডেট হয়েছে।", "Link updated.") : t("লিংক সংরক্ষিত হয়েছে।", "Link saved."), "success");
        setLinkForm({ label: "", meetLink: "", topic: "" });
        fetchLinks(linksOpen.courseId);
      } else {
        toast(data.error || data.message || t("সংরক্ষণ হয়নি।", "Save failed."), "error");
      }
    } catch {
      toast(t("সমস্যা হয়েছে।", "Something went wrong."), "error");
    } finally {
      setLinksBusy(false);
    }
  };

  const deleteLink = async (id: string) => {
    const ok = await confirm({
      title: t("মিট লিংক মুছবেন?", "Delete this Meet link?"),
      message: t("এই সংরক্ষিত লিংকটি মুছে ফেলা হবে।", "This saved link will be removed."),
      confirmLabel: t("মুছুন", "Delete"),
      destructive: true,
    });
    if (!ok) return;
    try {
      const res = await fetch(`/api/academy/live/links/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminPasscode: ADMIN_PASSCODE }),
      });
      const data = await res.json();
      if (data.success) fetchLinks(linksOpen!.courseId);
      else toast(data.error || t("মোছা যায়নি।", "Delete failed."), "error");
    } catch {
      toast(t("সমস্যা হয়েছে।", "Something went wrong."), "error");
    }
  };

  // ── end-class dialog (fill class log, then close) ─────────────────────
  const [closeOpen, setCloseOpen] = useState<{
    session: { _id: string; courseId: string; date: string; time?: string; attendance: { rollNumber: number; name: string }[]; open: boolean };
    course: Course;
  } | null>(null);
  const [closeForm, setCloseForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    time: "",
    topic: "",
    presentStudents: [] as string[],
  });
  const [closeBusy, setCloseBusy] = useState(false);

  // ── new LMS controls ──────────────────────────────────────────────────
  const [topicsOpen, setTopicsOpen] = useState<Course | null>(null);
  const [topicsForm, setTopicsForm] = useState<string[]>([]);

  const [lessonsOpen, setLessonsOpen] = useState<Course | null>(null);
  const [lessonsForm, setLessonsForm] = useState<{ lessonNumber: number; title: string; description: string }[]>([]);

  const [groupsOpen, setGroupsOpen] = useState<Course | null>(null);
  const [groups, setGroups] = useState<{ _id: string; courseId: string; label: string; memberRolls: number[] }[]>([]);
  const [groupLabel, setGroupLabel] = useState("");
  const [groupMembers, setGroupMembers] = useState<number[]>([]);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [groupsBusy, setGroupsBusy] = useState(false);

  const [markOpen, setMarkOpen] = useState<{ course: Course; session: { _id: string; topic?: string } } | null>(null);
  const [markMap, setMarkMap] = useState<Record<string, { mark: string; feedback: string }>>({});
  const [markBusy, setMarkBusy] = useState(false);

  const [regOpen, setRegOpen] = useState<Course | null>(null); // registration dialog

  // edit an already-live class (fix Meet link / topic / assignment)
  const [liveEdit, setLiveEdit] = useState<{ course: Course; session: { _id: string; meetLink: string; topic?: string; assignmentPrompt?: string } } | null>(null);
  const [liveEditForm, setLiveEditForm] = useState({ meetLink: "", topic: "", assignmentPrompt: "" });
  const [liveEditBusy, setLiveEditBusy] = useState(false);

  const saveLiveMeta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveEdit) return;
    setLiveEditBusy(true);
    try {
      const res = await fetch("/api/academy/live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "set-meta",
          id: liveEdit.session._id,
          newMeetLink: liveEditForm.meetLink,
          topic: liveEditForm.topic,
          assignmentPrompt: liveEditForm.assignmentPrompt,
          adminPasscode: ADMIN_PASSCODE,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast(t("লাইভ ক্লাস আপডেট হয়েছে।", "Live class updated."), "success");
        setLiveEdit(null);
        fetchLive();
      } else {
        toast(data.error || t("আপডেট হয়নি।", "Update failed."), "error");
      }
    } catch {
      toast(t("সমস্যা হয়েছে।", "Something went wrong."), "error");
    } finally {
      setLiveEditBusy(false);
    }
  };

  const fetchLive = useCallback(async () => {
    try {
      const res = await fetch("/api/academy/live", { cache: "no-store" });
      const data = await res.json();
      if (data.success) setLiveSessions(data.sessions || []);
    } catch {
      /* ignore */
    }
  }, []);

  const openLive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveOpen || !liveForm.meetLink.trim()) return;
    setLiveSaving(true);
    try {
      const res = await fetch("/api/academy/live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "open",
          courseId: liveOpen.courseId,
          meetLink: liveForm.meetLink,
          date: liveForm.date,
          time: liveForm.time,
          topic: liveForm.topic,
          assignmentPrompt: liveForm.assignmentPrompt,
          adminPasscode: ADMIN_PASSCODE,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast(t("ক্লাস চালু হয়েছে — একাডেমি পেজে লাইভ বাটন দেখা যাবে।", "Class is live — the academy page now shows the live button."), "success");
        setLiveOpen(null);
        setLiveForm({ meetLink: "", date: new Date().toISOString().slice(0, 10), time: "", topic: "", assignmentPrompt: "" });
        fetchLive();
      } else {
        toast(data.error || t("চালু হয়নি।", "Failed."), "error");
      }
    } catch {
      toast(t("সমস্যা হয়েছে।", "Something went wrong."), "error");
    } finally {
      setLiveSaving(false);
    }
  };

  const openClose = (courseId: string) => {
    const session = liveSessions.find((s) => s.courseId === courseId && s.open);
    if (!session) return;
    setCloseForm({
      date: session.date || new Date().toISOString().slice(0, 10),
      time: session.time || "",
      topic: session.topic || "",
      presentStudents: (session.attendance ?? []).map((a) => String(a.rollNumber).trim()),
    });
    setCloseOpen({ session, course: courses.find((c) => c.courseId === courseId) as Course });
  };

  const saveClose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!closeOpen) return;
    const enrolled = enrolledFor(closeOpen.course.courseId).map((s) => String(s.rollNumber).trim());
    const absent = enrolled.filter((r) => !closeForm.presentStudents.includes(r));
    setCloseBusy(true);
    try {
      const res = await fetch("/api/academy/live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "close-merge",
          id: closeOpen.session._id,
          contentCovered: {
            date: closeForm.date,
            time: closeForm.time,
            topic: closeForm.topic.trim(),
          },
          presentStudents: closeForm.presentStudents,
          absentStudents: absent,
          adminPasscode: ADMIN_PASSCODE,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast(t("ক্লাস বন্ধ হয়েছে এবং ক্লাস লগ সংরক্ষিত হয়েছে।", "Class ended and the class log was saved."), "success");
        setCloseOpen(null);
        fetchLive();
        fetchAll();
      } else {
        toast(data.error || t("বন্ধ হয়নি।", "Failed."), "error");
      }
    } catch {
      toast(t("সমস্যা হয়েছে।", "Something went wrong."), "error");
    } finally {
      setCloseBusy(false);
    }
  };

  // ── study groups ───────────────────────────────────────────────────────
  const openGroups = async (course: Course) => {
    setGroupsOpen(course);
    setGroupLabel("");
    setGroupMembers([]);
    setEditingGroupId(null);
    setGroupsBusy(true);
    try {
      const res = await fetch(`/api/academy/groups?courseId=${encodeURIComponent(course.courseId)}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (data.success) setGroups(data.groups || []);
    } catch {
      /* ignore */
    } finally {
      setGroupsBusy(false);
    }
  };

  const editGroup = (g: { _id: string; label: string; memberRolls: number[] }) => {
    setEditingGroupId(g._id);
    setGroupLabel(g.label);
    setGroupMembers([...g.memberRolls]);
  };

  const saveGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupsOpen) return;
    if (groupMembers.length === 0) {
      toast(t("কমপক্ষে একজন শিক্ষার্থী সিলেক্ট করুন।", "Select at least one student."), "error");
      return;
    }
    setGroupsBusy(true);
    try {
      const isEdit = editingGroupId !== null;
      const res = await fetch(
        isEdit ? `/api/academy/groups/${editingGroupId}` : "/api/academy/groups",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseId: groupsOpen.courseId,
            label: groupLabel,
            memberRolls: groupMembers,
            adminPasscode: ADMIN_PASSCODE,
          }),
        },
      );
      const data = await res.json();
      if (data.success) {
        toast(
          isEdit
            ? t("স্টাডি গ্রুপ আপডেট হয়েছে।", "Study group updated.")
            : t("স্টাডি গ্রুপ তৈরি হয়েছে।", "Study group created."),
          "success",
        );
        setGroupLabel("");
        setGroupMembers([]);
        setEditingGroupId(null);
        openGroups(groupsOpen);
      } else {
        toast(data.error || t("সংরক্ষণ হয়নি।", "Save failed."), "error");
      }
    } catch {
      toast(t("সমস্যা হয়েছে।", "Something went wrong."), "error");
    } finally {
      setGroupsBusy(false);
    }
  };

  const deleteGroup = async (groupId: string) => {
    const ok = await confirm({
      title: t("গ্রুপ মুছবেন?", "Delete this group?"),
      message: t("এই গ্রুপটি মুছে ফেলা হবে।", "This group will be deleted."),
      confirmLabel: t("মুছুন", "Delete"),
      destructive: true,
    });
    if (!ok) return;
    setGroupsBusy(true);
    try {
      const res = await fetch(`/api/academy/groups/${groupId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminPasscode: ADMIN_PASSCODE }),
      });
      const data = await res.json();
      if (data.success && groupsOpen) openGroups(groupsOpen);
      else if (!data.success) toast(data.error || t("মোছা যায়নি।", "Delete failed."), "error");
    } catch {
      toast(t("সমস্যা হয়েছে।", "Something went wrong."), "error");
    } finally {
      setGroupsBusy(false);
    }
  };

  // ── settings helpers ───────────────────────────────────────────────────
  const saveSettings = async (
    courseId: string,
    fields: Record<string, unknown>,
    successMsg: string,
  ) => {
    try {
      const res = await fetch(`/api/academy/courses/${courseId}/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, adminPasscode: ADMIN_PASSCODE }),
      });
      const data = await res.json();
      if (data.success) {
        setCourses((prev) => prev.map((c) => (c.courseId === courseId ? { ...c, ...(data.course as Course) } : c)));
        toast(successMsg, "success");
        return true;
      }
      toast(data.message || data.error || t("সংরক্ষণ হয়নি।", "Save failed."), "error");
      return false;
    } catch {
      toast(t("সমস্যা হয়েছে।", "Something went wrong."), "error");
      return false;
    }
  };

  const saveTopics = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicsOpen) return;
    const clean = topicsForm.map((x) => x.trim()).filter(Boolean);
    const ok = await saveSettings(
      topicsOpen.courseId,
      { topics: clean },
      t("টপিকসমূহ সংরক্ষিত হয়েছে।", "Topics saved."),
    );
    if (ok) setTopicsOpen(null);
  };

  const saveLessons = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonsOpen) return;
    const clean = lessonsForm
      .filter((l) => l.title.trim())
      .map((l) => ({ lessonNumber: Number(l.lessonNumber) || 0, title: l.title.trim(), description: l.description.trim() }))
      .sort((a, b) => a.lessonNumber - b.lessonNumber);
    const ok = await saveSettings(
      lessonsOpen.courseId,
      { lessons: clean },
      t("পাঠসমূহ সংরক্ষিত হয়েছে।", "Lessons saved."),
    );
    if (ok) setLessonsOpen(null);
  };

  const saveRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regOpen) return;
    const ok = await saveSettings(
      regOpen.courseId,
      {
        registrationOpen: !regOpen.registrationOpen,
        registrationLastDate: regOpen.registrationLastDate || null,
        nextBatchRegistrationDate: regOpen.nextBatchRegistrationDate || null,
      },
      regOpen.registrationOpen
        ? t("রেজিস্ট্রেশন বন্ধ করা হয়েছে।", "Registration turned off.")
        : t("রেজিস্ট্রেশন চালু করা হয়েছে।", "Registration turned on."),
    );
    if (ok) setRegOpen(null);
  };

  const saveMarks = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!markOpen) return;
    setMarkBusy(true);
    const marks = Object.entries(markMap)
      .map(([roll, v]) => ({
        rollNumber: Number(roll),
        mark: Number(v.mark) || 0,
        feedback: v.feedback,
      }))
      .filter((m) => Number.isFinite(m.rollNumber) && m.rollNumber > 0);
    try {
      const res = await fetch("/api/academy/live/marks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ liveClassId: markOpen.session._id, marks, adminPasscode: ADMIN_PASSCODE }),
      });
      const data = await res.json();
      if (data.success) {
        toast(t("মার্ক সংরক্ষিত হয়েছে — শিক্ষার্থীরা দেখতে পাবে।", "Marks saved — students can see them."), "success");
        setMarkOpen(null);
      } else {
        toast(data.error || t("সংরক্ষণ হয়নি।", "Save failed."), "error");
      }
    } catch {
      toast(t("সমস্যা হয়েছে।", "Something went wrong."), "error");
    } finally {
      setMarkBusy(false);
    }
  };

  useEffect(() => {
    queueMicrotask(() => {
      fetchAll();
      fetchLive();
    });
  }, [fetchAll, fetchLive]);

  const set = <K extends keyof Course>(key: K, value: Course[K]) =>
    setForm((f) => (f ? { ...f, [key]: value } : f));

  const enrolledFor = useCallback(
    (courseId: string) =>
      students.filter((s) => {
        if (Array.isArray(s.enrolledCourseIds))
          return s.enrolledCourseIds.some((id) => id.toLowerCase() === courseId.toLowerCase());
        return s.enrolledCourseId ? s.enrolledCourseId.toLowerCase() === courseId.toLowerCase() : false;
      }),
    [students],
  );

  // ── course dialog (existing behaviour) ────────────────────────────────
  const submitCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    const payload = {
      courseId: form.courseId,
      courseName: form.courseName,
      targetLevel: form.targetLevel,
      status: form.status,
      startDate: form.startDate,
      nextBatchRegistrationDate: form.nextBatchRegistrationDate,
      totalLessons: Number(form.totalLessons),
      totalClassesPlanned: Number(form.totalClassesPlanned),
    };
    try {
      const res = await fetch(
        editing ? `/api/academy/courses/${form.courseId}` : "/api/academy/courses",
        {
          method: editing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (data.success ?? res.ok) {
        toast(editing ? t("কোর্স আপডেট হয়েছে।", "Course updated.") : t("কোর্স তৈরি হয়েছে।", "Course created."), "success");
        setForm(null);
        fetchAll();
      } else {
        toast(data.error || data.message || t("সংরক্ষণ হয়নি।", "Save failed."), "error");
      }
    } catch {
      toast(t("সমস্যা হয়েছে।", "Something went wrong."), "error");
    } finally {
      setSaving(false);
    }
  };

  // ── class log: create + edit ─────────────────────────────────────────
  const openClassCreate = (courseId: string) =>
    setClassForm({
      courseId,
      classId: "",
      date: new Date().toISOString().slice(0, 10),
      time: "",
      topic: "",
      presentStudents: [],
    });

  const openClassEdit = (courseId: string, cls: ClassRow) =>
    setClassForm({
      courseId,
      classId: cls.classId,
      date: cls.date ?? "",
      time: cls.time ?? "",
      topic: cls.contentCovered?.topic || cls.contentCovered?.summary || "",
      presentStudents: (cls.presentStudents ?? []).map((r) => String(r).trim()),
    });

  const saveClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classForm) return;
    setSavingClass(true);
    const isCreate = !classForm.classId;
    const enrolled = enrolledFor(classForm.courseId).map((s) => String(s.rollNumber).trim());
    const absent = enrolled.filter((r) => !classForm.presentStudents.includes(r));
    try {
      if (isCreate) {
        // 1) create a pending class log
        const res = await fetch("/api/academy/classes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            teacherPasscode: TEACHER_PASSCODE,
            courseId: classForm.courseId,
            date: classForm.date,
            time: classForm.time,
            contentCovered: {
              topic: classForm.topic.trim(),
              summary: classForm.topic.trim() || `Class ${classForm.date}`,
            },
            presentStudents: classForm.presentStudents,
            absentStudents: absent,
          }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || t("তৈরি হয়নি।", "Create failed."));

        // 2) admin auto-approves so it merges straight into the course
        const ap = await fetch("/api/academy/classes/approve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ logId: data.classLog._id, action: "APPROVE", adminPasscode: ADMIN_PASSCODE }),
        });
        const apData = await ap.json();
        if (!apData.success) throw new Error(apData.message || t("অনুমোদন হয়নি।", "Approval failed."));

        toast(t("নতুন ক্লাস লগ যোগ হয়েছে।", "New class log added."), "success");
      } else {
        const res = await fetch("/api/academy/classes/edit", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseId: classForm.courseId,
            classId: classForm.classId,
            date: classForm.date,
            time: classForm.time,
            contentCovered: {
              topic: classForm.topic.trim(),
              summary: classForm.topic.trim() || `Class ${classForm.date}`,
            },
            presentStudents: classForm.presentStudents,
            absentStudents: absent,
            adminPasscode: ADMIN_PASSCODE,
          }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || t("আপডেট হয়নি।", "Update failed."));
        toast(t("ক্লাস লগ আপডেট হয়েছে।", "Class log updated."), "success");
      }

      setClassForm(null);
      fetchAll();
    } catch (err) {
      toast(err instanceof Error ? err.message : t("সমস্যা হয়েছে।", "Something went wrong."), "error");
    } finally {
      setSavingClass(false);
    }
  };

  const removeClass = async (courseId: string, classId: string) => {
    const ok = await confirm({
      title: t("ক্লাস লগ মুছবেন?", "Delete this class log?"),
      message: t(
        `${classId} মুছে ফেলা হবে এবং পরের ক্লাসগুলো এক ধাপ এগিয়ে আসবে।`,
        `${classId} will be removed and later classes shift up to fill the gap.`,
      ),
      confirmLabel: t("মুছুন", "Delete"),
      destructive: true,
    });
    if (!ok) return;
    setBusyLog(`${courseId}-${classId}`);
    try {
      const res = await fetch("/api/academy/classes/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, classId, adminPasscode: ADMIN_PASSCODE }),
      });
      const result = await res.json();
      if (result.success) {
        toast(t("ক্লাস লগ মুছে ফেলা হয়েছে।", "Class log deleted."), "success");
        fetchAll();
      } else {
        toast(result.message || t("মোছা যায়নি।", "Delete failed."), "error");
      }
    } catch {
      toast(t("সমস্যা হয়েছে।", "Something went wrong."), "error");
    } finally {
      setBusyLog(null);
    }
  };

  // ── pending logs: approve / reject from right here ────────────────────
  const actOnLog = async (logId: string, action: "APPROVE" | "REJECT") => {
    if (action === "REJECT") {
      const ok = await confirm({
        title: t("ক্লাস লগ প্রত্যাখ্যান?", "Reject class log?"),
        message: t("এই লগটি মুছে ফেলা হবে।", "This log will be discarded."),
        confirmLabel: t("প্রত্যাখ্যান", "Reject"),
        destructive: true,
      });
      if (!ok) return;
    }
    setBusyLog(logId);
    try {
      const res = await fetch("/api/academy/classes/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logId, action, adminPasscode: ADMIN_PASSCODE }),
      });
      const data = await res.json();
      if (data.success) {
        toast(
          action === "APPROVE" ? t("লগ অনুমোদিত — কোর্সে যুক্ত হয়েছে।", "Log approved and merged into the course.") : t("লগ প্রত্যাখ্যাত।", "Log rejected."),
          "success",
        );
        fetchAll();
      } else {
        toast(data.message || t("কাজটি সম্পন্ন হয়নি।", "Action failed."), "error");
      }
    } catch {
      toast(t("সমস্যা হয়েছে।", "Something went wrong."), "error");
    } finally {
      setBusyLog(null);
    }
  };

  const classNum = (key: "topic", label: string) =>
    classForm && (
      <Field
        key={key}
        label={label}
        value={String(classForm[key])}
        onChange={(e) => setClassForm((f) => (f ? { ...f, [key]: e.target.value } : f))}
      />
    );

  const enrolledInClassForm = useMemo(
    () => (classForm ? enrolledFor(classForm.courseId) : []),
    [classForm, enrolledFor],
  );

  return (
    <AdminShell
      title={t("কোর্স ট্র্যাক", "Course tracks")}
      crumb={t("কোর্স", "Courses")}
      seal="书"
      lede={t(
        "নতুন কোর্স তৈরি করুন, ব্যাচের সময়সূচি সম্পাদনা করুন — প্রতিটি কোর্সের ক্লাস লগ এখান থেকেই তৈরি, সম্পাদনা ও অনুমোদন করুন।",
        "Create courses and edit cohort schedules — create, edit and approve each course's class logs right from here."
      )}
      actions={
        <>
          <Button
            size="sm"
            variant="secondary"
            iconLeft={<Plus className="h-4 w-4" />}
            onClick={() => {
              setEditing(false);
              setForm({ ...EMPTY_COURSE });
            }}
          >
            {t("নতুন কোর্স", "New course")}
          </Button>
          <IconButton label={t("রিফ্রেশ", "Refresh")} size="sm" spinning={loading} onClick={fetchAll}>
            <RefreshCw className="h-4 w-4" />
          </IconButton>
        </>
      }
    >
      {loading ? (
        <LoadingBlock label={t("লোড হচ্ছে", "Loading")} rows={3} />
      ) : courses.length === 0 ? (
        <EmptyState
          title={t("কোনো কোর্স নেই", "No courses yet")}
          description={t("প্রথম কোর্সটি তৈরি করুন।", "Create the first course to get started.")}
        />
      ) : (
        <div className="space-y-6">
          {courses.map((c) => {
            const coursePending = pendingLogs.filter(
              (p) => (p.courseId || "").toLowerCase() === c.courseId.toLowerCase(),
            );
            const enrolled = enrolledFor(c.courseId);

            return (
              <Card key={c.courseId} className="p-5">
                {/* course header */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-base font-bold text-text">{c.courseName}</h2>
                    <p className="mt-0.5 text-xs font-mono tabular-nums text-text/55">
                      {c.courseId} · {c.targetLevel}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {(() => {
                      const live = liveSessions.find((s) => s.courseId === c.courseId && s.open);
                      return live ? (
                        <>
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-danger/40 bg-danger/10 px-2.5 py-1 text-[11px] font-bold text-danger">
                            <span className="size-1.5 animate-pulse rounded-full bg-danger" />
                            LIVE
                          </span>
                          <Button
                            size="sm"
                            variant="danger"
                            disabled={busyLive === `live-${c.courseId}`}
                            onClick={() => openClose(c.courseId)}
                          >
                            {t("ক্লাস শেষ", "End class")}
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant="secondary"
                          iconLeft={<Radio className="h-4 w-4" />}
                          onClick={() => {
                            setLiveOpen(c);
                            setLiveForm({ meetLink: "", date: new Date().toISOString().slice(0, 10), time: "", topic: "", assignmentPrompt: "" });
                            fetchLinks(c.courseId);
                          }}
                        >
                          {t("ক্লাস অন", "Class on")}
                        </Button>
                      );
                    })()}
                    <StatusPill
                      tone={c.status === "Running" ? "done" : c.status === "Completed" ? "neutral" : "pending"}
                    >
                      {c.status}
                    </StatusPill>
                    <IconButton
                      label={t("কোর্স সম্পাদনা", "Edit course")}
                      size="sm"
                      onClick={() => {
                        setEditing(true);
                        setForm({ ...EMPTY_COURSE, ...c });
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </IconButton>
                  </div>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-text/55">
                  <span className="tabular-nums">
                    {t(
                      `${(c.classes?.length ?? 0)}/${c.totalClassesPlanned} ক্লাস`,
                      `${c.classes?.length ?? 0}/${c.totalClassesPlanned} classes`,
                    )}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">
                    {enrolled.length} {t("শিক্ষার্থী", "students")}
                  </span>
                </div>

                {/* ── LMS controls: registration, lessons, topic, groups ── */}
                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-text/10 pt-3">
                  <Button
                    size="sm"
                    variant="ghost"
                    iconLeft={<Link2 className="h-4 w-4" />}
                    onClick={() => openLinks(c)}
                  >
                    {t("মিট লিংক", "Meet links")}
                  </Button>
                  <Button
                    size="sm"
                    variant={c.registrationOpen ? "secondary" : "ghost"}
                    iconLeft={<GraduationCap className="h-4 w-4" />}
                    onClick={() => {
                      setRegOpen(c);
                    }}
                  >
                    {c.registrationOpen
                      ? t("রেজিস্ট্রেশন চালু", "Registration open")
                      : t("রেজিস্ট্রেশন বন্ধ", "Registration off")}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    iconLeft={<BookOpen className="h-4 w-4" />}
                    onClick={() => {
                      setLessonsForm(
                        (c.lessons ?? []).map((l) => ({
                          lessonNumber: l.lessonNumber,
                          title: l.title,
                          description: l.description ?? "",
                        })),
                      );
                      setLessonsOpen(c);
                    }}
                  >
                    {t("পাঠসমূহ", "Lessons")} {(c.lessons?.length ?? 0)}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    iconLeft={<Tags className="h-4 w-4" />}
                    onClick={() => {
                      setTopicsForm((c.topics ?? []).map((x) => x));
                      setTopicsOpen(c);
                    }}
                  >
                    {t("টপিকসমূহ", "Topics")} {(c.topics?.length ?? 0)}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    iconLeft={<Users className="h-4 w-4" />}
                    onClick={() => openGroups(c)}
                  >
                    {t("স্টাডি গ্রুপ", "Study groups")}
                  </Button>
                </div>
                {(() => {
                  const latest = c.nextClassTopic || (c.topics && c.topics.length ? c.topics[c.topics.length - 1] : "");
                  return latest ? (
                    <p className="mt-2 rounded-lg bg-secondary/[0.07] px-3 py-2 text-xs font-medium text-secondary">
                      {t("পরবর্তী ক্লাসের টপিক:", "Next class topic:")}{" "}
                      <span className="font-semibold">{latest}</span>
                    </p>
                  ) : null;
                })()}

                {/* ── live class management ── */}
                {(() => {
                  const live = liveSessions.find((s) => s.courseId === c.courseId && s.open);
                  if (!live) return null;
                  return (
                    <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-danger/30 bg-danger/[0.05] px-3 py-2.5">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-danger">
                        <span className="size-1.5 animate-pulse rounded-full bg-danger" /> LIVE
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        iconLeft={<Link2 className="h-4 w-4" />}
                        onClick={() => {
                          setLiveEditForm({
                            meetLink: live.meetLink,
                            topic: live.topic ?? "",
                            assignmentPrompt: live.assignmentPrompt ?? "",
                          });
                          setLiveEdit({ course: c, session: live });
                        }}
                      >
                        {t("লিংক/টপিক ঠিক করুন", "Fix link / topic")}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        iconLeft={<ClipboardList className="h-4 w-4" />}
                        onClick={() => setMarkOpen({ course: c, session: { _id: live._id, topic: live.topic } })}
                      >
                        {t("মার্ক দিন", "Mark assignments")}
                      </Button>
                    </div>
                  );
                })()}

                {/* ── pending logs for this course ── */}
                {coursePending.length > 0 && (
                  <div className="mt-4 rounded-xl border border-warn/30 bg-warn-surface/50 p-3.5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-warn">
                      {t(
                        `${coursePending.length}টি অপেক্ষমাণ লগ — অনুমোদন দিন`,
                        `${coursePending.length} pending log(s) — approve here`,
                      )}
                    </p>
                    <ul className="mt-2.5 space-y-2">
                      {coursePending.map((log) => (
                        <li
                          key={log._id}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-warn/25 bg-card px-3 py-2 text-xs"
                        >
                          <span className="min-w-0 truncate">
                            <span className="font-mono font-semibold text-text/70">{log.classId}</span>{" "}
                            · {log.contentCovered?.topic || log.contentCovered?.summary || t("নিয়মিত ক্লাস", "Regular session")} ·{" "}
                            <span className="tabular-nums">{log.date}</span>
                          </span>
                          <span className="flex gap-1.5">
                            <Button
                              size="sm"
                              loading={busyLog === log._id}
                              onClick={() => actOnLog(log._id, "APPROVE")}
                              iconLeft={<Check className="h-3.5 w-3.5" />}
                            >
                              {t("অনুমোদন", "Approve")}
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              disabled={busyLog === log._id}
                              onClick={() => actOnLog(log._id, "REJECT")}
                            >
                              {t("বাতিল", "Reject")}
                            </Button>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* ── class log list ── */}
                <div className="mt-4 border-t border-text/10 pt-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setLogOpen((prev) => ({ ...prev, [c.courseId]: !prev[c.courseId] }))}
                      className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-text/50 transition-colors hover:text-text"
                      aria-expanded={!!logOpen[c.courseId]}
                    >
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform ${logOpen[c.courseId] ? "" : "-rotate-90"}`}
                      />
                      {t("ক্লাস লগ", "Class logs")}
                      <span className="text-text/40">({c.classes?.length ?? 0})</span>
                    </button>
                    <Button
                      size="sm"
                      variant="secondary"
                      iconLeft={<Plus className="h-4 w-4" />}
                      onClick={() => openClassCreate(c.courseId)}
                    >
                      {t("নতুন ক্লাস লগ", "New class log")}
                    </Button>
                  </div>

                  {logOpen[c.courseId] ? (
                    c.classes && c.classes.length > 0 ? (
                      <ul className="mt-2.5 space-y-1.5">
                        {c.classes.map((cls, i) => (
                          <li
                            key={`${cls.classId}-${i}`}
                            className="flex items-center justify-between gap-2 rounded-lg border border-text/10 bg-text/2 px-3 py-2 text-xs"
                          >
                            <span className="min-w-0 truncate">
                              <span className="font-mono font-semibold text-text/70">{cls.classId}</span> ·{" "}
                              {cls.contentCovered?.topic || cls.contentCovered?.summary} ·{" "}
                              <span className="tabular-nums">
                                {cls.date} · {(cls.presentStudents ?? []).length}
                              </span>
                            </span>
                            <span className="flex shrink-0 gap-1">
                              <IconButton
                                label={t("সম্পাদনা", "Edit")}
                                size="sm"
                                className="h-7 w-7"
                                onClick={() => openClassEdit(c.courseId, cls)}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </IconButton>
                              <IconButton
                                label={t("মুছুন", "Delete")}
                                size="sm"
                                className="h-7 w-7"
                                disabled={busyLog === `${c.courseId}-${cls.classId}`}
                                onClick={() => removeClass(c.courseId, cls.classId)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </IconButton>
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2.5 text-xs text-text/45">
                        {t("এখনো কোনো ক্লাস লগ নেই।", "No class logs yet.")}
                      </p>
                    )
                  ) : (
                    <p className="mt-2 text-xs text-text/40">
                      {t("ক্লাস লগ দেখতে ক্লিক করুন।", "Click to view class logs.")}
                    </p>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── course dialog ── */}
      <Dialog
        open={form !== null}
        onClose={() => setForm(null)}
        title={editing ? t("কোর্স সম্পাদনা", "Edit course") : t("নতুন কোর্স", "New course")}
        size="lg"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setForm(null)}>
              {t("বাতিল", "Cancel")}
            </Button>
            <Button size="sm" loading={saving} onClick={submitCourse}>
              {t("সংরক্ষণ", "Save")}
            </Button>
          </>
        }
      >
        {form && (
          <form onSubmit={submitCourse} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label={t("কোর্স আইডি", "Course id")}
                hint={editing ? t("সম্পাদনার সময় পরিবর্তন করা যায় না।", "Can't change while editing.") : "HSK-101"}
                disabled={editing}
                required
                value={form.courseId}
                onChange={(e) => set("courseId", e.target.value)}
              />
              <Field
                label={t("লক্ষ্য স্তর", "Target level")}
                value={form.targetLevel}
                onChange={(e) => set("targetLevel", e.target.value)}
              />
            </div>
            <Field
              label={t("কোর্সের নাম", "Course name")}
              required
              value={form.courseName}
              onChange={(e) => set("courseName", e.target.value)}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <SelectField label={t("অবস্থা", "Status")} value={form.status} onChange={(e) => set("status", e.target.value)}>
                <option value="Coming Soon">{t("আসছে", "Coming Soon")}</option>
                <option value="Running">{t("চলমান", "Running")}</option>
                <option value="Completed">{t("সম্পন্ন", "Completed")}</option>
              </SelectField>
              <Field
                type="date"
                label={t("শুরুর তারিখ", "Start date")}
                value={form.startDate ?? ""}
                onChange={(e) => set("startDate", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field
                label={t("পরবর্তী ভর্তি", "Next intake")}
                hint={t("যেমন: 20 Sept 2026", "e.g. Sept 20, 2026")}
                value={form.nextBatchRegistrationDate ?? ""}
                onChange={(e) => set("nextBatchRegistrationDate", e.target.value)}
              />
              <Field
                type="number"
                min={1}
                label={t("মোট পাঠ", "Total lessons")}
                value={form.totalLessons}
                onChange={(e) =>
                  set("totalLessons", e.target.value === "" ? ("" as unknown as number) : Number(e.target.value))
                }
                className="tabular-nums"
              />
              <Field
                type="number"
                min={1}
                label={t("পরিকল্পিত ক্লাস", "Planned classes")}
                value={form.totalClassesPlanned}
                onChange={(e) =>
                  set("totalClassesPlanned", e.target.value === "" ? ("" as unknown as number) : Number(e.target.value))
                }
                className="tabular-nums"
              />
            </div>
          </form>
        )}
      </Dialog>

      {/* ── class-on dialog (live session) ── */}
      <Dialog
        open={liveOpen !== null}
        onClose={() => setLiveOpen(null)}
        title={t("ক্লাস চালু করুন", "Start live class")}
        description={
          liveOpen
            ? `${liveOpen.courseName} (${liveOpen.courseId}) — ${t("একাডেমি পেজে লাইভ বাটন দেখা যাবে", "the academy page will show a live button")}`
            : undefined
        }
        size="md"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setLiveOpen(null)}>
              {t("বাতিল", "Cancel")}
            </Button>
            <Button size="sm" loading={liveSaving} onClick={openLive}>
              {t("চালু করুন", "Go live")}
            </Button>
          </>
        }
      >
        {liveOpen && (
          <form onSubmit={openLive} className="space-y-4">
            {links.length > 0 && (
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.12em] text-text/55">
                  {t("বা সংরক্ষিত লিংক ব্যবহার করুন", "Or use a saved link")}
                </label>
                <select
                  value={liveForm.meetLink}
                  onChange={(e) => {
                    const link = links.find((l) => l.meetLink === e.target.value);
                    setLiveForm({
                      ...liveForm,
                      meetLink: e.target.value,
                      topic: link?.topic ?? liveForm.topic,
                    });
                  }}
                  className="w-full rounded-xl border border-text/20 bg-card px-3.5 py-2.5 text-sm font-semibold text-text focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text"
                >
                  <option value="">{t("— নতুন লিংক —", "— new link —")}</option>
                  {links.map((l) => (
                    <option key={l._id} value={l.meetLink}>
                      {l.label ? `${l.label} · ` : ""}
                      {l.meetLink}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <Field
              label={t("Google Meet লিংক", "Google Meet link")}
              required
              placeholder="https://meet.google.com/xxx-xxxx-xxx"
              value={liveForm.meetLink}
              onChange={(e) => setLiveForm({ ...liveForm, meetLink: e.target.value })}
              hint={t("শিক্ষার্থীরা একাডেমি পেজ থেকে এই লিংকে যাবে।", "Students will open this link from the academy page.")}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                type="date"
                label={t("ক্লাসের তারিখ", "Class date")}
                value={liveForm.date}
                onChange={(e) => setLiveForm({ ...liveForm, date: e.target.value })}
              />
              <Field
                label={t("ক্লাসের সময়", "Class time")}
                hint={t("যেমন: 9:00 PM - 10:10 PM", "e.g. 9:00 PM - 10:10 PM")}
                value={liveForm.time}
                onChange={(e) => setLiveForm({ ...liveForm, time: e.target.value })}
              />
            </div>
            <Field
              label={t("ক্লাসের টপিক", "Class topic")}
              hint={t("যেমন: লেসন ৩ — ব্যক্তিগত পরিচয়", "e.g. Lesson 3 — self introduction")}
              value={liveForm.topic}
              onChange={(e) => setLiveForm({ ...liveForm, topic: e.target.value })}
            />
            <TextArea
              label={t("অ্যাসাইনমেন্ট নির্দেশনা", "Assignment prompt")}
              hint={t("শিক্ষার্থীরা এটি করে ক্লাসে যোগ দেবে (ঐচ্ছিক)", "Students prepare this before class (optional)")}
              value={liveForm.assignmentPrompt}
              onChange={(e) => setLiveForm({ ...liveForm, assignmentPrompt: e.target.value })}
            />
          </form>
        )}
      </Dialog>

      {/* ── saved Meet links dialog ── */}
      <Dialog
        open={linksOpen !== null}
        onClose={() => setLinksOpen(null)}
        title={t("সংরক্ষিত মিট লিংক", "Saved Meet links")}
        description={linksOpen ? `${linksOpen.courseName} (${linksOpen.courseId})` : undefined}
        size="md"
        footer={
          <Button variant="secondary" size="sm" onClick={() => setLinksOpen(null)}>
            {t("বন্ধ করুন", "Close")}
          </Button>
        }
      >
        {linksOpen && (
          <div className="space-y-5">
            {/* list */}
            {links.length === 0 ? (
              <p className="text-sm text-text/55">{t("এখনো কোনো লিংক সংরক্ষিত হয়নি।", "No links saved yet.")}</p>
            ) : (
              <ul className="space-y-2">
                {links.map((l) => (
                  <li key={l._id} className="flex items-center justify-between gap-2 rounded-xl border border-text/12 bg-card px-3 py-2.5">
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-text">
                        {l.label || l.meetLink}
                      </span>
                      {l.label && <span className="block truncate text-[11px] tabular-nums text-text/45">{l.meetLink}</span>}
                    </span>
                    <span className="flex shrink-0 items-center gap-1.5">
                      <IconButton label={t("সম্পাদনা", "Edit")} size="sm" onClick={() => setLinkForm({ _id: l._id, label: l.label, meetLink: l.meetLink, topic: l.topic })}>
                        <Pencil className="h-4 w-4" />
                      </IconButton>
                      <IconButton label={t("মুছুন", "Delete")} size="sm" onClick={() => deleteLink(l._id)}>
                        <Trash2 className="h-4 w-4" />
                      </IconButton>
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {/* add / edit form */}
            <form onSubmit={saveLink} className="space-y-3 border-t border-text/10 pt-4">
              <Field
                label={t("লেবেল (ঐচ্ছিক)", "Label (optional)")}
                placeholder={t("যেমন: নিয়মিত ক্লাস", "e.g. Regular class")}
                value={linkForm.label}
                onChange={(e) => setLinkForm({ ...linkForm, label: e.target.value })}
              />
              <Field
                label={t("Google Meet লিংক", "Google Meet link")}
                required
                placeholder="https://meet.google.com/xxx-xxxx-xxx"
                value={linkForm.meetLink}
                onChange={(e) => setLinkForm({ ...linkForm, meetLink: e.target.value })}
              />
              <Field
                label={t("টপিক (ঐচ্ছিক)", "Topic (optional)")}
                value={linkForm.topic}
                onChange={(e) => setLinkForm({ ...linkForm, topic: e.target.value })}
              />
              <div className="flex justify-end gap-2">
                {linkForm._id && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => setLinkForm({ label: "", meetLink: "", topic: "" })}>
                    {t("নতুন লিংক", "New link")}
                  </Button>
                )}
                <Button type="submit" size="sm" loading={linksBusy} iconLeft={<Link2 className="h-4 w-4" />}>
                  {linkForm._id ? t("আপডেট", "Update") : t("সংরক্ষণ করুন", "Save link")}
                </Button>
              </div>
            </form>
          </div>
        )}
      </Dialog>

      {/* ── end-class dialog (fill class log, then close) ── */}
      <Dialog
        open={closeOpen !== null}
        onClose={() => setCloseOpen(null)}
        title={t("ক্লাস শেষ করুন — ক্লাস লগ পূরণ করে সংরক্ষণ করুন", "End class — fill the class log & save")}
        description={
          closeOpen
            ? `${closeOpen.course.courseName} (${closeOpen.course.courseId}) · ${t(
                "উপস্থিত তালিকা হাজিরা থেকে আগেই বসে আছে, সম্পাদনা করতে পারেন", 
                "present list is pre-filled from attendance — you can adjust it",
              )}`
            : undefined
        }
        size="lg"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setCloseOpen(null)}>
              {t("বাতিল", "Cancel")}
            </Button>
            <Button size="sm" variant="danger" loading={closeBusy} onClick={saveClose} iconLeft={<Radio className="h-4 w-4" />}>
              {t("সংরক্ষণ ও ক্লাস বন্ধ", "Save & end class")}
            </Button>
          </>
        }
      >
        {closeOpen && (
          <form onSubmit={saveClose} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                type="date"
                label={t("তারিখ", "Date")}
                value={closeForm.date}
                onChange={(e) => setCloseForm({ ...closeForm, date: e.target.value })}
              />
              <Field
                label={t("সময়", "Time")}
                hint={t("যেমন: 9:00 PM - 10:10 PM", "e.g. 9:00 PM - 10:10 PM")}
                value={closeForm.time}
                onChange={(e) => setCloseForm({ ...closeForm, time: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 gap-3">
              <Field
                label={t("আজকের বিষয়", "Today's topic")}
                hint={t("যেমন: HSK 3 Lesson 4 — Weather", "e.g. HSK 3 Lesson 4 — Weather")}
                value={closeForm.topic}
                onChange={(e) => setCloseForm({ ...closeForm, topic: e.target.value })}
                placeholder={t("ক্লাসের বিষয় লিখুন", "Enter the class topic")}
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-semibold text-text">
                  {t("উপস্থিত শিক্ষার্থী", "Present students")}
                  <span className="ml-2 text-xs tabular-nums text-text/50">
                    {closeForm.presentStudents.length} / {enrolledFor(closeOpen.course.courseId).length}
                  </span>
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const all = enrolledFor(closeOpen.course.courseId).map((s) => String(s.rollNumber).trim());
                    setCloseForm({
                      ...closeForm,
                      presentStudents:
                        closeForm.presentStudents.length === all.length ? [] : all,
                    });
                  }}
                >
                  {closeForm.presentStudents.length === enrolledFor(closeOpen.course.courseId).length
                    ? t("সব বাদ", "Clear all")
                    : t("সবাই উপস্থিত", "All present")}
                </Button>
              </div>
              <ul className="mt-3 grid max-h-64 grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                {enrolledFor(closeOpen.course.courseId).map((s) => {
                  const roll = String(s.rollNumber).trim();
                  const isPresent = closeForm.presentStudents.includes(roll);
                  return (
                    <li key={roll}>
                      <button
                        type="button"
                        aria-pressed={isPresent}
                        onClick={() =>
                          setCloseForm({
                            ...closeForm,
                            presentStudents: isPresent
                              ? closeForm.presentStudents.filter((r) => r !== roll)
                              : [...closeForm.presentStudents, roll],
                          })
                        }
                        className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text ${
                          isPresent ? "border-ok/40 bg-ok-surface" : "border-text/12 bg-card hover:border-text/25"
                        }`}
                      >
                        <span className="min-w-0">
                          <span className="block text-[11px] tabular-nums text-text/45">#{roll}</span>
                          <span className="block truncate font-semibold text-text">{s.nameEnglish}</span>
                        </span>
                        <span
                          aria-hidden="true"
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                            isPresent ? "border-ok bg-ok text-card" : "border-text/25 text-transparent"
                          }`}
                        >
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </form>
        )}
      </Dialog>

      {/* ── class log dialog (create + edit) ── */}
      <Dialog
        open={classForm !== null}
        onClose={() => setClassForm(null)}
        title={
          classForm
            ? classForm.classId
              ? t(`${classForm.classId} সম্পাদনা`, `Edit ${classForm.classId}`)
              : t("নতুন ক্লাস লগ", "New class log")
            : ""
        }
        description={
          classForm
            ? `${courses.find((c) => c.courseId === classForm.courseId)?.courseName ?? classForm.courseId} · ${summaryOf(classForm)}`
            : undefined
        }
        size="lg"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setClassForm(null)}>
              {t("বাতিল", "Cancel")}
            </Button>
            <Button size="sm" loading={savingClass} onClick={saveClass}>
              {classForm?.classId ? t("আপডেট সংরক্ষণ", "Save changes") : t("তৈরি ও যুক্ত করুন", "Create & attach")}
            </Button>
          </>
        }
      >
        {classForm && (
          <form onSubmit={saveClass} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                type="date"
                label={t("তারিখ", "Date")}
                required
                value={classForm.date}
                onChange={(e) => setClassForm({ ...classForm, date: e.target.value })}
              />
              <Field
                label={t("সময়", "Time")}
                hint={t("যেমন: 05:00 PM - 06:30 PM", "e.g. 05:00 PM - 06:30 PM")}
                value={classForm.time}
                onChange={(e) => setClassForm({ ...classForm, time: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 gap-3">
              {classNum("topic", t("আজকের বিষয়", "Today's topic"))}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-semibold text-text">
                  {t("উপস্থিত শিক্ষার্থী", "Present students")}
                  <span className="ml-2 text-xs tabular-nums text-text/50">
                    {classForm.presentStudents.length} / {enrolledInClassForm.length}
                  </span>
                </p>
                {enrolledInClassForm.length > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setClassForm({
                        ...classForm,
                        presentStudents:
                          classForm.presentStudents.length === enrolledInClassForm.length
                            ? []
                            : enrolledInClassForm.map((s) => String(s.rollNumber).trim()),
                      })
                    }
                  >
                    {classForm.presentStudents.length === enrolledInClassForm.length
                      ? t("সব বাদ", "Clear all")
                      : t("সবাই উপস্থিত", "All present")}
                  </Button>
                )}
              </div>

              {enrolledInClassForm.length === 0 ? (
                <p className="mt-2 text-xs text-text/50">
                  {t(
                    "এই কোর্সে এখনো অনুমোদিত শিক্ষার্থী নেই — উপস্থিতি ছাড়াই লগ তৈরি হবে।",
                    "No approved students in this course yet — the log will be created without attendance.",
                  )}
                </p>
              ) : (
                <ul className="mt-3 grid max-h-64 grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                  {enrolledInClassForm.map((s) => {
                    const roll = String(s.rollNumber).trim();
                    const isPresent = classForm.presentStudents.includes(roll);
                    return (
                      <li key={roll}>
                        <button
                          type="button"
                          aria-pressed={isPresent}
                          onClick={() =>
                            setClassForm({
                              ...classForm,
                              presentStudents: isPresent
                                ? classForm.presentStudents.filter((r) => r !== roll)
                                : [...classForm.presentStudents, roll],
                            })
                          }
                          className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text ${
                            isPresent ? "border-ok/40 bg-ok-surface" : "border-text/12 bg-card hover:border-text/25"
                          }`}
                        >
                          <span className="min-w-0">
                            <span className="block text-[11px] tabular-nums text-text/45">#{roll}</span>
                            <span className="block truncate font-semibold text-text">{s.nameEnglish}</span>
                          </span>
                          <span
                            aria-hidden="true"
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                              isPresent ? "border-ok bg-ok text-card" : "border-text/25 text-transparent"
                            }`}
                          >
                            <Check className="h-3 w-3" strokeWidth={3} />
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </form>
        )}
      </Dialog>

      {/* ── topics list dialog ── */}
      <Dialog
        open={topicsOpen !== null}
        onClose={() => setTopicsOpen(null)}
        title={t("টপিকসমূহ", "Topics")}
        description={topicsOpen ? `${topicsOpen.courseName} (${topicsOpen.courseId})` : undefined}
        size="md"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setTopicsOpen(null)}>
              {t("বাতিল", "Cancel")}
            </Button>
            <Button size="sm" onClick={saveTopics}>
              {t("সংরক্ষণ", "Save")}
            </Button>
          </>
        }
      >
        {topicsOpen && (
          <form onSubmit={saveTopics} className="space-y-3">
            <p className="text-xs text-text/60">
              {t(
                "অ্যাডমিন টপিক যোগ, এডিট ও ডিলিট করতে পারবেন — শিক্ষার্থীরা এগুলো পড়ে ক্লাসে যোগ দেবে।",
                "Admin can add, edit and delete topics — students study them before joining class.",
              )}
            </p>
            {topicsForm.map((tp, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex-1">
                  <Field
                    label={`${t("টপিক", "Topic")} #${i + 1}`}
                    value={tp}
                    onChange={(e) =>
                      setTopicsForm((prev) => prev.map((x, j) => (j === i ? e.target.value : x)))
                    }
                  />
                </div>
                <IconButton
                  label={t("মুছুন", "Delete")}
                  size="sm"
                  onClick={() => setTopicsForm((prev) => prev.filter((_, j) => j !== i))}
                >
                  <Trash2 className="h-4 w-4" />
                </IconButton>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              iconLeft={<Plus className="h-4 w-4" />}
              onClick={() => setTopicsForm((prev) => [...prev, ""])}
            >
              {t("নতুন টপিক", "New topic")}
            </Button>
          </form>
        )}
      </Dialog>

      {/* ── lessons manager dialog ── */}
      <Dialog
        open={lessonsOpen !== null}
        onClose={() => setLessonsOpen(null)}
        title={t("পাঠসমূহ (সিলেবাস)", "Lessons (syllabus)")}
        description={lessonsOpen ? `${lessonsOpen.courseName} (${lessonsOpen.courseId})` : undefined}
        size="lg"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setLessonsOpen(null)}>
              {t("বাতিল", "Cancel")}
            </Button>
            <Button size="sm" onClick={saveLessons}>
              {t("সংরক্ষণ", "Save")}
            </Button>
          </>
        }
      >
        {lessonsOpen && (
          <form onSubmit={saveLessons} className="space-y-3">
            {lessonsForm.map((l, i) => (
              <div key={i} className="rounded-xl border border-text/10 bg-card p-3">
                <div className="flex items-center gap-2">
                  <Field
                    type="number"
                    min={1}
                    label={t("নম্বর", "No.")}
                    value={l.lessonNumber}
                    onChange={(e) =>
                      setLessonsForm((prev) => prev.map((x, j) => (j === i ? { ...x, lessonNumber: Number(e.target.value) } : x)))
                    }
                    className="w-24 tabular-nums"
                  />
                  <div className="flex-1">
                    <Field
                      label={t("শিরোনাম", "Title")}
                      value={l.title}
                      onChange={(e) =>
                        setLessonsForm((prev) => prev.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))
                      }
                    />
                  </div>
                  <IconButton
                    label={t("মুছুন", "Delete")}
                    size="sm"
                    onClick={() => setLessonsForm((prev) => prev.filter((_, j) => j !== i))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </IconButton>
                </div>
                <div className="mt-2">
                  <TextArea
                    label={t("বিবরণ (ঐচ্ছিক)", "Description (optional)")}
                    value={l.description}
                    onChange={(e) =>
                      setLessonsForm((prev) => prev.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)))
                    }
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              iconLeft={<Plus className="h-4 w-4" />}
              onClick={() =>
                setLessonsForm((prev) => [
                  ...prev,
                  { lessonNumber: (prev[prev.length - 1]?.lessonNumber ?? 0) + 1, title: "", description: "" },
                ])
              }
            >
              {t("নতুন পাঠ", "New lesson")}
            </Button>
          </form>
        )}
      </Dialog>

      {/* ── registration dialog ── */}
      <Dialog
        open={regOpen !== null}
        onClose={() => setRegOpen(null)}
        title={t("রেজিস্ট্রেশন নিয়ন্ত্রণ", "Registration control")}
        description={regOpen ? `${regOpen.courseName} (${regOpen.courseId})` : undefined}
        size="md"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setRegOpen(null)}>
              {t("বাতিল", "Cancel")}
            </Button>
            <Button
              size="sm"
              variant={regOpen?.registrationOpen ? "danger" : "secondary"}
              onClick={saveRegistration}
            >
              {regOpen?.registrationOpen
                ? t("রেজিস্ট্রেশন বন্ধ করুন", "Turn off registration")
                : t("রেজিস্ট্রেশন চালু করুন", "Turn on registration")}
            </Button>
          </>
        }
      >
        {regOpen && (
          <div className="space-y-4">
            <div
              className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                regOpen.registrationOpen ? "border-ok/40 bg-ok-surface" : "border-text/15 bg-card"
              }`}
            >
              <span className="text-sm font-semibold text-text">
                {t("রেজিস্ট্রেশন", "Registration")}
              </span>
              <span className={`text-sm font-bold ${regOpen.registrationOpen ? "text-ok" : "text-text/55"}`}>
                {regOpen.registrationOpen ? t("চালু", "ON") : t("বন্ধ", "OFF")}
              </span>
            </div>
            <Field
              type="date"
              label={t("রেজিস্ট্রেশন শেষ তারিখ (ঐচ্ছিক)", "Registration last date (optional)")}
              value={regOpen.registrationLastDate ?? ""}
              onChange={(e) => setRegOpen({ ...regOpen, registrationLastDate: e.target.value })}
              hint={t("খালি রাখলে শেষ তারিখ থাকবে না।", "Leave blank for no deadline.")}
            />
            <Field
              type="date"
              label={t("পরবর্তী ভর্তির তারিখ (ঐচ্ছিক)", "Next admission date (optional)")}
              value={regOpen.nextBatchRegistrationDate ?? ""}
              onChange={(e) => setRegOpen({ ...regOpen, nextBatchRegistrationDate: e.target.value })}
              hint={t(
                "রেজিস্ট্রেশন বন্ধ থাকলে শিক্ষার্থীরা এই তারিখটি 'পরবর্তী ভর্তি' হিসেবে দেখবে।",
                "When registration is off, students see this date as the next intake.",
              )}
            />
            <p className="text-xs text-text/55">
              {t(
                "চালু করলে একাডেমি পেজে কোর্সটি ভর্তির জন্য দেখানো হবে।",
                "When on, the course is shown for enrolment on the academy page.",
              )}
            </p>
          </div>
        )}
      </Dialog>

      {/* ── study groups dialog ── */}
      <Dialog
        open={groupsOpen !== null}
        onClose={() => setGroupsOpen(null)}
        title={t("স্টাডি গ্রুপ (পরবর্তী ক্লাসের জোড়া)", "Study groups (next-class pairs)")}
        description={groupsOpen ? `${groupsOpen.courseName} (${groupsOpen.courseId})` : undefined}
        size="lg"
        footer={
          <Button variant="secondary" size="sm" onClick={() => setGroupsOpen(null)}>
            {t("বন্ধ করুন", "Close")}
          </Button>
        }
      >
        {groupsOpen && (
          <div className="space-y-4">
            <form onSubmit={saveGroup} className="space-y-3 rounded-xl border border-text/10 bg-card p-4">
              <Field
                label={t("গ্রুপের নাম (ঐচ্ছিক)", "Group name (optional)")}
                value={groupLabel}
                onChange={(e) => setGroupLabel(e.target.value)}
                placeholder={t("যেমন: গ্রুপ আ", "e.g. Group A")}
              />
              <div>
                <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-text/45">
                  {t("সদস্য সিলেক্ট করুন (নাম)", "Select members by name")} · {groupMembers.length}
                </p>
                <div className="max-h-56 space-y-1.5 overflow-y-auto rounded-xl border border-text/10 bg-background p-2">
                  {enrolledFor(groupsOpen.courseId).length === 0 ? (
                    <p className="px-2 py-3 text-xs text-text/45">
                      {t("এই কোর্সে অনুমোদিত শিক্ষার্থী নেই।", "No approved students in this course.")}
                    </p>
                  ) : (
                    enrolledFor(groupsOpen.courseId).map((s) => {
                      const roll = Number(s.rollNumber);
                      const checked = groupMembers.includes(roll);
                      return (
                        <label
                          key={roll}
                          className={`flex cursor-pointer items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                            checked ? "bg-secondary/10 text-text" : "hover:bg-text/5 text-text/80"
                          }`}
                        >
                          <span className="flex min-w-0 items-center gap-2">
                            <span className="font-mono text-[11px] text-text/45">#{roll}</span>
                            <span className="truncate font-semibold">{s.nameEnglish}</span>
                          </span>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) =>
                              setGroupMembers((prev) =>
                                e.target.checked ? [...prev, roll] : prev.filter((r) => r !== roll),
                              )
                            }
                            className="h-4 w-4 accent-secondary"
                          />
                        </label>
                      );
                    })
                  )}
                </div>
              </div>
              <div className="flex justify-end">
                {editingGroupId && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mr-auto"
                    onClick={() => {
                      setEditingGroupId(null);
                      setGroupLabel("");
                      setGroupMembers([]);
                    }}
                  >
                    {t("বাতিল", "Cancel")}
                  </Button>
                )}
                <Button type="submit" size="sm" loading={groupsBusy} iconLeft={<Plus className="h-4 w-4" />}>
                  {editingGroupId ? t("আপডেট করুন", "Update") : t("গ্রুপ যোগ করুন", "Add group")}
                </Button>
              </div>
            </form>

           <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-text/45">
                {t("তৈরি করা গ্রুপসমূহ", "Created groups")} ({groups.length})
              </p>
              {groupsBusy && groups.length === 0 ? (
                <p className="text-xs text-text/50">{t("লোড হচ্ছে…", "Loading…")}</p>
              ) : groups.length === 0 ? (
                <p className="text-xs text-text/45">{t("কোনো গ্রুপ নেই।", "No groups yet.")}</p>
              ) : (
                <ul className="space-y-2">
                  {groups.map((g) => (
                    <li
                      key={g._id}
                      className="flex items-center justify-between gap-2 rounded-lg border border-text/10 bg-text/2 px-3 py-2 text-xs"
                    >
                      <span className="min-w-0">
                        <span className="font-semibold text-text">{g.label || t("গ্রুপ", "Group")}</span>
                        <span className="ml-2 text-text/55">
                          {g.memberRolls.map((r) => `#${r}`).join(", ")}
                        </span>
                      </span>
                      <span className="flex shrink-0 gap-1">
                        <IconButton label={t("এডিট", "Edit")} size="sm" onClick={() => editGroup(g)}>
                          <Pencil className="h-4 w-4" />
                        </IconButton>
                        <IconButton label={t("মুছুন", "Delete")} size="sm" onClick={() => deleteGroup(g._id)}>
                          <Trash2 className="h-4 w-4" />
                        </IconButton>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </Dialog>

      {/* ── mark assignments dialog ── */}
      <Dialog
        open={markOpen !== null}
        onClose={() => setMarkOpen(null)}
        title={t("অ্যাসাইনমেন্ট মার্ক", "Mark assignments")}
        description={markOpen ? `${markOpen.course.courseName} · ${markOpen.session.topic || ""}` : undefined}
        size="lg"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setMarkOpen(null)}>
              {t("বাতিল", "Cancel")}
            </Button>
            <Button size="sm" loading={markBusy} onClick={saveMarks}>
              {t("মার্ক সংরক্ষণ", "Save marks")}
            </Button>
          </>
        }
      >
        {markOpen && (
          <form onSubmit={saveMarks} className="space-y-2">
            <p className="text-xs text-text/60">
              {t(
                "প্রতি শিক্ষার্থীর রোলে মার্ক দিন — সংরক্ষণ করলে সবাই দেখতে পাবে।",
                "Mark each student by roll — everyone can view marks after saving.",
              )}
            </p>
            <ul className="max-h-[50vh] space-y-1.5 overflow-y-auto pr-1">
              {enrolledFor(markOpen.course.courseId).map((s) => {
                const roll = String(s.rollNumber).trim();
                const m = markMap[roll] ?? { mark: "", feedback: "" };
                return (
                  <li key={roll} className="flex flex-wrap items-center gap-2 rounded-xl border border-text/10 bg-card px-3 py-2">
                    <span className="flex min-w-[7rem] items-center gap-2">
                      <span className="font-mono text-xs text-text/45">#{roll}</span>
                      <span className="truncate text-sm font-semibold text-text">{s.nameEnglish}</span>
                    </span>
                    <input
                      type="number"
                      min={0}
                      placeholder={t("মার্ক", "Mark")}
                      value={m.mark}
                      onChange={(e) => setMarkMap((prev) => ({ ...prev, [roll]: { ...m, mark: e.target.value } }))}
                      className="w-24 rounded-lg border border-text/20 bg-background px-3 py-1.5 text-sm tabular-nums focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text"
                    />
                    <input
                      type="text"
                      placeholder={t("মন্তব্য (ঐচ্ছিক)", "Feedback (optional)")}
                      value={m.feedback}
                      onChange={(e) => setMarkMap((prev) => ({ ...prev, [roll]: { ...m, feedback: e.target.value } }))}
                      className="min-w-0 flex-1 rounded-lg border border-text/20 bg-background px-3 py-1.5 text-sm focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text"
                    />
                  </li>
                );
              })}
            </ul>
          </form>
        )}
      </Dialog>

      {/* ── edit live class (fix meet link / topic / assignment) ── */}
      <Dialog
        open={liveEdit !== null}
        onClose={() => setLiveEdit(null)}
        title={t("লাইভ ক্লাস ঠিক করুন", "Fix live class")}
        description={liveEdit ? `${liveEdit.course.courseName} (${liveEdit.course.courseId})` : undefined}
        size="lg"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setLiveEdit(null)}>
              {t("বাতিল", "Cancel")}
            </Button>
            <Button size="sm" loading={liveEditBusy} onClick={saveLiveMeta}>
              {t("আপডেট করুন", "Update")}
            </Button>
          </>
        }
      >
        {liveEdit && (
          <form onSubmit={saveLiveMeta} className="space-y-4">
            <Field
              label={t("Google Meet লিংক", "Google Meet link")}
              required
              value={liveEditForm.meetLink}
              onChange={(e) => setLiveEditForm({ ...liveEditForm, meetLink: e.target.value })}
              hint={t("ভুল হলে এখান থেকে ঠিক করুন।", "Fix a wrong link here.")}
            />
            <Field
              label={t("ক্লাসের টপিক", "Class topic")}
              value={liveEditForm.topic}
              onChange={(e) => setLiveEditForm({ ...liveEditForm, topic: e.target.value })}
            />
            <TextArea
              label={t("অ্যাসাইনমেন্ট নির্দেশনা", "Assignment prompt")}
              value={liveEditForm.assignmentPrompt}
              onChange={(e) => setLiveEditForm({ ...liveEditForm, assignmentPrompt: e.target.value })}
            />
          </form>
        )}
      </Dialog>
    </AdminShell>
  );
}
