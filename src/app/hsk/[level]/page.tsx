import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getLevelDetail,
  getLevelParams,
} from "@/features/vocabulary/data";
import LessonPicker from "@/features/vocabulary/components/LessonPicker";

/** Positive integer, no leading zero — keeps `/hsk/01` from rendering `/hsk/1`. */
const CANONICAL = /^[1-9]\d*$/;

export function generateStaticParams() {
  return getLevelParams();
}

interface Props {
  params: Promise<{ level: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { level } = await params;
  const detail = getLevelDetail(Number(level));
  if (!detail) return {};

  const title = `HSK ${level} vocabulary`;
  const description = `All ${detail.words} words from HSK ${level} — ${detail.lessons.length} lessons, ${detail.texts} texts, each with pinyin plus an English and a Bangla gloss.`;

  return {
    title,
    description,
    alternates: { canonical: `/hsk/${level}` },
    openGraph: { title, description, url: `/hsk/${level}`, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function LevelPage({ params }: Props) {
  const { level } = await params;
  const detail = CANONICAL.test(level) ? getLevelDetail(Number(level)) : null;
  if (!detail) notFound();

  return <LessonPicker detail={detail} />;
}
