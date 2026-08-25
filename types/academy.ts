export interface ICoveredText {
  textNumber: number;
  title: string;
  type: "Dialogue" | "Reading" | "Grammar" | "Vocabulary";
}

export interface IContentCovered {
  lessonNumber: number;
  lessonTitle: string;
  totalTextsInLesson: number;
  coveredTexts: ICoveredText[];
  lessonProgress: string;
}

export interface IClassSession {
  classId: string;
  date: string;
  time: string;
  status: "Scheduled" | "Completed" | "Cancelled";
  contentCovered: IContentCovered[];
  presentStudents: (string | number)[];
  absentStudents: (string | number)[];
}

export interface IExamResult {
  rollNumber: string | number;
  attended: boolean;
  score: number;
  grade: string;
  remarks: string;
}

export interface IWeekendExam {
  examId: string;
  examTitle: string;
  date: string;
  totalMarks: number;
  passMarks: number;
  results: IExamResult[];
}

export interface ICourse {
  courseId: string;
  courseName: string;
  targetLevel: string;
  totalLessons: number;
  totalClassesPlanned: number;
  completedClassesCount: number;
  enrolledStudentRolls: (string | number)[];
  classes: IClassSession[];
  weekendExams: IWeekendExam[];
}

export interface IStudent {
  rollNumber: string | number;
  nameEnglish: string;
  whatsapp: string;
  location: string;
  avatarUrl?: string;
  enrolledCourseIds: string[];
}

export interface IAcademyData {
  institution: string;
  instructor: string;
  courses: ICourse[];
  students: IStudent[];
}