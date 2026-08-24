"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

type FAQItem = {
  question: string;
  answer: React.ReactNode;
};

export const faq = {
  en: {
    badge: "FAQs",

    title: {
      first: "Frequently Asked",
      highlight: "Questions",
    },

    subtitle:
      "Here are some common questions about our Chinese learning community. If you need more help, feel free to contact our support team.",

    items: [
      {
        question: "How can I join the Chinese Learning Community?",
        answer: (
          <>
            Click the <strong>Join Community</strong> button on the website.
            You'll be redirected to our WhatsApp community where you can join as
            a member.
          </>
        ),
      },
      {
        question: "Do I need any previous Chinese language knowledge?",
        answer:
          "No. This course is designed for complete beginners. You can start learning Chinese from zero.",
      },
      {
        question: "Where can I watch the Pinyin lessons?",
        answer: (
          <>
            All Pinyin lessons are available in our{" "}
            <Link
              href="https://drive.google.com/drive/folders/12fEKjDBRU5NgnpgE4WluoRMer94LIkaQ"
              target="_blank"
              className="font-semibold text-primary hover:underline"
            >
              Google Drive
            </Link>
            .
          </>
        ),
      },
      {
        question: "How do I submit my Pinyin pronunciation practice?",
        answer: (
          <>
            Record your pronunciation and send it as a voice message in our{" "}
            <a
              href="https://chat.whatsapp.com/EBP79wEaAfAEvMtMee6HTY"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:underline"
            >
              WhatsApp Practice Group
            </a>
            .
          </>
        ),
      },
      {
        question: "Will I receive help if I face any problems?",
        answer:
          "Yes. Our teachers and community members are always ready to help you.",
      },
      {
        question: "Is the learning community free?",
        answer:
          "Yes. Joining our Chinese learning community is completely free.",
      },
      {
        question: "How can I improve faster?",
        answer:
          "Practice every day, complete your assignments, submit your voice recordings, and actively participate in community discussions.",
      },
    ] as FAQItem[],

    support: {
      title: "Still have questions?",
      highlight: "We're here to help!",
      description:
        "If you couldn't find the answer you're looking for, feel free to contact our support team.",
      button: "Contact Support",
      available: "Available: 10:00 AM - 10:00 PM",
    },
  },

  bn: {
    badge: "প্রশ্নোত্তর",

    title: {
      first: "সচরাচর",
      highlight: "জিজ্ঞাসিত প্রশ্ন",
    },

    subtitle:
      "আমাদের চীনা ভাষা শেখার কমিউনিটি সম্পর্কে সাধারণ কিছু প্রশ্নের উত্তর এখানে দেওয়া হয়েছে। আরও সাহায্যের প্রয়োজন হলে আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করুন।",

    items: [
      {
        question: "আমি কীভাবে চীনা ভাষা শেখার কমিউনিটিতে যোগ দিতে পারি?",
        answer: (
          <>
            ওয়েবসাইটের <strong>Join Community</strong> বাটনে ক্লিক করুন। এরপর
            আপনাকে আমাদের WhatsApp কমিউনিটিতে নিয়ে যাওয়া হবে, যেখানে আপনি
            সদস্য হতে পারবেন।
          </>
        ),
      },
      {
        question: "চীনা ভাষা শেখার জন্য আগে থেকে কিছু জানা কি প্রয়োজন?",
        answer:
          "না। আমাদের কোর্স সম্পূর্ণ নতুনদের জন্য তৈরি। আপনি একদম শুরু থেকেই শিখতে পারবেন।",
      },
      {
        question: "আমি Pinyin-এর ভিডিওগুলো কোথায় পাব?",
        answer: (
          <>
            সব Pinyin ভিডিও আমাদের{" "}
            <Link
              href="https://drive.google.com/drive/folders/12fEKjDBRU5NgnpgE4WluoRMer94LIkaQ"
              target="_blank"
              className="font-semibold text-primary hover:underline"
            >
              Google Drive
            </Link>{" "}
            থেকে দেখতে পারবেন।
          </>
        ),
      },
      {
        question: "Pinyin উচ্চারণের ভয়েস কীভাবে জমা দেব?",
        answer: (
          <>
            আপনার উচ্চারণ রেকর্ড করে আমাদের{" "}
            <a
              href="https://chat.whatsapp.com/EBP79wEaAfAEvMtMee6HTY"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:underline"
            >
              WhatsApp Practice Group
            </a>{" "}
            -এ ভয়েস মেসেজ হিসেবে পাঠিয়ে দিন।
          </>
        ),
      },
      {
        question: "পড়ার সময় কোনো সমস্যা হলে কি সাহায্য পাব?",
        answer:
          "অবশ্যই। আমাদের শিক্ষক ও কমিউনিটির সদস্যরা সবসময় সাহায্য করতে প্রস্তুত।",
      },
      {
        question: "কমিউনিটিতে যোগ দিতে কি কোনো ফি দিতে হবে?",
        answer: "না। আমাদের শেখার কমিউনিটিতে যোগদান সম্পূর্ণ বিনামূল্যে।",
      },
      {
        question: "কমিউনিটিতে কীভাবে দ্রুত উন্নতি করব?",
        answer:
          "প্রতিদিন অনুশীলন করুন, অ্যাসাইনমেন্ট সম্পন্ন করুন, নিয়মিত ভয়েস জমা দিন এবং আলোচনায় সক্রিয়ভাবে অংশ নিন।",
      },
    ] as FAQItem[],

    support: {
      title: "আরও কোনো প্রশ্ন আছে?",
      highlight: "আমরা সাহায্য করতে প্রস্তুত!",
      description:
        "আপনার প্রয়োজনীয় উত্তর না পেলে আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করুন।",
      button: "সাপোর্টে যোগাযোগ করুন",
      available: "সময়: সকাল ১০টা - রাত ১০টা",
    },
  },
};

export default function FAQ() {
  const { language } = useLanguage();
  const [open, setOpen] = useState<number | null>(0);

  const data = language === "bn" ? faq.bn : faq.en;

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-4 text-center">
          <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
            {data.badge}
          </span>

          <h2 className="mt-5 text-3xl font-bold text-text md:text-4xl">
            {data.title.first}{" "}
            <span className="text-primary">{data.title.highlight}</span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {data.subtitle}
          </p>
        </div>

        {/* FAQ */}
        <div className="space-y-3">
          {data.items.map((item, index) => {
            const isOpen = open === index;

            return (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-200"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition-colors hover:bg-primary/5"
                >
                  <h3 className="font-semibold text-text">{item.question}</h3>

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {isOpen ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-border px-5 pb-5 pt-4 leading-7 text-muted-foreground">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support */}
        <div className="mt-4 rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
          <h3 className="text-2xl font-bold text-text">
            {data.support.title}{" "}
            <span className="text-primary">{data.support.highlight}</span>
          </h3>

          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            {data.support.description}
          </p>

          <a
            href="https://wa.me/8801787881334"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:opacity-90"
          >
            {data.support.button}
          </a>

          <p className="mt-4 text-sm text-muted-foreground">
            {data.support.available}
          </p>
        </div>
      </div>
    </section>
  );
}
