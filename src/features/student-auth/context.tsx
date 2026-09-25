"use client";

import React, {
  createContext,
  useCallback,
  useContext,
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
  const [booted, setBooted] = useState(false);

  // Re-validate the saved session once on mount (no effect-setState lint:
  // deferred via queueMicrotask, the codebase pattern).
  if (!booted) {
    setBooted(true);
    queueMicrotask(() => {
      const phone = loadSessionPhone();
      if (!phone) {
        setChecking(false);
        return;
      }
      fetch("/api/auth/me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      })
        .then((r) => r.json())
        .then((d) => {
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
        .finally(() => setChecking(false));
    });
  }

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
    setStudent(null);
    try {
      window.localStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
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
