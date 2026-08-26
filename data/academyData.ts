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
      enrolledStudentRolls: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      ],
      classes: [
        {
          classId: "CLS-HSK101-01",
          date: "2026-08-01",
          time: "09:00 PM - 10:10 PM",
          status: "Completed",
          contentCovered: [
            {
              lessonNumber: 1,
              lessonTitle: "你好 (Hello)",
              totalTextsInLesson: 4,
              coveredTexts: [
                {
                  textNumber: 1,
                  title: "Text 1: Greetings (你好)",
                  type: "Dialogue",
                },
                {
                  textNumber: 2,
                  title: "Text 2: Polite Greetings (您好)",
                  type: "Dialogue",
                },
              ],
              lessonProgress: "50% completed",
            },
          ],
          presentStudents: [1, 2, 3, 4],
          absentStudents: [5, 6],
        },
        {
          classId: "CLS-HSK101-02",
          date: "2026-08-03",
          time: "05:00 PM - 06:30 PM",
          status: "Completed",
          contentCovered: [
            {
              lessonNumber: 1,
              lessonTitle: "你好 (Hello)",
              totalTextsInLesson: 4,
              coveredTexts: [
                {
                  textNumber: 3,
                  title: "Text 3: Apologies (对不起)",
                  type: "Dialogue",
                },
                {
                  textNumber: 4,
                  title: "Text 4: Responses (没关系)",
                  type: "Dialogue",
                },
              ],
              lessonProgress: "100% completed",
            },
          ],
          presentStudents: [1, 2, 4, 8],
          absentStudents: [3],
        },
        {
          classId: "CLS-HSK101-03",
          date: "2026-08-05",
          time: "05:00 PM - 06:30 PM",
          status: "Completed",
          contentCovered: [
            {
              lessonNumber: 2,
              lessonTitle: "谢谢你 (Thank You)",
              totalTextsInLesson: 4,
              coveredTexts: [
                {
                  textNumber: 1,
                  title: "Text 1: In the Classroom",
                  type: "Dialogue",
                },
              ],
              lessonProgress: "25% completed",
            },
          ],
          presentStudents: [1, 2, 4],
          absentStudents: [3],
        },
      ],
      weekendExams: [
        {
          examId: "EXAM-HSK101-W1",
          examTitle: "Weekend Assessment 1 (Lesson 1-2)",
          date: "2026-08-07",
          totalMarks: 100,
          passMarks: 60,
          results: [
            {
              rollNumber: 1,
              attended: true,
              score: 96,
              grade: "A+",
              remarks: "Excellent character strokes",
            },
            {
              rollNumber: 2,
              attended: true,
              score: 84,
              grade: "B+",
              remarks: "Good vocabulary recall",
            },
            {
              rollNumber: 3,
              attended: false,
              score: 0,
              grade: "F",
              remarks: "Absent",
            },
            {
              rollNumber: 4,
              attended: true,
              score: 78,
              grade: "B",
              remarks: "Need more tone practice",
            },
          ],
        },
      ],
    },
    {
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
          contentCovered: [
            {
              lessonNumber: 1,
              lessonTitle:
                "九月去北京旅游最好 (September is the best time to visit Beijing)",
              totalTextsInLesson: 4,
              coveredTexts: [
                {
                  textNumber: 1,
                  title: "Text 1: Travel Plan",
                  type: "Dialogue",
                },
                {
                  textNumber: 2,
                  title: "Text 2: Sports & Exercise",
                  type: "Dialogue",
                },
              ],
              lessonProgress: "50% completed",
            },
          ],
          presentStudents: [1, 4],
          absentStudents: [],
        },
      ],
      weekendExams: [],
    },
  ],
    students: [
    {
      rollNumber: 1,
      nameEnglish: "Rokibul",
      whatsapp: "+8801744156928",
      location: "Dhaka, Bangladesh",
      avatarUrl: "https://example.com/avatars/stu001.png",
      enrolledCourseIds: ["HSK-101", "HSK-201"]
    },
    {
      rollNumber: 2,
      nameEnglish: "Redwan",
      whatsapp: "+8801673550666",
      location: "Banasree, Dhaka",
      avatarUrl: "https://example.com/avatars/stu002.png",
      enrolledCourseIds: ["HSK-101"]
    },
    {
      rollNumber: 3,
      nameEnglish: "iftekhar Hasan Abir",
      whatsapp: "+8801914006249",
      location: "Karaniganj, Dhaka",
      avatarUrl: "https://example.com/avatars/stu003.png",
      enrolledCourseIds: ["HSK-101"]
    },
    {
      rollNumber: 4,
      nameEnglish: "Suraiya Jahan Labone",
      whatsapp: "+8801576963495",
      location: "Uttar Kaunnara, Saturia Manikgonj, Dhaka",
      avatarUrl: "https://example.com/avatars/stu004.png",
      enrolledCourseIds: ["HSK-101", "HSK-201"]
    },
    {
      rollNumber: 5,
      nameEnglish: "Asif Mahamud",
      whatsapp: "+8801318723849",
      location: "Kgajura, Bagherpara, Jashore",
      avatarUrl: "https://example.com/avatars/stu005.png",
      enrolledCourseIds: ["HSK-101"]
    },
    {
      rollNumber: 6,
      nameEnglish: "Sabbir Hossain",
      whatsapp: "+8801630218829",
      location: "Balu ghat, Dhaka cant; Dhaka-1206",
      avatarUrl: "https://example.com/avatars/stu006.png",
      enrolledCourseIds: ["HSK-101"]
    },
    {
      rollNumber: "7",
      nameEnglish: "Md Mominul Islam",
      whatsapp: "+8801963821304",
      location: "Nilphamari, Rangpur, Bangladsh",
      avatarUrl: "https://ibb.co.com/F4jxskPN",
      enrolledCourseIds: ["HSK-101"]
    },
    {
      rollNumber: 8,
      nameEnglish: "Mahdi Islam Hadhin",
      whatsapp: "+8801805205369",
      location: "Hathazari, Chattogram",
      avatarUrl: "https://example.com/avatars/stu006.png",
      enrolledCourseIds: ["HSK-101"]
    },
    {
      rollNumber: 9,
      nameEnglish: "Sohag Sharma",
      whatsapp: "+8801761636297",
      location: "Sitakundo",
      avatarUrl: "https://example.com/avatars/stu006.png",
      enrolledCourseIds: ["HSK-101"]
    },
    {
      rollNumber: 10,
      nameEnglish: "Asif Mahamud",
      whatsapp: "+8801318723849",
      location: "Savar, Bagherpara, Jashore",
      avatarUrl: "https://example.com/avatars/stu006.png",
      enrolledCourseIds: ["HSK-101"]
    },
    {
      rollNumber: 11,
      nameEnglish: "Tanvir",
      whatsapp: "+8801850118511",
      location: "Uttara, Dhaka",
      avatarUrl: "https://example.com/avatars/stu006.png",
      enrolledCourseIds: ["HSK-101"]
    },
    {
      rollNumber: 12,
      nameEnglish: "Shariar Roucafi",
      whatsapp: "+8615679101763",
      location: "Nanchang, Jiangxi, China",
      avatarUrl: "https://example.com/avatars/stu006.png",
      enrolledCourseIds: ["HSK-101"]
    },
    {
      rollNumber: 13,
      nameEnglish: "M.M.B Tushar",
      whatsapp: "+8801873962540",
      location: "Comilla",
      avatarUrl: "https://example.com/avatars/stu006.png",
      enrolledCourseIds: ["HSK-101"]
    },
    {
      rollNumber: 14,
      nameEnglish: "Maruf Hossain",
      whatsapp: "+8801998744436",
      location: "Hijlgari, Chuadanga",
      avatarUrl: "https://example.com/avatars/stu006.png",
      enrolledCourseIds: ["HSK-101"]
    },
    {
      rollNumber: 15,
      nameEnglish: "Thakurdash Chandra Ray",
      whatsapp: "+8801780588812",
      location: "Khansama, Dinajpur",
      avatarUrl: "https://example.com/avatars/stu006.png",
      enrolledCourseIds: ["HSK-101"]
    },
    {
      rollNumber: 16,
      nameEnglish: "Aiful islam",
      whatsapp: "+8801816147180",
      location: "Mognama pekua, Cox's Bazar",
      avatarUrl: "https://example.com/avatars/stu006.png",
      enrolledCourseIds: ["HSK-101"]
    },
    {
      rollNumber: 17,
      nameEnglish: "Jobayer Ahmed",
      whatsapp: "+8801706898268",
      location: "Motijheel, Dhaka",
      avatarUrl: "https://example.com/avatars/stu006.png",
      enrolledCourseIds: ["HSK-101"]
    },
    {
      rollNumber: 18,
      nameEnglish: "Sumaia Islam",
      whatsapp: "+8801608266181",
      location: "Mitford, Dhaka",
      avatarUrl: "https://example.com/avatars/stu006.png",
      enrolledCourseIds: ["HSK-101"]
    },
    {
      rollNumber: 19,
      nameEnglish: "Fuad",
      whatsapp: "+8801922153836",
      location: "Dhanmondi, Dhaka",
      avatarUrl: "https://example.com/avatars/stu006.png",
      enrolledCourseIds: ["HSK-101"]
    },
    {
      rollNumber: 20,
      nameEnglish: "Ishrat Tushu ",
      whatsapp: " 01978859009",
      location: "Gazipur, Bangladesh",
      avatarUrl: "https://example.com/avatars/stu020.png",
      enrolledCourseIds: ["HSK-101"]
    },
{
      rollNumber: 21,
      nameEnglish: "Farid Howlader",
      whatsapp: "+8801937273952",
      location: "Mongla, Bangladesh",
      avatarUrl: "https://example.com/avatars/stu020.png",
      enrolledCourseIds: ["HSK-101"]
    },
{
      rollNumber: 23,
      nameEnglish: "shwee shwee wai",
      whatsapp: "01616955228",
      location: "wuzhou university, guwanxi",
      avatarUrl: "https://example.com/avatars/stu020.png",
      enrolledCourseIds: ["HSK-101"]
    },
{
      rollNumber: 24,
      nameEnglish: "Monita Akter",
      whatsapp: "13006940516",
      location: "wuzhou university, guwanxi",
      avatarUrl: "https://example.com/avatars/stu020.png",
      enrolledCourseIds: ["HSK-101"]
    },
{
      rollNumber: 25,
      nameEnglish: "Tirtho Tomas Mankhin",
      whatsapp: "+8801848016256",
      location: ", durgabari, mymeshaing,Bangladesh",
      avatarUrl: "https://example.com/avatars/stu020.png",
      enrolledCourseIds: ["HSK-101"]
    },
{
      rollNumber: 26,
      nameEnglish: "Mashud Ahmed",
      whatsapp: "+8801751430463",
      location: " Nilphamari,Bangladesh",
      avatarUrl: "https://example.com/avatars/stu020.png",
      enrolledCourseIds: ["HSK-101"]
    },
{
      rollNumber: 27,
      nameEnglish: "Md Habib Hossen",
      whatsapp: "+8801674615124",
      location: "Mirpur-12, Dhaka, Bangladesh",
      avatarUrl: "https://example.com/avatars/stu020.png",
      enrolledCourseIds: ["HSK-101"]
    } ,
 {
      rollNumber: 28,
      nameEnglish: "md foyshal ahamed",
      whatsapp: "+8801982934976",
      location: "gazipur, Bangladesh",
      avatarUrl: "https://example.com/avatars/stu020.png",
      enrolledCourseIds: ["HSK-101"]
    },
{
      rollNumber: 29,
      nameEnglish: "Mr Hamim",
      whatsapp: "+8801410792134",
      location: "Gazipur, konabari,  Bangladesh",
      avatarUrl: "https://example.com/avatars/stu020.png",
      enrolledCourseIds: ["HSK-101"]
    },
{
      rollNumber: 30,
      nameEnglish: "MD ARIF HOSEN ",
      whatsapp: "+8801826579642 ",
      location: "Gazipur, konabari,  Bangladesh",
      avatarUrl: "https://example.com/avatars/stu020.png",
      enrolledCourseIds: ["HSK-101"]
    },
{
      rollNumber: "31",
      nameEnglish:"Juyel Rana",
      whatsapp: "+8801602130075",
      location: "Gazipur, Bangladsh",
      avatarUrl: "https://ibb.co.com/F4jxskPN",
      enrolledCourseIds: ["HSK-101"]
    },
{
      rollNumber: "32",
      nameEnglish: "Md Amir Hamza",
      whatsapp: "+8801626658883",
      location: "Gazipur, Bangladesh ",
      avatarUrl: "https://ibb.co.com/F4jxskPN",
      enrolledCourseIds: ["HSK-101"]
    },
{
      rollNumber: "33",
      nameEnglish: "Sadat",
      whatsapp: "+8801831832491",
      location: "/Noakhali, Bangladesh ",
      avatarUrl: "https://ibb.co.com/F4jxskPN",
      enrolledCourseIds: ["HSK-101"]
    },
{
      rollNumber: "34",
      nameEnglish: "Arif",
      whatsapp: "+8801345587536",
      location: "Chattagram, Bangladesh ",
      avatarUrl: "https://ibb.co.com/F4jxskPN",
      enrolledCourseIds: ["HSK-101"]
    },
{
      rollNumber: "35",
      nameEnglish: "M.M.B Tushar",
      whatsapp: "+8801873962540",
      location: "Cumilla, Bangladesh ",
      avatarUrl: "https://ibb.co.com/F4jxskPN",
      enrolledCourseIds: ["HSK-101"]
    },
{
      rollNumber: "36",
      nameEnglish: "Miraz Khan",
      whatsapp: "+8801568418144",
      location: "Uttara , Dhaka",
      avatarUrl: "https://ibb.co.com/F4jxskPN",
      enrolledCourseIds: ["HSK-101"]
    },
{
      rollNumber: "37",
      nameEnglish: "Sabekun Nahar Jerin",
      whatsapp: "+8801863336556",
      location: "Feni, Bangladesh ",
      avatarUrl: "https://ibb.co.com/F4jxskPN",
      enrolledCourseIds: ["HSK-101"]
    },
{
      rollNumber: "38",
      nameEnglish: "Md. Salman Rumi Kabbo",
      whatsapp: "+8801836460879",
      location: "Badda , Notun Bazar , Dhaka",
      avatarUrl: "https://ibb.co.com/F4jxskPN",
      enrolledCourseIds: ["HSK-101"]
    },
{
      rollNumber: "39",
      nameEnglish: "MD Asadul hoq (Asad)",
      whatsapp: "+8801973681199",
      location: "Rampura , Dhaka, Bangladesh ",
      avatarUrl: "https://ibb.co.com/F4jxskPN",
      enrolledCourseIds: ["HSK-101"]
    },
  ] ,
};
