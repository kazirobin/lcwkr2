// app/hsk/[level]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLevelLessonData } from '@/data/vocabulary';

interface LevelPageProps {
  params: Promise<{
    level: string;
  }>;
}

export default async function LevelPage({ params }: LevelPageProps) {
  const { level } = await params;
  const levelNum = parseInt(level);
  
  // Get all lessons with their texts for this HSK level
  const lessons = getLevelLessonData(levelNum);
  
  if (lessons.length === 0) {
    notFound();
  }
  
  // Calculate total vocabulary for the level
  const totalVocabulary = lessons.reduce((sum, lesson) => sum + lesson.totalVocabulary, 0);
  const totalTexts = lessons.reduce((sum, lesson) => sum + lesson.texts.length, 0);
  
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        {/* Navigation */}
        <div className="mb-6">
          <Link href="/hsk" className="text-primary hover:underline inline-flex items-center font-medium">
            ← Back to All HSK Levels
          </Link>
        </div>
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2 text-text">HSK Level {level}</h1>
          <div className="flex flex-wrap gap-4 text-text/70">
            <span>📚 {lessons.length} Lessons</span>
            <span>📝 {totalTexts} Texts</span>
            <span>📖 {totalVocabulary} Vocabulary Words</span>
          </div>
        </div>
        
        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <div
              key={lesson.lesson}
              className="bg-background shadow-lg hover:shadow-xl transition-shadow rounded-xl overflow-hidden border border-secondary/20"
            >
              {/* Lesson Header */}
              <div className="bg-primary px-6 py-4">
                <Link     key={lesson.lesson}
                    href={`/hsk/${level}/lesson/${lesson.lesson}`}>

                <h2 className="text-2xl font-bold text-background">
                  Lesson {lesson.lesson}
                </h2>
                <p className="text-background/80 text-sm mt-1">
                  {lesson.texts.length} texts • {lesson.totalVocabulary} vocabulary
                </p>
                    </Link>
              </div>
              
              {/* Texts List */}
              {/* <div className="p-6 space-y-3">
                {lesson.texts.map((text) => (
                  <Link
                    key={text}
                    href={`/hsk/${level}/lesson/${lesson.lesson}/text/${text}`}
                    className="block group"
                  >
                    <div className="flex items-center justify-between p-3 bg-secondary/30 hover:bg-secondary rounded-lg transition-colors border border-transparent hover:border-primary/30">
                      <div>
                        <span className="font-medium text-text group-hover:text-primary">
                          Text {text}
                        </span>
                        <span className="text-xs text-text/40 ml-2">
                          Vocabulary
                        </span>
                      </div>
                      <span className="text-primary group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </div>
                  </Link>
                ))}
              </div> */}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}