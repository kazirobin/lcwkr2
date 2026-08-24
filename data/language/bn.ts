import { hero } from "./components/hero";

const bn = {
  nav: {
    home: "হোম",
    pdf: "পিডিএফ",
    vocabulary: "Vocabulary",
    apps: "এপ্যস",
    pinyin: "পিনইন",
    intro: "সূচনা ",
    community: "কমিউনিটি",
  },

  home: {
    title: "সহজে চাইনিজ শিখুন",
    subtitle: "আজই আপনার শেখা শুরু করুন।"
  },

  buttons: {
    watchVideo: "ভিডিও দেখুন",
    joinWhatsapp: "হোয়াটসঅ্যাপে যোগ দিন"
  },
   hero: {
    ...hero,

    title: {
      line1: "চাইনিজ শিখুন",
      line2: "একদম শুরু ",
      line3: "থেকে",
      hsk: "HSK 6",
      line4: "সম্পূর্ণ",
      free: "ফ্রি",
      badge: "লাইভ ক্লাস হয়",
      edu:"শিক্ষা হোক সবার জন্য বিনামূল্যে।",
    },

    description:
      "আমাদের WhatsApp কমিউনিটিতে যোগ দিন এবং প্রতিদিন চাইনিজ শিখুন।",

    buttons: {
      whatsapp: "চীনা ভাষার পরিচিতি",
      resources: "PDF ডাউনলোড করুন",
    },

    links: {
      whatsapp:
        "https://chat.whatsapp.com/EBP79wEaAfAEvMtMee6HTY",
      resources: "/hsk-materials",
    },

    images: {
      teacher: "/assets/hero1.png",
      background: "/assets/hero3.png",
      teacherAlt: "চাইনিজ শিক্ষক",
    },
  },
  roadmap: {
    badge: "পিনইন জমা দেওয়ার নির্দেশিকা",

    title: "লেভেল ১ ক্লাসে যোগদানের আগে এই ধাপগুলো সম্পন্ন করুন",

    description:
      "পিনইন চার্ট পড়ুন, নিজের উচ্চারণ রেকর্ড করুন, WhatsApp Practice Group-এ জমা দিন এবং মডারেটরের যাচাইয়ের জন্য অপেক্ষা করুন।",

    imageAlt: "চাইনিজ পিনইন চার্ট",

    imageNote:
      "ভয়েস রেকর্ড করার আগে এই চার্টের প্রতিটি পিনইন পড়ে অনুশীলন করুন।",

    stepLabel: "ধাপ",

    steps: [
      {
        title: "পিনইন চার্ট অনুশীলন করুন",
        description:
          "চার্টে থাকা প্রতিটি পিনইন মনোযোগ দিয়ে পড়ুন এবং সঠিক উচ্চারণ অনুশীলন করুন।",
      },
      {
        title: "ভয়েস রেকর্ড করুন",
        description:
          "সম্পূর্ণ পিনইন চার্ট পড়ে পরিষ্কারভাবে নিজের কণ্ঠ রেকর্ড করুন।",
      },
      {
        title: "WhatsApp গ্রুপে জমা দিন",
        description:
          "আপনার ভয়েস রেকর্ডিং WhatsApp Practice Group-এ পাঠিয়ে দিন যাচাইয়ের জন্য।",
      },
      {
        title: "লেভেল ১ ক্লাসে যোগ দিন",
        description:
          "আপনার উচ্চারণ সঠিক হলে আপনাকে Level 1 Chinese Class-এ যুক্ত করা হবে।",
      },
    ],

    finalTitle: "যাচাইয়ের পর",

    finalDescription:
      "আমাদের মডারেটররা আপনার উচ্চারণ যাচাই করবেন। অনুমোদন পেলেই আপনাকে Level 1 Chinese Class-এ যুক্ত করা হবে।",

    learnButton: "পিনইন শিখুন",

    submitButton: "ভয়েস জমা দিন",
  
},
};

export default bn;