import { LessonHomework } from '../../types';

export const lesson1Data: LessonHomework = {
  lessonNumber: 1,
  lessonTitleEn: 'Hello / How are you',
  lessonTitleBn: 'হ্যালো / কেমন আছেন',
  sections: {
    characterWriting: [
      { id: 'h1_l1_cw1', questionEn: "Write '你' 5 times", questionBn: "'你' ৫ বার লিখুন", correctAnswer: '你', marks: 10 }
    ],
    matching: [
      { id: 'h1_l1_m1', questionEn: 'Match Nǐ hǎo', questionBn: 'নি হাও অর্থ কি?', optionsEn: ['Hello'], optionsBn: ['হ্যালো'], correctAnswer: 'Hello', marks: 10 }
    ],
    dialogueCompletion: [
      { id: 'h1_l1_d1', questionEn: 'Complete dialogue', questionBn: 'ডায়লগ পূরণ করুন', optionsEn: ['Nǐ hǎo'], optionsBn: ['হ্যালো'], correctAnswer: 'Nǐ hǎo', marks: 15 }
    ],
    speakingActivity: [
      { id: 'h1_l1_s1', questionEn: 'Speak Nǐ hǎo', questionBn: 'উচ্চারণ করুন', correctAnswer: 'audio', marks: 15 }
    ]
  }
};