"use client";

import { useState } from "react";

type Props = {
  title: string;
  description: string;
  language: string;
  code: string;
};

export default function MsgCard({
  title,
  description,
  language,
  code,
}: Props) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:shadow-lg">
      {/* Header */}
      <div className="border-b border-gray-200 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>

            <p className="mt-1 text-sm text-gray-500">{description}</p>
          </div>

          <span className="rounded-md bg-blue-100 px-3 py-1 text-xs font-semibold uppercase text-blue-700">
            {language}
          </span>
        </div>
      </div>

      {/* Code */}
      <div className="overflow-x-auto bg-gray-900">
        <pre className="p-5 text-sm leading-6 text-green-300">
          <code>{code}</code>
        </pre>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-5">
        <span className="text-sm text-gray-500">
          {code.split("\n").length} Lines
        </span>

        <button
          onClick={copyCode}
          className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition ${
            copied
              ? "bg-green-600"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {copied ? "✅ Copied!" : "📋 Copy Code"}
        </button>
      </div>
    </div>
  );
}