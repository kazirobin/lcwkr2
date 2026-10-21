"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import {
  Clock,
  Minimize2,
  Maximize2,
  X,
  CheckCircle2,
  Flame,
  Trophy,
  Target,
  TrendingUp,
  Sparkles,
  Zap,
} from "lucide-react";
import { useLanguage } from "@/i18n";
import { useAccount } from "@/features/student-auth";

type DashboardData = {
  totalSeconds: number;
  totalLogins: number;
  todaySeconds: number;
  dailyGoalSeconds: number;
  dailyGoalProgress: number;
  streak: number;
  weekly: { thisWeek: number; lastWeek: number; dailyAvg: number; goalDays: number };
  earnedMilestones: Array<{ id: string; label: { bn: string; en: string }; icon: string }>;
  nextMilestone: { id: string; label: { bn: string; en: string }; icon: string } | null;
};

type TimeSpentData = {
  logins: number;
  totalSeconds: number;
  firstLoginAt: string | null;
  activeLoginAt: string | null;
  onlineNow: boolean;
};

function humanTime(seconds: number): string {
  if (!seconds || seconds < 60) return seconds ? `${Math.round(seconds)}s` : "—";
  const m = Math.round(seconds / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem > 0 ? `${h}h ${rem}m` : `${h}h`;
}

function daysAgo(iso: string | null): string {
  if (!iso) return "—";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "—";
  const days = Math.floor((Date.now() - then) / 86400000);
  if (days <= 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

function formatStreakLabel(streak: number, t: (bn: string, en: string) => string): string {
  if (streak === 0) return t("স্ট্রিক শুরু করুন", "Start streak");
  if (streak === 1) return t("১ দিন স্ট্রিক!", "1 day streak!");
  return t(`${streak} দিন স্ট্রিক!`, `${streak} day streak!`);
}

function getMotivationalMessage(streak: number, todayProgress: number, t: (bn: string, en: string) => string): string {
  if (streak === 0) {
    return todayProgress === 0
      ? t("আজ প্রথম লগইন করুন স্ট্রিক শুরু করতে!", "Log in today to start your streak!")
      : t("চলুন আজ দিনটি পুরন করি!", "Let's complete today's goal!");
  }
  if (streak < 3) {
    return t("ভালো লাগছে! স্ট্রিক চালিয়ে যান!", "Great! Keep the streak going!");
  }
  if (streak < 7) {
    return t("অভিনন্দন! আপনি আগ্নেয় হয়ে যাচ্ছেন!", "Amazing! You're on fire!");
  }
  if (streak < 30) {
    return t("দারুণ! আপনি একজন ধারাবাহিক শিক্ষার্থী!", "Fantastic! You're a consistent learner!");
  }
  return t("লেজেন্ডারি! আপনি স্ট্রিক মাস্টার!", "Legendary! You're a streak master!");
}

function getProgressColor(progress: number): string {
  if (progress >= 100) return "text-ok";
  if (progress >= 75) return "text-primary";
  if (progress >= 50) return "text-warn";
  return "text-text";
}

export function TimeSpentNotification() {
  const { language } = useLanguage();
  const { student } = useAccount();
  const t = (bn: string, en: string) => (language === "bn" ? bn : en);

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [basicData, setBasicData] = useState<TimeSpentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [minimized, setMinimized] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [liveSeconds, setLiveSeconds] = useState(0);
  const [todayLiveSeconds, setTodayLiveSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Persist dismissed state in localStorage
  const dismissedKey = "time-spent-dismissed";

  useEffect(() => {
    const stored = localStorage.getItem(dismissedKey);
    if (stored === "true") {
      setDismissed(true);
    }
  }, []);

  const fetchDashboard = useCallback(async () => {
    if (!student?.whatsapp) return;
    try {
      const res = await fetch(`/api/student/dashboard?phone=${encodeURIComponent(student.whatsapp)}`, { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setDashboard(json);
          setTodayLiveSeconds(json.todaySeconds);
        }
      }
    } catch {
      // silent
    }
  }, [student?.whatsapp]);

  const fetchBasic = useCallback(async () => {
    if (!student?.whatsapp) return;
    try {
      const res = await fetch(`/api/student/time-spent?phone=${encodeURIComponent(student.whatsapp)}`, { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setBasicData(json);
          setLiveSeconds(json.totalSeconds);
          startTimeRef.current = Date.now();
        }
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [student?.whatsapp]);

  useEffect(() => {
    fetchDashboard();
    fetchBasic();
    // Refresh dashboard every 5 minutes, basic every 1 minute for live counter
    const dashInterval = setInterval(fetchDashboard, 5 * 60 * 1000);
    const basicInterval = setInterval(fetchBasic, 60 * 1000);
    return () => {
      clearInterval(dashInterval);
      clearInterval(basicInterval);
    };
  }, [fetchDashboard, fetchBasic]);

  // Live counter update every second when online
  useEffect(() => {
    if (basicData?.onlineNow) {
      intervalRef.current = setInterval(() => {
        setLiveSeconds((prev) => prev + 1);
        setTodayLiveSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [basicData?.onlineNow]);

  const dismiss = () => {
    setDismissed(true);
    localStorage.setItem(dismissedKey, "true");
  };

  const toggleMinimize = () => {
    setMinimized((prev) => !prev);
  };

  if (dismissed || loading || !basicData) return null;

  const totalTime = humanTime(liveSeconds);
  const todayTime = humanTime(todayLiveSeconds);
  const memberSince = basicData.firstLoginAt ? daysAgo(basicData.firstLoginAt) : "—";
  const streak = dashboard?.streak ?? 0;
  const todayProgress = dashboard?.dailyGoalProgress ?? 0;
  const motivationalMsg = useMemo(() => getMotivationalMessage(streak, todayProgress, t), [streak, todayProgress, t]);

  const streakIcon = streak >= 30 ? "🏆🔥" : streak >= 7 ? "🔥🔥" : streak >= 3 ? "🔥" : "🌱";

  return (
    <div
      className={`fixed bottom-4 right-4 z-[60] w-full max-w-sm transition-all duration-300 ${minimized ? "minimized" : ""}`}
    >
      {!minimized && (
        <div
          className="rounded-xl border border-text/15 bg-card shadow-[0_16px_40px_-12px_rgba(0,0,0,0.35)] overflow-hidden motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2"
        >
          <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-text/10">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Clock className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="font-semibold text-text">{t("এই সাইটে সময়", "Time on site")}</span>
              {basicData.onlineNow && (
                <span className="flex items-center gap-1 rounded-full bg-ok/15 px-2 py-0.5 text-[10px] font-semibold text-ok">
                  <span className="h-1.5 w-1.5 rounded-full bg-ok animate-pulse" aria-hidden="true" />
                  {t("অনলাইন", "Online")}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={toggleMinimize}
                aria-label={minimized ? t("বিস্তার করুন", "Expand") : t("ন্যূনতম করুন", "Minimize")}
                className="rounded p-1 text-text/40 hover:text-text hover:bg-text/5 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text"
              >
                <Minimize2 className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={dismiss}
                aria-label={t("বন্ধ করুন", "Close")}
                className="rounded p-1 text-text/40 hover:text-text hover:bg-text/5 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Streak & Daily Goal Row */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 in-[.dark]:bg-amber-900/30 text-amber-500 text-xl" aria-hidden="true">
                  {streakIcon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] text-text/55">{t("স্ট্রিক", "Streak")}</p>
                  <p className="font-bold text-lg text-text">{formatStreakLabel(streak, t)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-right">
                <div className="w-24 h-3 rounded-full bg-text/10 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getProgressColor(todayProgress)}`}
                    style={{ width: `${todayProgress}%` }}
                  />
                </div>
                <span className="font-mono text-sm font-bold tabular-nums text-text">{todayProgress}%</span>
              </div>
            </div>

            {/* Motivational Message */}
            <div className="rounded-lg bg-primary/5 border border-primary/10 p-3">
              <p className="text-sm text-primary font-medium flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                {motivationalMsg}
              </p>
            </div>

            {/* Main stat: Total time */}
            <div className="flex items-baseline justify-between gap-4 border-t border-text/10 pt-3">
              <div>
                <p className="text-[11px] text-text/55">{t("মোট সময়", "Total time")}</p>
                <p className="font-mono text-2xl font-bold tabular-nums text-text">{totalTime}</p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
            </div>

            {/* Today's progress toward goal */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-text/55">{t("আজকের লক্ষ্য", "Today's goal")}</span>
                <span className="font-mono font-bold tabular-nums text-text">
                  {todayTime} / {humanTime(dashboard?.dailyGoalSeconds ?? 900)}
                </span>
              </div>
              <div className="h-2 rounded-full bg-text/10 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getProgressColor(todayProgress)}`}
                  style={{ width: `${todayProgress}%` }}
                />
              </div>
            </div>

            {/* Secondary stats */}
            <div className="grid grid-cols-4 gap-2 text-center border-t border-text/10 pt-3">
              <div className="rounded-xl border border-text/10 bg-background px-2 py-2">
                <p className="font-mono text-lg font-bold tabular-nums text-text">{basicData.logins}</p>
                <p className="text-[10px] text-text/50">{t("লগইন", "Logins")}</p>
              </div>
              <div className="rounded-xl border border-text/10 bg-background px-2 py-2">
                <p className="font-mono text-lg font-bold tabular-nums text-text">{streak}</p>
                <p className="text-[10px] text-text/50">{t("স্ট্রিক", "Streak")}</p>
              </div>
              <div className="rounded-xl border border-text/10 bg-background px-2 py-2">
                <p className="font-mono text-lg font-bold tabular-nums text-text">{dashboard?.weekly?.goalDays ?? 0}</p>
                <p className="text-[10px] text-text/50">{t("লক্ষ্য দিন", "Goal days")}</p>
              </div>
              <div className="rounded-xl border border-text/10 bg-background px-2 py-2">
                <p className="font-mono text-lg font-bold tabular-nums text-ok">
                  {basicData.onlineNow ? t("হ্যাঁ", "Yes") : t("না", "No")}
                </p>
                <p className="text-[10px] text-text/50">{t("অনলাইন", "Online")}</p>
              </div>
            </div>

            {/* Next Milestone */}
            {dashboard?.nextMilestone && (
              <div className="rounded-lg bg-amber-50 in-[.dark]:bg-amber-900/20 border border-amber-200 in-[.dark]:border-amber-800 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl" aria-hidden="true">{dashboard.nextMilestone.icon}</span>
                    <div>
                      <p className="text-[11px] text-amber-700 in-[.dark]:text-amber-300">{t("পরবর্তি মাইলстоন", "Next milestone")}</p>
                      <p className="font-semibold text-amber-800 in-[.dark]:text-amber-200">
                        {t(dashboard.nextMilestone.label.bn, dashboard.nextMilestone.label.en)}
                      </p>
                    </div>
                  </div>
                  <Target className="h-5 w-5 text-amber-500" aria-hidden="true" />
                </div>
              </div>
            )}

            {/* Latest Milestone Earned */}
            {dashboard?.earnedMilestones && dashboard.earnedMilestones.length > 0 && (
              <div className="rounded-lg bg-green-50 in-[.dark]:bg-green-900/20 border border-green-200 in-[.dark]:border-green-800 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl" aria-hidden="true">{dashboard.earnedMilestones[dashboard.earnedMilestones.length - 1].icon}</span>
                    <div>
                      <p className="text-[11px] text-green-700 in-[.dark]:text-green-300">{t("আজ অর্জিত", "Earned today")}</p>
                      <p className="font-semibold text-green-800 in-[.dark]:text-green-200">
                        {t(
                          dashboard.earnedMilestones[dashboard.earnedMilestones.length - 1].label.bn,
                          dashboard.earnedMilestones[dashboard.earnedMilestones.length - 1].label.en
                        )}
                      </p>
                    </div>
                  </div>
                  <Trophy className="h-5 w-5 text-green-500" aria-hidden="true" />
                </div>
              </div>
            )}

            <p className="text-[11px] text-text/50 border-t border-text/10 pt-2">
              {t(
                "প্রতিদিন ১৫ মিনিট দিন, চাইনিজ শিখুন সহজে। স্ট্রিক রাখলে পুরস্কার!",
                "Spend 15 min daily, learn Chinese easily. Keep streak for rewards!"
              )}
            </p>
          </div>
        </div>
      )}

      {minimized && (
        <button
          type="button"
          onClick={toggleMinimize}
          aria-label={t("বিস্তার করুন", "Expand")}
          className="flex w-full max-w-sm items-center gap-2.5 rounded-xl border border-text/15 bg-card px-3 py-2.5 text-sm text-text shadow-[0_16px_40px_-12px_rgba(0,0,0,0.35)] hover:border-primary/30 transition-colors motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <span className="flex-1 truncate font-medium text-text">
            {t("আজ: ", "Today: ")}{todayTime} {todayProgress >= 100 ? "✅" : `(${todayProgress}%)`}
          </span>
          {streak > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-amber-100 in-[.dark]:bg-amber-900/30 px-2 py-0.5 text-[10px] font-semibold text-amber-600 in-[.dark]:text-amber-400">
              <Flame className="h-3 w-3" aria-hidden="true" />
              {streak}d
            </span>
          )}
          {basicData.onlineNow && (
            <span className="flex items-center gap-1 rounded-full bg-ok/15 px-2 py-0.5 text-[10px] font-semibold text-ok">
              <span className="h-1.5 w-1.5 rounded-full bg-ok animate-pulse" aria-hidden="true" />
              {t("অনলাইন", "Online")}
            </span>
          )}
          <Maximize2 className="h-4 w-4 text-text/40" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}