"use client";

import { useId, useRef, useState } from "react";
import { Heart, Check, Copy, ArrowUpRight } from "lucide-react";

import { useReveal } from "@/lib/useReveal";
import { donors as seedDonors, DONATION, type Donor } from "@/features/marketing/data/donors";

/**
 * `/donate` — the voluntary-support page.
 *
 * Rebuilt into the house sumi-e register (see `app/community/page.tsx`):
 * rice-paper hero, an oversized Hanzi per section, hairline-separated rows
 * rather than card grids, and the shared `.reveal-group` entrance. The copy,
 * the donor roll and the submit flow are carried over unchanged from the
 * original page; what changed is the visual treatment plus the form/status
 * accessibility (associated labels, `autocomplete`, an announced status
 * region, and a visible WhatsApp link rather than a silent popup).
 *
 * Backend concerns (`/api/donations` auth, real persistence, server-side
 * validation) are tracked separately and untouched here.
 */

const maskPhone = (phone: string) =>
  phone.replace(/^(\d{3})\d+(\d{2})$/, "$1******$2");

// ── the bKash number, with a copy control ──────────────────────────
function NumberBlock() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(DONATION.bkashNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — the number is still visible to type */
    }
  };

  return (
    <div className="mt-8 max-w-lg border border-text/15 bg-background px-4 py-3.5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text/50">
            bKash Personal Number
          </p>
          <p className="mt-1 font-mono text-xl tracking-[0.12em] text-text tabular-nums select-all">
            {DONATION.bkashNumber}
          </p>
        </div>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-2 rounded-xl border border-text/15 px-3.5 py-2 text-sm font-medium text-text transition-colors hover:border-text/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
        >
          {copied ? (
            <Check className="size-4 text-ok" aria-hidden="true" />
          ) : (
            <Copy className="size-4 text-text/50" aria-hidden="true" />
          )}
          <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <p className="mt-2 text-xs text-text/55">
        Send Money করার পর নিচের ফর্মে TrxID সাবমিট করুন।
      </p>
    </div>
  );
}

