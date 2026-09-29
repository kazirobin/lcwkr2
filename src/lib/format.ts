/** Human-readable size. Uploads are counted in bytes everywhere, and the
 *  interesting range is a few hundred KB of handwriting up to a few GB of
 *  class audio, so the units adapt rather than always showing bytes. */
export function formatBytes(bytes: number | null | undefined, digits = 1): string {
  const n = Number(bytes ?? 0);
  if (!Number.isFinite(n) || n <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(units.length - 1, Math.floor(Math.log(n) / Math.log(1024)));
  const value = n / 1024 ** i;
  return `${i === 0 ? Math.round(value) : value.toFixed(digits)} ${units[i]}`;
}

/** Seconds as m:ss, or h:mm:ss for a long recording. */
export function formatDuration(seconds: number | null | undefined): string {
  const total = Math.max(0, Math.round(Number(seconds ?? 0)));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mm = h > 0 ? String(m).padStart(2, "0") : String(m);
  return h > 0 ? `${h}:${mm}:${String(s).padStart(2, "0")}` : `${mm}:${String(s).padStart(2, "0")}`;
}
