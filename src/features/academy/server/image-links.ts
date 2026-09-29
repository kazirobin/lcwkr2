/**
 * Turning "here is my photo, hosted somewhere" into a URL a browser can draw.
 *
 * Students on a slow connection are told to upload to an image host and paste
 * the link. What they paste is almost never a link to an image:
 *
 *   - ImageBB's share page (`https://ibb.co/abc123`) is a web page, not a
 *     picture. Handing that to `<img src>` produces a broken image and the
 *     admin sees nothing at all.
 *   - The share page contains the real file at `i.ibb.co/abc123/name.jpg`, and
 *     advertises it as `og:image`. That is the one to store.
 *   - People mistype the host. `ibb.co.com` is a real thing you can type, and
 *     it is not ImageBB.
 *
 * So the link is normalised first, then resolved. Everything stays on the
 * allowlist: this is not a proxy, it will only ever fetch a host the submission
 * validator already trusts, and a failure falls back to the link the student
 * gave rather than dropping their work.
 */

/** How long to wait before giving up and keeping the original link. */
const RESOLVE_TIMEOUT_MS = 6000;

/** Enough for `og:image`; these pages are a few KB, not a few MB. */
const RESOLVE_MAX_BYTES = 512 * 1024;

/** ImageBB ids and filenames are short; anything longer is not one. */
const IMAGE_EXT = /\.(jpe?g|png|gif|webp|avif|bmp|heic|heif)(?:$|[?#])/i;

/**
 * Hosts we know how to pull a real image URL out of.
 * Kept in step with the validator's allowlist, minus the ones that serve files
 * directly and need no resolving.
 */
const RESOLVABLE: { test: RegExp; host: string }[] = [
  { test: /(^|\.)ibb\.co$/i, host: "ibb.co" },
  { test: /(^|\.)imgbb\.com$/i, host: "imgbb.com" },
  { test: /(^|\.)imgur\.com$/i, host: "imgur.com" },
  { test: /(^|\.)postimages\.org$/i, host: "postimages.org" },
];

/**
 * Fix the host before anything else.
 *
 * `ibb.co.com` is a typo for `ibb.co`, and a very easy one to make. It is
 * rejected by the allowlist, so without this a correct upload looks like an
 * invalid link and the student is told off for pasting a working one.
 */
export function normalizeImageUrl(input: string): string {
  let url = String(input ?? "").trim();
  if (!url) return url;

  // Strip the wrapping some apps add when a link is copied out of a message.
  url = url.replace(/^<|>$/g, "").trim();

  // No scheme means the browser would treat it as a relative path.
  if (!/^https?:\/\//i.test(url)) {
    if (/^www\./i.test(url) || /^[a-z0-9-]+\.[a-z]{2,}/i.test(url)) {
      url = `https://${url}`;
    }
  }

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();

    // `ibb.co.com` → `ibb.co`. Matching the `.co.com` suffix is enough to be
    // safe: the real file host `i.ibb.co` does not end that way, so it is
    // never touched. The rewrite is only kept if the result is a host we know.
    if (host.endsWith(".co.com")) {
      const fixed = host.replace(/\.co\.com$/, ".co");
      if (RESOLVABLE.some((r) => r.test.test(fixed))) {
        parsed.hostname = fixed;
        return parsed.toString();
      }
    }

    // http → https. An image host that redirects is fine; a browser mixed
    // content warning on an admin page is not.
    if (parsed.protocol === "http:") {
      parsed.protocol = "https:";
      return parsed.toString();
    }

    return parsed.toString();
  } catch {
    return url;
  }
}

/** True when the URL already points at a file, so it can be used as-is. */
function looksLikeImage(url: string): boolean {
  try {
    return IMAGE_EXT.test(new URL(url).pathname);
  } catch {
    return false;
  }
}

/**
 * Pull the advertised image out of a share page's markup.
 *
 * Exported so it can be tested against recorded markup rather than a live
 * fetch: a test that depends on somebody else's uptime is a test that fails for
 * reasons that have nothing to do with this code.
 */
export function extractImageFromHtml(html: string, host: string): string | null {
  // Matching the whole <meta> tag and then reading `content` out of it, rather
  // than assuming property-then-content order, because the order is not fixed
  // across hosts or even across a host's own pages.
  const metas = html.match(/<meta\b[^>]*>/gi) ?? [];
  const fromMeta = (key: "property" | "name", value: string) => {
    for (const tag of metas) {
      const k = tag.match(new RegExp(`${key}=["']([^"']+)["']`, "i"))?.[1]?.toLowerCase();
      if (k !== value) continue;
      const content = tag.match(/content=["']([^"']+)["']/i)?.[1];
      if (content) return absolutize(content, host);
    }
    return null;
  };

  // og:image is what the host itself says the picture is, so it is the first
  // thing to try. twitter:image is the same idea and ImageBB sets it too.
  const og = fromMeta("property", "og:image");
  if (og) return og;
  const tw = fromMeta("name", "twitter:image");
  if (tw) return tw;

  // Last resort: any img src on the page. Acceptable because the page came from
  // a host the validator already trusts.
  const img = html.match(/<img[^>]+src=["'](https?:\/\/[^"']+)["']/i);
  if (img?.[1]) return absolutize(img[1], host);

  // A protocol-relative src, which is how some hosts still write it.
  const rel = html.match(/<img[^>]+src=["'](\/\/[^"']+)["']/i);
  if (rel?.[1]) return absolutize(rel[1], host);

  return null;
}

function absolutize(src: string, host: string): string {
  const trimmed = src.trim();
  if (/^https?:\/\//i.test(trimmed)) return normalizeImageUrl(trimmed);
  // Protocol-relative (`//host/path`) already names its own host, so it only
  // needs the scheme. Prefixing the default host here would turn a correct URL
  // into `ibb.co/i.ibb.co/...`, which resolves to nothing. Checked before the
  // leading slashes are trimmed off, or the `//` is gone by the time we look.
  if (trimmed.startsWith("//")) return normalizeImageUrl(`https:${trimmed}`);
  return normalizeImageUrl(`https://${host}/${trimmed.replace(/^\/+/, "")}`);
}

/**
 * Resolve a pasted link to something a browser can actually display.
 *
 * Returns the image URL on success, or the normalised original on failure. It
 * never throws and never returns an empty string: a photo the student worked
 * for is worth keeping even if the host is having a bad day, and the admin can
 * always open the link by hand.
 */
export async function resolveDisplayImageUrl(input: string): Promise<string> {
  const normalized = normalizeImageUrl(input);
  if (!normalized || looksLikeImage(normalized)) return normalized;

  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch {
    return normalized;
  }

  const rule = RESOLVABLE.find((r) => r.test.test(parsed.hostname.toLowerCase()));
  if (!rule) return normalized;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), RESOLVE_TIMEOUT_MS);
    let html: string;
    try {
      const res = await fetch(normalized, {
        signal: controller.signal,
        redirect: "follow",
        headers: {
          // Some hosts serve a bare page to unknown agents. Ask as a browser.
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml",
        },
        cache: "no-store",
      });
      if (!res.ok) return normalized;
      // Read the body with a cap: a share page is small, and a hostile or
      // mis-typed host should not be able to stream into our memory.
      const text = await res.text();
      html = text.length > RESOLVE_MAX_BYTES ? text.slice(0, RESOLVE_MAX_BYTES) : text;
    } finally {
      clearTimeout(timer);
    }

    const found = extractImageFromHtml(html, rule.host);
    if (found && looksLikeImage(found)) return found;
    return normalized;
  } catch {
    // Offline, timed out, blocked, or the host changed its markup. The link the
    // student gave is still the best thing we have.
    return normalized;
  }
}
