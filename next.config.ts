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
};

export default nextConfig;
