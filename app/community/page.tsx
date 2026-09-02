"use client";

import { Users, Award, MessageCircle, Clock, Sparkles } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { communityMembers, getCommunityStats } from "@/data/communityData";
import { CommunityMember } from "@/data/communityData";
import CommunityRules from "@/components/CommunityRules";

// ============================================
// TRANSLATIONS
// ============================================

const translations = {
  en: {
    badge: "Community Leaders",
    title: "Our Community",
    subtitle: "Leading our community with passion and dedication.",
    stats: {
      founder: "Founder",
      coAdmins: "Co-Admins",
      managers: "Managers",
      teachers: "Teachers",
    },
    roles: {
      founder: "Founder & Lead Admin",
      "co-admin": "Co-Admin",
      manager: "Manager",
      teacher: "Teacher",
    },
    manages: "Manages",
  },
  bn: {
    badge: "কমিউনিটি নেতৃত্ব",
    title: "আমাদের কমিউনিটি",
    subtitle: "ভালোবাসা ও আন্তরিকতার সাথে কমিউনিটি পরিচালনা করছি।",
    stats: {
      founder: "প্রতিষ্ঠাতা",
      coAdmins: "সহ-অ্যাডমিন",
      managers: "ম্যানেজার",
      teachers: "শিক্ষক",
    },
    roles: {
      founder: "প্রতিষ্ঠাতা ও প্রধান অ্যাডমিন",
      "co-admin": "সহকারী অ্যাডমিন",
      manager: "ম্যানেজার",
      teacher: "শিক্ষক",
    },
    manages: "ম্যানেজ করে",
  },
};

// Helper function to format WhatsApp number
const formatWhatsApp = (number: string) => {
  if (number.startsWith("880")) {
    return `+${number.slice(0, 4)} ${number.slice(4, 8)}-${number.slice(8)}`;
  }
  return number;
};

// ============================================
// MEMBER CARD COMPONENT - MODIFIED
// ============================================

interface MemberCardProps extends CommunityMember {
  roleLabel: string;
  manageLabel: string;
}

