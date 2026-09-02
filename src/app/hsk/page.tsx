// app/hsk/page.tsx
import Link from 'next/link';
import { getAllLevels } from '@/features/vocabulary/data';

export default function HskPage() {
  const levels = getAllLevels();
  
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-10 text-text">Choose HSK Level</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {levels.map((level) => (
            <Link
              key={level}
              href={`/hsk/${level}`}
              className="bg-background shadow-lg hover:shadow-xl transition-shadow rounded-xl overflow-hidden group border border-secondary/20"
            >
              <div className="bg-primary h-2"></div>
              <div className="p-8 text-center">
                <h2 className="text-3xl font-bold text-text mb-2">HSK {level}</h2>
                <p className="text-text/70">Click to view texts</p>
                <div className="mt-4 text-primary group-hover:translate-x-1 transition-transform inline-block font-medium">
                  Click Here →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}