import { IAcademyData } from "@/types/academy";
import { studentsData } from "./students";

export const academyData: IAcademyData = {
  institution: "Learn Chinese with Kazi Robin",
  instructor: "Kazi Robin",
  courses: [
  {
    "courseId": "HSK-101",
    "courseName": "Beginner Chinese (HSK 1)",
    "targetLevel": "HSK 1",
    "status": "Running",
    "startDate": "2026-09-29",
    "nextBatchRegistrationDate": "September 20, 2026",
    "totalLessons": 15,
    "totalClassesPlanned": 20,
    "completedClassesCount": 0,
    "classes": [],
    "weekendExams": [
      {
        "examId": "EXAM-HSK101-W1",
        "examTitle": "Weekend Assessment 1 (Lesson 1-2)",
        "date": "2026-08-07",
        "totalMarks": 100,
        "passMarks": 60,
        "results": [
          {
            "rollNumber": 1,
            "attended": true,
            "score": 96,
            "grade": "A+",
            "remarks": "Excellent character strokes",
            "_id": "6a911d1e6530d8764782d385"
          },
          {
            "rollNumber": 2,
            "attended": true,
            "score": 84,
            "grade": "B+",
            "remarks": "Good vocabulary recall",
            "_id": "6a911d1e6530d8764782d386"
          },
          {
            "rollNumber": 3,
            "attended": false,
            "score": 0,
            "grade": "F",
            "remarks": "Absent",
            "_id": "6a911d1e6530d8764782d387"
          },
          {
            "rollNumber": 4,
            "attended": true,
            "score": 78,
            "grade": "B",
            "remarks": "Need more tone practice",
            "_id": "6a911d1e6530d8764782d388"
          }
        ],
        "_id": "6a911d1e6530d8764782d384"
      }
    ]
  },
  {
    "courseId": "HSK-201",
    "courseName": "Elementary Chinese (HSK 2)",
    "targetLevel": "HSK 2",
    "status": "Running",
    "startDate": "2026-08-29",
    "nextBatchRegistrationDate": "September 20, 2026",
    "totalLessons": 15,
    "totalClassesPlanned": 20,
    "completedClassesCount": 0,
    "classes": [],
    "weekendExams": []
  }
],
  students: studentsData,
};
