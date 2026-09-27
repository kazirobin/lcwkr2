import { connectDB } from "@/lib/db";
import { Announcement } from "@/features/academy/models";

/**
 * Site-wide notices. The main job is telling everyone when a course opens, so
 * `announceCourseLaunch` is called automatically by the launch action rather
 * than being left to the admin to remember.
 */

export type AnnouncementRow = {
  id: string;
  key: string;
  title: string;
  body: string;
  href: string;
  courseId?: string;
  tone: "info" | "success" | "warning";
  active: boolean;
  dismissible: boolean;
  createdAt: string;
};

function toRow(doc: {
  _id: unknown;
  key: string;
  title: string;
  body: string;
  href: string;
  courseId?: string;
  tone: "info" | "success" | "warning";
  active: boolean;
  dismissible: boolean;
  createdAt: Date;
}): AnnouncementRow {
  return {
    id: String(doc._id),
    key: doc.key,
    title: doc.title,
    body: doc.body,
    href: doc.href,
    courseId: doc.courseId,
    tone: doc.tone,
    active: doc.active,
    dismissible: doc.dismissible,
    createdAt: doc.createdAt.toISOString(),
  };
}

/** The banners a visitor should see right now. */
export async function activeAnnouncements(): Promise<AnnouncementRow[]> {
  await connectDB();
  const docs = await Announcement.find({ active: true }).sort({ createdAt: -1 }).limit(3).lean();
  return docs.map((d) => toRow(d as never));
}

export async function listAnnouncements(): Promise<AnnouncementRow[]> {
  await connectDB();
  const docs = await Announcement.find({}).sort({ createdAt: -1 }).limit(50).lean();
  return docs.map((d) => toRow(d as never));
}

/**
 * Post (or re-post) a notice. The key is what makes it idempotent: launching
 * the same course twice refreshes one banner instead of adding another.
 */
export async function upsertAnnouncement(input: {
  key: string;
  title: string;
  body?: string;
  href?: string;
  courseId?: string;
  tone?: "info" | "success" | "warning";
  active?: boolean;
  dismissible?: boolean;
}): Promise<AnnouncementRow> {
  await connectDB();
  const doc = await Announcement.findOneAndUpdate(
    { key: input.key },
    {
      $set: {
        key: input.key,
        title: input.title,
        body: input.body ?? "",
        href: input.href ?? "",
        courseId: input.courseId ?? "",
        tone: input.tone ?? "success",
        active: input.active ?? true,
        dismissible: input.dismissible ?? true,
      },
    },
    { new: true, upsert: true },
  ).lean();
  return toRow(doc as never);
}

export async function setAnnouncementActive(id: string, active: boolean) {
  await connectDB();
  const doc = await Announcement.findByIdAndUpdate(id, { $set: { active } }, { new: true }).lean();
  return doc ? toRow(doc as never) : null;
}

export async function deleteAnnouncement(id: string) {
  await connectDB();
  return Announcement.findByIdAndDelete(id);
}

/**
 * The message the admin can copy into a WhatsApp group when a course opens.
 * Returned as plain text so the admin page can put it in a textarea.
 */
export function launchBroadcastText(course: {
  courseName: string;
  targetLevel: string;
  tagline?: string;
  duration?: string;
  fee: number;
  freeClassCount?: number;
  covers?: string[];
}): string {
  const lines = [
    `🎓 *নতুন কোর্স চালু হয়েছে!*`,
    `-----------------------------------`,
    `📘 *কোর্স:* ${course.courseName}`,
    `🎯 *লেভেল:* ${course.targetLevel}`,
  ];
  if (course.tagline) lines.push(`📝 ${course.tagline}`);
  if (course.duration) lines.push(`⏳ *সময়কাল:* ${course.duration}`);
  lines.push(
    course.fee > 0
      ? `💰 *ফি:* ৳${course.fee.toLocaleString("en-US")}`
      : `💰 *ফি:* ফ্রি`,
  );
  if (course.freeClassCount && course.freeClassCount > 0) {
    lines.push(`🎁 *ফ্রি ক্লাস:* ${course.freeClassCount} টি আগে`);
  }
  if (course.covers?.length) {
    lines.push(`-----------------------------------`);
    for (const item of course.covers) lines.push(`✅ ${item}`);
  }
  lines.push(
    `-----------------------------------`,
    `ভর্তি করতে চাইলে এই লিংকে যান 👇`,
    `https://lcwkr.vercel.app/academy`,
  );
  return lines.join("\n");
}
