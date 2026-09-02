import type { Metadata } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://lcwkr.vercel.app";

const TITLE = "HSK books, audio & mock tests";
const DESCRIPTION =
  "Free HSK study material for all six levels — PDF textbooks, listening audio, practice exams and vocabulary lists, organised level by level on Google Drive.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/pdf",
    languages: { "bn-BD": "/pdf", en: "/pdf" },
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/pdf`,
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function PdfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
