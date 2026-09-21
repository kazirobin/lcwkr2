export interface ILesson {
  lessonNumber: number;
  title: string;
  description?: string;
}

export interface IAssignmentSubmission {
  rollNumber: number;
  content: string;
  submittedAt: string;
}

export interface IAssignmentMark {
  rollNumber: number;
  mark: number;
  feedback?: string;
  markedAt: string;
}

export interface IContentCovered {
  summary?: string;
  topic?: string;
  fromLesson?: number;
  fromText?: number;
  toLesson?: number;
  toText?: number;
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
  // ── new professional LMS fields ──
  lessons?: ILesson[];
  nextClassTopic?: string;
  topics?: string[];
  registrationOpen?: boolean;
  registrationLastDate?: string;
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

export interface IStudyGroup {
  _id?: string;
  courseId: string;
  label: string;
  memberRolls: number[];
  createdByRoll?: number;
  createdAt: string;
}

export interface ILiveClassView {
  _id: string;
  courseId: string;
  meetLink: string;
  topic?: string;
  assignmentPrompt?: string;
  date: string;
  time?: string;
  open: boolean;
  attendance: { rollNumber: number; name: string }[];
  submissions: IAssignmentSubmission[];
  marks: IAssignmentMark[];
}

export interface ILiveLink {
  _id: string;
  courseId: string;
  label: string;
  meetLink: string;
  topic: string;
}

export interface IAcademyData {
  institution: string;
  instructor: string;
  courses: ICourse[];
  students: IStudent[];
}