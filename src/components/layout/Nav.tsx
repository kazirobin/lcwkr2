// app/components/Nav.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";

import { useLanguage } from "@/i18n";
import ThemeButton from "./ThemeButton";
import AccountButton from "./AccountButton";
import PinyinToggle from "@/components/ui/PinyinToggle";
import ProPanel from "@/features/chinese-words/components/ProPanel";
import { useProAccess } from "@/features/chinese-words/components/pro-access";
import { FacebookIcon } from "@/components/icons/FacebookIcon";

// ============================================
// CONFIGURATION
// ============================================

// Primary call-to-action — the live-class WhatsApp group (mirrors the Hero CTA).
const WHATSAPP_URL = "https://chat.whatsapp.com/EBP79wEaAfAEvMtMee6HTY";
// Secondary community — the Facebook group.
const FACEBOOK_GROUP_URL = "https://www.facebook.com/groups/lcwkr/";

const MAIN_LINKS = [
  { id: "home", href: "/", en: "Home", bn: "হোম" },
  { id: "intro", href: "/intro", en: "How it works", bn: "কীভাবে চলে" },
] as const;

const DROPDOWNS = {
  academy: {
    id: "academy",
    en: "Academy",
    bn: "একাডেমি",
    items: [
      { href: "/academy", en: "Academy Hub", bn: "একাডেমি হাব" },
      { href: "/community", en: "Community", bn: "কমিউনিটি" },
      { href: "/donate", en: "Support / Donate", bn: "অনুদান" },
    ],
    activePrefixes: ["/academy", "/community", "/donate"],
  },
  vocabulary: {
    id: "vocabulary",
    en: "Vocabulary",
    bn: "ভোকাবুলারি",
    items: [
      { href: "/pinyin", en: "Pinyin", bn: "পিনয়িন" },
      { href: "/hsk", en: "HSK Vocabulary", bn: "HSK ভোকাবুলারি" },
      { href: "/hsk/1", en: "HSK 1", bn: "HSK ১" },
      { href: "/hsk/2", en: "HSK 2", bn: "HSK ২", isPro: true },
      { href: "/hsk/3", en: "HSK 3", bn: "HSK ৩", isPro: true },
    ],
    activePrefixes: ["/hsk"],
  },
apps: {
    id: "resources",
    en: "Resources",
    bn: "রিসোর্স",
    items: [
      {
        href: "/chinese-words",
        en: "Chinese Core Words",
        bn: "চাইনিজ কোর ওয়ার্ডস",
        isProtected: true,
      },
      {
        href: "/hw/hsk1/1",
        en: "HSK Homework",
        bn: "হোমওয়ার্ক ও প্র্যাকটিস",
        isProtected: true, // চাইলে ফলস করে দিতে পারেন
      },
      {
        href: "/hanzi-pro",
        en: "Hanzi Pro Challenge",
        bn: "হানজি প্রো চ্যালেঞ্জ",
        isProtected: true,
      },
      { href: "/apps", en: "Suggested Apps", bn: "প্রস্তাবিত অ্যাপস" },
      { href: "/pdf", en: "PDF", bn: "পিডিএফ" },
    ],
    activePrefixes: ["/apps", "/pdf", "/chinese-words", "/hw"],
  },
} as const;

type DropdownId = keyof typeof DROPDOWNS;

// Shared glass surface for the dropdown / mobile panels.
const PANEL_GLASS =
  "border border-text/10 bg-background/80 backdrop-blur-xl ring-1 ring-white/50 dark:ring-white/5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.35)]";

