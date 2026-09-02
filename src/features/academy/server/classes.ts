import { connectDB } from "@/lib/db";
import { ClassLog, Course } from "@/features/academy/models";

export async function createClassLog(input: {
  courseId: string;
  date: unknown;
  time: unknown;
  contentCovered: unknown;
  presentStudents: unknown;
  absentStudents: unknown;
}) {
  const { courseId, date, time, contentCovered, presentStudents, absentStudents } = input;

  await connectDB();

  const course = await Course.findOne({ courseId });
  const nextIndex = (course?.classes?.length || 0) + 1;
  const generatedClassId = `CLS-${courseId.replace("-", "")}-${
    nextIndex < 10 ? `0${nextIndex}` : nextIndex
  }`;

  return ClassLog.create({
    courseId,
    classId: generatedClassId,
    date,
    time,
    contentCovered,
    presentStudents,
    absentStudents,
    approvalStatus: "Pending",
    submittedBy: "Teacher Robin",
  });
}

export async function listPendingClasses() {
  await connectDB();
  return ClassLog.find({ approvalStatus: "Pending" }).sort({ createdAt: -1 });
}

export type ReviewClassResult =
  | { kind: "not-found" }
  | { kind: "approved" }
  | { kind: "rejected" };

export async function reviewClassLog(
  logId: string,
  action: string,
): Promise<ReviewClassResult> {
  await connectDB();

  const log = await ClassLog.findById(logId);
  if (!log) return { kind: "not-found" };

  if (action === "APPROVE") {
    log.approvalStatus = "Approved";
    await log.save();

    await Course.findOneAndUpdate(
      { courseId: log.courseId },
      {
        $push: {
          classes: {
            classId: log.classId,
            date: log.date,
            time: log.time,
            status: "Completed",
            contentCovered: log.contentCovered,
            presentStudents: log.presentStudents,
            absentStudents: log.absentStudents,
          },
        },
        $inc: { completedClassesCount: 1 },
      },
    );

    return { kind: "approved" };
  }

  await ClassLog.findByIdAndDelete(logId);
  return { kind: "rejected" };
}

export type DeleteClassResult =
  | { kind: "course-not-found" }
  | { kind: "deleted"; classes: unknown[]; completedClassesCount: number };

export async function deleteClass(
  courseId: string,
  classId: string,
): Promise<DeleteClassResult> {
  await connectDB();

  const course = await Course.findOne({ courseId });
  if (!course) return { kind: "course-not-found" };

  const remainingClasses = course.classes.filter((cls: any) => cls.classId !== classId);

  const reindexedClasses = remainingClasses.map((cls: any, index: number) => {
    const cleanCourseCode = courseId.replace(/[^a-zA-Z0-9]/g, "");
    const newIndex = String(index + 1).padStart(2, "0");
    const newClassId = `CLS-${cleanCourseCode}-${newIndex}`;

    return {
      ...(cls.toObject?.() || cls),
      classId: newClassId,
    };
  });

  course.classes = reindexedClasses;
  course.completedClassesCount = reindexedClasses.length;
  await course.save();

  return {
    kind: "deleted",
    classes: reindexedClasses,
    completedClassesCount: reindexedClasses.length,
  };
}

export type EditClassResult =
  | { kind: "course-not-found" }
  | { kind: "class-not-found" }
  | { kind: "updated"; course: unknown };

export async function editClass(input: {
  courseId: string;
  classId: string;
  date: unknown;
  time: unknown;
  contentCovered: unknown;
  presentStudents?: unknown[];
  absentStudents?: unknown[];
}): Promise<EditClassResult> {
  const { courseId, classId, date, time, contentCovered, presentStudents, absentStudents } = input;

  await connectDB();

  const cleanPresent = (presentStudents || []).map((r: any) => String(r).trim());
  const cleanAbsent = (absentStudents || []).map((r: any) => String(r).trim());

  const course = await Course.findOne({ courseId });
  if (!course) return { kind: "course-not-found" };

  const targetClass = course.classes.find((cls: any) => cls.classId === classId);
  if (!targetClass) return { kind: "class-not-found" };

  targetClass.date = date;
  targetClass.time = time;
  targetClass.contentCovered = contentCovered;
  targetClass.presentStudents = cleanPresent;
  targetClass.absentStudents = cleanAbsent;

  course.markModified("classes");
  await course.save();

  return { kind: "updated", course };
}
