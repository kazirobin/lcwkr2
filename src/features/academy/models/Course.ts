import mongoose, { Schema, model, models } from "mongoose";

export interface ICourseDoc {
  courseId: string;
  courseName: string;
  targetLevel: string;
  status: "Running" | "Coming Soon" | "Completed";
  startDate?: string;
  nextBatchRegistrationDate?: string;
  // ── new professional LMS fields ──
  lessons: Array<{ lessonNumber: number; title: string; description?: string }>;
  nextClassTopic?: string;
  topics?: string[];
  registrationOpen: boolean;
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
