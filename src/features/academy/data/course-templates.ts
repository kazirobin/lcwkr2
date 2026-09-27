/**
 * Ready-made course blueprints.
 *
 * Starting a course from a template is faster than filling in the syllabus by
 * hand, and it guarantees the student-facing page has the sections a course
 * needs to look like a real product: what it covers, how long it runs, what it
 * costs, and a roadmap.
 *
 * `roadmap` is deliberately the HSK track rather than free text — the lesson
 * pages, PDFs and homework all already exist per HSK level, so a course can
 * point at them and be useful on day one.
 */

export type CourseTemplate = {
  key: string;
  /** Pre-filled courseId, which the admin can change before saving. */
  courseId: string;
  courseName: string;
  targetLevel: string;
  tagline: string;
  duration: string;
  fee: number;
  freeClassCount: number;
  seats: number;
  covers: string[];
  totalLessons: number;
  totalClassesPlanned: number;
  lessons: Array<{ lessonNumber: number; title: string }>;
  topics: string[];
};

const HSK1_ROADMAP: Array<{ lessonNumber: number; title: string }> = [
  { lessonNumber: 1, title: "পিনয়িন ও উচ্চারণের নিয়ম" },
  { lessonNumber: 2, title: "সংখ্যা ও বয়স" },
  { lessonNumber: 3, title: "পরিবার ও বন্ধু" },
  { lessonNumber: 4, title: "খাবার ও পানীয়" },
  { lessonNumber: 5, title: "দৈনন্দিন কাজ" },
  { lessonNumber: 6, title: "সময় ও দিন" },
  { lessonNumber: 7, title: "বিভাগ ও জায়গা" },
  { lessonNumber: 8, title: "যাওয়া-আসা" },
  { lessonNumber: 9, title: "অনুভূতি ও অবস্থা" },
  { lessonNumber: 10, title: "ক্রিয়ার কাল" },
  { lessonNumber: 11, title: "প্রশ্নবোধক শব্দ" },
  { lessonNumber: 12, title: "সংযোগক শব্দ" },
  { lessonNumber: 13, title: "পরীক্ষার প্রস্তুতি (১)" },
  { lessonNumber: 14, title: "পরীক্ষার প্রস্তুতি (২)" },
  { lessonNumber: 15, title: "মডেল টেস্ট ও রিভিশন" },
];

export const COURSE_TEMPLATES: CourseTemplate[] = [
  {
    key: "hsk1-exam-1month",
    courseId: "HSK-1-EXAM-1M",
    courseName: "মাত্র ১ মাসে HSK 1 পরীক্ষার সম্পূর্ণ প্রস্তুতি!",
    targetLevel: "HSK 1",
    tagline: "এক মাসে HSK 1-এর সব শব্দ, ব্যাকরণ ও পরীক্ষার কৌশল — শূন্য থেকে।",
    duration: "১ মাস",
    fee: 500,
    freeClassCount: 1,
    seats: 30,
    covers: [
      "HSK 1-এর ১৫টি পাঠ — পূর্ণ বাংলা ব্যাখ্যা সহ",
      "প্রতি সপ্তাহে ২টি লাইভ ক্লাস (Zoom)",
      "আধুনিক বাংলা থেকে মাত্র ২ বার ব্যাখ্যা",
      "আসল HSK 1 পরীক্ষার প্রশ্নের ধরন ও কৌশল",
      "৩টি মডেল টেস্ট ও ব্যক্তিগত ফলাফল",
      "হাতের লেখা ও ডায়ালগ অনুশীলনের মার্কিং",
    ],
    totalLessons: 15,
    totalClassesPlanned: 8,
    lessons: HSK1_ROADMAP,
    topics: ["পিনয়িন", "ব্যাকরণ", "শব্দভাণ্ডার", "পরীক্ষার কৌশল", "লেখার অনুশীলন"],
  },
  {
    key: "hsk1-beginner",
    courseId: "HSK-1-BEGINNER",
    courseName: "শূন্য থেকে প্রাথমিক চীনা (HSK 1)",
    targetLevel: "HSK 1",
    tagline: "একদম নতুনদের জন্য — বাংলায় ব্যাখ্যা করে ধীরে ধীরে বেসিক চীনা।",
    duration: "৩ মাস",
    fee: 0,
    freeClassCount: 0,
    seats: 0,
    covers: [
      "HSK 1-এর ১৫টি পাঠের পূর্ণ ভিডিও",
      "প্রতি সপ্তাহে ১টি লাইভ ক্লাস",
      "পাঠের বই (PDF) ও অডিও",
      "সাপ্তাহিক হোমওয়ার্ক ও ফিডব্যাক",
    ],
    totalLessons: 15,
    totalClassesPlanned: 12,
    lessons: HSK1_ROADMAP,
    topics: ["পিনয়িন", "শব্দভাণ্ডার", "ব্যাকরণ", "উচ্চারণ"],
  },
  {
    key: "hsk2-elementary",
    courseId: "HSK-2-ELEMENTARY",
    courseName: "মৌলিক চীনা (HSK 2)",
    targetLevel: "HSK 2",
    tagline: "HSK 1 শেষ করা শিক্ষার্থীদের জন্য পরবর্তী ধাপ।",
    duration: "৩ মাস",
    fee: 500,
    freeClassCount: 0,
    seats: 20,
    covers: [
      "HSK 2-এর ১৫টি পাঠ",
      "প্রতি সপ্তাহে ২টি লাইভ ক্লাস",
      "HSK 1 রিভিশন ও শব্দভাণ্ডার বৃদ্ধি",
      "লেখার অনুশীলন ও মাসিক মূল্যায়ন",
    ],
    totalLessons: 15,
    totalClassesPlanned: 12,
    lessons: [],
    topics: ["HSK 2 ব্যাকরণ", "শব্দভাণ্ডার", "রচনা", "উচ্চারণ"],
  },
];

export function templateByKey(key: string): CourseTemplate | undefined {
  return COURSE_TEMPLATES.find((t) => t.key === key);
}
