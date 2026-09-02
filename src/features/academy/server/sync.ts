import fs from "fs";
import path from "path";
import { connectDB } from "@/lib/db";
import { Course, Student } from "@/features/academy/models";
import { academyData } from "@/features/academy/data";

/** One-off tooling: push MongoDB academy data back into the checked-in
 *  `src/features/academy/data` .ts files, and re-seed the DB from them. */

export async function seedAcademyFromStaticData() {
  await connectDB();

  await Course.deleteMany({});
  await Student.deleteMany({});

  for (const c of academyData.courses) {
    await Course.create(c);
  }

  for (const s of academyData.students) {
    await Student.create({
      ...s,
      enrolledCourseId: s.enrolledCourseIds[0] || "HSK-101",
      registrationStatus: "Approved",
    });
  }
}

export async function syncAcademyDataToFiles() {
  await connectDB();

  const rawCourses = await Course.find({}).lean();
  const rawStudents = await Student.find({ registrationStatus: "Approved" })
    .sort({ rollNumber: 1 })
    .lean();

  const courses = rawCourses.map((c: any) => {
    const { _id, __v, createdAt, updatedAt, ...rest } = c;
    return rest;
  });

  const students = rawStudents.map((s: any) => ({
    rollNumber: s.rollNumber,
    nameEnglish: s.nameEnglish,
    whatsapp: s.whatsapp,
    isWhatsAppGroupJoined: s.isWhatsAppGroupJoined ?? false,
    location: s.location || "Dhaka, Bangladesh",
    avatarUrl: s.avatarUrl,
    enrolledCourseIds: [s.enrolledCourseId],
  }));

  const studentsFileContent = `import { IStudent } from "@/features/academy/types";\n\nexport const studentsData: IStudent[] = ${JSON.stringify(
    students,
    null,
    2,
  )};\n`;

  const academyDataContent = `import { IAcademyData } from "@/features/academy/types";\nimport { studentsData } from "./students";\n\nexport const academyData: IAcademyData = {\n  institution: "Learn Chinese with Kazi Robin",\n  instructor: "Kazi Robin",\n  courses: ${JSON.stringify(
    courses,
    null,
    2,
  )},\n  students: studentsData,\n};\n`;

  const targetDir = path.join(process.cwd(), "src", "features", "academy", "data");
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  fs.writeFileSync(path.join(targetDir, "students.ts"), studentsFileContent, "utf-8");
  fs.writeFileSync(path.join(targetDir, "index.ts"), academyDataContent, "utf-8");

  return { courses: courses.length, students: students.length };
}
