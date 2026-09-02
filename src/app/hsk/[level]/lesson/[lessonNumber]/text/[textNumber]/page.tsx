import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getText,
  getTextNav,
  getTextParams,
} from "@/features/vocabulary/data";
import TextReader from "@/features/vocabulary/components/TextReader";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://lcwkr.vercel.app";

const CANONICAL = /^[1-9]\d*$/;

export function generateStaticParams() {
  return getTextParams();
}

interface Props {
  params: Promise<{ level: string; lessonNumber: string; textNumber: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { level, lessonNumber, textNumber } = await params;
  const data = getText(Number(level), Number(lessonNumber), Number(textNumber));
  if (!data) return {};

  const words = data.vocabulary
    .slice(0, 6)
    .map((v) => v.hanzi)
    .join("，");
  const title = `HSK ${level} · Lesson ${lessonNumber} · Text ${textNumber}`;
  const description = `${data.vocabulary.length} words from HSK ${level}, Lesson ${lessonNumber}, Text ${textNumber}: ${words}… — each with pinyin, an English and a Bangla gloss.`;
  const path = `/hsk/${level}/lesson/${lessonNumber}/text/${textNumber}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "article" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function TextPage({ params }: Props) {
  const { level, lessonNumber, textNumber } = await params;
  const canonical =
    CANONICAL.test(level) &&
    CANONICAL.test(lessonNumber) &&
    CANONICAL.test(textNumber);

  const lvl = Number(level);
  const lsn = Number(lessonNumber);
  const txt = Number(textNumber);

  const data = canonical ? getText(lvl, lsn, txt) : null;
  const nav = canonical ? getTextNav(lvl, lsn, txt) : null;
  if (!data || !nav) notFound();

  const path = `${SITE_URL}/hsk/${level}/lesson/${lessonNumber}/text/${textNumber}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "HSK vocabulary", item: `${SITE_URL}/hsk` },
          { "@type": "ListItem", position: 2, name: `HSK ${level}`, item: `${SITE_URL}/hsk/${level}` },
          {
            "@type": "ListItem",
            position: 3,
            name: `Lesson ${lessonNumber}`,
            item: `${SITE_URL}/hsk/${level}/lesson/${lessonNumber}`,
          },
          { "@type": "ListItem", position: 4, name: `Text ${textNumber}`, item: path },
        ],
      },
      {
        "@type": "DefinedTermSet",
        "@id": path,
        name: `HSK ${level} · Lesson ${lessonNumber} · Text ${textNumber} vocabulary`,
        inLanguage: "zh",
        hasDefinedTerm: data.vocabulary.map((v) => ({
          "@type": "DefinedTerm",
          name: v.hanzi,
          description: `${v.pinyin} — ${v.english}; ${v.bangla}`,
          inLanguage: "zh",
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TextReader data={data} nav={nav} />
    </>
  );
}
