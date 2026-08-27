import { IAcademyData } from "@/types/academy";
import { studentsData } from "./students";
import { hsk101Course } from "./hsk101";
import { hsk201Course } from "./hsk201";

export const academyData: IAcademyData = {
  institution: "Global Academy",
  instructor: "Kazi Robin",
  courses: [hsk101Course, hsk201Course],
  students: studentsData,
};