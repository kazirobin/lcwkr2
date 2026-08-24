// app/components/Breadcrumb.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  
  // Build breadcrumb items
  const breadcrumbs = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    let label = segment;
    
    // Make labels more readable
    if (segment === 'hsk') label = 'HSK';
    else if (segment === 'lesson') label = 'Lesson';
    else if (segment === 'text') label = 'Text';
    else label = segment.charAt(0).toUpperCase() + segment.slice(1);
    
    return { href, label };
  });
  
  return (
    <nav className="bg-gray-100 p-4 rounded-lg mb-6">
      <ol className="flex items-center space-x-2 text-sm">
        <li>
          <Link href="/" className="text-blue-500 hover:underline">
            Home
          </Link>
        </li>
        {breadcrumbs.map((item, index) => (
          <li key={index} className="flex items-center space-x-2">
            <span className="text-gray-400">/</span>
            {index === breadcrumbs.length - 1 ? (
              <span className="font-semibold text-gray-800">{item.label}</span>
            ) : (
              <Link href={item.href} className="text-blue-500 hover:underline">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}