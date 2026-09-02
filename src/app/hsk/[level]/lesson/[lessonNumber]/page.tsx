// app/hsk/[level]/lesson/[lessonNumber]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTextsForLesson } from '@/features/vocabulary/data';

interface LessonPageProps {
  params: Promise<{
    level: string;
    lessonNumber: string;
  }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  // Await the params Promise
  const { level, lessonNumber } = await params;
  
  const levelNum = parseInt(level);
  const lessonNum = parseInt(lessonNumber);
  
  // Get texts for this specific lesson
  const texts = getTextsForLesson(levelNum, lessonNum);
  
  // If no texts found, return 404
  if (!texts || texts.length === 0) {
    notFound();
  }
  
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link href={`/hsk/${level}`} className="text-primary hover:underline inline-flex items-center font-medium">
            ← Back to All Lessons
          </Link>
        </div>
        
        <h1 className="text-4xl font-bold mb-2 text-text">
          HSK {level} - Lesson {lessonNumber}
        </h1>
        <p className="text-text/70 mb-10">Select a text to read</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {texts.map((text) => (
            <Link
              key={text}
              href={`/hsk/${level}/lesson/${lessonNumber}/text/${text}`}
              className="bg-background shadow-lg hover:shadow-xl transition-shadow rounded-xl overflow-hidden group border border-secondary/20"
            >
              <div className="bg-primary h-2"></div>
              <div className="p-8 text-center">
                <h2 className="text-2xl font-bold text-text mb-2">Text {text}</h2>
                <p className="text-text/70">Read and learn</p>
                <div className="mt-4 text-primary group-hover:translate-x-1 transition-transform inline-block font-medium">
                  Read →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}