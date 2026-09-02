import type { MetadataRoute } from "next";

import { getLevelParams, getLessonParams, getTextParams } from "@/features/vocabulary/data";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://lcwkr.vercel.app";

type Entry = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
};

/** Public, indexable routes. Admin, API and utility routes are excluded. */
const STATIC_ROUTES: Entry[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/intro", changeFrequency: "monthly", priority: 0.9 },
  { path: "/academy", changeFrequency: "weekly", priority: 0.8 },
  { path: "/academy/courses", changeFrequency: "weekly", priority: 0.7 },
  { path: "/academy/students", changeFrequency: "weekly", priority: 0.5 },
  { path: "/community", changeFrequency: "monthly", priority: 0.6 },
  { path: "/hsk", changeFrequency: "monthly", priority: 0.7 },
  { path: "/pdf", changeFrequency: "monthly", priority: 0.6 },
  { path: "/apps", changeFrequency: "yearly", priority: 0.4 },
];

/** Every HSK level / lesson / text page, derived from the vocabulary data. */
function hskRoutes(): Entry[] {
  const levels: Entry[] = getLevelParams().map(({ level }) => ({
    path: `/hsk/${level}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));
  const lessons: Entry[] = getLessonParams().map(({ level, lessonNumber }) => ({
    path: `/hsk/${level}/lesson/${lessonNumber}`,
    changeFrequency: "yearly",
    priority: 0.5,
  }));
  const texts: Entry[] = getTextParams().map(
    ({ level, lessonNumber, textNumber }) => ({
      path: `/hsk/${level}/lesson/${lessonNumber}/text/${textNumber}`,
      changeFrequency: "yearly",
      priority: 0.4,
    }),
  );
  return [...levels, ...lessons, ...texts];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [...STATIC_ROUTES, ...hskRoutes()].map(
    ({ path, changeFrequency, priority }) => ({
      url: `${SITE_URL}${path}`,
      lastModified,
      changeFrequency,
      priority,
    }),
  );
}
