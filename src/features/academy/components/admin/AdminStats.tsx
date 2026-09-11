"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Shared admin metrics. Fetched once per admin visit and exposed to the
 * quick-access bar (counters) and the dashboard tiles via context.
 */

export type AdminCounts = {
  pendingStudents: number;
  approvedStudents: number;
  pendingClasses: number;
  courses: number;
  chineseWords: number;
  hanziPro: number;
  donations: number;
};

const EMPTY: AdminCounts = {
  pendingStudents: 0,
  approvedStudents: 0,
  pendingClasses: 0,
  courses: 0,
  chineseWords: 0,
  hanziPro: 0,
  donations: 0,
};

type AdminStatsContextType = {
  counts: AdminCounts;
  loading: boolean;
  refresh: () => Promise<void>;
};

const AdminStatsContext = createContext<AdminStatsContextType>({
  counts: EMPTY,
  loading: false,
  refresh: async () => {},
});

export function AdminStatsProvider({ children }: { children: ReactNode }) {
  const [counts, setCounts] = useState<AdminCounts>(EMPTY);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [pStu, aStu, logs, crs, words, hp, donate] = await Promise.all([
        fetch("/api/academy/students?status=Pending", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/academy/students?status=Approved", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/academy/classes/pending", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/academy/courses", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/chinese-words", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/hanzi-pro", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/donations", { cache: "no-store" }).then((r) => r.json()),
      ]);
      setCounts({
        pendingStudents: pStu.students?.length || 0,
        approvedStudents: aStu.students?.length || 0,
        pendingClasses: logs.pendingClasses?.length || 0,
        courses: crs.courses?.length || 0,
        chineseWords: words.data?.length || 0,
        hanziPro: hp.students?.length || 0,
        donations: donate.donations?.length || 0,
      });
    } catch (err) {
      console.error("Failed to load admin stats:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => refresh());
  }, [refresh]);

  const value = useMemo(
    () => ({ counts, loading, refresh }),
    [counts, loading, refresh],
  );

  return <AdminStatsContext.Provider value={value}>{children}</AdminStatsContext.Provider>;
}

export function useAdminStats() {
  return useContext(AdminStatsContext);
}
