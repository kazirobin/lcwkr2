/**
 * HSK study material, level by level — PDF books, audio, mock tests and
 * vocabulary, each pointing at a Google Drive folder. Rendered by
 * `app/pdf/page.tsx` as a hairline-separated list in the sumi-e register.
 *
 * `resources` flags gate whether a link renders; today every level is
 * complete, but the shape is kept so a partially-stocked level can show its
 * missing pieces as "soon" rather than 404.
 */

export type ResourceKey = "books" | "audio" | "mockTest" | "vocabulary";

export interface HSKLevel {
  id: string;
  level: string;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  resources: Record<"all" | ResourceKey, boolean>;
  driveLinks: Partial<Record<"all" | ResourceKey, string>>;

  /**
   * TODO(covers): book cover / thumbnail for the level, rendered by
   * `app/pdf/page.tsx`. Not wired up — cannot be derived automatically:
   * `driveLinks` point at Drive *folders* (no thumbnail), and the textbook
   * PDFs inside are only folder-shared, so `drive.google.com/thumbnail?id=…`
   * 404s on them. To enable, either:
   *   a) set each level's textbook PDF to "anyone with link" and put its file
   *      id here as `coverFileId` — the page can then use
   *      `https://drive.google.com/thumbnail?id=${coverFileId}&sz=w600`; or
   *   b) add cover images under `public/assets/hsk/` and set `coverUrl`.
   */
  // coverFileId?: string;
  // coverUrl?: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  link: string;
}