// ── field ──────────────────────────────────────────────────────────
function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  autoComplete,
  inputMode,
  uppercase,
}: {
  label: string;
  name: string;
  type?: "text" | "tel";
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "text" | "tel";
  uppercase?: boolean;
}) {
  const id = useId();
  const errId = `${id}-err`;

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-text"
      >
        {label}
        <span className="ml-0.5 text-secondary" aria-hidden="true">
          *
        </span>
      </label>
      <input
        id={id}
        name={name}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        required
        aria-required="true"
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? errId : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`mt-1.5 w-full border bg-background px-3.5 py-2.5 text-[15px] text-text transition-colors placeholder:text-text/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text ${
          uppercase ? "uppercase placeholder:normal-case" : ""
        } ${error ? "border-danger" : "border-text/20 focus-visible:border-text"}`}
      />
      {error && (
        <p id={errId} className="mt-1.5 text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export default function DonatePage() {
  const [donors, setDonors] = useState<Donor[]>(seedDonors);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    trxId: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(
    null,
  );
  const [waLink, setWaLink] = useState("");
  const waRef = useRef<HTMLAnchorElement>(null);

  const formRef = useReveal<HTMLDivElement>();
  const rollRef = useReveal<HTMLDivElement>();

  const setField = (k: keyof typeof formData) => (v: string) => {
    setFormData((prev) => ({ ...prev, [k]: v }));
    setErrors((prev) => ({ ...prev, [k]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.name.trim()) e.name = "Please enter your name.";
    if (!formData.phone.trim()) e.phone = "Please enter your bKash number.";
    if (!formData.location.trim()) e.location = "Please enter your city.";
    if (!formData.trxId.trim()) e.trxId = "Please enter the bKash TrxID.";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors);
      document
        .querySelector<HTMLInputElement>('form [aria-invalid="true"]')
        ?.focus();
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      // ১. নিজস্ব API-তে ডেটা পাঠানো
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, amount: 200 }),
      });

      if (!res.ok) throw new Error("Failed to submit donation");

      // ২. ফ্রন্টএন্ডে রিয়েল-টাইমে লিস্ট আপডেট
      setDonors((prev) => [
        { ...formData, phone: maskPhone(formData.phone), amount: 200 },
        ...prev,
      ]);

      // ৩. WhatsApp-এ স্বয়ংক্রিয় মেসেজ পাঠানোর লিঙ্ক তৈরি
      const message = `🎉 *New Donation Received!*\n\n👤 *Name:* ${formData.name}\n📱 *Phone:* ${formData.phone}\n📍 *Location:* ${formData.location}\n💳 *TrxID:* ${formData.trxId}\n💰 *Amount:* 200 BDT\n\nThank you for supporting LCWKR!`;
      const whatsappUrl = `https://wa.me/${DONATION.adminWhatsApp}?text=${encodeURIComponent(
        message,
      )}`;
      setWaLink(whatsappUrl);

      setStatus({
        type: "success",
        msg: "Donation information submitted successfully! Redirecting to WhatsApp...",
      });

      // ফর্ম রিসেট
      setFormData({ name: "", phone: "", location: "", trxId: "" });

      // WhatsApp ট্যাবে ওপেন করা — the visible link below is the fallback
      // when the browser blocks the programmatic open.
      window.open(whatsappUrl, "_blank", "noopener");
      requestAnimationFrame(() => waRef.current?.focus());
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        msg: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-text">
      {/* ============================ HERO ============================ */}
      <section className="relative isolate -mt-16 overflow-hidden bg-[#f8f3ea] in-[.dark]:bg-background sm:-mt-20">
        <span
          aria-hidden="true"
          lang="zh"
          className="pointer-events-none absolute -top-16 right-[4%] hidden select-none text-[22rem] leading-none font-bold text-text/[0.04] lg:block"
        >
          捐
        </span>

        <div className="relative z-10 mx-auto max-w-6xl px-4 pt-28 pb-16 sm:px-6 md:pt-32 md:pb-20 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex size-9 items-center justify-center rounded-full border border-secondary/30 text-secondary">
              <Heart className="size-4 fill-current" aria-hidden="true" />
            </span>

            <h1 className="mt-6 text-[2.4rem] leading-[1.12] font-bold tracking-tight sm:text-5xl">
              Support Learn Chinese with Kazi Robin
            </h1>

            <p className="mt-6 max-w-[54ch] text-base leading-[1.9] text-text/70 sm:text-lg">
              আমাদের <span className="font-semibold text-text">LCWKR</span>{" "}
              প্ল্যাটফর্মকে আরও উন্নত, সহজলভ্য এবং নতুন ফিচারে সমৃদ্ধ করতে আপনার
              সহযোগিতা অত্যন্ত মূল্যবান। আপনি যদি আমাদের উদ্যোগের সাথে থাকতে চান,
              তবে স্বেচ্ছায়{" "}
              <span className="font-bold text-secondary">২০০ টাকা</span> অনুদান
              দিয়ে প্ল্যাটফর্মের উন্নয়নে অংশ নিতে পারেন।
            </p>

            <NumberBlock />
          </div>
        </div>
      </section>

      {/* ============================ FORM ========================== */}
      <section className="border-t border-text/10 bg-background py-16 md:py-24">
        <div
          ref={formRef}
          className="reveal-group mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-2xl">
            <h2
              data-reveal
              className="text-3xl font-bold tracking-tight text-text sm:text-4xl"
            >
              অনুদান তথ্য প্রদান করুন
            </h2>

            <form
              onSubmit={handleSubmit}
              noValidate
              data-reveal
              style={{ "--r": 1 } as React.CSSProperties}
              className="mt-8"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Your Name"
                  name="name"
                  value={formData.name}
                  onChange={setField("name")}
                  error={errors.name}
                  placeholder="যেমন: Kazi Robin"
                  autoComplete="name"
                />
                <Field
                  label="bKash Phone Number"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  value={formData.phone}
                  onChange={setField("phone")}
                  error={errors.phone}
                  placeholder="01XXXXXXXXX"
                  autoComplete="tel"
                />
                <Field
                  label="Your Location / City"
                  name="location"
                  value={formData.location}
                  onChange={setField("location")}
                  error={errors.location}
                  placeholder="যেমন: Dhaka"
                  autoComplete="address-level2"
                />
                <Field
                  label="bKash TrxID"
                  name="trxId"
                  value={formData.trxId}
                  onChange={setField("trxId")}
                  error={errors.trxId}
                  placeholder="যেমন: 9K2L1M4P"
                  uppercase
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-text px-5 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text disabled:opacity-55 sm:w-auto"
              >
                {loading ? "সাবমিট হচ্ছে..." : "কনফার্ম করুন (Confirm Donation)"}
              </button>
            </form>

            <div aria-live="polite" className="mt-5 empty:mt-0">
              {status && (
                <div
                  role={status.type === "error" ? "alert" : "status"}
                  className={`flex flex-wrap items-center gap-x-2 gap-y-3 border px-4 py-3 text-sm ${
                    status.type === "error"
                      ? "border-danger/40 bg-danger-surface text-text"
                      : "border-ok/40 bg-ok-surface text-text"
                  }`}
                >
                  {status.type === "success" && (
                    <Check className="size-4 text-ok" aria-hidden="true" />
                  )}
                  <span>{status.msg}</span>
                  {status.type === "success" && waLink && (
                    <a
                      ref={waRef}
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-text underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
                    >
                      Open WhatsApp
                      <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ======================= DONOR HONOUR ROLL ================== */}
      <section className="border-t border-text/10 bg-background py-16 md:py-24">
        <div
          ref={rollRef}
          className="reveal-group mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"
        >
          <h2
            data-reveal
            className="flex items-center gap-2 text-3xl font-bold tracking-tight text-text sm:text-4xl"
          >
            <Heart
              className="size-6 shrink-0 fill-current text-secondary"
              aria-hidden="true"
            />
            সম্মানিত ডোনারদের তালিকা
          </h2>

          <ul
            data-reveal
            style={{ "--r": 1 } as React.CSSProperties}
            className="mt-8 max-w-2xl border-t border-text/10"
          >
            {donors.map((donor, idx) => (
              <li
                key={`${donor.trxId}-${idx}`}
                className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-text/10 py-4"
              >
                <span className="text-[15px] font-medium text-text">
                  {donor.name}
                </span>
                <span className="font-mono text-sm tabular-nums text-text/55">
                  ৳{donor.amount}
                </span>
                <span className="w-full text-xs text-text/50">
                  {donor.phone} · {donor.location}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
