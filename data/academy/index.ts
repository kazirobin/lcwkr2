import { IAcademyData } from "@/types/academy";
import { studentsData } from "./academy/students";
import { hsk101Course } from "./academy/hsk101";
import { hsk201Course } from "./academy/hsk201";

export const academyData: IAcademyData = {
  institution: "Global Academy",
  instructor: "Kazi Robin",
  courses: [hsk101Course, hsk201Course],
  students: studentsData,
};