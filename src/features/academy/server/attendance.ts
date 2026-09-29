// Attendance, computed in one place.
//
// The class history already lives on each course (`classes[].presentStudents`
// / `absentStudents`) and the in-progress class lives on the live session
// (`attendance[]`). Rather than adding a third store, everything is derived
// from those two — the numbers a student is shown always come from the same
// source the teacher's class log wrote, so the leaderboard and a student's own
// profile can never disagree.
import { connectDB } from "@/lib/db";
import { Course, Student } from "@/features/academy/models";
import { listLiveClasses } from "./live";

export type AttendanceTally = {
  held: number;
  attended: number;
  rate: number | null;
};

export type AttendanceSession = {
  key: string;
  date: string;
  title: string;
  live: boolean;
  present: boolean;
};

export type CourseAttendance = AttendanceTally & {
  courseId: string;
  courseName: string;
  sessions: AttendanceSession[];
};

export type AttendanceReport = AttendanceTally & {
  byCourse: CourseAttendance[];
  recent: AttendanceSession[];
};

const rollKey = (value: unknown): string => String(value ?? "").trim();

/** The courses a student is on, tolerating the old single-course field. */
export function courseIdsOf(student: {
  enrolledCourseIds?: unknown;
  enrolledCourseId?: unknown;
}): string[] {
  const list = Array.isArray(student.enrolledCourseIds)
    ? student.enrolledCourseIds.map((id) => String(id ?? "").trim()).filter(Boolean)
    : [];
  if (list.length) return [...new Set(list)];
  const single = String(student.enrolledCourseId ?? "").trim();
  return single ? [single] : [];
}

/**
 * The parts of a course document this module reads. Kept narrow so the tally
 * logic is checked at compile time rather than through `any` casts at every
 * property access.
 */
type CourseForAttendance = {
  courseId?: unknown;
  courseName?: unknown;
  classes?: unknown;
};

type ClassForAttendance = {
  classId?: unknown;
  date?: unknown;
  time?: unknown;
  contentCovered?: { summary?: unknown; topic?: unknown };
  presentStudents?: unknown;
  absentStudents?: unknown;
};

type LiveForAttendance = {
  _id?: unknown;
  courseId?: unknown;
  topic?: unknown;
  date?: unknown;
  open?: unknown;
  attendance?: unknown;
};

/** Coerce a lean Mongo document into the narrow shape used here. */
const asArray = <T,>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);
const asRecord = <T,>(value: unknown): T | null =>
  value && typeof value === "object" ? (value as T) : null;

/** Attendance for one roll against a set of course documents. */
export function tallyForRoll(
  roll: unknown,
  courses: CourseForAttendance[],
): { byCourse: CourseAttendance[]; held: number; attended: number } {
  const target = rollKey(roll);
  const byCourse: CourseAttendance[] = [];
  let held = 0;
  let attended = 0;

  for (const course of courses) {
    const sessions: AttendanceSession[] = [];
    let courseAttended = 0;

    for (const raw of asArray<ClassForAttendance>(course.classes)) {
      const presentList = asArray<unknown>(raw.presentStudents);
      const absentList = asArray<unknown>(raw.absentStudents);
      const present = presentList.some((r) => rollKey(r) === target);
      if (!present && !absentList.some((r) => rollKey(r) === target)) {
        // Class ran before this student joined the roster — not held against them.
        continue;
      }
      if (present) courseAttended += 1;
      const covered = asRecord<{ summary?: unknown; topic?: unknown }>(raw.contentCovered) ?? {};
      sessions.push({
        key: String(raw.classId ?? `${raw.date ?? ""}-${sessions.length}`),
        date: String(raw.date ?? ""),
        title:
          String(covered.summary ?? covered.topic ?? "").trim() ||
          String(raw.time ?? "").trim() ||
          "Class",
        live: false,
        present,
      });
    }

    held += sessions.length;
    attended += courseAttended;
    byCourse.push({
      courseId: String(course.courseId ?? ""),
      courseName: String(course.courseName ?? course.courseId ?? ""),
      held: sessions.length,
      attended: courseAttended,
      rate: sessions.length ? Math.round((courseAttended / sessions.length) * 100) : null,
      sessions,
    });
  }

  return { byCourse, held, attended };
}

