import type { Metadata } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://lcwkr.vercel.app";

const TITLE = "Chinese learning apps we recommend";
const DESCRIPTION =
  "A hand-picked set of free Android apps for pinyin, dictionaries, handwriting and HSK preparation — the ones we actually point students to.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/apps",
    languages: { "bn-BD": "/apps", en: "/apps" },
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/apps`,
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function AppsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
