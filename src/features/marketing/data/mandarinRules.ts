// data/mandarinRules.ts

export type Category = 
  | "overview" 
  | "schedule" 
  | "chain_system" 
  | "rules" 
  | "commitment";

export type RuleSeverity = "strict" | "moderate" | "informative";

export interface Rule {
  id: string;
  category: Category;
  icon: string;
  priority: number;
  severity: RuleSeverity;
  isHighlighted: boolean;
  title: {
    bn: string;
    en: string;
  };
  description: {
    bn: string;
    en: string;
  };
  tag: {
    bn: string;
    en: string;
  };
  details?: {
    bn: string[];
    en: string[];
  };
  action?: {
    label: {
      bn: string;
      en: string;
    };
    link: string;
    type: "external" | "internal";
  };
}

export interface CategoryGroup {
  id: Category | "all";
  label: {
    bn: string;
    en: string;
  };
  icon: string;
}

export const categoryGroups: CategoryGroup[] = [
  { id: "all", label: { bn: "সবগুলো", en: "All" }, icon: "LayoutGrid" },
  { id: "overview", label: { bn: "পরিচিতি", en: "Overview" }, icon: "Compass" },
  { id: "schedule", label: { bn: "ক্লাস রুটিন", en: "Schedule" }, icon: "CalendarClock" },
  { id: "chain_system", label: { bn: "চেইন সিস্টেম", en: "Chain System" }, icon: "Network" },
  { id: "rules", label: { bn: "কঠোর নিয়ম", en: "Strict Rules" }, icon: "Shield" },
  { id: "commitment", label: { bn: "যোগদান ও লাভ", en: "Commitment" }, icon: "Star" },
];