/** Add the class that is running right now, so the count is never stale. */
export function addLiveSession(
  report: AttendanceReport,
  courseId: string,
  session: { key: string; date: string; title: string },
  present: boolean,
): AttendanceReport {
  const known = report.byCourse.find((c) => c.courseId === courseId);
  if (!known) return report;

  const entry: AttendanceSession = { ...session, live: true, present };
  if (present) {
    known.attended += 1;
    known.sessions.unshift(entry);
  }
  known.held += 1;
  known.rate = Math.round((known.attended / known.held) * 100);

  return {
    ...report,
    held: report.held + 1,
    attended: report.attended + (present ? 1 : 0),
    rate: Math.round(((report.attended + (present ? 1 : 0)) / (report.held + 1)) * 100),
    byCourse: report.byCourse,
    recent: [entry, ...report.recent],
  };
}

/** Full report for one student, including the class in progress. */
export async function attendanceReport(
  roll: unknown,
  courseIds: string[],
): Promise<AttendanceReport> {
  await connectDB();
  const [courses, live] = await Promise.all([
    Course.find({ courseId: { $in: courseIds } }).lean(),
    listLiveClasses().catch(() => []),
  ]);

  const { byCourse, held, attended } = tallyForRoll(roll, courses);
  const report: AttendanceReport = {
    held,
    attended,
    rate: held ? Math.round((attended / held) * 100) : null,
    byCourse,
    recent: byCourse
      .flatMap((c) => c.sessions.map((s) => ({ ...s, courseId: c.courseId })))
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
      .slice(0, 12),
  };

  // A class that is open right now has not been folded into `Course.classes`
  // yet, so count it here.
  const open = asArray<LiveForAttendance>(live).find(
    (l) => l.open && courseIds.includes(String(l.courseId ?? "")),
  );
  if (open) {
    const roster = asArray<{ rollNumber?: unknown }>(open.attendance);
    const present = roster.some((a) => rollKey(a.rollNumber) === rollKey(roll));
    return addLiveSession(
      report,
      String(open.courseId ?? ""),
      {
        key: `live-${open._id}`,
        date: String(open.date ?? ""),
        title: String(open.topic ?? "Live class") || "Live class",
      },
      present,
    );
  }

  return report;
}

export type LeaderRow = {
  rollNumber: number;
  nameEnglish: string;
  avatarUrl?: string;
  isPro?: boolean;
  location?: string;
  courseIds: string[];
  held: number;
  attended: number;
  rate: number | null;
};

/**
 * Attendance for every approved student, computed from the course documents
 * already in memory. One pass over the courses, one over the students, rather
 * than a query per card.
 */
export async function attendanceLeaderboard(): Promise<LeaderRow[]> {
  await connectDB();
  const [students, courses, live] = await Promise.all([
    Student.find({ registrationStatus: "Approved" }).select("rollNumber nameEnglish avatarUrl isPro location enrolledCourseId enrolledCourseIds").lean(),
    Course.find({}).select("courseId courseName classes").lean(),
    listLiveClasses().catch(() => []),
  ]);

  const openByCourse = new Map<string, LiveForAttendance>();
  for (const l of asArray<LiveForAttendance>(live)) {
    if (l.open) openByCourse.set(String(l.courseId ?? ""), l);
  }

  const courseDocs: CourseForAttendance[] = courses;

  return students
    .map((s) => {
      const ids = courseIdsOf(s);
      const mine = courseDocs.filter((c) => ids.includes(String(c.courseId ?? "")));
      const { byCourse, held, attended } = tallyForRoll(s.rollNumber, mine);
      let totalHeld = held;
      let totalAttended = attended;

      for (const course of byCourse) {
        const open = openByCourse.get(course.courseId);
        if (!open) continue;
        totalHeld += 1;
        const roster = asArray<{ rollNumber?: unknown }>(open.attendance);
        if (roster.some((a) => rollKey(a.rollNumber) === rollKey(s.rollNumber))) {
          totalAttended += 1;
        }
      }

      return {
        rollNumber: s.rollNumber,
        nameEnglish: s.nameEnglish,
        avatarUrl: s.avatarUrl,
        isPro: s.isPro,
        location: s.location,
        courseIds: ids,
        held: totalHeld,
        attended: totalAttended,
        rate: totalHeld ? Math.round((totalAttended / totalHeld) * 100) : null,
      };
    })
    .sort((a, b) => a.rollNumber - b.rollNumber);
}
