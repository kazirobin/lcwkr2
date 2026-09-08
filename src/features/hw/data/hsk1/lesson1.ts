import { LessonHomework } from '../../types';

export const lesson1Data: LessonHomework = {
  lessonNumber: 1,
  lessonTitleEn: 'Greetings, Core Courtesies & Classroom Expressions',
  lessonTitleBn: 'অভিবাদন, সৌজন্যমূলক কথোপকথন ও শ্রেণিকক্ষের অভিব্যক্তি',
  sections: {
    characterWriting: [
      {
        id: 'h1_l1_cw1',
        questionEn: "Write the character/term for 'Hello' (Nǐ hǎo) 5 times following correct stroke order.",
        questionBn: "সঠিক স্ট্রোক অর্ডার অনুসরণ করে 'হ্যালো' (你好 - Nǐ hǎo) শব্দটি ৫ বার লিখুন।",
        correctAnswer: '你好',
        marks: 5,
      },
      {
        id: 'h1_l1_cw2',
        questionEn: "Write the character/term for 'Teacher' (Lǎoshī) 5 times following correct stroke order.",
        questionBn: "সঠিক স্ট্রোক অর্ডার অনুসরণ করে 'শিক্ষক/গুরুজি' (老师 - Lǎoshī) শব্দটি ৫ বার লিখুন।",
        correctAnswer: '老师',
        marks: 5,
      },
    ],
    matching: [
      {
        id: 'h1_l1_m1',
        questionEn: 'Match the Chinese greeting or courtesy with its correct Bengali meaning.',
        questionBn: 'চাইনিজ অভিবাদন বা সৌজন্যমূলক শব্দটির সাথে সঠিক বাংলা অর্থের মিল করুন।',
        optionsEn: ['Xièxie', 'Bù kèqi', 'Zàijiàn', 'Dàjiā hǎo'],
        optionsBn: ['ধন্যবাদ জানানো', 'কোনো ব্যাপার না / স্বাগতম', 'বিদায়, আবার দেখা হবে', 'সবাইকে হ্যালো!'],
        correctAnswer: 'ধন্যবাদ জানানো',
        marks: 10,
      },
    ],
    dialogueCompletion: [
      {
        id: 'h1_l1_d1',
        questionEn: 'Complete the dialogue: A: Xièxie! (Thank you!) B: ______! (You are welcome!)',
        questionBn: 'ডায়লগটি সম্পূর্ণ করুন: A: Xièxie! (ধন্যবাদ!) B: ______! (কোনো ব্যাপার না/স্বাগতম!)',
        optionsEn: ['Bù kèqi', 'Zàijiàn', 'Nǐ hǎo'],
        optionsBn: ['কোনো ব্যাপার না / স্বাগতম', 'বিদায়', 'হ্যালো'],
        correctAnswer: 'Bù kèqi',
        marks: 15,
      },
    ],
    speakingActivity: [
      {
        id: 'h1_l1_s1',
        questionEn: "Record your voice and clearly pronounce '老师，再见！' (Teacher, goodbye!).",
        questionBn: "ভয়েস রেকর্ড করুন এবং স্পষ্ট করে বলুন '老师，再见！' (শিক্ষক, বিদায়!)।",
        correctAnswer: 'Audio Recording Submission',
        marks: 15,
      },
    ],
  },
};