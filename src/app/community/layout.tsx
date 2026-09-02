import type { Metadata } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://lcwkr.vercel.app";

const TITLE = "The people behind the community";
const DESCRIPTION =
  "Who runs Learn Chinese with Kazi Robin — the founder, managers and teachers keeping the live classes, the level track and the WhatsApp groups running six days a week, plus the community guidelines.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/community",
    languages: { "bn-BD": "/community", en: "/community" },
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/community`,
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
