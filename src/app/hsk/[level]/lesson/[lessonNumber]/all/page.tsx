import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getLessonParams,
  getText,
  getTextsForLesson,
} from "@/features/vocabulary/data";
import type { VocabularyData, VocabularyItem } from "@/features/vocabulary/types";
import FullLessonReader from "@/features/vocabulary/components/FullLessonReader";

const CANONICAL = /^[1-9]\d*$/;

export function generateStaticParams() {
  return getLessonParams();
}

interface Props {
  params: Promise<{ level: string; lessonNumber: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { level, lessonNumber } = await params;
  const canonical = CANONICAL.test(level) && CANONICAL.test(lessonNumber);
  if (!canonical) return {};

  const title = `HSK ${level} · Lesson ${lessonNumber} — all texts & words`;
  const description = `Every dialogue and the full word list of HSK ${level}, Lesson ${lessonNumber} on one page — pinyin, English and Bangla glosses.`;
  const path = `/hsk/${level}/lesson/${lessonNumber}/all`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function AllTextsPage({ params }: Props) {
  const { level, lessonNumber } = await params;
  const canonical = CANONICAL.test(level) && CANONICAL.test(lessonNumber);

  const lvl = Number(level);
  const lsn = Number(lessonNumber);

  const texts = canonical ? getTextsForLesson(lvl, lsn) : [];
  const records = texts
    .map((t) => getText(lvl, lsn, t))
    .filter((r): r is VocabularyData => r != null);
  if (records.length === 0) notFound();

  // the whole lesson's words, deduplicated by hanzi, first occurrence wins
  const seen = new Set<string>();
  const words: VocabularyItem[] = [];
  for (const r of records) {
    for (const v of r.vocabulary) {
      if (!v.hanzi || seen.has(v.hanzi)) continue;
      seen.add(v.hanzi);
      words.push(v);
    }
  }

  return <FullLessonReader level={lvl} lesson={lsn} records={records} words={words} />;
}
