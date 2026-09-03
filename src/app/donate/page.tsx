"use client";

import { useId, useRef, useState, useEffect } from "react";
import { Heart, Check, Copy, ArrowUpRight, Target } from "lucide-react";

import { useReveal } from "@/lib/useReveal";
import {
  seedDonors,
  DONATION,
  type Donor,
} from "@/features/marketing/data/donors";

const maskPhone = (phone: string) =>
  phone.replace(/^(\d{3})\d+(\d{2})$/, "$1******$2");

function NumberBlock() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(DONATION.bkashNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
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
      <label htmlFor={id} className="block text-sm font-medium text-text">
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
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    trxId: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(
    null
  );
  const [waLink, setWaLink] = useState("");
  const waRef = useRef<HTMLAnchorElement>(null);

  const formRef = useReveal<HTMLDivElement>();
  const rollRef = useReveal<HTMLDivElement>();

  const loadDonations = async () => {
    try {
      const res = await fetch("/api/donations", { cache: "no-store" });
      const data = await res.json();
      if (data.donations && data.donations.length > 0) {
        setDonors(data.donations);
      }
    } catch (e) {
      console.error("Failed to fetch donors:", e);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadDonations();
  }, []);

  const totalRaised = donors.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const remainingNeeded = Math.max(0, DONATION.targetGoal - totalRaised);
  const progressPercent = Math.min(
    100,
    Math.round((totalRaised / DONATION.targetGoal) * 100)
  );

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
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, amount: 200 }),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Failed to submit donation");

      setDonors((prev) => [
        resData.data || { ...formData, phone: maskPhone(formData.phone), amount: 200 },
        ...prev,
      ]);

      const message = `🎉 *New Donation Received!*\n\n👤 *Name:* ${formData.name}\n📱 *Phone:* ${formData.phone}\n📍 *Location:* ${formData.location}\n💳 *TrxID:* ${formData.trxId}\n💰 *Amount:* 200 BDT\n\nThank you for supporting LCWKR!`;
      const whatsappUrl = `https://wa.me/${DONATION.adminWhatsApp}?text=${encodeURIComponent(
        message
      )}`;
      setWaLink(whatsappUrl);

      setStatus({
        type: "success",
        msg: "Donation information submitted successfully! Redirecting to WhatsApp...",
      });

      setFormData({ name: "", phone: "", location: "", trxId: "" });
      window.open(whatsappUrl, "_blank", "noopener");
      requestAnimationFrame(() => waRef.current?.focus());
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setStatus({ type: "error", msg: message });
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
              প্ল্যাটফর্মকে সচল, ফ্রি এবং নতুন ফিচারে সমৃদ্ধ করতে
              স্বেচ্ছায়{" "}
              <span className="font-bold text-secondary">২০০ টাকা</span> অনুদান
              দিয়ে প্ল্যাটফর্মের উন্নয়নে অংশ নিতে পারেন।
            </p>

            {/* DYNAMIC PROGRESS / GOAL CARD */}
            <div className="mt-8 max-w-lg rounded-2xl border border-text/15 bg-card/60 p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-text/60">
                <span className="flex items-center gap-1.5">
                  <Target className="size-4 text-secondary" /> লক্ষ্যমাত্রা: ৳
                  {DONATION.targetGoal.toLocaleString()}
                </span>
                <span className="font-mono text-text">{progressPercent}% অর্জিত</span>
              </div>

              <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-text/10">
                <div
                  className="h-full rounded-full bg-secondary transition-all duration-700 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-text/10 pt-3 text-sm">
                <div>
                  <span className="text-xs text-text/50">মোট সংগৃহীত:</span>
                  <p className="font-mono text-lg font-bold text-ok">
                    ৳{totalRaised.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-text/50">আর প্রয়োজন:</span>
                  <p className="font-mono text-lg font-bold text-secondary">
                    {remainingNeeded === 0
                      ? "লক্ষ্য পূরণ হয়েছে! 🎉"
                      : `৳${remainingNeeded.toLocaleString()}`}
                  </p>
                </div>
              </div>
            </div>

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
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-text px-5 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-55 sm:w-auto"
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
                      className="inline-flex items-center gap-1 font-semibold text-text underline underline-offset-2"
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
            সম্মানিত ডোনারদের তালিকা ({donors.length} জন)
          </h2>

          <ul
            data-reveal
            style={{ "--r": 1 } as React.CSSProperties}
            className="mt-8 max-w-2xl border-t border-text/10"
          >
            {fetching ? (
              <li className="py-6 text-sm text-text/50">ডেটা লোড হচ্ছে...</li>
            ) : donors.length === 0 ? (
              <li className="py-6 text-sm text-text/50">
                এখনও কোনো ডোনেশন রেকর্ড পাওয়া যায়নি।
              </li>
            ) : (
              donors.map((donor, idx) => (
                <li
                  key={donor._id || `${donor.trxId}-${idx}`}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-text/10 py-4"
                >
                  <span className="text-[15px] font-medium text-text">
                    {donor.name}
                  </span>
                  <span className="font-mono text-sm tabular-nums text-text/55">
                    ৳{donor.amount}
                  </span>
                  <span className="w-full text-xs text-text/50">
                    {maskPhone(donor.phone)} · {donor.location}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}