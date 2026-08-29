export interface IContentCovered {
  summary: string;
  fromLesson: number;
  fromText: number;
  toLesson: number;
  toText: number;
}

export interface IClassSession {
  _id?: string;
  classId: string;
  date: string;
  time: string;
  status: "Scheduled" | "Completed" | "Cancelled";
  contentCovered: IContentCovered;
  presentStudents: (string | number)[];
  absentStudents: (string | number)[];
}

export interface IExamResult {
  _id?: string;
  rollNumber: string | number;
  attended: boolean;
  score: number;
  grade: string;
  remarks: string;
}

export interface IWeekendExam {
  _id?: string;
  examId: string;
  examTitle: string;
  date: string;
  totalMarks: number;
  passMarks: number;
  results: IExamResult[];
}

export interface ICourse {
  _id?: string;
  courseId: string;
  courseName: string;
  targetLevel: string;
  status: "Running" | "Coming Soon" | "Completed";
  startDate?: string;
  nextBatchRegistrationDate?: string;
  totalLessons: number;
  totalClassesPlanned: number;
  completedClassesCount: number;
  enrolledStudentRolls?: (string | number)[]; // 👈 অপশনাল (?) করা হয়েছে
  classes: IClassSession[];
  weekendExams: IWeekendExam[];
}

export interface IStudent {
  _id?: string;
  rollNumber: string | number;
  nameEnglish: string;
  whatsapp: string;
  isWhatsAppGroupJoined: boolean;
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