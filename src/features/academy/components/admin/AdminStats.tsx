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
  /** Every student record, whatever their status. */
  totalStudents: number;
  pendingStudents: number;
  approvedStudents: number;
  courses: number;
  /** Enrollments waiting on a decision, and the ones already seated. */
  pendingEnrollments: number;
  approvedEnrollments: number;
  /** Pro subscribers plus unexpired trials. */
  proMembers: number;
  /** The two halves of that number, for the page that needs to separate them. */
  proStudents: number;
  activeTrials: number;
  /** Payments submitted and not yet reviewed. */
  pendingPro: number;
  /** Sign-in figures for the whole school. */
  loginsToday: number;
  /** Students with a session still open right now. */
  onlineNow: number;
  /** Distinct students who have ever signed in. */
  everLoggedIn: number;
};

const EMPTY: AdminCounts = {
  totalStudents: 0,
  pendingStudents: 0,
  approvedStudents: 0,
  courses: 0,
  pendingEnrollments: 0,
  approvedEnrollments: 0,
  proMembers: 0,
  proStudents: 0,
  activeTrials: 0,
  pendingPro: 0,
  loginsToday: 0,
  onlineNow: 0,
  everLoggedIn: 0,
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
      // One request instead of eight. The old version counted by fetching whole
      // collections and taking `.length`, so every /admin page pulled in every
      // student, every course and every review just to render a few pills.
      const res = await fetch("/api/admin/overview", { cache: "no-store" });
      const data = await res.json();
      if (data.success) setCounts({ ...EMPTY, ...data.counts });
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
