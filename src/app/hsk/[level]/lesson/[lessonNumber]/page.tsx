import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getLessonDetail,
  getLessonParams,
} from "@/features/vocabulary/data";
import TextPicker from "@/features/vocabulary/components/TextPicker";

const CANONICAL = /^[1-9]\d*$/;

export function generateStaticParams() {
  return getLessonParams();
}

interface Props {
  params: Promise<{ level: string; lessonNumber: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { level, lessonNumber } = await params;
  const detail = getLessonDetail(Number(level), Number(lessonNumber));
  if (!detail) return {};

  const title = `HSK ${level} · Lesson ${lessonNumber} vocabulary`;
  const description = `${detail.words} words across ${detail.texts.length} texts in HSK ${level}, Lesson ${lessonNumber} — pinyin, English and Bangla glosses.`;
  const path = `/hsk/${level}/lesson/${lessonNumber}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function LessonPage({ params }: Props) {
  const { level, lessonNumber } = await params;
  const canonical = CANONICAL.test(level) && CANONICAL.test(lessonNumber);
  const detail = canonical
    ? getLessonDetail(Number(level), Number(lessonNumber))
    : null;
  if (!detail) notFound();

  return <TextPicker detail={detail} />;
}
