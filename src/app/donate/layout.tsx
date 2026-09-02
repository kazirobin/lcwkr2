import type { Metadata } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://lcwkr.vercel.app";

const TITLE = "Support the platform";
const DESCRIPTION =
  "Chip in a voluntary ৳200 over bKash to help keep Learn Chinese with Kazi Robin free — live classes, the HSK track and the practice community, six days a week.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  // A thin, transactional page: useful to reach, not useful in a search index.
  // Kept crawlable and linked so people and link-followers still find it.
  robots: { index: false, follow: true },
  alternates: {
    canonical: "/donate",
    languages: { "bn-BD": "/donate", en: "/donate" },
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/donate`,
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function DonateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
