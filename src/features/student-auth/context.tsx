"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface AccountStudent {
  rollNumber: number;
  nameEnglish: string;
  whatsapp: string;
  isWhatsAppGroupJoined: boolean;
  isPro: boolean;
  location: string;
  avatarUrl?: string;
  enrolledCourseId: string;
  enrolledCourseIds?: string[];
  registrationStatus: string;
}

interface AccountContextValue {
  student: AccountStudent | null;
  /** True while the saved session is being re-validated on load. */
  checking: boolean;
  login: (phone: string, password: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  logout: () => void;
  refresh: () => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
}

const AccountContext = createContext<AccountContextValue | null>(null);

const SESSION_KEY = "lcwkr_student";

function loadSessionPhone(): string | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { phone?: string };
    return parsed.phone ?? null;
  } catch {
    return null;
  }
}

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [student, setStudent] = useState<AccountStudent | null>(null);
  const [checking, setChecking] = useState(true);

  /* Re-validate the saved session once the tree is mounted.
     This used to be done during render, behind a `booted` flag and a microtask,
     which let the fetch and its state updates land before the provider was ready
     to receive them — React logged "can't perform a React state update on a
     component that hasn't mounted yet" on every page load, and the first tap
     after a load could go nowhere. An effect runs after mount, and the `alive`
     flag keeps a late answer from writing to a tree that has gone. */
  useEffect(() => {
    let alive = true;
    const phone = loadSessionPhone();
    if (!phone) {
      /* Deferred so the update is a follow-up rather than a cascading render,
         the pattern the rest of the app uses. Safe here precisely because this
         runs after mount, which is what the old render-time version was not. */
      queueMicrotask(() => {
        if (alive) setChecking(false);
      });
      return;
    }
    fetch("/api/auth/me", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        if (d.success) setStudent(d.student);
        else {
          try {
            window.localStorage.removeItem(SESSION_KEY);
          } catch {
            /* ignore */
          }
        }
      })
      .catch(() => {
        /* offline — keep logged-out view, session intact */
      })
      .finally(() => {
        if (alive) setChecking(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const login = useCallback(async (phone: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { ok: false as const, error: data.error ?? "Login failed." };
      }
      setStudent(data.student);
      try {
        window.localStorage.setItem(SESSION_KEY, JSON.stringify({ phone }));
      } catch {
        /* ignore */
      }
      return { ok: true as const };
    } catch {
      return { ok: false as const, error: "Network problem. Try again." };
    }
  }, []);

  const logout = useCallback(() => {
    const phone = loadSessionPhone();
    setStudent(null);
    try {
      window.localStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
    // Tell the server so the admin's session list gets a real sign-out time.
    // Fire and forget: signing out must never wait on the network.
    if (phone) {
      try {
        navigator.sendBeacon?.(
          "/api/auth/logout",
          new Blob([JSON.stringify({ phone })], { type: "application/json" }),
        );
      } catch {
        /* ignore */
      }
    }
  }, []);

  const refresh = useCallback(async () => {
    const phone = loadSessionPhone();
    if (!phone) return;
    try {
      const res = await fetch("/api/auth/me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (data.success) setStudent(data.student);
      else logout();
    } catch {
      /* offline — ignore */
    }
  }, [logout]);

  /**
   * Keep the account honest without asking anybody to press a button.
   *
   * The account was read once, when the page loaded, and that was the whole
   * problem: the admin switches Pro on in /admin/pro, and a student who already
   * had the site open carried on seeing the old answer for the rest of that
   * session — locked out of content they had just paid for, with the Pro pages
   * reachable only by typing a URL or pressing reload. The data was correct the
   * whole time; the browser was simply holding yesterday's answer.
   *
   * So it is re-read when the tab comes back to the front, which is the moment
   * this actually happens in practice (admin approves, student switches back),
   * and once a minute while the tab sits open, which covers a student who walks
   * away and comes back to a different page. A reload is no longer needed, and
   * a revoked Pro likewise stops working on its own.
   */
  useEffect(() => {
    if (!loadSessionPhone()) return;
    let alive = true;

    const revalidate = () => {
      if (alive && document.visibilityState === "visible") void refresh();
    };

    const onVisible = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", revalidate);

    // A student who has just paid should not wait a minute to find out. The
    // events above catch the case where they were looking away; this catches
    // the one where they are staring at the page the whole time, which is
    // exactly what happens when the admin approves from another machine while
    // they wait. One small lookup a student, every half minute.
    const timer = setInterval(revalidate, 30_000);

    return () => {
      alive = false;
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", revalidate);
      clearInterval(timer);
    };
  }, [refresh]);

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      const phone = loadSessionPhone();
      if (!phone || !student) return { ok: false as const, error: "Login first." };
      try {
        const res = await fetch("/api/auth/change-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone, currentPassword, newPassword }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          return { ok: false as const, error: data.error ?? "Failed." };
        }
        return { ok: true as const };
      } catch {
        return { ok: false as const, error: "Network problem. Try again." };
      }
    },
    [student],
  );

  const value = useMemo(
    () => ({ student, checking, login, logout, refresh, changePassword }),
    [student, checking, login, logout, refresh, changePassword],
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount(): AccountContextValue {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error("useAccount must be used inside <AccountProvider>");
  return ctx;
}

/** Saved session phone for non-context callers (e.g. hw submit sync). */
export function loadAccountPhone(): string | null {
  return loadSessionPhone();
}
