import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://lcwkr.vercel.app";

/** Public, indexable routes. Admin, API and utility routes are excluded. */
const ROUTES: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/intro", changeFrequency: "monthly", priority: 0.9 },
  { path: "/academy", changeFrequency: "weekly", priority: 0.8 },
  { path: "/academy/courses", changeFrequency: "weekly", priority: 0.7 },
  { path: "/academy/students", changeFrequency: "weekly", priority: 0.5 },
  { path: "/community", changeFrequency: "monthly", priority: 0.6 },
  { path: "/hsk", changeFrequency: "monthly", priority: 0.7 },
  { path: "/hsk/1", changeFrequency: "monthly", priority: 0.6 },
  { path: "/hsk/2", changeFrequency: "monthly", priority: 0.6 },
  { path: "/hsk/3", changeFrequency: "monthly", priority: 0.6 },
  { path: "/pdf", changeFrequency: "monthly", priority: 0.6 },
  { path: "/apps", changeFrequency: "yearly", priority: 0.4 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
