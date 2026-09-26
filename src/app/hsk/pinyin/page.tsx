// src/app/hsk/pinyin/page.tsx

import { Metadata } from "next";
import PinyinPage from "@/features/vocabulary/components/PinyinPage";

export const metadata: Metadata = {
  title: "Pinyin fundamentals — HSK vocabulary",
  description:
    "Interactive pinyin reference: initials and finals, each with hanzi and a short gloss. Click to hear the pronunciation.",
};

export default function HskPinyinPage() {
  return <PinyinPage />;
}
