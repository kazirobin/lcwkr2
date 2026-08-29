import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { connectDB } from "@/lib/mongodb";
import { Course } from "@/models/Course";
import { Student } from "@/models/Student";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pin = searchParams.get("pin");

    // অ্যাডমিন সিকিউরিটি চেক
    if (pin !== "8131" && pin !== process.env.ADMIN_PASSCODE) {
      return NextResponse.json({ success: false, message: "Unauthorized PIN" }, { status: 401 });
    }

    await connectDB();

    // ১. ডাটাবেজ থেকে অনুমোদিত সব ডেটা আনা
    const rawCourses = await Course.find({}).lean();
    const rawStudents = await Student.find({ registrationStatus: "Approved" }).sort({ rollNumber: 1 }).lean();

    // ক্লিন ফরম্যাটিং (Mongoose internal fields বাদ দেওয়া)
    const courses = rawCourses.map((c: any) => {
      const { _id, __v, createdAt, updatedAt, ...rest } = c;
      return rest;
    });

    const students = rawStudents.map((s: any) => {
      return {
        rollNumber: s.rollNumber,
        nameEnglish: s.nameEnglish,
        whatsapp: s.whatsapp,
        isWhatsAppGroupJoined: s.isWhatsAppGroupJoined ?? false,
        location: s.location || "Dhaka, Bangladesh",
        avatarUrl: s.avatarUrl,
        enrolledCourseIds: [s.enrolledCourseId],
      };
    });

    // ২. ফাইলের কনটেন্ট তৈরি
    const studentsFileContent = `import { IStudent } from "@/types/academy";\n\nexport const studentsData: IStudent[] = ${JSON.stringify(students, null, 2)};\n`;

    const academyDataContent = `import { IAcademyData } from "@/types/academy";\nimport { studentsData } from "./students";\n\nexport const academyData: IAcademyData = {\n  institution: "Learn Chinese with Kazi Robin",\n  instructor: "Kazi Robin",\n  courses: ${JSON.stringify(courses, null, 2)},\n  students: studentsData,\n};\n`;

    // ৩. data/academy ফোল্ডারে ফাইল রাইট করা
    const targetDir = path.join(process.cwd(), "data", "academy");
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    fs.writeFileSync(path.join(targetDir, "students.ts"), studentsFileContent, "utf-8");
    fs.writeFileSync(path.join(targetDir, "index.ts"), academyDataContent, "utf-8");

    return NextResponse.json({
      success: true,
      message: "Successfully fetched from MongoDB and written to local .ts files!",
      counts: {
        courses: courses.length,
        students: students.length,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}