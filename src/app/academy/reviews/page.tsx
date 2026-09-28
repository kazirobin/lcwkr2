"use client";

import { useState, useEffect, useCallback } from "react";
import { Check, MessageSquareQuote, RefreshCw, Send, Star } from "lucide-react";
import { useLanguage } from "@/i18n";
import { useAccount } from "@/features/student-auth";
import {
  Breadcrumb,
  Button,
  Card,
  IconButton,
  LoadingBlock,
  PageHeader,
  SectionHanzi,
  Field,
  TextArea,
  EmptyState,
  Eyebrow,
} from "@/components/ui";

type Review = {
  _id: string;
  name: string;
  mobile: string;
  location: string;
  message: string;
  rating: number;
  approved: boolean;
  createdAt: string;
};

export default function ReviewsPage() {
  const { language } = useLanguage();
  const { student: account } = useAccount();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  // A signed-in student has already told us who they are, so the three identity
  // boxes are filled in and locked rather than asked for again — asking somebody
  // to retype their own name and number is how a review ends up under the wrong
  // one. A visitor with no account fills them in as before.
  useEffect(() => {
    if (!account) return;
    queueMicrotask(() => {
      setName((v) => v || account.nameEnglish || "");
      setMobile((v) => v || account.whatsapp || "");
      setLocation((v) => v || account.location || "");
    });
  }, [account]);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/academy/reviews", { cache: "no-store" }).then((r) => r.json());
      if (res.success && Array.isArray(res.reviews)) setReviews(res.reviews);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  // Deferred through a microtask: fetchReviews sets state, and doing that
  // synchronously in the effect body is a cascading render. This is the pattern
  // the rest of the app uses.
  useEffect(() => {
    let alive = true;
    queueMicrotask(() => {
      if (alive) void fetchReviews();
    });
    return () => {
      alive = false;
    };
  }, [fetchReviews]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !message.trim()) {
      setError(t("নাম ও রিভিউ বাধ্যতামূলক।", "Name and review are required."));
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/academy/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, mobile, location, message, rating }),
      });
      const data = await res.json();
      if (data.success) {
        // The review is cleared so the next one starts from a blank page, but a
        // signed-in student's own details stay: they were never typed, so
        // wiping them would only make the next submit fail on a missing name.
        setMessage(""); setRating(5);
        if (!account) {
          setName(""); setMobile(""); setLocation("");
        }
        setDone(true);
        fetchReviews();
      } else {
        setError(data.error || t("জমা হয়নি।", "Failed to submit."));
      }
    } catch {
      setError(t("সমস্যা হয়েছে।", "Something went wrong."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative isolate mx-auto max-w-6xl px-4 pt-28 pb-20 sm:px-6 lg:px-8">
      <SectionHanzi char="评" className="-top-10 right-0" />

      <Breadcrumb
        items={[
          { label: t("হোম", "Home"), href: "/" },
          { label: t("একাডেমি", "Academy"), href: "/academy" },
          { label: t("রিভিউ", "Reviews") },
        ]}
      />

      <PageHeader
        className="mt-6"
        eyebrow={<Eyebrow seal="评" label={t("রিভিউ", "Reviews")} detail={`${reviews.length}`} />}
        title={t("আমাদের সম্পর্কে শিক্ষার্থীদের মতামত", "What learners say about us")}
        lede={t(
          "আপনার অভিজ্ঞতা শেয়ার করুন — অ্যাডমিন অনুমোদনের পর তা এখানে দেখা যাবে।",
          "Share your experience — once approved by an admin, it appears here.",
        )}
        actions={
          <IconButton
            label={t("রিফ্রেশ", "Refresh")}
            size="sm"
            spinning={loading}
            onClick={fetchReviews}
          >
            <RefreshCw className="h-4 w-4" />
          </IconButton>
        }
      />

      {/* Submit form */}
      <Card className="mt-8 p-6">
        <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-text/55">
          {t("আপনার রিভিউ দিন", "Write a review")}
        </h2>
        {done && (
          <p className="mt-3 flex items-center gap-2 rounded-xl border border-ok/30 bg-ok-surface px-4 py-2.5 text-sm font-medium text-ok">
            <Check className="h-4 w-4" />
            {t(
              "ধন্যবাদ! আপনার রিভিউ জমা হয়েছে — অ্যাডমিন অনুমোদনের পর প্রকাশিত হবে।",
              "Thank you! Your review was submitted and will be published after admin approval.",
            )}
          </p>
        )}
        <form onSubmit={submit} className="mt-4 space-y-4">
          {account ? (
            /* Signed in: the identity is already known, so it is shown rather
               than asked for, and cannot be edited into somebody else's. */
            <div className="rounded-xl border border-ok/30 bg-ok-surface px-4 py-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-ok/80">
                {t("আপনার অ্যাকাউন্ট থেকে", "From your account")}
              </p>
              <p className="mt-1 text-sm text-text/75">
                <span className="font-semibold text-text">{account.nameEnglish}</span>
                <span className="mx-2 text-text/30">·</span>
                <span className="font-mono tabular-nums">{account.whatsapp}</span>
                {account.location && (
                  <>
                    <span className="mx-2 text-text/30">·</span>
                    <span>{account.location}</span>
                  </>
                )}
              </p>
              <p className="mt-1.5 text-[11px] text-text/50">
                {t(
                  "শুধু রিভিউ লিখে পাঠান — নাম ও নম্বর আমরা নিজে থেকেই বসিয়ে দেব।",
                  "Just write the review — we fill in the name and number for you.",
                )}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label={t("নাম", "Name")} required value={name} onChange={(e) => setName(e.target.value)} />
              <Field label={t("মোবাইল", "Mobile")} value={mobile} onChange={(e) => setMobile(e.target.value)} />
              <Field label={t("অবস্থান", "Location")} value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
          )}
          <div>
            <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.12em] text-text/55">
              {t("রেটিং", "Rating")}
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  aria-label={`${n}`}
                  className={n <= rating ? "text-warn" : "text-text/25"}
                >
                  <Star className="h-5 w-5" fill={n <= rating ? "currentColor" : "none"} />
                </button>
              ))}
            </div>
          </div>
          <TextArea
            label={t("রিভিউ", "Review")}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          {error && <p className="text-xs font-medium text-danger">{error}</p>}
          <div className="flex justify-end">
            <Button type="submit" loading={busy} iconLeft={<Send className="h-4 w-4" />}>
              {t("জমা দিন", "Submit")}
            </Button>
          </div>
        </form>
      </Card>

      {/* Approved reviews */}
      <section className="mt-10">
        <Eyebrow seal="评" label={t("অনুমোদিত রিভিউ", "Approved reviews")} detail={`${reviews.length}`} />
        {loading ? (
          <div className="mt-4">
            <LoadingBlock label={t("রিভিউ লোড হচ্ছে", "Loading reviews")} rows={2} />
          </div>
        ) : reviews.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title={t("এখনও কোনো রিভিউ নেই", "No reviews yet")}
              description={t("প্রথম রিভিউটি আপনিই লিখুন।", "Be the first to write one.")}
            />
          </div>
        ) : (
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r) => (
              <li key={r._id}>
                <Card className="flex h-full flex-col p-5">
                  <MessageSquareQuote className="h-5 w-5 text-text/30" aria-hidden="true" />
                  <div className="mt-2 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        className={n <= (r.rating || 0) ? "h-3.5 w-3.5 text-warn" : "h-3.5 w-3.5 text-text/15"}
                        fill={n <= (r.rating || 0) ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                  <p className="mt-3 flex-1 text-sm leading-6 text-text/80">{r.message}</p>
                  <div className="mt-4 border-t border-text/10 pt-3">
                    <p className="text-sm font-bold text-text">{r.name}</p>
                    <p className="text-xs text-text/45">
                      {[r.location, r.mobile].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}