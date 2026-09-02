import { ICourse } from "@/features/academy/types";

export const hsk201: ICourse = {
  courseId: "HSK-201",
  status: "Coming Soon",
  courseName: "Elementary Chinese (HSK 2)",
  targetLevel: "HSK 2",
  startDate: "2026-08-06",
  nextBatchRegistrationDate: "September 04, 2026",
  totalLessons: 15,
  totalClassesPlanned: 20,
  completedClassesCount: 1,
  enrolledStudentRolls: [1, 4],
  classes: [
    {
      classId: "CLS-HSK201-01",
      date: "2026-08-06",
      time: "09:00 PM - 10:10 PM",
      status: "Completed",
      contentCovered: {
        summary: "Lesson 1 Text 1 to Lesson 1 Text 2",
        fromLesson: 1,
        fromText: 1,
        toLesson: 1,
        toText: 2,
      },
      presentStudents: [1, 4],
      absentStudents: [],
    },
  ],
  weekendExams: [],
};