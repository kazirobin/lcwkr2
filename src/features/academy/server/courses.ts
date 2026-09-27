import { connectDB } from "@/lib/db";
import { Course } from "@/features/academy/models";

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
 * Open or close paid enrollment. The first launch stamps `launchedAt`, so the
 * admin can see when a course actually went on sale.
 */
export async function setCourseLaunched(courseId: string, launched: boolean) {
  await connectDB();
  const update: Record<string, unknown> = { launched: Boolean(launched) };
  if (launched) {
    update.launchedAt = new Date();
    // Legacy gate stays in step so older pages agree with the new flow.
    update.registrationOpen = true;
  } else {
    update.registrationOpen = false;
  }
  return Course.findOneAndUpdate({ courseId }, { $set: update }, { new: true });
}
