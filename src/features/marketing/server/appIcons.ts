import { cache } from "react";

import {
  suggestedApps,
  type AppWithIcon,
} from "@/features/marketing/data/suggestedApps";

/**
 * Resolves each suggested app's Play Store listing to its icon at request
 * time. The listing page exposes the icon as an `og:image` meta tag on
 * Google's CDN; we parse it out and normalise the size suffix.
 *
 * Called from the `/apps` server component. Results are cached for a week
 * (route `revalidate` + per-fetch `next.revalidate`), so the scrape runs
 * at most once per app per week and never on a user's request path.
 *
 * A failed lookup degrades to `iconUrl: null` — the UI renders a monogram
 * placeholder — and never throws.
 */

const WEEK_SECONDS = 60 * 60 * 24 * 7;

export function packageIdFromUrl(url: string): string | null {
  try {
    return new URL(url).searchParams.get("id");
  } catch {
    return null;
  }
}

/** Rewrite Google's size suffix (`=s0-br30`, `=w240-h480-rw`, …) to `=s128`. */
function sizedIcon(raw: string): string {
  const base = raw.split("=")[0];
  return `${base}=s128`;
}

const fetchIcon = cache(async (packageId: string): Promise<string | null> => {
  try {
    const res = await fetch(
      `https://play.google.com/store/apps/details?id=${encodeURIComponent(
        packageId,
      )}&hl=en`,
      {
        headers: {
          "user-agent":
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        },
        next: { revalidate: WEEK_SECONDS, tags: ["app-icons"] },
      },
    );
    if (!res.ok) return null;

    const html = await res.text();
    const match = html.match(
      /<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i,
    );
    if (!match) return null;

    return sizedIcon(match[1]);
  } catch {
    return null;
  }
});

export const getAppsWithIcons = cache(async (): Promise<AppWithIcon[]> => {
  return Promise.all(
    suggestedApps.map(async (app): Promise<AppWithIcon> => {
      const packageId = packageIdFromUrl(app.url);
      const iconUrl = packageId ? await fetchIcon(packageId) : null;
      return { ...app, packageId, iconUrl };
    }),
  );
});
