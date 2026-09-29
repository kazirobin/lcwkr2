import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `/hsk/[level]` and a static `/hsk/pinyin` sibling compete for the same
  // path, and the dynamic segment wins at runtime — `Number("pinyin")` is NaN,
  // so the page 404s (non-deterministically, depending on build order). The
  // pinyin reference therefore lives at `/pinyin`, and the old URL is
  // redirected here so existing links keep working.
  async redirects() {
    return [
      { source: "/hsk/pinyin", destination: "/pinyin", permanent: true },
    ];
  },

  /**
   * The service worker must never be served from a cache, or a fixed version of
   * the offline site sticks to every device and the download never picks up
   * new content. These are the headers the Next.js PWA guide asks for; the
   * scope header is what lets `/sw.js` control the whole site.
   */
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate, no-store",
          },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },
};

export default nextConfig;
