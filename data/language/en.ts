import { hero } from "./components/hero";

const en = {
  nav: {
    home: "Home",
    pdf: "PDF",
    vocabulary: "Vocabulary",
    apps: "Apps",
    pinyin: "Pinyin",
    intro: "Intro",
    community: "Community",
  },

  home: {
    title: "Learn Chinese Easily",
    subtitle: "Start your Chinese learning journey."
  },

  buttons: {
    watchVideo: "Watch Video",
    joinWhatsapp: "Join WhatsApp"
  },
   hero: {
    ...hero,

    title: {
      line1: "Learn Chinese",
      line2: "From Beginner",
      line3: "to",
      hsk: "HSK 6",
      line4: "Completely",
      free: "Free",
      badge: "Live Class Available",
      edu:"Education Must Be Free",
    },

    description:
      "Join our active WhatsApp learning community where students learn Chinese every day.",

    buttons: {
      whatsapp: "Chinese Language Overview",
      resources: "Download The PDF",
    },

    links: {
      whatsapp:
        "https://chat.whatsapp.com/EBP79wEaAfAEvMtMee6HTY",
      resources: "/hsk-materials",
    },

    images: {
      teacher: "/assets/hero1.png",
      background: "/assets/hero3.png",
      teacherAlt: "Chinese teacher",
    },
    
  },
  roadmap: {
    badge: "Pinyin Submission Roadmap",

    title: "Complete These Steps Before Joining Level 1",

    description:
      "Read the Pinyin chart, record your pronunciation, submit it to our WhatsApp Practice Group, and wait for moderator verification.",

    imageAlt: "Chinese Pinyin Chart",

    imageNote:
      "Read every Pinyin in this chart before recording your voice.",

    stepLabel: "Step",

    steps: [
      {
        title: "Practice the Pinyin Chart",
        description:
          "Carefully read every Pinyin shown in the chart. Practice until you can pronounce them confidently.",
      },
      {
        title: "Record Your Voice",
        description:
          "Record your voice while reading the complete Pinyin chart clearly and naturally.",
      },
      {
        title: "Submit to WhatsApp",
        description:
          "Send your voice recording to our WhatsApp Practice Group for pronunciation review.",
      },
      {
        title: "Join Level 1",
        description:
          "Once your pronunciation is approved, you'll receive access to the Level 1 Chinese class.",
      },
    ],

    finalTitle: "After Verification",

    finalDescription:
      "Our moderators will review your pronunciation. Once approved, you'll be invited to the Level 1 Chinese course.",

    learnButton: "Learn Pinyin",

    submitButton: "Submit Voice Recording",
},
};

export default en;