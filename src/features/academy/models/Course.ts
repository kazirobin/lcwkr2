import { Schema, model, models } from "mongoose";

export interface ICourseDoc {
  courseId: string;
  courseName: string;
  targetLevel: string;
  // Kept for the courses that already exist in the database. New courses are
  // driven by `launched` below; the admin no longer edits this by hand.
  status?: "Running" | "Coming Soon" | "Completed";
  startDate?: string;
  nextBatchRegistrationDate?: string;
  // ── how the course is sold ──
  /** One-line promise shown on the academy course card. */
  tagline: string;
  /** How long the course runs, e.g. "3 months" — free text so it reads well. */
  duration: string;
  /** Seat price in BDT. 0 means the course is free to join. */
  fee: number;
  /** How many trial classes a new student gets before paying. */
  freeClassCount: number;
  /** Bullets describing what the course covers, shown in the detail view. */
  covers: string[];
  /** Seats available. 0 means unlimited. */
  seats: number;
  /** Once true the course is open for paid enrollment. */
  launched: boolean;
  launchedAt?: Date;
  /**
   * Set when the batch has finished. A completed course stops accepting new
   * enrollments and drops off the academy list, but its class log and students
   * stay exactly where they are for the record.
   */
  completed: boolean;
  completedAt?: Date;
  /** Date the paid enrollment window closes, YYYY-MM-DD. Empty = no deadline. */
  enrollmentDeadline?: string;
  // ── new professional LMS fields ──
  lessons: Array<{ lessonNumber: number; title: string; description?: string }>;
  nextClassTopic?: string;
  topics?: string[];
  // Legacy gate kept only so existing records keep working. The admin UI no
  // longer toggles it; `launched` decides whether enrollment is open.
  registrationOpen?: boolean;
  registrationLastDate?: string;
  totalLessons: number;
  totalClassesPlanned: number;
  completedClassesCount: number;
  classes: Array<{
    classId: string;
    date: string;
    time: string;
    status: "Scheduled" | "Completed" | "Cancelled";
    contentCovered: {
      summary: string;
      topic?: string;
      fromLesson: number;
      fromText: number;
      toLesson: number;
      toText: number;
    };
    presentStudents: number[];
    absentStudents: number[];
  }>;
  weekendExams: Array<{
    examId: string;
    examTitle: string;
    date: string;
    totalMarks: number;
    passMarks: number;
    results: Array<{
      rollNumber: number;
      attended: boolean;
      score: number;
      grade: string;
      remarks: string;
    }>;
  }>;
}

const CourseSchema = new Schema<ICourseDoc>(
  {
    courseId: { type: String, required: true, unique: true },
    courseName: { type: String, required: true },
    targetLevel: { type: String, required: true },
    status: {
      type: String,
      enum: ["Running", "Coming Soon", "Completed"],
      default: "Coming Soon",
    },
    startDate: { type: String },
    nextBatchRegistrationDate: { type: String },
    // ── how the course is sold ──
    tagline: { type: String, default: "" },
    duration: { type: String, default: "" },
    fee: { type: Number, default: 0, min: 0 },
    freeClassCount: { type: Number, default: 0, min: 0 },
    covers: { type: [String], default: [] },
    seats: { type: Number, default: 0, min: 0 },
    launched: { type: Boolean, default: false, index: true },
    launchedAt: { type: Date, default: null },
    completed: { type: Boolean, default: false, index: true },
    completedAt: { type: Date, default: null },
    enrollmentDeadline: { type: String, default: "" },
    // ── new professional LMS fields ──
    lessons: [
      {
        lessonNumber: { type: Number, required: true },
        title: { type: String, required: true },
        description: { type: String },
      },
    ],
    nextClassTopic: { type: String, default: "" },
    topics: { type: [String], default: [] },
    registrationOpen: { type: Boolean, default: false },
    registrationLastDate: { type: String },
    totalLessons: { type: Number, default: 15 },
    totalClassesPlanned: { type: Number, default: 24 },
    completedClassesCount: { type: Number, default: 0 },
    classes: [
      {
        classId: { type: String, required: true },
        date: { type: String, required: true },
        time: { type: String, required: true },
        status: { type: String, default: "Completed" },
        contentCovered: {
          summary: String,
          topic: String,
          fromLesson: Number,
          fromText: Number,
          toLesson: Number,
          toText: Number,
        },
        presentStudents: [Number],
        absentStudents: [Number],
      },
    ],
    weekendExams: [
      {
        examId: String,
        examTitle: String,
        date: String,
        totalMarks: Number,
        passMarks: Number,
        results: [
          {
            rollNumber: Number,
            attended: Boolean,
            score: Number,
            grade: String,
            remarks: String,
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

export const Course = models.Course || model<ICourseDoc>("Course", CourseSchema);
export default Course;
