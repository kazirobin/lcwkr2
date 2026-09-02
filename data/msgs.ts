export type Snippet = {
  id: number;
  title: string;
  description: string;
  language: "tsx" | "ts" | "jsx" | "js" | "css" | "html";
  code: string;
};

export const snippets: Snippet[] = [
  {
    id: 1,
    title: "core word",
    description: "json",
    language: "tsx",
    code: `{
    character: "生",
    pinyin: "shēng",
    meaningEn: "to be born; life; student",
    meaningBn: "জন্ম নেওয়া; জীবন",
    hskLevel: 1,
    strokeCount: 5,
    relatedWords: [
      {
        word: "生日",
        pinyin: "shēngrì",
        meaningEn: "birthday",
        meaningBn: "জন্মদিন",
        wordType: "Noun",
        hskLevel: 2,
        examples: [
          {
            chinese: "祝你生日快乐！",
            pinyin: "Zhù nǐ shēngrì kuàilè!",
            meaningEn: "Happy birthday to you!",
            meaningBn: "শুভ জন্মদিন!",
          },
        ],
      },
      {
        word: "医生",
        pinyin: "yīshēng",
        meaningEn: "doctor",
        meaningBn: "ডাক্তার",
        wordType: "Noun",
        hskLevel: 1,
        examples: [],
      },
    ],
  },`,
  },
    {
    id: 2,
    title: "core prompt",
    description: " caracter",
    language: "tsx",
    code: `Act as an expert Chinese language teacher and full-stack developer data assistant. 

I will give you one or multiple Chinese Core Characters. For each character, generate a JavaScript/TypeScript data object exactly matching this schema:

{
  character: string,
  pinyin: string, // with tone marks (e.g., shēng)
  meaningEn: string,
  meaningBn: string, // Accurate Bengali meaning
  hskLevel: number, // (1 to 6)
  strokeCount: number,
  relatedWords: [
    {
      word: string, // Chinese compound word formed with the core character
      pinyin: string,
      meaningEn: string,
      meaningBn: string,
      wordType: string, // "Noun" | "Verb" | "Adjective" | "Phrase" etc.
      hskLevel: number,
      examples: [
        {
          chinese: string, // Natural, useful sentence
          pinyin: string,
          meaningEn: string,
          meaningBn: string
        }
      ]
    }
  ]
}

Strict Rules:
1. Provide 3 to 6 common/practical relatedWords for each core character.
2. Provide at least 1 or 2 high-quality example sentences with Pinyin, English, and Bangla translation for the main related words. Empty array `[]` is allowed for secondary words.
3. Accurate Bangla translation is mandatory for every meaning and sentence.
4. Output ONLY the valid JavaScript/JSON array or objects so I can copy-paste directly into my code. Do not include markdown introductions or chit-chat.

Here are the Core Characters:
[এখানে আপনার ক্যারেক্টারগুলো লিখুন, যেমন: 看, 说, 吃, 喝]`,
  },
{
    id: 3,
    title: "(5.00pm class)Chinese special for beginner",
    description: "Activity Form Link",
    language: "tsx",
    code: `https://forms.gle/AVheo7e3taQf362C9`,
  },
  {
    id: 4,
    title: "(Class 9.00pm daily) HSK 1-2 Primary",
    description: "Attendances Form Link",
    language: "tsx",
    code: `https://forms.gle/eF9ANkfetc37xmne6`,
  },
  {
    id: 5,
    title: "(Class 9.00pm daily) HSK 1-2 Primary",
    description: "Registration Form Link",
    language: "tsx",
    code: `https://forms.gle/S12miqZDiTDoFF4L6`,
  },
  {
    id: 6,
    title: "(Class 10.10pm daily)Hsk 3 Intermediate",
    description: "Attendances Form Link",
    language: "tsx",
    code: `https://forms.gle/Mimne7cTpheXVd1r8`,
  },

  {
    id: 7,
    title: "(Class 10.10pm daily)Hsk 3 Intermediate",
    description: "Registration Form Link",
    language: "tsx",
    code: `https://forms.gle/NPvhLaxmh6rQaurS6`,
  },

  {
    id: 8,
    title: "Quiz LCWKR",
    description: "Max width container",
    language: "tsx",
    code: `https://forms.gle/D47rbPPGH1A2v4bD6`,
  },
{
    id: 9,
    title: "Word List Prompt",
    description: "for get words list",
    language: "tsx",
    code: `আমাকে নিচের প্রতিটি শব্দের জন্য এই ফরম্যাটে তথ্য দাও:

1. **শব্দ** pinyin Meaning — character breakdown = meaning  
   Example: উদাহরণ বাক্য। Pinyin. English meaning.  
   Similar: সমার্থক শব্দ pinyin Meaning

শব্দগুলি হলো (পিনয়িনে):
tiānqì, zhèlǐ, tiān, xiàyǔ, le, yǔ, yǒudiǎnr, juéde, lěng`,
  },
{
    id: 10,
    title: "August 2026 New Members",
    description: "Registration Form Link",
    language: "tsx",
    code: `https://www.cognitoforms.com/KaziRobin1/NewMembersAugust2026`,
  },
  {
    id: 11,
    title: "August 2026 New Members",
    description: "Max width container",
    language: "tsx",
    code: `Learn Chinese with Kazi Robin-এ আপনাকে স্বাগতম! 🌸

উপরে যে ছবিটি দিয়েছি, সেখানে থাকা Chinese Initials & Finals-এর সবগুলো উচ্চারণ মনোযোগ দিয়ে শিখুন।

🎙️ এরপর সবগুলো একসাথে স্পষ্টভাবে উচ্চারণ করে একটি ভয়েস রেকর্ডিং করুন এবং এই ইনবক্সেই রিপ্লাই দিন।

যদি Initials & Finals-এর উচ্চারণ শিখতে কোনো সমস্যা হয়, তাহলে আমাদের ওয়েবসাইটে যান:
🌐 https://lcwkr.vercel.app/

ওয়েবসাইটে "Pinyin Course" নামে একটি বাটন পাবেন। সেখানে ক্লিক করলে একটি Google Drive লিংক পাবেন। সেই লিংকে আমরা উচ্চারণ শেখার জন্য কয়েকটি ভিডিও দিয়েছি। ভিডিওগুলো দেখে অনুশীলন করলে সঠিক উচ্চারণ শিখতে অনেক সহজ হবে।

📝 ভয়েস রেকর্ডিং পাঠানোর পর অনুগ্রহ করে নিচের New Members Form-টি সুন্দরভাবে পূরণ করুন:

New Members Form:
https://www.cognitoforms.com/KaziRobin1/NewMembersAugust2026

✅ আপনার ভয়েস রেকর্ডিং শুনে সবকিছু ঠিক থাকলে আপনাকে আমাদের WhatsApp গ্রুপে অ্যাড করে দেওয়া হবে। এরপর আপনার ভয়েসটি গ্রুপে আপনার নাম উল্লেখ করে শেয়ার করা হবে, যাতে আমাদের মেন্টররা আপনার উচ্চারণ যাচাই করে প্রয়োজনীয় পরামর্শ দিতে পারেন।

📚 এরপর থেকেই আপনি আমাদের HSK 1 ব্যাচে`,
  },


];