export const hskLevels: HSKLevel[] = [
  {
    id: "hsk-1",
    level: "HSK Level 1",
    title: "Beginner",
    titleBn: "প্রাথমিক",
    description: "Start your Chinese journey with basic vocabulary.",
    descriptionBn: "মৌলিক শব্দভাণ্ডার দিয়ে চীনা শেখা শুরু করুন।",
    resources: {
      all: true,
      books: true,
      audio: true,
      mockTest: true,
      vocabulary: true,
    },
    driveLinks: {
      all: "https://drive.google.com/drive/folders/1cuhnbILUvxFKlMCmkgRaDP0SiLpiCbgM?usp=drive_link",
      books:
        "https://drive.google.com/drive/folders/1GFvFiWDtFa5blOe26a-kKOwCACGY_eCK?usp=drive_link",
      audio:
        "https://drive.google.com/drive/folders/1X8bv142wtkENNHZWd30c5t1Dvrl6NeQU?usp=drive_link",
      mockTest:
        "https://drive.google.com/drive/folders/1s7SXAqakvPpEKHnZP3-TC9F4NTjR10vu?usp=drive_link",
      vocabulary:
        "https://drive.google.com/file/d/1k6gwM5t4PwwW7Cc-mlHfC6oCt0oXqlQt/view?usp=drive_link",
    },
  },
  {
    id: "hsk-2",
    level: "HSK Level 2",
    title: "Elementary",
    titleBn: "প্রারম্ভিক",
    description: "Build a foundation with everyday conversations.",
    descriptionBn: "প্রতিদিনের কথোপকথনে ভিত গড়ুন।",
    resources: {
      all: true,
      books: true,
      audio: true,
      mockTest: true,
      vocabulary: true,
    },
    driveLinks: {
      all: "https://drive.google.com/drive/folders/1kvKuD1100jX2Wgbljuwr443v3LrXOvs_?usp=drive_link",
      books:
        "https://drive.google.com/drive/folders/1uyTpWA-cpmc0oMv7mmdDd-Xy1yjoHBOa?usp=drive_link",
      audio:
        "https://drive.google.com/drive/folders/1F-hJc2XVYcp6diXP7tuQnf4uFfPBNMH9?usp=drive_link",
      mockTest:
        "https://drive.google.com/drive/folders/1W78AO00XWiwslWvOZHHK-fu_dtqMGA26?usp=drive_link",
      vocabulary:
        "https://drive.google.com/file/d/1GVndWJG1bY9M_mqh1XhkQqGXijnxO2YO/view?usp=drive_link",
    },
  },
  {
    id: "hsk-3",
    level: "HSK Level 3",
    title: "Pre-Intermediate",
    titleBn: "নিম্ন-মধ্যম",
    description: "Communicate confidently in daily situations.",
    descriptionBn: "দৈনন্দিন পরিস্থিতিতে আত্মবিশ্বাসে কথা বলুন।",
    resources: {
      all: true,
      books: true,
      audio: true,
      mockTest: true,
      vocabulary: true,
    },
    driveLinks: {
      all: "https://drive.google.com/drive/folders/1WoJPqChhwMwVJ1C3KAyp3CyVzGKVmbws?usp=drive_link",
      books:
        "https://drive.google.com/drive/folders/1_OXK_Iuee5iuryPMDR76Ea8hiOHVux25?usp=drive_link",
      audio:
        "https://drive.google.com/drive/folders/1Sp9QQtlfdEc37uSgVTQYyhS8cQ7dBoGu?usp=drive_link",
      mockTest:
        "https://drive.google.com/drive/folders/1sUz0twM8nkmP3z6ENb0K8Pt_l2-85KlJ?usp=drive_link",
      vocabulary:
        "https://drive.google.com/file/d/1TCFTv128jQMbGI9NZUNUD1sJXWUX9ibv/view?usp=drive_link",
    },
  },
  {
    id: "hsk-4",
    level: "HSK Level 4",
    title: "Intermediate",
    titleBn: "মধ্যম",
    description: "Express complex ideas and understand native content.",
    descriptionBn: "জটিল ভাবনা প্রকাশ করুন, নেটিভ কনটেন্ট বুঝুন।",
    resources: {
      all: true,
      books: true,
      audio: true,
      mockTest: true,
      vocabulary: true,
    },
    driveLinks: {
      all: "https://drive.google.com/drive/folders/1R80teEvyvy3upZ9hJtHMro5S1BfOVQsG?usp=drive_link",
      books:
        "https://drive.google.com/drive/folders/1J3Dr7JFql5IKQxcBMeSu2YmizQ8HVihg?usp=drive_link",
      audio:
        "https://drive.google.com/drive/folders/17thaoXjYhT-SCuuaLN-WUqLWVgrO2jjV?usp=drive_link",
      mockTest:
        "https://drive.google.com/drive/folders/1uqPrzOaGjo0jeJghSD1BOH0ZGNENB9mv?usp=drive_link",
      vocabulary:
        "https://drive.google.com/file/d/1Q8uDOg2i88CQoQWq-wcvPB-Eyor2gjb9/view?usp=drive_link",
    },
  },
  {
    id: "hsk-5",
    level: "HSK Level 5",
    title: "Advanced",
    titleBn: "উচ্চতর",
    description: "Master advanced vocabulary and complex reading.",
    descriptionBn: "উন্নত শব্দভাণ্ডার আর জটিল পাঠে দক্ষ হোন।",
    resources: {
      all: true,
      books: true,
      audio: true,
      mockTest: true,
      vocabulary: true,
    },
    driveLinks: {
      all: "https://drive.google.com/drive/folders/1_kgn35rulKQkLoTqshyK4f1fa2t0ydM4?usp=drive_link",
      books:
        "https://drive.google.com/drive/folders/16FImlIM8fd_Cx76xxQGVqyCMhEGpUAEk?usp=drive_link",
      audio:
        "https://drive.google.com/drive/folders/1qKG7mGdM-CKdSMxKGwWpS3GEiAFvhb_p?usp=drive_link",
      mockTest:
        "https://drive.google.com/drive/folders/1uoLtBYNROdAcmJzSIfho-0B2a7EV7Nm1?usp=drive_link",
      vocabulary:
        "https://drive.google.com/file/d/1M3VYLjf7sEolzoIaNjbhXOotl3Dmb2bC/view?usp=drive_link",
    },
  },
  {
    id: "hsk-6",
    level: "HSK Level 6",
    title: "Proficient",
    titleBn: "দক্ষ",
    description: "Achieve professional-level Chinese fluency.",
    descriptionBn: "পেশাদার পর্যায়ের চীনা সাবলীলতা অর্জন করুন।",
    resources: {
      all: true,
      books: true,
      audio: true,
      mockTest: true,
      vocabulary: true,
    },
    driveLinks: {
      all: "https://drive.google.com/drive/folders/13pW9pOFAFkSe-NXbvP611RjW8F16tbYo?usp=drive_link",
      books:
        "https://drive.google.com/drive/folders/18sx8UmwzK93fZea7l28wI_PJFRFaNaEr?usp=drive_link",
      audio:
        "https://drive.google.com/drive/folders/1zUQ45S_XeUHWUVglTrzR5B9rxksAeiaQ?usp=drive_link",
      mockTest:
        "https://drive.google.com/drive/folders/1hWlp_SAcMyNPr2zDT5KVbg9YFxay_fHE?usp=drive_link",
      vocabulary:
        "https://drive.google.com/file/d/1LziYNVQzFa7YQMUqEP_7-XW2j9gZ8HZl/view?usp=drive_link",
    },
  },
];

/** The everything-at-once folder, offered once at the foot of the page. */
export const completeCollection: ResourceItem = {
  id: "all-books",
  title: "The complete collection",
  titleBn: "সম্পূর্ণ সংগ্রহ",
  description: "Every level, every resource type, in one Drive folder.",
  descriptionBn: "প্রতিটি লেভেল, প্রতিটি রিসোর্স — এক ড্রাইভ ফোল্ডারে।",
  link: "https://drive.google.com/drive/folders/13EV97xZHlKU-uUeHElDnHuBu5sCIJj0m?usp=drive_link",
};

/** Labels for the four per-level resource links, in render order. */
export const resourceLabels: {
  key: ResourceKey;
  bn: string;
  en: string;
}[] = [
  { key: "books", bn: "বই (PDF)", en: "Books (PDF)" },
  { key: "audio", bn: "অডিও", en: "Audio" },
  { key: "mockTest", bn: "মক টেস্ট", en: "Mock tests" },
  { key: "vocabulary", bn: "ভোকাবুলারি", en: "Vocabulary" },
];
