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
