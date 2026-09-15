// Live class sessions — admin opens a course's class (Google Meet link),
// students join + mark attendance by roll, admin ends it with a passcode.

import mongoose, { Schema, Document, Model } from "mongoose";
import connectDB from "@/lib/db";
import { Student, Course, LiveLink } from "@/features/academy/models";

export interface ILiveAttendance {
  rollNumber: number;
  name: string;
  at: Date;
}

export interface ILiveSubmission {
  rollNumber: number;
  content: string;
  submittedAt: Date;
}

export interface ILiveMark {
  rollNumber: number;
  mark: number;
  feedback: string;
  markedAt: Date;
}

export interface ILiveClass extends Document {
  courseId: string;
  meetLink: string;
  topic?: string;
  assignmentPrompt?: string;
  date: string;
  time: string;
  open: boolean;
  openedAt: Date;
  closedAt: Date | null;
  attendance: ILiveAttendance[];
  submissions: ILiveSubmission[];
  marks: ILiveMark[];
  createdAt: Date;
  updatedAt: Date;
}

const LiveClassSchema = new Schema<ILiveClass>(
  {
    courseId: { type: String, required: true, index: true },
    meetLink: { type: String, required: true, trim: true },
    topic: { type: String, default: "" },
    assignmentPrompt: { type: String, default: "" },
    date: { type: String, required: true },
    time: { type: String, default: "" },
    open: { type: Boolean, default: true, index: true },
    openedAt: { type: Date, default: Date.now },
    closedAt: { type: Date, default: null },
    attendance: [
      {
        rollNumber: { type: Number, required: true },
        name: { type: String, default: "" },
        at: { type: Date, default: Date.now },
      },
    ],
    submissions: [
      {
        rollNumber: { type: Number, required: true },
        content: { type: String, default: "" },
        submittedAt: { type: Date, default: Date.now },
      },
    ],
    marks: [
      {
        rollNumber: { type: Number, required: true },
        mark: { type: Number, default: 0 },
        feedback: { type: String, default: "" },
        markedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

export const LiveClassModel: Model<ILiveClass> =
  mongoose.models.LiveClass ||
  mongoose.model<ILiveClass>("LiveClass", LiveClassSchema);

export async function listLiveClasses() {
  await connectDB();
  const docs = await LiveClassModel.find({}).sort({ openedAt: -1 }).lean();
  return docs.map((d) => ({ ...d, _id: d._id.toString() }));
}

// ── saved Google Meet links (per course) ─────────────────────────────────

/** Persist a meet link if it isn't already saved for the course. */
export async function ensureLiveLink(courseId: string, meetLink: string, topic?: string) {
  await connectDB();
  const link = meetLink.trim();
  if (!link) return null;
  const existing = await LiveLink.findOne({ courseId, meetLink: link });
  if (existing) return existing;
  return LiveLink.create({ courseId, meetLink: link, topic: (topic ?? "").trim() });
}

export async function listLiveLinks(courseId: string) {
  await connectDB();
  const docs = await LiveLink.find({ courseId }).sort({ createdAt: 1 }).lean();
  return docs.map((d) => ({ ...d, _id: d._id.toString() }));
}

export async function createLiveLink(input: { courseId: string; label: string; meetLink: string; topic: string }) {
  await connectDB();
  return LiveLink.create({
    courseId: input.courseId,
    label: input.label.trim(),
    meetLink: input.meetLink.trim(),
    topic: input.topic.trim(),
  });
}

export async function updateLiveLink(
  id: string,
  input: { label?: string; meetLink?: string; topic?: string },
) {
  await connectDB();
  const updated = await LiveLink.findByIdAndUpdate(
    id,
    {
      ...(input.label !== undefined ? { label: input.label.trim() } : {}),
      ...(input.meetLink !== undefined ? { meetLink: input.meetLink.trim() } : {}),
      ...(input.topic !== undefined ? { topic: input.topic.trim() } : {}),
    },
    { new: true },
  ).lean();
  if (!updated) throw new Error("Live link not found.");
  return { ...updated, _id: updated._id.toString() };
}

export async function deleteLiveLink(id: string) {
  await connectDB();
  await LiveLink.findByIdAndDelete(id);
  return true;
}

/** Admin starts a class for a course (only one open per course). */
export async function openLiveClass(
  courseId: string,
  meetLink: string,
  date: string,
  time?: string,
  topic?: string,
  assignmentPrompt?: string,
) {
  await connectDB();
  const already = await LiveClassModel.findOne({ courseId, open: true });
  if (already) {
    throw new Error("This course already has an open class. End it first.");
  }
  const created = await LiveClassModel.create({
    courseId,
    meetLink: meetLink.trim(),
    topic: (topic ?? "").trim(),
    assignmentPrompt: (assignmentPrompt ?? "").trim(),
    date,
    time: time ?? "",
    open: true,
  });
  return { ...created.toObject(), _id: created._id.toString() };
}

/** Admin updates the meet link / topic / assignment prompt of a class. */
export async function setLiveMeta(
  id: string,
  meta: { meetLink?: string; topic?: string; assignmentPrompt?: string },
) {
  await connectDB();
  const updated = await LiveClassModel.findByIdAndUpdate(
    id,
    {
      ...(meta.meetLink !== undefined ? { meetLink: meta.meetLink.trim() } : {}),
      ...(meta.topic !== undefined ? { topic: meta.topic.trim() } : {}),
      ...(meta.assignmentPrompt !== undefined
        ? { assignmentPrompt: meta.assignmentPrompt.trim() }
        : {}),
    },
    { new: true },
  ).lean();
  if (!updated) throw new Error("Live class not found.");
  return { ...updated, _id: updated._id.toString() };
}

/**
 * Student submits an assignment (text or link) for this class — roll-based, no
 * login. Re-submitting overwrites the previous submission.
 */
export async function submitAssignment(
  liveClassId: string,
  rollNumber: number,
  content: string,
) {
  await connectDB();
  const session = await LiveClassModel.findById(liveClassId);
  if (!session) throw new Error("Class not found.");
  const idx = (session.submissions ?? []).findIndex((s) => s.rollNumber === rollNumber);
  if (idx >= 0) {
    session.submissions[idx].content = content;
    session.submissions[idx].submittedAt = new Date();
  } else {
    session.submissions.push({ rollNumber, content, submittedAt: new Date() });
  }
  await session.save();
  return { ...session.toObject(), _id: session._id.toString() };
}

/**
 * Admin marks assignments for many students at once, keyed by roll number.
 * Marks are public (everyone can view them per the LMS requirement).
 */
export async function markAssignments(
  liveClassId: string,
  marks: { rollNumber: number; mark: number; feedback?: string }[],
) {
  await connectDB();
  const session = await LiveClassModel.findById(liveClassId);
  if (!session) throw new Error("Class not found.");
  for (const m of marks) {
    const idx = (session.marks ?? []).findIndex((x) => x.rollNumber === m.rollNumber);
    if (idx >= 0) {
      session.marks[idx].mark = m.mark;
      session.marks[idx].feedback = m.feedback ?? session.marks[idx].feedback ?? "";
      session.marks[idx].markedAt = new Date();
    } else {
      session.marks.push({
        rollNumber: m.rollNumber,
        mark: m.mark,
        feedback: m.feedback ?? "",
        markedAt: new Date(),
      });
    }
  }
  await session.save();
  return { ...session.toObject(), _id: session._id.toString() };
}

/** Admin ends the class. */
export async function closeLiveClass(id: string) {
  await connectDB();
  const closed = await LiveClassModel.findByIdAndUpdate(
    id,
    { open: false, closedAt: new Date() },
    { new: true },
  ).lean();
  if (!closed) throw new Error("Live class not found.");
  return { ...closed, _id: closed._id.toString() };
}

export async function deleteLiveClass(id: string) {
  await connectDB();
  await LiveClassModel.findByIdAndDelete(id);
  return true;
}

/**
 * Student marks attendance by roll number — no login needed.
 * Requires: an open class for the course + the roll belongs to an approved
 * student enrolled in that course. Duplicate rolls are ignored.
 */
export async function markLiveAttendance(courseId: string, rollNumber: number) {
  await connectDB();

  const session = await LiveClassModel.findOne({ courseId, open: true });
  if (!session) throw new Error("No open class for this course right now.");

  const student = await Student.findOne({ rollNumber, registrationStatus: "Approved" });
  if (!student) throw new Error("Roll number not found or not approved.");

  const cid = courseId.toLowerCase();
  const enrolled = Array.isArray(student.enrolledCourseIds)
    ? student.enrolledCourseIds.some((id: string) => id.toLowerCase() === cid)
    : (student as { enrolledCourseId?: string }).enrolledCourseId?.toLowerCase() === cid;
  if (!enrolled) throw new Error("You are not enrolled in this course.");

  if (session.attendance.some((a) => a.rollNumber === rollNumber)) {
    return { ...session.toObject(), _id: session._id.toString(), duplicate: true };
  }

  session.attendance.push({
    rollNumber,
    name: student.nameEnglish,
    at: new Date(),
  });
  await session.save();
  return { ...session.toObject(), _id: session._id.toString(), duplicate: false };
}

/**
 * Student/admin unmarks (toggles off) attendance for the open class.
 */
export async function unmarkLiveAttendance(courseId: string, rollNumber: number) {
  await connectDB();

  const session = await LiveClassModel.findOne({ courseId, open: true });
  if (!session) throw new Error("No open class for this course right now.");

  session.attendance = (session.attendance ?? []).filter(
    (a) => a.rollNumber !== rollNumber,
  );
  await session.save();
  return { ...session.toObject(), _id: session._id.toString(), unmarked: true };
}

/**
 * Admin closes the session AND appends it to the course's class-log list —
 * the attendance rolls become the class's presentStudents. Optional lesson
 * coverage comes from the admin submit form (like the class-log dialog).
 */
export async function closeLiveClassAndMerge(
  id: string,
  form?: {
    date?: string;
    time?: string;
    fromLesson?: number;
    fromText?: number;
    toLesson?: number;
    toText?: number;
    presentStudents?: string[];
    absentStudents?: string[];
  },
) {
  await connectDB();
  const session = await LiveClassModel.findById(id);
  if (!session) throw new Error("Live class not found.");

  session.open = false;
  session.closedAt = new Date();
  await session.save();

  const attendance = session.attendance ?? [];
  const date = form?.date || session.date;
  const time = form?.time || session.time || "Live class";
  const coverage = {
    fromLesson: form?.fromLesson,
    fromText: form?.fromText,
    toLesson: form?.toLesson,
    toText: form?.toText,
  };
  const summary =
    coverage.fromLesson != null
      ? `Lesson ${coverage.fromLesson} Text ${coverage.fromText} to Lesson ${coverage.toLesson} Text ${coverage.toText}`
      : `Live class — ${attendance.length} attended`;

  const presentRolls =
    form?.presentStudents && form.presentStudents.length
      ? form.presentStudents.map((r) => Number(r)).filter((n: number) => !Number.isNaN(n))
      : attendance.map((a) => a.rollNumber);
  const absentRolls =
    form?.absentStudents && form.absentStudents.length
      ? form.absentStudents.map((r) => Number(r)).filter((n: number) => !Number.isNaN(n))
      : [];

  const course = await Course.findOne({ courseId: session.courseId });
  if (course) {
    const nextIndex = (course.classes?.length || 0) + 1;
    const cleanCourseCode = session.courseId.replace(/[^a-zA-Z0-9]/g, "");
    course.classes.push({
      classId: `CLS-${cleanCourseCode}-${String(nextIndex).padStart(2, "0")}`,
      date,
      time,
      status: "Completed",
      contentCovered: {
        summary,
        fromLesson: coverage.fromLesson,
        fromText: coverage.fromText,
        toLesson: coverage.toLesson,
        toText: coverage.toText,
      },
      presentStudents: presentRolls,
      absentStudents: absentRolls,
    });
    course.completedClassesCount = course.classes.length;
    course.markModified("classes");
    await course.save();
  }

  return { ...session.toObject(), _id: session._id.toString() };
}
