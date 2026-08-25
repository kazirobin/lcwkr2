import { IAcademyData } from "@/types/academy";

export const academyData: IAcademyData = {
  institution: "Global Academy",
  instructor: "Kazi Robin",
  courses: [
    {
      courseId: "HSK-101",
      courseName: "Beginner Chinese (HSK 1)",
      targetLevel: "HSK 1",
      totalLessons: 15,
      totalClassesPlanned: 24,
      completedClassesCount: 3,
      enrolledStudentRolls: ["STU001", "STU002", "STU003", "STU004"],
      classes: [
        {
          classId: "CLS-CHN101-01",
          date: "2026-08-01",
          time: "05:00 PM - 06:30 PM",
          status: "Completed",
          contentCovered: [
            {
              lessonNumber: 1,
              lessonTitle: "你好 (Hello)",
              totalTextsInLesson: 4,
              coveredTexts: [
                { textNumber: 1, title: "Text 1: Greetings (你好)", type: "Dialogue" },
                { textNumber: 2, title: "Text 2: Polite Greetings (您好)", type: "Dialogue" }
              ],
              lessonProgress: "50% completed"
            }
          ],
          presentStudents: ["STU001", "STU002", "STU003", "STU004"],
          absentStudents: []
        },
        {
          classId: "CLS-CHN101-02",
          date: "2026-08-03",
          time: "05:00 PM - 06:30 PM",
          status: "Completed",
          contentCovered: [
            {
              lessonNumber: 1,
              lessonTitle: "你好 (Hello)",
              totalTextsInLesson: 4,
              coveredTexts: [
                { textNumber: 3, title: "Text 3: Apologies (对不起)", type: "Dialogue" },
                { textNumber: 4, title: "Text 4: Responses (没关系)", type: "Dialogue" }
              ],
              lessonProgress: "100% completed"
            }
          ],
          presentStudents: ["STU001", "STU002", "STU004"],
          absentStudents: ["STU003"]
        },
        {
          classId: "CLS-CHN101-03",
          date: "2026-08-05",
          time: "05:00 PM - 06:30 PM",
          status: "Completed",
          contentCovered: [
            {
              lessonNumber: 2,
              lessonTitle: "谢谢你 (Thank You)",
              totalTextsInLesson: 4,
              coveredTexts: [
                { textNumber: 1, title: "Text 1: In the Classroom", type: "Dialogue" }
              ],
              lessonProgress: "25% completed"
            }
          ],
          presentStudents: ["STU001", "STU002", "STU004"],
          absentStudents: ["STU003"]
        }
      ],
      weekendExams: [
        {
          examId: "EXAM-CHN101-W1",
          examTitle: "Weekend Assessment 1 (Lesson 1-2)",
          date: "2026-08-07",
          totalMarks: 100,
          passMarks: 60,
          results: [
            { rollNumber: "STU001", attended: true, score: 96, grade: "A+", remarks: "Excellent character strokes" },
            { rollNumber: "STU002", attended: true, score: 84, grade: "B+", remarks: "Good vocabulary recall" },
            { rollNumber: "STU003", attended: false, score: 0, grade: "F", remarks: "Absent" },
            { rollNumber: "STU004", attended: true, score: 78, grade: "B", remarks: "Need more tone practice" }
          ]
        }
      ]
    },
    {
      courseId: "HSK-201",
      courseName: "Elementary Chinese (HSK 2)",
      targetLevel: "HSK 2",
      totalLessons: 15,
      totalClassesPlanned: 30,
      completedClassesCount: 1,
      enrolledStudentRolls: ["STU001", "STU004"],
      classes: [
        {
          classId: "CLS-CHN201-01",
          date: "2026-08-06",
          time: "07:00 PM - 08:30 PM",
          status: "Completed",
          contentCovered: [
            {
              lessonNumber: 1,
              lessonTitle: "九月去北京旅游最好 (September is the best time to visit Beijing)",
              totalTextsInLesson: 4,
              coveredTexts: [
                { textNumber: 1, title: "Text 1: Travel Plan", type: "Dialogue" },
                { textNumber: 2, title: "Text 2: Sports & Exercise", type: "Dialogue" }
              ],
              lessonProgress: "50% completed"
            }
          ],
          presentStudents: ["STU001", "STU004"],
          absentStudents: []
        }
      ],
      weekendExams: []
    }
  ],
  students: [
    {
      rollNumber: "1",
      nameEnglish: "Rokibul",
      whatsapp: "+8801744156928",
      location: "Dhaka, Bangladesh",
      avatarUrl: "https://example.com/avatars/stu001.png",
      enrolledCourseIds: ["HSK-101"]
    },
    {
      rollNumber: "2",
      nameEnglish: "Redwan",
      whatsapp: "+8801673550666",
      location: "Banasree, Dhaka",
      avatarUrl: "https://example.com/avatars/stu002.png",
      enrolledCourseIds: ["HSK-101"]
    },
    {
      rollNumber: "3",
      nameEnglish: "iftekhar Hasan Abir",
      whatsapp: "+8801914006249",
      location: "Karaniganj, Dhaka",
      avatarUrl: "https://example.com/avatars/stu003.png",
      enrolledCourseIds: ["HSK-101"]
    },
    
    {
      rollNumber: "4",
      nameEnglish: "Suraiya Jahan Labone",
      whatsapp: "+8801576963495",
      location: "Uttar Kaunnara, Saturia Manikgonj, Dhaka",
      avatarUrl: "https://example.com/avatars/stu004.png",
      enrolledCourseIds: ["HSK-101"]
    },
    {
      rollNumber: "5",
      nameEnglish: "Asif Mahamud",
      whatsapp: "+8801318723849",
      location: "Kgajura, Bagherpara, Jashore",
      avatarUrl: "https://example.com/avatars/stu005.png",
      enrolledCourseIds: ["HSK-101"]
    },
    {
      rollNumber: "6",
      nameEnglish: "Sabbir Hossain",
      whatsapp: "+8801630218829",
      location: "Balu ghat, Dhaka cant; Dhaka-1206",
      avatarUrl: "https://example.com/avatars/stu006.png",
      enrolledCourseIds: ["HSK-101"]
    },
    {
      rollNumber: "7",
      nameEnglish: "Mahdi Islam",
      whatsapp: "+8801805205369",
      location: "Modonhat, Hathazari, Chattogram",
      avatarUrl: "https://example.com/avatars/stu006.png",
      enrolledCourseIds: ["HSK-101"]
    },
    {
      rollNumber: "8",
      nameEnglish: "Mahdi Islam Hadhin",
      whatsapp: "+8801805205369",
      location: "Hathazari, Chattogram",
      avatarUrl: "https://example.com/avatars/stu006.png",
      enrolledCourseIds: ["HSK-101"]
    },
    {
      rollNumber: "9",
      nameEnglish: "Sohag Sharma",
      whatsapp: "+8801761636297***",
      location: "Sitakundo",
      avatarUrl: "https://example.com/avatars/stu006.png",
      enrolledCourseIds: ["HSK-101"]
    },
    {
      rollNumber: "10",
      nameEnglish: "Asif Mahamud",
      whatsapp: "+8801318723849",
      location: "Savar, Bagherpara, Jashore ",
      avatarUrl: "https://example.com/avatars/stu006.png",
      enrolledCourseIds: ["HSK-101"]
    },
    {
      rollNumber: "11",
      nameEnglish: "Tanvir",
      whatsapp: "+8801850118511",
      location: "Uttara, Dhaka",
      avatarUrl: "https://example.com/avatars/stu006.png",
      enrolledCourseIds: ["HSK-101"]
    },
    {
      rollNumber: "12",
      nameEnglish: "Shariar Roucafi",
      whatsapp: "+86156 7910 1763",
      location: "Nanchang, Jiangxi,china",
      avatarUrl: "https://example.com/avatars/stu006.png",
      enrolledCourseIds: ["HSK-101"]
    },
    {
      rollNumber: "13",
      nameEnglish: "M.M.B Tushar",
      whatsapp: "+8801873962540",
      location: "Comilla ",
      avatarUrl: "https://example.com/avatars/stu006.png",
      enrolledCourseIds: ["HSK-101"]
    },
    {
      rollNumber: "14",
      nameEnglish: "Maruf Hossain",
      whatsapp: "+8801998744436",
      location: "Comilla ",
      avatarUrl: "https://example.com/avatars/stu006.png",
      enrolledCourseIds: ["HSK-101"]
    },
    {
      rollNumber: "15",
      nameEnglish: "Thakurdash Chandra Ray",
      whatsapp: "+8801780588812",
      location: "Khansama, Dinajpur",
      avatarUrl: "https://example.com/avatars/stu006.png",
      enrolledCourseIds: ["HSK-101"]
    },
    {
      rollNumber: "16",
      nameEnglish: "Aiful islam ",
      whatsapp: "+8801816147180",
      location: "mognama pekua, cox's bazar ",
      avatarUrl: "https://example.com/avatars/stu006.png",
      enrolledCourseIds: ["HSK-101"]
    },
    {
      rollNumber: "17",
      nameEnglish: "Jobayer Ahmed ",
      whatsapp: "+8801706898268",
      location: "Mothijheel,Dhaka ",
      avatarUrl: "https://example.com/avatars/stu006.png",
      enrolledCourseIds: ["HSK-101"]
    },
    {
      rollNumber: "18",
      nameEnglish: "Sumaia Islam",
      whatsapp: "+8801608266181",
      location: "Mitford, Dhaka",
      avatarUrl: "https://example.com/avatars/stu006.png",
      enrolledCourseIds: ["HSK-101"]
    },
    {
      rollNumber: "19",
      nameEnglish: "Fuad",
      whatsapp: "+8801922153836",
      location: "dhaka",
      avatarUrl: "https://example.com/avatars/stu006.png",
      enrolledCourseIds: ["HSK-101"]
    },

{
      rollNumber: "20",
      nameEnglish: "Saharia Al Mahamud",
      whatsapp: "+8801305890049",
      location: "Dinajpur, Rangpur, Bangladsh",
      avatarUrl: "https://ibb.co.com/F4jxskPN",
      enrolledCourseIds: ["HSK-101"]
    },
  ]
};