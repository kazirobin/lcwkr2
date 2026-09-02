// app/hsk/[level]/lesson/[lessonNumber]/text/[textNumber]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  getLessonTextData, 
  getLessonsForLevel,
  getTextsForLesson,
} from '@/features/vocabulary/data';
import VocabularyList from '@/features/vocabulary/components/VocabularyList';

interface TextPageProps {
  params: Promise<{
    level: string;
    lessonNumber: string;
    textNumber: string;
  }>;
}

export default async function TextPage({ params }: TextPageProps) {
  const { level, lessonNumber, textNumber } = await params;
  
  const levelNum = parseInt(level);
  const lessonNum = parseInt(lessonNumber);
  const textNum = parseInt(textNumber);
  
  // Get the data for this specific lesson and text
  const data = getLessonTextData(levelNum, lessonNum, textNum);
  
  if (!data) {
    notFound();
  }
  
  // Get all lessons for this level
  const allLessons = getLessonsForLevel(levelNum);
  const currentLessonIndex = allLessons.indexOf(lessonNum);
  
  // Find previous and next lessons
  const prevLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null;
  
  // Get first text of each lesson (to navigate to the first text of the lesson)
  const getFirstTextOfLesson = (lesson: number): number => {
    const texts = getTextsForLesson(levelNum, lesson);
    return texts.length > 0 ? texts[0] : 1;
  };
  
  // Get texts for current lesson
  const currentLessonTexts = getTextsForLesson(levelNum, lessonNum);
  
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link 
            href={`/hsk/${level}`} 
            className="text-primary hover:underline font-medium transition-colors inline-flex items-center"
          >
            ← Back to HSK Level {level} All Lessons List
          </Link>
        </div>
        
        {/* Lesson Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-text">
            Lesson {lessonNum}
          </h1>
          <p className="text-text/70 mt-1">
            Text {textNum} of {currentLessonTexts.length}
          </p>
        </div>
        
        {/* Main Content */}
        <VocabularyList data={data} level={level} text={textNumber} />
        
        {/* Lesson Navigation */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-text/10 pt-6">
          <div className="flex gap-3">
            {/* Previous Lesson Button */}
            {prevLesson !== null ? (
              <Link
                href={`/hsk/${level}/lesson/${prevLesson}/text/${getFirstTextOfLesson(prevLesson)}`}
                className="inline-flex items-center gap-2 rounded-lg border border-secondary bg-background px-4 py-2 text-sm font-medium text-text transition-colors hover:bg-secondary hover:text-background"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous Lesson
              </Link>
            ) : (
              <button
                disabled
                className="inline-flex items-center gap-2 rounded-lg border border-text/10 bg-text/5 px-4 py-2 text-sm font-medium text-text/40 cursor-not-allowed"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous Lesson
              </button>
            )}
            
            {/* Next Lesson Button */}
            {nextLesson !== null ? (
              <Link
                href={`/hsk/${level}/lesson/${nextLesson}/text/${getFirstTextOfLesson(nextLesson)}`}
                className="inline-flex items-center gap-2 rounded-lg border border-secondary bg-background px-4 py-2 text-sm font-medium text-text transition-colors hover:bg-secondary hover:text-background"
              >
                Next Lesson
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <button
                disabled
                className="inline-flex items-center gap-2 rounded-lg border border-text/10 bg-text/5 px-4 py-2 text-sm font-medium text-text/40 cursor-not-allowed"
              >
                Next Lesson
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
          
          {/* Text Navigation within Current Lesson */}
          <div className="flex items-center gap-2 text-sm text-text/70">
            <span className="font-medium">Text:</span>
            <div className="flex gap-1">
              {currentLessonTexts.map((text) => (
                <Link
                  key={text}
                  href={`/hsk/${level}/lesson/${lessonNum}/text/${text}`}
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-md border text-sm font-medium transition-colors ${
                    text === textNum
                      ? 'border-primary bg-primary text-background'
                      : 'border-secondary bg-background text-text hover:bg-secondary hover:text-background'
                  }`}
                >
                  {text}
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        {/* Lesson Progress Info */}
        <div className="mt-4 text-center text-sm text-text/60">
          <span>Lesson {lessonNum} of {allLessons.length}</span>
          <span className="mx-2">•</span>
          <span>Text {textNum} of {currentLessonTexts.length}</span>
          {prevLesson === null && (
            <span className="ml-2 inline-block px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
              First Lesson
            </span>
          )}
          {nextLesson === null && (
            <span className="ml-2 inline-block px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
              Last Lesson
            </span>
          )}
        </div>
      </div>
    </div>
  );
}