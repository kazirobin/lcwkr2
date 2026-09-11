// Live class sessions — admin opens a course's class (Google Meet link),
// students join + mark attendance by roll, admin ends it with a passcode.

import mongoose, { Schema, Document, Model } from "mongoose";
import connectDB from "@/lib/db";
import { Student, Course } from "@/features/academy/models";

export interface ILiveAttendance {
  rollNumber: number;
  name: string;
  at: Date;
}

export interface ILiveClass extends Document {
  courseId: string;
  meetLink: string;
  date: string;
  time: string;
  open: boolean;
  openedAt: Date;
  closedAt: Date | null;
  attendance: ILiveAttendance[];
  createdAt: Date;
  updatedAt: Date;
}

const LiveClassSchema = new Schema<ILiveClass>(
  {
    courseId: { type: String, required: true, index: true },
    meetLink: { type: String, required: true, trim: true },
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

/** Admin starts a class for a course (only one open per course). */
export async function openLiveClass(courseId: string, meetLink: string, date: string, time?: string) {
  await connectDB();
  const already = await LiveClassModel.findOne({ courseId, open: true });
  if (already) {
    throw new Error("This course already has an open class. End it first.");
  }
  const created = await LiveClassModel.create({
    courseId,
    meetLink: meetLink.trim(),
    date,
    time: time ?? "",
    open: true,
  });
  return { ...created.toObject(), _id: created._id.toString() };
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
      presentStudents: attendance.map((a) => a.rollNumber),
      absentStudents: [],
    });
    course.completedClassesCount = course.classes.length;
    course.markModified("classes");
    await course.save();
  }

  return { ...session.toObject(), _id: session._id.toString() };
}
