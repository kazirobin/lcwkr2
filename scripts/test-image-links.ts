import { extractImageFromHtml, normalizeImageUrl } from "@/features/academy/server/image-links";

/**
 * The host is the part students get wrong, so it is the part worth pinning
 * down. `ibb.co.com` is a real string anyone can type, and it is not ImageBB;
 * a correct upload must not be rejected as an invalid link because of it.
 */
const CASES: { given: string; want: string; why: string }[] = [
  {
    given: "https://ibb.co.com/wNr6bhvf",
    want: "https://ibb.co/wNr6bhvf",
    why: "the .com typo is put right",
  },
  {
    given: "https://i.ibb.co.com/wNr6bhvf/photo.jpg",
    want: "https://i.ibb.co/wNr6bhvf/photo.jpg",
    why: "the file host keeps its i. prefix",
  },
  {
    given: "https://i.ibb.co/wNr6bhvf/photo.jpg",
    want: "https://i.ibb.co/wNr6bhvf/photo.jpg",
    why: "a real file URL is left alone",
  },
  {
    given: "https://ibb.co/wNr6bhvf",
    want: "https://ibb.co/wNr6bhvf",
    why: "a valid share page is left for the resolver",
  },
  {
    given: "  https://ibb.co/wNr6bhvf  ",
    want: "https://ibb.co/wNr6bhvf",
    why: "a link pasted out of a message arrives with whitespace",
  },
  {
    given: "<https://ibb.co/wNr6bhvf>",
    want: "https://ibb.co/wNr6bhvf",
    why: "some apps wrap copied links in angle brackets",
  },
  {
    given: "ibb.co/wNr6bhvf",
    want: "https://ibb.co/wNr6bhvf",
    why: "a missing scheme would make it a relative path",
  },
  {
    given: "www.ibb.co/wNr6bhvf",
    want: "https://www.ibb.co/wNr6bhvf",
    why: "www with no scheme still means https",
  },
  {
    given: "http://i.ibb.co/wNr6bhvf/photo.jpg",
    want: "https://i.ibb.co/wNr6bhvf/photo.jpg",
    why: "http on an admin page is a mixed-content warning",
  },
  {
    given: "https://imgbb.com/abc123",
    want: "https://imgbb.com/abc123",
    why: "imgbb.com is the other spelling of the same site",
  },
  {
    given: "",
    want: "",
    why: "empty in, empty out — the validator rejects it next",
  },
  {
    given: "not a url at all",
    want: "not a url at all",
    why: "garbage is passed through for the validator to reject",
  },
];

let failed = 0;
for (const { given, want, why } of CASES) {
  const got = normalizeImageUrl(given);
  const ok = got === want;
  if (!ok) failed++;
  console.log(`${ok ? "ok  " : "FAIL"}  ${why}\n        ${given || "(empty)"} -> ${got || "(empty)"}`);
}

/* The pull-out of the real file from a share page. Driven by recorded markup
   rather than a live fetch, because a live fetch would make this test depend on
   somebody else's uptime — and because the markup shapes below are the ones
   that have to keep working. */
const EXTRACT_CASES: { name: string; html: string; want: string | null }[] = [
  {
    name: "ImageBB share page, og:image first",
    html: `<head><meta property="og:image" content="https://i.ibb.co/abc123/photo.jpg">
      <meta name="twitter:image" content="https://i.ibb.co/abc123/other.jpg"></head>`,
    want: "https://i.ibb.co/abc123/photo.jpg",
  },
  {
    name: "attributes in the other order",
    html: `<head><meta content="https://i.ibb.co/abc123/photo.png" property="og:image"></head>`,
    want: "https://i.ibb.co/abc123/photo.png",
  },
  {
    name: "no og:image, twitter:image is used",
    html: `<head><meta name="twitter:image" content="https://i.ibb.co/abc123/p.webp"></head>`,
    want: "https://i.ibb.co/abc123/p.webp",
  },
  {
    name: "falls back to the first img src",
    html: `<body><img src="https://i.ibb.co/abc123/only.jpg" width="800"></body>`,
    want: "https://i.ibb.co/abc123/only.jpg",
  },
  {
    name: "protocol-relative src is made absolute",
    html: `<body><img src="//i.ibb.co/abc123/rel.jpg"></body>`,
    want: "https://i.ibb.co/abc123/rel.jpg",
  },
  {
    name: "a 404 page has nothing to find",
    html: `<head><title>That page doesn't exist (404)</title></head>`,
    want: null,
  },
];

console.log("");
for (const { name, html, want } of EXTRACT_CASES) {
  // The real extraction function, on fixed markup.
  const got = extractImageFromHtml(html, "ibb.co");
  const ok = got === want;
  if (!ok) failed++;
  console.log(`${ok ? "ok  " : "FAIL"}  ${name}\n        ${got ?? "(none)"}`);
}

console.log(`\n${CASES.length + EXTRACT_CASES.length - failed}/${CASES.length + EXTRACT_CASES.length} passed`);
if (failed > 0) process.exit(1);
