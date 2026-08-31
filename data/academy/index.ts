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
    "status": "Coming Soon",
    "startDate": "2026-09-29",
    "nextBatchRegistrationDate": "September 20, 2026",
    "totalLessons": 15,
    "totalClassesPlanned": 20,
    "completedClassesCount": 2,
    "classes": [
      {
        "classId": "CLS-HSK101-01",
        "date": "2026-08-29",
        "time": "09:00 PM - 10:10 PM",
        "status": "Completed",
        "contentCovered": {
          "summary": "Lesson 1 Text 1 to Lesson 1 Text 2",
          "fromLesson": 1,
          "fromText": 1,
          "toLesson": 1,
          "toText": 3
        },
        "presentStudents": [
          2,
          4,
          5,
          6,
          9,
          8,
          24,
          21,
          20,
          23,
          26,
          27,
          44,
          43,
          39,
          37,
          36,
          33,
          25,
          1,
          3,
          7,
          10,
          12,
          11,
          29,
          32
        ],
        "absentStudents": [
          13,
          14,
          15,
          16,
          17,
          18,
          22,
          28,
          30,
          31,
          34,
          35,
          38,
          40,
          42,
          50
        ],
        "_id": "6a93152d464718e9f494b871"
      },
      {
        "classId": "CLS-HSK101-02",
        "date": "2026-08-30",
        "time": "09:00 PM - 10:10 PM",
        "status": "Completed",
        "contentCovered": {
          "summary": "Lesson 2 Text 1 to Lesson 2 Text 3",
          "fromLesson": 2,
          "fromText": 1,
          "toLesson": 2,
          "toText": 3
        },
        "presentStudents": [
          20,
          3,
          21,
          28,
          29,
          30,
          50,
          43,
          44,
          39,
          27,
          23,
          24,
          10,
          15,
          4,
          7,
          5,
          12,
          11,
          18,
          8,
          2,
          37,
          22,
          36,
          14
        ],
        "absentStudents": [
          1,
          6,
          9,
          13,
          16,
          17,
          25,
          26,
          31,
          32,
          33,
          34,
          35,
          38,
          40,
          42
        ],
        "_id": "6a94575a6ba259d2cb6787f6"
      }
    ],
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
    "status": "Coming Soon",
    "startDate": "2026-08-29",
    "nextBatchRegistrationDate": "September 20, 2026",
    "totalLessons": 15,
    "totalClassesPlanned": 20,
    "completedClassesCount": 1,
    "classes": [
      {
        "classId": "CLS-HSK201-01",
        "date": "2026-08-30",
        "time": "09:00 PM - 10:10 PM",
        "status": "Completed",
        "contentCovered": {
          "summary": "Lesson 1 Text 1 to Lesson 1 Text 2",
          "fromLesson": 1,
          "fromText": 1,
          "toLesson": 1,
          "toText": 2
        },
        "presentStudents": [
          46,
          19,
          41,
          48
        ],
        "absentStudents": [
          45,
          47,
          49,
          51,
          52,
          53
        ],
        "_id": "6a9457576ba259d2cb6787f5"
      }
    ],
    "weekendExams": []
  }
],
  students: studentsData,
};
