import { getAppsWithIcons } from "@/features/marketing/server/appIcons";
import AppsExplorer from "@/features/marketing/components/AppsExplorer";

/**
 * `/apps` — the app registry for Chinese learners.
 *
 * Rebuilt as a technical "package registry": a mono spec sheet over a
 * rice-paper header, then a dark console listing every app as a data row
 * with its resolved Play Store icon and package id.
 *
 * This server component resolves the icons (see `server/appIcons.ts`) and
 * hands the list to the client `AppsExplorer` for the category filter and
 * bilingual copy. Icons are scraped from the Play Store at most once a week.
 */

export const revalidate = 604800; // 1 week

export default async function SuggestedAppsPage() {
  const apps = await getAppsWithIcons();
  const resolved = apps.filter((a) => a.iconUrl).length;

  return <AppsExplorer apps={apps} resolvedIcons={resolved} />;
}
