import { ICourse } from "@/types/academy";

export const hsk201Course: ICourse = {
  courseId: "HSK-201",
  courseName: "Elementary Chinese (HSK 2)",
  targetLevel: "HSK 2",
  totalLessons: 15,
  totalClassesPlanned: 30,
  completedClassesCount: 1,
  enrolledStudentRolls: [1, 4],
  classes: [
    {
      classId: "CLS-HSK201-01",
      date: "2026-08-06",
      time: "07:00 PM - 08:30 PM",
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