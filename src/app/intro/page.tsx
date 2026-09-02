import type { Metadata } from "next";
import IntroContent from "./IntroContent";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://lcwkr.vercel.app";

const TITLE = "Start learning Chinese from zero — free, in Bangla";
const DESCRIPTION =
  "Where beginners get stuck learning Chinese, and how this free class answers each part: a pronunciation gate before Level 1, one ordered track to HSK, live classes six days a week, and a practice community. Taught in Bangla by Kazi Robin.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/intro",
    languages: { "bn-BD": "/intro", en: "/intro" },
  },
  openGraph: {
    type: "article",
    url: `${SITE_URL}/intro`,
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": `${SITE_URL}/#organization`,
      name: "Learn Chinese with Kazi Robin",
      url: SITE_URL,
      sameAs: ["https://github.com/lcwkr"],
    },
    {
      "@type": "Course",
      name: "Learn Chinese with Kazi Robin — Pinyin to HSK",
      description:
        "A free, structured Mandarin Chinese course for Bangla-speaking beginners: a Pinyin pronunciation gate, six levels, and HSK preparation, with live classes six days a week and a practice community.",
      inLanguage: ["bn", "zh"],
      isAccessibleForFree: true,
      provider: { "@id": `${SITE_URL}/#organization` },
      teaches: ["Mandarin Chinese", "Pinyin pronunciation", "HSK 1-6"],
      offers: {
        "@type": "Offer",
        price: 0,
        priceCurrency: "BDT",
        category: "Free",
        availability: "https://schema.org/InStock",
      },
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "online",
        courseWorkload: "PT1H",
        courseSchedule: {
          "@type": "Schedule",
          repeatFrequency: "P1W",
          repeatCount: 6,
        },
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Start here",
          item: `${SITE_URL}/intro`,
        },
      ],
    },
  ],
};

export default function IntroPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <IntroContent />
    </>
  );
}
