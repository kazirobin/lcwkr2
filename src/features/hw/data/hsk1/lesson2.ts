import { LessonHomework } from '../../types';

export const lesson2Data: LessonHomework = {
  lessonNumber: 2,
  lessonTitleEn: 'Thank You / You are welcome',
  lessonTitleBn: 'ধন্যবাদ / স্বাগতম',
  sections: {
    characterWriting: [
      {
        id: 'h1_l2_cw1',
        questionEn: "Write the character '谢' (Xiè) 5 times.",
        questionBn: "'谢' (শিয়ে - ধন্যবাদ) অক্ষরটি ৫ বার লিখুন।",
        correctAnswer: '谢',
        marks: 10,
      },
    ],
    matching: [
      {
        id: 'h1_l2_m1',
        questionEn: "Match '不客气' (Bù kèqi) with Bengali meaning.",
        questionBn: "'不客气' (পু খেচি) এর বাংলা অর্থ মিলাও।",
        optionsEn: ['Thank you', 'You are welcome', 'Goodbye'],
        optionsBn: ['ধন্যবাদ', 'কোনো সমস্যা নেই / স্বাগতম', 'বিদায়'],
        correctAnswer: 'You are welcome',
        marks: 10,
      },
    ],
    dialogueCompletion: [
      {
        id: 'h1_l2_d1',
        questionEn: 'Complete response to "Xièxie": ______',
        questionBn: '"Xièxie" (ধন্যবাদ)-এর উত্তরে কী বলতে হবে তা পূরণ করুন: ______',
        optionsEn: ['Bù kèqi', 'Zàijiàn', 'Duìbuqǐ'],
        optionsBn: ['স্বাগতম (不客气)', 'বিদায়', 'দুঃখিত'],
        correctAnswer: 'Bù kèqi',
        marks: 15,
      },
    ],
    speakingActivity: [
      {
        id: 'h1_l2_s1',
        questionEn: "Record your voice: 'xièxie nǐ' (Thank you).",
        questionBn: "ভয়েস রেকর্ড করুন: 'xièxie nǐ' (ধন্যবাদ আপনাকে)।",
        correctAnswer: 'Audio Recording Submission',
        marks: 15,
      },
    ],
  },
};