export interface HomeworkQuestion {
  id: string;
  type?: string; // এই প্রপার্টিটি যোগ করতে হবে
  questionEn: string;
  questionBn: string;
  optionsEn?: string[];
  optionsBn?: string[];
  correctAnswer: string;
  marks: number;
}
export interface LessonHomework {
  lessonNumber: number;
  lessonTitleEn: string;
  lessonTitleBn: string;
  sections: {
    characterWriting: HomeworkQuestion[];
    matching: HomeworkQuestion[];
    dialogueCompletion: HomeworkQuestion[];
    speakingActivity: HomeworkQuestion[];
  };
}