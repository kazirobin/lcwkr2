"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, MessageSquare, RefreshCw } from "lucide-react";
import { ICourse } from "@/types/academy";
import { useLanguage } from "@/context/LanguageContext";
import {
  Breadcrumb,
  Button,
  Dialog,
  EmptyState,
  Eyebrow,
  Field,
  IconButton,
  LoadingBlock,
  PageHeader,
  SectionHanzi,
  SelectField,
  useToast,
} from "@/components/academy/ui";

const COUNTRY_CODES = [
  { code: "+880", country: "Bangladesh", flag: "🇧🇩" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+1", country: "USA / Canada", flag: "🇺🇸" },
];

const ADMIN_WHATSAPP = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || "+8801787881334";

type Registered = {
  nameEnglish: string;
  whatsapp: string;
  location: string;
  enrolledCourseId: string;
  rollNumber: string | number;
};

export default function StudentAdmissionPage() {
  const router = useRouter();
  const toast = useToast();
  const { language } = useLanguage();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );

  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+880");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [courseId, setCourseId] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const [registered, setRegistered] = useState<Registered | null>(null);

  const fetchCourses = useCallback(async () => {
    setLoadingCourses(true);
    try {
      const res = await fetch("/api/academy/courses", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.courses)) {
        const open = data.courses.filter(
          (c: ICourse) => c.status === "Coming Soon" || c.status === "Running",
        );
        setCourses(open);
        if (open.length > 0) setCourseId(open[0].courseId);
      }
    } catch {
      toast(t("কোর্স লোড করা যায়নি।", "Couldn't load courses."), "error");
    } finally {
      setLoadingCourses(false);
    }
  }, [t, toast]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = t("নাম লিখুন।", "Enter your full name.");
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 8) next.phone = t("সঠিক নম্বর দিন।", "Enter a valid number.");
    if (!location.trim()) next.location = t("অবস্থান লিখুন।", "Enter your location.");
    if (!courseId) next.courseId = t("একটি ট্র্যাক বেছে নিন।", "Choose a track.");
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    let clean = phone.replace(/\D/g, "");
    if (countryCode === "+880" && clean.startsWith("0")) clean = clean.slice(1);
    const payload = {
      nameEnglish: name.trim(),
      whatsapp: `${countryCode}${clean}`,
      location: location.trim(),
      enrolledCourseId: courseId,
    };

    try {
      const res = await fetch("/api/academy/students/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.success) {
        setRegistered({ ...payload, rollNumber: result.student?.rollNumber ?? "—" });
      } else {
        toast(result.message || t("আবেদন জমা হয়নি।", "Registration failed."), "error");
      }
    } catch {
      toast(t("সমস্যা হয়েছে, আবার চেষ্টা করুন।", "Something went wrong. Try again."), "error");
    } finally {
      setSubmitting(false);
    }
  };

  const sendJoinRequest = () => {
    if (!registered) return;
    const message =
      `*WhatsApp group join request*\n\n` +
      `Assalamu Alaikum / Nǐ hǎo Admin,\nI have registered and need to join the class group for the Google Meet links.\n\n` +
      `*Name:* ${registered.nameEnglish}\n*Roll:* ${registered.rollNumber}\n` +
      `*WhatsApp:* ${registered.whatsapp}\n*Location:* ${registered.location}\n` +
      `*Track:* ${registered.enrolledCourseId}\n\nPlease verify and add me.`;
    const num = ADMIN_WHATSAPP.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(message)}`, "_blank");
    router.push("/academy");
  };

  return (
    <div className="relative isolate mx-auto max-w-xl px-4 pt-28 pb-20 sm:px-6">
      <SectionHanzi char="报" className="-top-10 -right-4 text-[12rem]" />

      <Breadcrumb
        items={[
          { label: t("একাডেমি", "Academy"), href: "/academy" },
          { label: t("ভর্তি", "Admission") },
        ]}
      />

      <PageHeader
        className="mt-6"
        eyebrow={<Eyebrow seal="报" label={t("ভর্তি", "Admission")} />}
        title={t("শিক্ষার্থী ভর্তির আবেদন", "Apply for admission")}
        lede={t(
          "ফর্মটি পূরণ করুন — এরপর ক্লাসের হোয়াটসঅ্যাপ গ্রুপে যুক্ত হওয়ার জন্য অ্যাডমিনকে অনুরোধ পাঠাবেন।",
          "Fill this in, then send the admin a request to be added to the class WhatsApp group.",
        )}
        actions={
          <IconButton
            label={t("কোর্স রিফ্রেশ করুন", "Refresh courses")}
            size="sm"
            spinning={loadingCourses}
            onClick={fetchCourses}
          >
            <RefreshCw className="h-4 w-4" />
          </IconButton>
        }
      />

      <div className="mt-10">
        {loadingCourses ? (
          <LoadingBlock label={t("কোর্স লোড হচ্ছে", "Loading courses")} rows={1} />
        ) : courses.length === 0 ? (
          <EmptyState
            title={t("সব ব্যাচে ক্লাস চলছে", "All cohorts are running")}
            description={t(
              "এই মুহূর্তে নতুন ভর্তির জন্য কোনো ব্যাচ খোলা নেই। পরবর্তী ব্যাচের জন্য অপেক্ষা করুন।",
              "No cohort is open for new admission right now. Watch the hub for the next intake.",
            )}
          />
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-5 rounded-2xl border border-text/10 bg-card p-6 sm:p-7">
            <Field
              label={t("পূর্ণ নাম (ইংরেজিতে)", "Full name (English)")}
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={validate}
              error={errors.name}
              placeholder="Md Shazzad Hossain"
              autoComplete="name"
            />

            <div className="flex flex-col gap-1.5">
              <label htmlFor="wa-num" className="text-[13px] font-semibold text-text">
                {t("হোয়াটসঅ্যাপ নম্বর", "WhatsApp number")}
                <span className="ml-1 text-danger" aria-hidden="true">*</span>
              </label>
              <div className="flex gap-2">
                <label className="sr-only" htmlFor="wa-cc">
                  {t("দেশের কোড", "Country code")}
                </label>
                <select
                  id="wa-cc"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="rounded-xl border border-text/15 bg-card px-2.5 py-3 text-sm text-text focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
                <input
                  id="wa-num"
                  type="tel"
                  inputMode="numeric"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onBlur={validate}
                  aria-invalid={errors.phone ? true : undefined}
                  aria-describedby={errors.phone ? "wa-err" : undefined}
                  placeholder="1XXXXXXXXX"
                  className="w-full rounded-xl border border-text/15 bg-card px-3.5 py-3 text-sm tabular-nums text-text placeholder:text-text/40 focus:border-text/40 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text aria-invalid:border-danger"
                />
              </div>
              {errors.phone && (
                <p id="wa-err" role="alert" className="text-xs font-medium text-danger">
                  {errors.phone}
                </p>
              )}
            </div>

            <Field
              label={t("বর্তমান অবস্থান", "Current location")}
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onBlur={validate}
              error={errors.location}
              placeholder={t("ধানমন্ডি, ঢাকা", "Dhanmondi, Dhaka")}
            />

            <SelectField
              label={t("ট্র্যাক নির্বাচন করুন", "Choose a track")}
              required
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              error={errors.courseId}
            >
              {courses.map((c) => (
                <option key={c.courseId} value={c.courseId}>
                  {c.courseId} — {c.courseName}
                </option>
              ))}
            </SelectField>

            <Button type="submit" loading={submitting} className="w-full" iconRight={<ArrowRight className="h-4 w-4" />}>
              {submitting ? t("জমা হচ্ছে…", "Submitting…") : t("আবেদন জমা দিন", "Submit application")}
            </Button>
          </form>
        )}
      </div>

      <Dialog
        open={registered !== null}
        onClose={() => setRegistered(null)}
        title={t("গ্রুপে যুক্ত হোন", "Join the class group")}
        description={t(
          "গুগল মিট লিংক ও লেকচার শিট গ্রুপেই দেওয়া হয়। অ্যাডমিনকে ভেরিফিকেশন মেসেজ পাঠান।",
          "Meet links and lecture sheets go out in the group. Send the admin a verification message.",
        )}
        footer={
          <Button onClick={sendJoinRequest} iconLeft={<MessageSquare className="h-4 w-4" />}>
            {t("অ্যাডমিনকে অনুরোধ পাঠান", "Send request to admin")}
          </Button>
        }
      >
        {registered && (
          <dl className="space-y-2 rounded-xl border border-text/10 bg-text/3 p-4 text-sm">
            {[
              [t("নাম", "Name"), registered.nameEnglish],
              [t("রোল", "Roll"), `#${registered.rollNumber}`],
              [t("হোয়াটসঅ্যাপ", "WhatsApp"), registered.whatsapp],
              [t("ট্র্যাক", "Track"), registered.enrolledCourseId],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4">
                <dt className="text-text/50">{k}</dt>
                <dd className="font-semibold text-text">{v}</dd>
              </div>
            ))}
          </dl>
        )}
      </Dialog>
    </div>
  );
}
