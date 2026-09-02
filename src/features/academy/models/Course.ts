import mongoose, { Schema, model, models } from "mongoose";

export interface ICourseDoc {
  courseId: string;
  courseName: string;
  targetLevel: string;
  status: "Running" | "Coming Soon" | "Completed";
  startDate?: string;
  nextBatchRegistrationDate?: string;
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