export default function Nav() {
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();
  // The nav's Pro panel shows the same status the Pro pages do.
  const { status: proStatus, remainingMs: proRemaining } = useProAccess();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownId | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Protected feature modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);

  const t = useCallback(
    (en: string, bn: string) => (language === "en" ? en : bn),
    [language]
  );

  // Resolve the current route to exactly ONE nav destination: the longest href
  // the pathname matches. Without this, a plain prefix test lights every
  // ancestor too — "/hsk/2" would mark both "HSK 2" and its parent "HSK
  // Vocabulary" (/hsk) active, and every "/academy/*" route would re-light
  // "Academy Hub". Leaf routes still keep their nearest item lit
  // ("/academy/courses/abc" → "Mandarin Courses").
  const activeHref = useMemo(() => {
    const hrefs = [
      ...MAIN_LINKS.map((l) => l.href),
      ...Object.values(DROPDOWNS).flatMap((d) => d.items.map((i) => i.href)),
    ];
    const matches = hrefs.filter((href) =>
      href === "/"
        ? pathname === "/"
        : pathname === href || pathname.startsWith(`${href}/`)
    );
    return matches.sort((a, b) => b.length - a.length)[0] ?? null;
  }, [pathname]);

  const isActive = useCallback(
    (href: string) => href === activeHref,
    [activeHref]
  );

  // Section-level: is the pathname anywhere inside this dropdown's territory?
  // Drives the trigger's "you are here" state, independent of whether the
  // dropdown happens to be open.
  const isDropdownActive = useCallback(
    (dropdownId: DropdownId) =>
      DROPDOWNS[dropdownId].activePrefixes.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
      ),
    [pathname]
  );

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Deepen the glass once the page leaves the very top.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      setIsMobileMenuOpen(false);
      setOpenDropdown(null);
    });
  }, [pathname]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenDropdown(null);
        setIsMobileMenuOpen(false);
        setShowPasswordModal(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile) return;
      if (
        openDropdown &&
        navRef.current &&
        !navRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown, isMobile]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isMobile) return;
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        !mobileToggleRef.current?.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen, isMobile]);

  const toggleDropdown = (dropdownId: DropdownId) => {
    setOpenDropdown(openDropdown === dropdownId ? null : dropdownId);
  };

  const closeAll = () => {
    setOpenDropdown(null);
    setIsMobileMenuOpen(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "bn" : "en");
    setOpenDropdown(null);
  };

  const toggleMobileMenu = () => {
    // functional update: the click-outside handler may have already closed
    // the menu in the same tap sequence (mousedown fires before click)
    setIsMobileMenuOpen((v) => !v);
    setOpenDropdown(null);
  };

  // Protected Link Click Handler
  const handleProtectedNavigation = (e: React.MouseEvent, href: string) => {
    // A member clicking "Chinese Core Words" or "Hanzi Pro" in the nav was
    // stopped here and shown the paywall instead of the page, because this
    // handler blocked every click without ever asking whether they had paid.
    // Now only a visitor without Pro is intercepted.
    if (proStatus === "pro") {
      closeAll();
      return;
    }

    e.preventDefault();
    closeAll();

    // Pro is opened through the one shared panel; there is no password box
    // here any more, because Pro is granted on the student's account.
    setShowPasswordModal(true);
    void href;
  };

  // Render a single link.
  // - "mobile": full-width rows with rounded chips (mobile panel)
  // - "desktop": inline, centered nav items — active reads as accent text
  //   only (no filled chip), matching the header reference.
  const renderLink = (
    href: string,
    label: string,
    context: "desktop" | "mobile" = "mobile",
    onClick?: () => void
  ) => {
    const active = isActive(href);

    if (context === "desktop") {
      return (
        <Link
          href={href}
          onClick={onClick || closeAll}
          aria-current={active ? "page" : undefined}
          className={`px-3 py-2 text-sm font-medium transition-colors ${
            active
              ? "text-secondary"
              : "text-text/70 hover:text-text"
          }`}
        >
          {label}
        </Link>
      );
    }

    return (
      <Link
        href={href}
        onClick={onClick || closeAll}
        aria-current={active ? "page" : undefined}
        className={`block px-4 py-3 text-base font-medium transition-colors rounded-lg ${
          active
            ? "text-secondary bg-secondary/10"
            : "text-text/80 hover:text-secondary hover:bg-secondary/7"
        }`}
      >
        {label}
      </Link>
    );
  };

  // Desktop dropdown
  const renderDesktopDropdown = (dropdownId: DropdownId) => {
    const dropdown = DROPDOWNS[dropdownId];
    const isOpen = openDropdown === dropdownId;
    const active = isDropdownActive(dropdownId);
    const label = t(dropdown.en, dropdown.bn);

    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => toggleDropdown(dropdownId)}
          className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors ${
            active || isOpen
              ? "text-secondary"
              : "text-text/70 hover:text-text"
          }`}
          aria-expanded={isOpen}
          aria-current={active ? "location" : undefined}
          aria-label={label}
        >
          {label}
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isOpen && (
          <div
            className={`absolute left-0 mt-2 w-56 rounded-2xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1 zoom-in-95 duration-150 ${PANEL_GLASS}`}
          >
            {dropdown.items.map((item) => {
              const isProtected = "isProtected" in item && item.isProtected;
              const showProBadge = isProtected || ("isPro" in item && item.isPro);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    if (isProtected) {
                      handleProtectedNavigation(e, item.href);
                    } else {
                      closeAll();
                    }
                  }}
                  className={`mx-1.5 flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors ${
                    isActive(item.href)
                      ? "text-secondary bg-secondary/10 font-semibold"
                      : "text-text/80 hover:bg-secondary/7 hover:text-secondary"
                  }`}
                >
                  <span>{t(item.en, item.bn)}</span>
                  {showProBadge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-secondary/15 text-secondary font-bold">
                      PRO
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // Mobile dropdown
  const renderMobileDropdown = (dropdownId: DropdownId) => {
    const dropdown = DROPDOWNS[dropdownId];
    const isOpen = openDropdown === dropdownId;
    const label = t(dropdown.en, dropdown.bn);
    const active = isDropdownActive(dropdownId);

    return (
      <div className="border-b border-text/10 last:border-0">
        <button
          type="button"
          onClick={() => toggleDropdown(dropdownId)}
          className={`flex items-center justify-between w-full px-4 py-3 text-base font-medium transition-colors rounded-xl ${
            active
              ? "text-secondary bg-secondary/10"
              : isOpen
                ? "text-secondary bg-secondary/6"
                : "text-text/80 hover:text-secondary hover:bg-secondary/7"
          }`}
          aria-expanded={isOpen}
          aria-current={active ? "location" : undefined}
          aria-label={label}
        >
          <span>{label}</span>
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="pl-4 pb-2 space-y-1">
            {dropdown.items.map((item) => {
              const isProtected = "isProtected" in item && item.isProtected;
              const showProBadge = isProtected || ("isPro" in item && item.isPro);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    if (isProtected) {
                      handleProtectedNavigation(e, item.href);
                    } else {
                      closeAll();
                    }
                  }}
                  className={`flex items-center justify-between px-4 py-2.5 text-sm transition-colors rounded-lg ${
                    isActive(item.href)
                      ? "text-secondary bg-secondary/10 font-semibold"
                      : "text-text/70 hover:text-secondary hover:bg-secondary/7"
                  }`}
                >
                  <span>{t(item.en, item.bn)}</span>
                  {showProBadge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-secondary/15 text-secondary font-bold">
                      PRO
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <nav
        ref={navRef}
        className="fixed inset-x-0 top-0 z-40"
      >
        <div
          className={`transition-colors duration-300 ${
            scrolled
              ? "border-b border-text/10 bg-background/85 backdrop-blur-xl"
              : "border-b border-transparent bg-transparent backdrop-blur-sm"
          }`}
        >
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-20 sm:px-6 lg:px-8">
            {/* Logo */}
            <Link
              href="/"
              onClick={closeAll}
              className="shrink-0 flex items-center gap-2 rounded-full px-1.5 py-1"
            >
              <Image
                src="/assets/logo.png"
                alt="Learn Chinese — The Easy Way"
                width={232}
                height={100}
                className="h-8 w-auto sm:h-9"
                priority
              />
            </Link>

            {/* Desktop Navigation — centered between the logo and the actions */}
            <div className="hidden md:flex md:flex-1 md:items-center md:justify-center md:gap-1">
              {MAIN_LINKS.map((link) => (
                <div key={link.id}>
                  {renderLink(link.href, t(link.en, link.bn), "desktop")}
                </div>
              ))}

              {Object.keys(DROPDOWNS).map((id) => (
                <div key={id}>{renderDesktopDropdown(id as DropdownId)}</div>
              ))}
            </div>

            {/* Desktop actions */}
              <div className="hidden md:flex md:shrink-0 md:items-center md:gap-1.5">
              <button
                type="button"
                onClick={toggleLanguage}
                className="px-3 py-2 text-sm font-medium text-text/70 hover:text-text rounded-full transition-colors"
                aria-label="Toggle language"
              >
                {language === "en" ? "বাংলা" : "English"}
              </button>
<PinyinToggle />
              <ThemeButton />
              <AccountButton onNavigate={closeAll} />
              <a
                href={FACEBOOK_GROUP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeAll}
                aria-label={t(
                  "Join the Facebook group",
                  "Facebook গ্রুপে যোগ দিন",
                )}
                title={t("Join the Facebook group", "Facebook গ্রুপে যোগ দিন")}
                className="p-2.5 rounded-full text-text/70 hover:text-secondary hover:bg-secondary/7 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeAll}
                className="ml-1 inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-secondary px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-secondary/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-secondary/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
              >
                {t("Join live class", "লাইভ ক্লাসে যোগ দিন")}
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </a>
            </div>

            {/* Mobile Controls — keep only the persistent action chips;
                the language and theme toggles live inside the hamburger. */}
            <div className="md:hidden flex items-center gap-1.5">
              <PinyinToggle />
              <AccountButton onNavigate={closeAll} />
              <button
                type="button"
                ref={mobileToggleRef}
                onClick={toggleMobileMenu}
                className="p-2 rounded-full text-text/80 hover:text-secondary hover:bg-secondary/7 transition-colors"
                aria-label={t("Toggle navigation menu", "নেভিগেশন মেনু টগল করুন")}
                aria-expanded={isMobileMenuOpen}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

            {/* Mobile Menu */}
            {isMobile && isMobileMenuOpen && (
              <div
                ref={mobileMenuRef}
                className={`md:hidden mx-4 mb-2 rounded-2xl py-3 px-2 animate-in fade-in slide-in-from-top-2 duration-150 ${PANEL_GLASS}`}
              >
                <div className="flex flex-col space-y-1">
                  {/* language + theme toggles live inside the hamburger on small screens */}
                  <div className="flex items-center gap-2 border-b border-text/10 pb-2 mb-1">
                    <button
                      type="button"
                      onClick={toggleLanguage}
                      className="px-3 py-1.5 text-sm font-medium rounded-full border border-text/15 text-text/80 hover:text-secondary hover:border-secondary/40 transition-colors"
                    >
                      {language === "en" ? "বাংলা" : "English"}
                    </button>
                    <ThemeButton />
                  </div>

                  {MAIN_LINKS.map((link) => (
                  <div key={link.id}>
                    {renderLink(link.href, t(link.en, link.bn))}
                  </div>
                ))}

                {Object.keys(DROPDOWNS).map((id) => (
                  <div key={id}>{renderMobileDropdown(id as DropdownId)}</div>
                ))}

                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeAll}
                  className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-3.5 text-base font-semibold text-white shadow-sm shadow-secondary/25 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                >
                  {t("Join live class", "লাইভ ক্লাসে যোগ দিন")}
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </a>

                <a
                  href={FACEBOOK_GROUP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeAll}
                  className="flex items-center justify-center gap-2 rounded-xl border border-text/15 bg-background px-4 py-3 text-sm font-medium text-text transition-colors hover:border-secondary/50 hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                >
                  <FacebookIcon className="h-4 w-4" />
                  {t("Join the Facebook group", "Facebook গ্রুপে যোগ দিন")}
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* The Pro panel. This is the one place the form lives in the nav �
          the Pro pages open the very same component, so a visitor never sees
          two copies of it at once. */}
      {showPasswordModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-3 backdrop-blur-sm sm:p-4 animate-in fade-in duration-200"
          onClick={() => setShowPasswordModal(false)}
        >
          <div
            className="relative my-4 w-full max-w-xl text-text"
            onClick={(e) => e.stopPropagation()}
          >
            <ProPanel
              status={proStatus}
              remainingMs={proRemaining}
              onClose={() => setShowPasswordModal(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