export const rulesData: Rule[] = [
  {
    id: "r001",
    category: "overview",
    icon: "GraduationCap",
    priority: 1,
    severity: "informative",
    isHighlighted: true,
    title: {
      bn: "সম্পূর্ণ বিনামূল্যে চাইনিজ ভাষা শিক্ষা",
      en: "100% Free Chinese Language Education"
    },
    description: {
      bn: "সবার জন্য চীনা ভাষা শেখার পথ সহজ, উন্মুক্ত ও কার্যকর করতে আমাদের কমিউনিটিতে স্বাগতম।",
      en: "Welcome to our community, making Chinese language learning accessible, open, and effective for everyone."
    },
    tag: { bn: "স্বাগতম", en: "Welcome" },
    details: {
      bn: ["কোনো প্রকার আর্থিক খরচ নেই", "সকল স্তরের শিক্ষার্থীদের জন্য উন্মুক্ত", "মানসম্মত শিক্ষা উপকরণ সরবরাহ"],
      en: ["No financial costs involved", "Open for all levels of learners", "High-quality educational materials provided"]
    }
  },
  {
    id: "r002",
    category: "overview",
    icon: "Target",
    priority: 2,
    severity: "informative",
    isHighlighted: true,
    title: {
      bn: "চেইন সিস্টেমের মাধ্যমে সম্মিলিত শিক্ষা",
      en: "Collaborative Learning via Chain System"
    },
    description: {
      bn: "এখানে কেবল একমুখী পড়াশোনা নয়, বরং একটি স্বয়ংক্রিয় চেইন সিস্টেমের মাধ্যমে সবাই একসাথে শিখবে।",
      en: "Not just one-way learning, but an automated chain system where everyone learns together."
    },
    tag: { bn: "দর্শন", en: "Philosophy" }
  },
  {
    id: "r003",
    category: "schedule",
    icon: "Calendar",
    priority: 3,
    severity: "moderate",
    isHighlighted: false,
    title: {
      bn: "নতুন ব্যাচ শুরুর সময়সূচী",
      en: "New Batch Start Schedule"
    },
    description: {
      bn: "প্রতি মাসের প্রথম শনিবার থেকে নিয়মিত নতুন ব্যাচের ক্লাস শুরু হয়।",
      en: "New batches start on the first Saturday of every month."
    },
    tag: { bn: "ব্যাচ শুরু", en: "Batch Start" }
  },
  {
    id: "r004",
    category: "schedule",
    icon: "BookOpen",
    priority: 4,
    severity: "moderate",
    isHighlighted: false,
    title: {
      bn: "৩ সপ্তাহের সম্পূর্ণ স্টাডি প্ল্যান",
      en: "3-Week Comprehensive Study Plan"
    },
    description: {
      bn: "HSK 1 ও HSK 2-এর প্রতিটি বইয়ের ১৫টি লেসন মাত্র ৩ সপ্তাহে সম্পন্ন করা হয়।",
      en: "All 15 lessons of HSK 1 and HSK 2 are completed in just 3 weeks."
    },
    tag: { bn: "কারিকুলাম", en: "Curriculum" },
    details: {
      bn: ["প্রতিদিন ১টি লেসন", "সপ্তাহে ৫টি লেসন", "ইনটেনসিভ লার্নিং মেথড"],
      en: ["1 lesson per day", "5 lessons per week", "Intensive learning method"]
    }
  },
  {
    id: "r005",
    category: "schedule",
    icon: "Clock",
    priority: 5,
    severity: "moderate",
    isHighlighted: false,
    title: {
      bn: "সাপ্তাহিক ক্লাসের দিনসমূহ",
      en: "Weekly Class Days"
    },
    description: {
      bn: "শনিবার থেকে বুধবার প্রতিদিন ১টি করে লেসন (সপ্তাহে ৫টি লেসন)।",
      en: "Saturday to Wednesday, 1 lesson daily (5 lessons per week)."
    },
    tag: { bn: "ক্লাসের দিন", en: "Class Days" }
  },
  {
    id: "r006",
    category: "schedule",
    icon: "FileCheck",
    priority: 6,
    severity: "strict",
    isHighlighted: false,
    title: {
      bn: "সাপ্তাহিক মূল্যায়ন পরীক্ষা",
      en: "Weekly Assessment Exam"
    },
    description: {
      bn: "প্রতি বৃহস্পতিবার পুরো সপ্তাহের পড়ার মূল্যায়নের জন্য বাধ্যতামূলক পরীক্ষা।",
      en: "Mandatory weekly exam every Thursday to evaluate progress."
    },
    tag: { bn: "পরীক্ষা", en: "Exam" }
  },
  {
    id: "r007",
    category: "schedule",
    icon: "Coffee",
    priority: 7,
    severity: "informative",
    isHighlighted: false,
    title: {
      bn: "সাপ্তাহিক ছুটি",
      en: "Weekly Holiday"
    },
    description: {
      bn: "প্রতি শুক্রবার বিশ্রাম ও রিভিশনের জন্য ছুটি।",
      en: "Every Friday is a holiday for rest and revision."
    },
    tag: { bn: "ছুটি", en: "Holiday" }
  },
  {
    id: "r008",
    category: "schedule",
    icon: "Headphones",
    priority: 8,
    severity: "moderate",
    isHighlighted: false,
    title: {
      bn: "স্পিকিং ও লিসেনিং প্র্যাকটিস",
      en: "Speaking & Listening Practice"
    },
    description: {
      bn: "৩ সপ্তাহ শেষে মাসের বাকি দিনগুলোতে লিসেনিং ও স্পিকিং অনুশীলন।",
      en: "Remaining days of the month dedicated to listening & speaking practice after 3 weeks."
    },
    tag: { bn: "অনুশীলন", en: "Practice" }
  },
  {
    id: "r009",
    category: "chain_system",
    icon: "Users",
    priority: 9,
    severity: "moderate",
    isHighlighted: true,
    title: {
      bn: "প্রথম মাস: শিক্ষার্থী হিসেবে নতুন স্তর",
      en: "Month 1: Learn as a Student"
    },
    description: {
      bn: "প্রথম মাসে শিক্ষার্থীরা মেন্টরদের গাইডলাইনে নতুন লেভেল সম্পন্ন করবেন।",
      en: "In the first month, students complete new levels under mentor guidance."
    },
    tag: { bn: "শিক্ষার্থী", en: "Student" },
    details: {
      bn: ["HSK 1, 2 বা 3 লেভেল", "মেন্টরের সরাসরি গাইডলাইন", "প্রতিদিনের অনুশীলন ও অ্যাসাইনমেন্ট"],
      en: ["HSK 1, 2 or 3 level", "Direct mentor guidance", "Daily practice and assignments"]
    }
  },
  {
    id: "r010",
    category: "chain_system",
    icon: "Award",
    priority: 10,
    severity: "moderate",
    isHighlighted: true,
    title: {
      bn: "দ্বিতীয় মাস: শিক্ষক/মেন্টর হিসেবে দায়িত্ব",
      en: "Month 2: Serve as a Mentor"
    },
    description: {
      bn: "সফল শিক্ষার্থীরা পরবর্তী লেভেলে উঠে নতুনদের মেন্টরিং করবেন।",
      en: "Graduates advance to the next level while mentoring new students."
    },
    tag: { bn: "মেন্টরশিপ", en: "Mentorship" }
  },
  {
    id: "r011",
    category: "chain_system",
    icon: "Repeat",
    priority: 11,
    severity: "informative",
    isHighlighted: false,
    title: {
      bn: "চেইনের ধারাবাহিকতা",
      en: "Chain Continuity"
    },
    description: {
      bn: "আজকের শিক্ষার্থী, আগামী দিনের শিক্ষক—এই নীতিতে চেইন চলতে থাকবে।",
      en: "Today's student, tomorrow's teacher—the chain continues."
    },
    tag: { bn: "ধারাবাহিকতা", en: "Continuity" }
  },
  {
    id: "r012",
    category: "rules",
    icon: "Flame",
    priority: 12,
    severity: "strict",
    isHighlighted: false,
    title: {
      bn: "কঠোর নিয়ম ও ডেডিকেশন সতর্কতা",
      en: "Strict Rules & Dedication Warning"
    },
    description: {
      bn: "এই স্কোয়াড শুধুমাত্র অত্যন্ত আগ্রহী, সিরিয়াস ও ডেডিকেটেড শিক্ষার্থীদের জন্য।",
      en: "This squad is only for highly passionate, serious, and dedicated students."
    },
    tag: { bn: "সতর্কতা", en: "Warning" }
  },
  {
    id: "r013",
    category: "rules",
    icon: "Clock3",
    priority: 13,
    severity: "strict",
    isHighlighted: false,
    title: {
      bn: "ব্যাচ টাইম ও ক্লাসের সময়",
      en: "Batch Time & Class Schedule"
    },
    description: {
      bn: "লাইভ ক্লাস প্রতিদিন সন্ধ্যা ৭:০০ টা অথবা রাত ৯:০০ টায়।",
      en: "Live classes daily at either 7:00 PM or 9:00 PM."
    },
    tag: { bn: "ক্লাস টাইম", en: "Class Time" }
  },
  {
    id: "r014",
    category: "rules",
    icon: "Timer",
    priority: 14,
    severity: "strict",
    isHighlighted: true,
    title: {
      bn: "জয়েনিং টাইম লিমিট (১০ মিনিট)",
      en: "10-Minute Joining Limit"
    },
    description: {
      bn: "৭:০০ টার ক্লাসে ৭:১০ এবং ৯:০০ টার ক্লাসে ৯:১০ এর মধ্যে জয়েন করতে হবে।",
      en: "Must join by 7:10 PM for 7:00 PM batch and 9:10 PM for 9:00 PM batch."
    },
    tag: { bn: "সময়সীমা", en: "Deadline" }
  },
  {
    id: "r015",
    category: "rules",
    icon: "DoorClosed",
    priority: 15,
    severity: "strict",
    isHighlighted: false,
    title: {
      bn: "লেট এন্ট্রি নিষেধাজ্ঞা",
      en: "Late Entry Restriction"
    },
    description: {
      bn: "১০ মিনিট পর ক্লাসে প্রবেশাধিকার থাকবে না এবং অনুপস্থিত হিসেবে গণ্য হবে।",
      en: "No entry after 10 minutes; will be marked as absent."
    },
    tag: { bn: "প্রবেশ নিষেধ", en: "No Entry" }
  },
  {
    id: "r016",
    category: "rules",
    icon: "CheckCircle2",
    priority: 16,
    severity: "strict",
    isHighlighted: false,
    title: {
      bn: "১০০% লাইভ ক্লাসে উপস্থিতি",
      en: "100% Live Class Attendance"
    },
    description: {
      bn: "চীনা ভাষা দ্রুত আয়ত্তের জন্য নিয়মিত ও সময়মতো উপস্থিতি বাধ্যতামূলক।",
      en: "Regular and timely attendance is mandatory for fast language acquisition."
    },
    tag: { bn: "উপস্থিতি", en: "Attendance" }
  },
  {
    id: "r017",
    category: "rules",
    icon: "AlertOctagon",
    priority: 17,
    severity: "strict",
    isHighlighted: false,
    title: {
      bn: "অনুমতিহীন অনুপস্থিতি ও জরিমানা",
      en: "Unexcused Absence & Fine"
    },
    description: {
      bn: "অনুমতি ছাড়া অনুপস্থিত থাকলে ৳৫০ জরিমানা প্রযোজ্য।",
      en: "Unexcused absence will incur a fine of ৳50."
    },
    tag: { bn: "জরিমানা", en: "Fine" }
  },
  {
    id: "r018",
    category: "rules",
    icon: "FileEdit",
    priority: 18,
    severity: "moderate",
    isHighlighted: false,
    title: {
      bn: "হোমওয়ার্ক ছাড়ের সুযোগ",
      en: "Homework Fine Concession"
    },
    description: {
      bn: "অনুপস্থিত থাকলেও সময়মতো হোমওয়ার্ক জমা দিলে জরিমানা কমে ৳২৫ হবে।",
      en: "Submitting homework on time during absence reduces fine to ৳25."
    },
    tag: { bn: "ছাড়", en: "Concession" }
  },
  {
    id: "r019",
    category: "rules",
    icon: "UserX",
    priority: 19,
    severity: "strict",
    isHighlighted: true,
    title: {
      bn: "গ্রুপ থেকে সরাসরি বহিষ্কার",
      en: "Immediate Squad Dismissal"
    },
    description: {
      bn: "পরপর অনুপস্থিতি বা শৃঙ্খলা ভঙ্গ করলে নোটিশ ছাড়াই বহিষ্কার।",
      en: "Consecutive absences or rule violations will result in immediate dismissal."
    },
    tag: { bn: "বহিষ্কার", en: "Dismissal" }
  },
  {
    id: "r020",
    category: "commitment",
    icon: "Zap",
    priority: 20,
    severity: "informative",
    isHighlighted: false,
    title: {
      bn: "বিনা খরচে প্রিমিয়াম কোয়ালিটি",
      en: "Premium Quality at Zero Cost"
    },
    description: {
      bn: "কোনো আর্থিক খরচ ছাড়াই মানসম্মত চাইনিজ ভাষা শিক্ষা।",
      en: "High-quality Chinese language education without any financial cost."
    },
    tag: { bn: "ফ্রি", en: "Free" }
  },
  {
    id: "r021",
    category: "commitment",
    icon: "TrendingUp",
    priority: 21,
    severity: "informative",
    isHighlighted: false,
    title: {
      bn: "আত্মবিশ্বাস ও ধারাবাহিক অগ্রগতি",
      en: "Confidence & Consistent Progress"
    },
    description: {
      bn: "প্রতিদিনের প্র্যাকটিস ও সাপ্তাহিক পরীক্ষায় আত্মবিশ্বাস বৃদ্ধি।",
      en: "Grow confidence through daily practice and weekly exams."
    },
    tag: { bn: "অগ্রগতি", en: "Progress" }
  },
  {
    id: "r022",
    category: "commitment",
    icon: "Sparkles",
    priority: 22,
    severity: "informative",
    isHighlighted: false,
    title: {
      bn: "শেখানোর মাধ্যমে শতভাগ দক্ষতা",
      en: "Mastery Through Teaching"
    },
    description: {
      bn: "অন্যকে শেখানোর মাধ্যমে নিজের জ্ঞানকে নিখুঁত দক্ষতায় রূপান্তর।",
      en: "Transform knowledge into perfect skills by teaching others."
    },
    tag: { bn: "দক্ষতা", en: "Mastery" }
  },
  {
    id: "r023",
    category: "commitment",
    icon: "ShieldCheck",
    priority: 23,
    severity: "moderate",
    isHighlighted: true,
    title: {
      bn: "সম্মতি ও স্কোয়াডে যোগদান",
      en: "Consent & Squad Onboarding"
    },
    description: {
      bn: "সকল নিয়ম মেনে ক্লাস করতে প্রস্তুত থাকলে সম্মতি নিশ্চিত করে যোগ দিন।",
      en: "Confirm your consent and join the squad if ready to follow all rules."
    },
    tag: { bn: "যোগদান", en: "Join" },
    action: {
      label: { bn: "যোগাযোগ করুন", en: "Contact Now" },
      link: "https://wa.me/8801787881334",
      type: "external"
    }
  }
];

