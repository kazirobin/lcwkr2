import { IAcademyData } from "@/types/academy";
import { studentsData } from "./students";
import { hsk101 } from "./hsk101";
import { hsk201 } from "./hsk201";

export const academyData: IAcademyData = {
  institution: "Global Academy",
  instructor: "Kazi Robin",
  courses: [hsk101, hsk201],
  students: studentsData,
};