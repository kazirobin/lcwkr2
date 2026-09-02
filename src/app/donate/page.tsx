"use client";

import { useState } from "react";
import { Heart, Send, PhoneCall, MapPin, User, CheckCircle2 } from "lucide-react";

interface Donor {
  name: string;
  phone: string;
  location: string;
  trxId: string;
  amount: number;
}

export default function DonatePage() {
  const [donors, setDonors] = useState<Donor[]>([
    { name: "Thakurdash Chandra Ray", phone: "017******12", location: "Dhaka", trxId: "9K2L1M4P", amount: 200 },
   
  ]);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    trxId: "",
  });

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ১. নিজস্ব API-তে ডেটা পাঠানো
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, amount: 200 }),
      });

      if (!res.ok) throw new Error("Failed to submit donation");

      // ২. ফ্রন্টএন্ডে রিয়েল-টাইমে লিস্ট আপডেট
      const maskedPhone = formData.phone.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2");
      setDonors((prev) => [{ ...formData, phone: maskedPhone, amount: 200 }, ...prev]);

      // ৩. WhatsApp-এ স্বয়ংক্রিয় মেসেজ পাঠানোর লিঙ্ক তৈরি
      const adminWhatsApp = "8801787881334";
      const message = `🎉 *New Donation Received!*\n\n👤 *Name:* ${formData.name}\n📱 *Phone:* ${formData.phone}\n📍 *Location:* ${formData.location}\n💳 *TrxID:* ${formData.trxId}\n💰 *Amount:* 200 BDT\n\nThank you for supporting LCWKR!`;
      const encodedMsg = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${adminWhatsApp}?text=${encodedMsg}`;

      setStatusMsg("Donation information submitted successfully! Redirecting to WhatsApp...");
      
      // ফর্ম রিসেট
      setFormData({ name: "", phone: "", location: "", trxId: "" });

      // WhatsApp ট্যাবে ওপেন করা
      setTimeout(() => {
        window.open(whatsappUrl, "_blank");
      }, 1000);

    } catch (err) {
      console.error(err);
      setStatusMsg("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header & Impact Message */}
        <div className="text-center space-y-4 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="inline-flex items-center justify-center p-3 bg-red-100 rounded-full text-red-600 mb-2">
            <Heart className="w-8 h-8 fill-current" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800">
            Support Learn Chinese with Kazi Robin
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            আমাদের <span className="font-semibold text-slate-800">LCWKR</span> প্ল্যাটফর্মকে আরও উন্নত, সহজলভ্য এবং নতুন ফিচারে সমৃদ্ধ করতে আপনার সহযোগিতা অত্যন্ত মূল্যবান। আপনি যদি আমাদের উদ্যোগের সাথে থাকতে চান, তবে স্বেচ্ছায় <span className="font-bold text-red-600">২০০ টাকা</span> অনুদান দিয়ে প্ল্যাটফর্মের উন্নয়নে অংশ নিতে পারেন।
          </p>
          
          <div className="inline-block bg-pink-50 border border-pink-200 rounded-xl p-4 mt-4">
            <p className="text-sm font-medium text-pink-700">bKash Personal Number</p>
            <p className="text-2xl font-bold tracking-wider text-pink-600 select-all">
              01787881334
            </p>
            <p className="text-xs text-slate-500 mt-1">Send Money করার পর নিচের ফর্মে TrxID সাবমিট করুন।</p>
          </div>
        </div>

        {/* Donation Form */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Send className="w-5 h-5 text-indigo-600" />
            অনুদান তথ্য প্রদান করুন
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="যেমন: Kazi Robin"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">bKash Phone Number</label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="01XXXXXXXXX"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Your Location / City</label>
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                placeholder="যেমন: Dhaka"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">bKash TrxID</label>
              <input
                type="text"
                name="trxId"
                required
                value={formData.trxId}
                onChange={handleChange}
                placeholder="যেমন: 9K2L1M4P"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none uppercase"
              />
            </div>

            <div className="md:col-span-2 mt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition duration-200"
              >
                {loading ? "সাবমিট হচ্ছে..." : "কনফার্ম করুন (Confirm Donation)"}
              </button>
            </div>
          </form>

          {statusMsg && (
            <p className="mt-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4" /> {statusMsg}
            </p>
          )}
        </div>

        {/* Live Donors List */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500 fill-current" />
            সম্মানিত ডোনারদের তালিকা
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {donors.map((donor, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-2">
                <div className="flex items-center gap-2 text-slate-800 font-semibold">
                  <User className="w-4 h-4 text-slate-500" />
                  <span>{donor.name}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 text-sm">
                  <PhoneCall className="w-4 h-4 text-slate-400" />
                  <span>{donor.phone}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {donor.location}
                  </span>
                  <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    ৳{donor.amount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}