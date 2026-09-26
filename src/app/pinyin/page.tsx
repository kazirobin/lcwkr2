import { Metadata } from "next";
import PinyinPage from "@/features/vocabulary/components/PinyinPage";

export const metadata: Metadata = {
  title: "Pinyin fundamentals — HSK vocabulary",
  description:
    "Interactive pinyin reference: initials and finals, each with hanzi and a short gloss. Click to hear the pronunciation.",
  alternates: { canonical: "/pinyin" },
  openGraph: {
    title: "Pinyin fundamentals — HSK vocabulary",
    description:
      "Interactive pinyin reference: initials and finals, each with hanzi and a short gloss. Click to hear the pronunciation.",
    url: "/pinyin",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pinyin fundamentals — HSK vocabulary",
    description:
      "Interactive pinyin reference: initials and finals, each with hanzi and a short gloss. Click to hear the pronunciation.",
  },
};

export default function PinyinRoute() {
  return <PinyinPage />;
}