const MemberCard: React.FC<MemberCardProps> = ({
  name,
  role,
  image,
  whatsapp,
  job,
  schedule,
  subject,
  group,
  icon: Icon,
  roleLabel,
  manageLabel,
}) => {
  return (
    <div className="group rounded-xl border border-secondary bg-background p-5 transition-all hover:border-primary hover:shadow-lg hover:-translate-y-1">
      {/* Profile Image - TOP */}
      <div className="flex justify-center mb-3">
        <img
          src={image}
          alt={name}
          className="h-24 w-24 rounded-full border-2 border-secondary object-cover transition-all group-hover:border-primary"
        />
      </div>

      {/* Name - BELOW IMAGE */}
      <div className="text-center mb-1">
        <h4 className="text-lg font-semibold text-text">{name}</h4>
      </div>

      {/* Role Badge - BELOW NAME */}
      <div className="flex justify-center mb-4">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <Icon className="h-3.5 w-3.5" />
          {roleLabel}
        </span>
      </div>

      {/* Info Section */}
      <div className="text-center mb-3 min-h-10">
        {subject && (
          <>
            <p className="text-sm font-medium text-text">{subject}</p>
            {group && <p className="text-xs text-text/50">{group}</p>}
          </>
        )}
        {!subject && job && (
          <p className="text-sm text-text/70">
            {manageLabel}: {job}
          </p>
        )}
      </div>

      {/* Schedule */}
      {schedule && (
        <div className="flex items-center justify-center gap-2 text-xs text-text/50 mb-3">
          <Clock className="h-3 w-3" />
          <span>{schedule}</span>
        </div>
      )}

      {/* WhatsApp Card */}
      <a
        href={`https://wa.me/${whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-lg border border-primary/20 p-3 transition-all hover:border-primary hover:shadow-md"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg p-1.5 bg-primary/10">
              <MessageCircle className="h-3.5 w-3.5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-medium text-text">WhatsApp</p>
              <p className="text-[10px] text-text/50">
                {formatWhatsApp(whatsapp)}
              </p>
            </div>
          </div>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
            Active
          </span>
        </div>
      </a>
    </div>
  );
};

// ============================================
// MEMBERS GRID COMPONENT
// ============================================

interface MembersGridProps {
  members: CommunityMember[];
  title: string;
  subtitle: string;
  icon: any;
  roleType: CommunityMember["role"];
  translate: any;
}

const MembersGrid: React.FC<MembersGridProps> = ({
  members,
  title,
  subtitle,
  icon: Icon,
  roleType,
  translate,
}) => {
  if (members.length === 0) return null;

  return (
    <section className="border-t border-secondary bg-secondary/5 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg p-2 bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-text">{title}</h2>
            <p className="text-sm text-text/50">{subtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <MemberCard
              key={member.id}
              {...member}
              roleLabel={translate.roles[roleType] || roleType}
              manageLabel={translate.manages}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// STATS CARD COMPONENT
// ============================================

const StatsCard = ({ value, label }: { value: number; label: string }) => (
  <div className="rounded-xl border border-secondary bg-background p-4 text-center shadow-sm">
    <div className="text-2xl font-bold text-primary">{value}</div>
    <div className="text-xs text-text/50">{label}</div>
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================

export default function CommunityPage() {
  const { language } = useLanguage();
  const lang = translations[language as "en" | "bn"] || translations.en;
  const stats = getCommunityStats();

  // Filter members by role
  const founders = communityMembers.filter((m) => m.role === "founder");
  const coAdmins = communityMembers.filter((m) => m.role === "co-admin");
  const managers = communityMembers.filter((m) => m.role === "manager");
  const teachers = communityMembers.filter((m) => m.role === "teacher");

  // Combine founders and co-admins for the top section
  const topMembers = [...founders, ...coAdmins];

  return (
    <div className="min-h-screen bg-background text-text">
      {/* Hero Banner */}
      <section className="relative -mt-16 overflow-hidden bg-primary pt-28 pb-16 sm:-mt-20 sm:pt-32 sm:pb-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 -left-4 h-72 w-72 rounded-full bg-background mix-blend-multiply blur-xl animate-pulse" />
          <div className="absolute bottom-0 -right-4 h-72 w-72 rounded-full bg-background/50 mix-blend-multiply blur-xl animate-pulse delay-1000" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-background/20 px-4 py-1.5 backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium text-background">
              {lang.badge}
            </span>
          </div>

          <h1 className="flex items-center justify-center gap-3 text-3xl font-extrabold tracking-tight text-background md:text-5xl">
            <Users className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14" />
            {lang.title}
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-base text-background/80 sm:text-lg">
            {lang.subtitle}
          </p>
        </div>
      </section>

      {/* Stats */}
      <div className="relative z-10 mx-auto max-w-7xl -mt-6 px-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatsCard value={stats.founder} label={lang.stats.founder} />
          <StatsCard value={stats.coAdmins} label={lang.stats.coAdmins} />
          <StatsCard value={stats.managers} label={lang.stats.managers} />
          <StatsCard value={stats.teachers} label={lang.stats.teachers} />
        </div>
      </div>

      {/* Founders & Co-Admins */}
      {topMembers.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {topMembers.map((member) => (
              <MemberCard
                key={member.id}
                {...member}
                roleLabel={lang.roles[member.role] || member.role}
                manageLabel={lang.manages}
              />
            ))}
          </div>
        </section>
      )}

      {/* Managers */}
      <MembersGrid
        members={managers}
        title="Management Team"
        subtitle="Working behind the scenes to keep everything organized."
        icon={Users}
        roleType="manager"
        translate={lang}
      />

      {/* Teachers */}
      <MembersGrid
        members={teachers}
        title="Our Teachers"
        subtitle="Experienced mentors who guide your learning journey."
        icon={Award}
        roleType="teacher"
        translate={lang}
      />
      <CommunityRules/>
    </div>
  );
}
