import { lesson1Data as hsk1Lesson1 } from './hsk1/lesson1';
import { lesson2Data as hsk1Lesson2 } from './hsk1/lesson2';
// প্রয়োজন অনুযায়ী বাকি লেসনগুলোর ডেটা ফাইল এখানে ইম্পোর্ট করে নিতে পারেন:
// import { lesson3Data as hsk1Lesson3 } from './hsk1/lesson3';

import { LessonHomework } from '../types';

// HSK 1 এর জন্য ১৫টি লেসনের ডেটা ম্যাপ (যেগুলো ফাইল তৈরি করা আছে কেবল সেগুলোই যুক্ত হবে)
export const hsk1Lessons: Record<number, LessonHomework> = {
  1: hsk1Lesson1,
  2: hsk1Lesson2,
  // 3: hsk1Lesson3, (ফাইল তৈরি হলে এখানে অ্যাড করবেন)
};

// HSK 2 এর জন্য ১৫টি লেসনের ডেটা ম্যাপ
export const hsk2Lessons: Record<number, LessonHomework> = {
  // 1: hsk2Lesson1, (ফাইল তৈরি হলে এখানে অ্যাড করবেন)
};

// সার্বিক ডেটাবেস যেখানে লেভেল অনুযায়ী লেসনগুলো ম্যাপ করা থাকবে
export const allHskHomeworkDatabase: Record<string, Record<number, LessonHomework>> = {
  hsk1: hsk1Lessons,
  hsk2: hsk2Lessons,
  // একইভাবে hsk3, hsk4 ইত্যাদি যোগ করতে পারেন
};

/**
 * হেল্পার ফাংশন: যে যে লেসনের জন্য ফাইল/ডেটা আসলেই এক্সিস্ট করে, 
 * কেবল সেগুলোর লিস্ট ড্রপডাউনে দেখানোর জন্য লেসন নম্বর রিটার্ন করবে (১ থেকে ১৫ পর্যন্ত)।
 */
export const getAvailableLessonsForLevel = (level: string): number[] => {
  const levelLessons = allHskHomeworkDatabase[level] || {};
  const availableLessons: number[] = [];

  // ১ থেকে ১৫ পর্যন্ত লুপ চালিয়ে চেক করা হচ্ছে কোন লেসনগুলোর ডেটা রিয়েলি অবজেক্টে আছে
  for (let i = 1; i <= 15; i++) {
    if (levelLessons[i]) {
      availableLessons.push(i);
    }
  }

  return availableLessons;
};