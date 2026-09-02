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
  voice: {
    badge: "Before You Begin",

    title: "Listen to the Voice Instruction",

    description:
      "A short spoken briefing on how the Pinyin submission works. Play it all the way through before you start recording.",

    playerLabel: "Voice instruction audio",

    duration: "1 min 24 sec",

    playLabel: "Play voice instruction",

    pauseLabel: "Pause voice instruction",

    seekLabel: "Seek through voice instruction",

    muteLabel: "Mute",

    unmuteLabel: "Unmute",

    transcriptToggle: "Read the transcript",

    transcript:
      "[Transcript pending — replace this with the full spoken content of voice.m4a so the instruction is available to everyone.]",
  },

  roadmap: {
    badge: "Pinyin Submission Roadmap",

    title: "Complete These Steps Before Joining Level 1",

    description:
      "Read the Pinyin chart, record your pronunciation, submit it to our WhatsApp Practice Group, and wait for moderator verification.",

    sheetCaption:
      "Say each sound out loud, sitting it on the lines like a Pinyin copybook. Do not record until every one feels steady.",

    initialsLabel: "Initials",

    finalsLabel: "Finals",

    exampleLabel: "example word",

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

    submitButton: "Submit your recording",

    learnHref:
      "https://drive.google.com/drive/folders/12fEKjDBRU5NgnpgE4WluoRMer94LIkaQ",

    submitHref: "https://chat.whatsapp.com/EBP79wEaAfAEvMtMee6HTY",

    newTabHint: "opens in a new tab",
  },

  classRoutine: {
    badge: "Weekly rhythm",

    title: "Five live classes and a weekly exam",

    description:
      "Classes run six days a week on a fixed schedule, with one rest day. The exam every Thursday checks that week's work before you move on.",

    weekLabel: "The teaching week",

    days: [
      { short: "Sat", zh: "周六", note: "Live class", kind: "class" },
      { short: "Sun", zh: "周日", note: "Live class", kind: "class" },
      { short: "Mon", zh: "周一", note: "Live class", kind: "class" },
      { short: "Tue", zh: "周二", note: "Live class", kind: "class" },
      { short: "Wed", zh: "周三", note: "Live class", kind: "class" },
      { short: "Thu", zh: "周四", note: "Weekly exam", kind: "exam" },
      { short: "Fri", zh: "周五", note: "Rest day", kind: "rest" },
    ],

    attendanceNote: "Attendance is taken in every class.",

    examNote: "Thursday's exam covers everything from that week.",

    trackBadge: "The level track",

    trackTitle: "Pinyin first, then six levels, then HSK",

    trackDescription:
      "You move up one level at a time. Finish all six and you begin preparing for the HSK exam.",

    trackStartNote:
      "The track starts once your Pinyin pronunciation is approved.",

    levels: [
      { name: "Pinyin", zh: "拼音" },
      { name: "Level 1", zh: "一级" },
      { name: "Level 2", zh: "二级" },
      { name: "Level 3", zh: "三级" },
      { name: "Level 4", zh: "四级" },
      { name: "Level 5", zh: "五级" },
      { name: "Level 6", zh: "六级" },
      { name: "HSK prep", zh: "HSK" },
    ],

    pinyinHref: "#pinyin",

    pinyinLinkText: "See the Pinyin step",
  },

  intro: {
    hero: {
      seal: "门",
      eyebrow: "Start here",
      detail: "how the class works",
      titleLead: "Start learning Chinese from zero —",
      titleAccent: "free, in Bangla",
      lede: "This page walks through the whole thing: where beginners get stuck, how this class is set up to answer each part, and what you need to join. About two minutes to read.",
      ctaPrimary: { label: "See the first step", href: "/#pinyin" },
      ctaSecondary: {
        label: "Join the WhatsApp class",
        href: "https://chat.whatsapp.com/EBP79wEaAfAEvMtMee6HTY",
      },
      ctaText: { label: "Browse the courses", href: "/academy/courses" },
    },

    problem: {
      seal: "题",
      eyebrow: "Where beginners get stuck",
      title: "Learning Chinese alone usually stalls in the first month",
      description:
        "Not because it is too hard — because five specific things go unanswered when you are on your own.",
      items: [
        {
          title: "You do not know the order",
          body: "Pinyin, characters, tones, grammar, an app? Everything online assumes you already picked a starting point.",
        },
        {
          title: "Tones do not fix themselves",
          body: "You cannot hear what you are doing wrong, and no video can tell you your third tone is flat.",
        },
        {
          title: "The structured material costs money",
          body: "Paid courses have a path. The free material is scattered across a hundred videos with no order to follow.",
        },
        {
          title: "Motivation runs out",
          body: "With no schedule and no one expecting you, week two is where most people quietly stop.",
        },
        {
          title: "You cannot tell if you are improving",
          body: "No checkpoints, no feedback, no way to know whether you are ready for the next thing.",
        },
      ],
    },

    answer: {
      seal: "解",
      eyebrow: "How this class is built",
      title: "Each of those has a fixed answer here",
      description:
        "Not features — just how Kazi Robin has run the class from the start.",
      solvesLabel: "Answers",
      items: [
        {
          seal: "音",
          title: "A pronunciation gate before Level 1",
          body: "You read the Pinyin chart aloud, record it, and send it in. A mentor listens and checks it personally before you start — so everyone begins from the same clean base.",
          solves: "1 · 2",
        },
        {
          seal: "级",
          title: "One ordered track: Pinyin → six levels → HSK",
          body: "You always know the next step, because there is only one. No choosing, no guessing what to study.",
          solves: "1 · 5",
        },
        {
          seal: "课",
          title: "Live class six days a week, exam on Thursday",
          body: "A fixed routine with attendance every class. Thursday's exam checks the week before you move on.",
          solves: "4 · 5",
        },
        {
          seal: "群",
          title: "A practice group that answers back",
          body: "Send a voice note, get corrected by teachers and other students the same day. You are not doing this alone.",
          solves: "2 · 3",
        },
        {
          seal: "免",
          title: "Free — that is the whole point",
          body: "No fee for the classes, the community, or the notes. No one should fall behind on a language because of money.",
          solves: "3",
        },
      ],
      linkLead: "It all starts with the Pinyin step.",
      pinyinLink: { label: "Go to the Pinyin step", href: "/#pinyin" },
      routineLink: { label: "See the weekly routine", href: "/#routine" },
    },

    need: {
      seal: "备",
      eyebrow: "What you need to start",
      title: "Three things, nothing else",
      items: [
        {
          title: "A phone and internet",
          body: "The classes and the community both run on WhatsApp. No laptop required.",
        },
        {
          title: "About an hour a day",
          body: "One live class plus a little practice. Exam day asks for a bit more.",
        },
        {
          title: "Willingness to record your voice",
          body: "The Pinyin gate and the practice group both work by voice notes. This is the part people hesitate on — and the part that makes the tones click.",
        },
      ],
    },

    cta: {
      seal: "始",
      title: "Ready to start?",
      text: "Do the Pinyin step first. Once your pronunciation is approved, you are in Level 1.",
      primary: { label: "Start the Pinyin step", href: "/#pinyin" },
      secondary: {
        label: "Join the WhatsApp community",
        href: "https://chat.whatsapp.com/EBP79wEaAfAEvMtMee6HTY",
      },
    },
  },
};

export default en;