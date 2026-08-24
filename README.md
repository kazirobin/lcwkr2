This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.




 商店 shăngdiàn  衣服 yifu  件 jiàn 元 yuán 
怎么样 zěnmeyàng  贵 gui 穿 chuãn  女 nů  男 nán  那儿 nàr


// Lesson 2 - Text 2
export const lesson2Text2Data: VocabularyData = {
  lesson: 2,
  text: 2,
  vocabulary: [
    {
      hanzi: "不",
      pinyin: "bù",
      english: "No; not",
      bangla: "না",
      characters: [
        {
          hanzi: "不",
          pinyin: "bù",
          meaning: "Not/No"
        }
      ],
      example: {
        hanzi: "我不是老师。",
        pinyin: "Wǒ bú shì lǎoshī.",
        english: "I am not a teacher.",
        bangla: "আমি শিক্ষক নই।"
      },
      similar: [
        {
          hanzi: "没",
          pinyin: "méi",
          english: "Not (past actions/don't have)"
        }
      ]
    },
    {
      hanzi: "是",
      pinyin: "shì",
      english: "To be; yes",
      bangla: "হওয়া",
      characters: [
        {
          hanzi: "是",
          pinyin: "shì",
          meaning: "To be/Is/Are/Am"
        }
      ],
      example: {
        hanzi: "我是学生。",
        pinyin: "Wǒ shì xuéshēng.",
        english: "I am a student.",
        bangla: "আমি একজন ছাত্র।"
      },
      similar: [
        {
          hanzi: "对",
          pinyin: "duì",
          english: "Correct; right"
        }
      ]
    },
    {
      hanzi: "对不起",
      pinyin: "duìbuqǐ",
      english: "Sorry",
      bangla: "দুঃখিত",
      characters: [
        {
          hanzi: "对",
          pinyin: "duì",
          meaning: "Toward/Correct"
        },
        {
          hanzi: "不",
          pinyin: "bù",
          meaning: "Not"
        },
        {
          hanzi: "起",
          pinyin: "qǐ",
          meaning: "Rise"
        }
      ],
      example: {
        hanzi: "对不起，我迟到了。",
        pinyin: "Duìbuqǐ, wǒ chídào le.",
        english: "Sorry, I am late.",
        bangla: "দুঃখিত, আমি দেরি করে ফেলেছি।"
      },
      similar: [
        {
          hanzi: "抱歉",
          pinyin: "bàoqiàn",
          english: "Sorry; apologize"
        }
      ]
    },
    {
      hanzi: "没关系",
      pinyin: "méi guānxi",
      english: "It's okay; no problem",
      bangla: "কোনো সমস্যা নেই",
      characters: [
        {
          hanzi: "没",
          pinyin: "méi",
          meaning: "Not"
        },
        {
          hanzi: "关系",
          pinyin: "guānxi",
          meaning: "Relation/Matter"
        }
      ],
      example: {
        hanzi: "A: 对不起。B: 没关系。",
        pinyin: "A: Duìbuqǐ. B: Méi guānxi.",
        english: "A: Sorry. B: It's okay.",
        bangla: "A: দুঃখিত। B: কোনো সমস্যা নেই।"
      },
      similar: [
        {
          hanzi: "不要紧",
          pinyin: "bú yàojǐn",
          english: "No problem; it's all right"
        }
      ]
    },
    {
      hanzi: "没事",
      pinyin: "méi shì",
      english: "It's okay; nothing's wrong",
      bangla: "কিছু হয়নি",
      characters: [
        {
          hanzi: "没",
          pinyin: "méi",
          meaning: "Not"
        },
        {
          hanzi: "事",
          pinyin: "shì",
          meaning: "Matter/Problem"
        }
      ],
      example: {
        hanzi: "没事，别担心。",
        pinyin: "Méi shì, bié dānxīn.",
        english: "It's okay, don't worry.",
        bangla: "কিছু হয়নি, চিন্তা করো না।"
      },
      similar: [
        {
          hanzi: "没关系",
          pinyin: "méi guānxi",
          english: "It's okay; no problem"
        }
      ]
    }
  ]
};

// সব ডেটা একসাথে অ্যারেতে
export const vocabularyDataArray: VocabularyData[] = [
  lesson2Text2Data
];