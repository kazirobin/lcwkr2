"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Phone, MapPin, BookOpen, Send, Sparkles, AlertCircle, Clock, Calendar, ArrowRight, Globe } from "lucide-react";

const COUNTRY_CODES = [
  { code: "+880", country: "Bangladesh", flag: "🇧🇩", minDigits: 10 },
  { code: "+86", country: "China", flag: "🇨🇳", minDigits: 11 },
  { code: "+91", country: "India", flag: "🇮🇳", minDigits: 10 },
  { code: "+1", country: "USA / Canada", flag: "🇺🇸", minDigits: 10 },
];

export default function StudentRegistrationPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+880");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/academy/courses")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const comingSoon = data.courses.filter((c: any) => c.status === "Coming Soon");
          setCourses(comingSoon);
          if (comingSoon.length > 0) setSelectedCourseId(comingSoon[0].courseId);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    let clean = phone.replace(/\D/g, "");
    if (countryCode === "+880" && clean.startsWith("0")) clean = clean.slice(1);

    const fullPhone = `${countryCode}${clean}`;

    const res = await fetch("/api/academy/students/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nameEnglish: name.trim(),
        whatsapp: fullPhone,
        location: location.trim(),
        enrolledCourseId: selectedCourseId,
      }),
    });

    const result = await res.json();
    setSubmitting(false);

    if (result.success) {
      alert("Application submitted successfully! Please wait for Admin approval.");
      router.push("/academy");
    } else {
      alert(result.message || "Registration failed");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading portal...</div>;

  return (
    <div className="min-h-screen bg-background text-text py-10 px-4">
      <div className="max-w-xl mx-auto space-y-6">
        <Link href="/academy" className="text-xs text-text/50 hover:underline flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Academy Hub
        </Link>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" /> Scholar Admission
        </h1>

        {courses.length === 0 ? (
          <div className="p-8 border border-text/10 rounded-2xl text-center space-y-3 bg-text/5">
            <AlertCircle className="w-10 h-10 text-secondary mx-auto" />
            <h3 className="text-lg font-bold">All Batches Currently Running!</h3>
            <p className="text-xs text-text/60">No upcoming courses are open for admission at this moment.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-text/5 border border-text/10 space-y-4">
            <div>
              <label className="text-xs font-bold block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your English Name"
                className="w-full bg-background border border-text/10 rounded-xl p-3 text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold block mb-1">WhatsApp Number</label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="bg-background border border-text/10 rounded-xl px-3 py-3 text-xs font-bold"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                  ))}
                </select>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="WhatsApp Number"
                  className="w-full bg-background border border-text/10 rounded-xl p-3 text-sm focus:outline-none focus:border-primary font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold block mb-1">Location</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Dhanmondi, Dhaka"
                className="w-full bg-background border border-text/10 rounded-xl p-3 text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold block mb-1">Select Track</label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full bg-background border border-text/10 rounded-xl p-3 text-sm font-semibold"
              >
                {courses.map((c) => (
                  <option key={c.courseId} value={c.courseId}>
                    {c.courseId} - {c.courseName} (Coming Soon)
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-secondary hover:bg-secondary/90 text-white font-bold rounded-xl text-sm"
            >
              {submitting ? "Submitting Application..." : "Submit for Admission"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}