import { connectDB } from "@/lib/db";
import { Course } from "@/features/academy/models";
import { upsertAnnouncement, launchBroadcastText } from "./announcements";

export async function listCourses() {
  await connectDB();
  return Course.find({}).sort({ createdAt: 1 });
}

export async function createCourse(body: unknown) {
  await connectDB();
  return Course.create(body as Record<string, unknown>);
}

export async function getCourseById(courseId: string) {
  await connectDB();
  return Course.findOne({ courseId });
}

export async function updateCourse(courseId: string, body: unknown) {
  await connectDB();
  return Course.findOneAndUpdate(
    { courseId },
    { $set: body as Record<string, unknown> },
    { new: true },
  );
}

export async function deleteCourse(courseId: string) {
  await connectDB();
  return Course.findOneAndDelete({ courseId });
}

/** The fields that describe how a course is sold and how long it runs. */
export type CourseOffer = {
  tagline?: string;
  duration?: string;
  fee?: number;
  freeClassCount?: number;
  covers?: string[];
  seats?: number;
  enrollmentDeadline?: string;
};

const NUMERIC: Array<keyof CourseOffer> = ["fee", "freeClassCount", "seats"];

/**
 * Update the sales details of a course. Only known keys are written, so a
 * stray field in the request body cannot end up in the document.
 */
export async function updateCourseOffer(courseId: string, patch: CourseOffer) {
  await connectDB();
  const set: Record<string, unknown> = {};

  if (typeof patch.tagline === "string") set.tagline = patch.tagline.trim();
  if (typeof patch.duration === "string") set.duration = patch.duration.trim();
  if (Array.isArray(patch.covers)) {
    set.covers = patch.covers.map((c) => String(c).trim()).filter(Boolean).slice(0, 12);
  }
  if (typeof patch.enrollmentDeadline === "string") {
    set.enrollmentDeadline = patch.enrollmentDeadline.trim();
  }
  for (const key of NUMERIC) {
    const value = patch[key];
    if (value === undefined || value === null || value === "") continue;
    const n = Number(value);
    if (Number.isFinite(n) && n >= 0) set[key] = Math.round(n);
  }

  if (!Object.keys(set).length) return getCourseById(courseId);
  return Course.findOneAndUpdate({ courseId }, { $set: set }, { new: true });
}

/**
 * Mark a batch finished, or reopen it. Completing takes the course off sale and
 * off the academy list; reopening puts it back exactly as it was, so a course
 * that was never launched does not silently start accepting enrollments.
 */
export async function setCourseCompleted(courseId: string, completed: boolean) {
  await connectDB();
  const course = await Course.findOne({ courseId });
  if (!course) return null;
  const update: Record<string, unknown> = { completed: Boolean(completed) };
  if (completed) {
    update.completedAt = new Date();
    update.launched = false;
    update.registrationOpen = false;
  } else {
    update.completedAt = null;
  }
  return Course.findOneAndUpdate({ courseId }, { $set: update }, { new: true });
}

/** The course to feature on the academy page, or null to feature nothing. */
export async function setCourseFeatured(courseId: string, featured: boolean) {
  await connectDB();
  if (featured) {
    // Only one course can be the featured one, so clear the rest.
    await Course.updateMany({ courseId: { $ne: courseId } }, { $set: { featured: false } });
  }
  return Course.findOneAndUpdate({ courseId }, { $set: { featured: Boolean(featured) } }, { new: true });
}

/**
 * Open or close paid enrollment. The first launch stamps `launchedAt`, so the
 * admin can see when a course actually went on sale. A completed course has to
 * be reopened before it can go on sale again.
 */
export async function setCourseLaunched(courseId: string, launched: boolean) {
  await connectDB();
  const course = await Course.findOne({ courseId });
  if (!course) return null;
  if (launched && course.completed) {
    return null; // caller turns this into a clear message
  }
  const update: Record<string, unknown> = { launched: Boolean(launched) };
  if (launched) {
    update.launchedAt = new Date();
    // Legacy gate stays in step so older pages agree with the new flow.
    update.registrationOpen = true;
  } else {
    update.registrationOpen = false;
  }
  const updated = await Course.findOneAndUpdate({ courseId }, { $set: update }, { new: true });
  if (updated && launched) {
    // A launch is news, so put a banner up automatically rather than trusting
    // anyone to remember. Failures here must not undo the launch itself.
    try {
      await upsertAnnouncement({
        key: `course-launch:${courseId}`,
        title: `নতুন কোর্স চালু: ${updated.courseName}`,
        body:
          updated.fee > 0
            ? `৳${updated.fee.toLocaleString("en-US")}${updated.duration ? ` · ${updated.duration}` : ""} — এখনই ভর্তি করুন।`
            : `ফ্রি কোর্স${updated.duration ? ` · ${updated.duration}` : ""} — এখনই যুক্ত হোন।`,
        href: "/academy#courses",
        courseId,
        tone: "success",
      });
    } catch {
      /* the course is live either way */
    }
  }
  if (updated && !launched) {
    try {
      await upsertAnnouncement({
        key: `course-launch:${courseId}`,
        title: `${updated.courseName}`,
        body: "এই কোর্সে এখন ভর্তি বন্ধ হয়েছে।",
        href: "/academy#courses",
        courseId,
        tone: "info",
        active: false,
      });
    } catch {
      /* ignore */
    }
  }
  return updated;
}

/** The ready-to-paste WhatsApp message for a course launch. */
export async function courseBroadcastText(courseId: string): Promise<string | null> {
  await connectDB();
  const course = await Course.findOne({ courseId }).lean();
  if (!course) return null;
  return launchBroadcastText({
    courseName: course.courseName,
    targetLevel: course.targetLevel,
    tagline: course.tagline,
    duration: course.duration,
    fee: course.fee ?? 0,
    freeClassCount: course.freeClassCount ?? 0,
    covers: course.covers ?? [],
  });
}
