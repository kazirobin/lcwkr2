import type { Metadata } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://lcwkr.vercel.app";

const TITLE = "HSK 1–3 vocabulary";
const DESCRIPTION =
  "Every word from the HSK 1, 2 and 3 course books — pinyin, an English and a Bangla gloss, a character breakdown and an example sentence for each. Free.";

export const metadata: Metadata = {
  // Re-establish the site title suffix for the whole /hsk subtree — a plain
  // string title in an intermediate layout otherwise stops the root template
  // from reaching the deeper level/lesson/text pages.
  title: {
    default: TITLE,
    template: "%s · Learn Chinese with Kazi Robin",
  },
  description: DESCRIPTION,
  alternates: {
    canonical: "/hsk",
    languages: { "bn-BD": "/hsk", en: "/hsk" },
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/hsk`,
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function HskLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
