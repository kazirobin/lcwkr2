// app/components/Nav.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";

import { useLanguage } from "@/context/LanguageContext";
import ThemeButton from "./ThemeButton";

// ============================================
// CONFIGURATION - Edit this section to modify your navbar
// ============================================

// 1. Define your main navigation links (non-dropdown)
const MAIN_LINKS = [
  { id: "home", href: "/", en: "Home", bn: "হোম" },
  { id: "intro", href: "/intro", en: "Intro", bn: "ইন্ট্রো" },
] as const;

// 2. Define your dropdown menus
const DROPDOWNS = {
  academy: {
    id: "academy",
    en: "Academy",
    bn: "একাডেমি",
    items: [
      { href: "/academy", en: "Academy Hub", bn: "একাডেমি হাব" },
      { href: "/academy/courses", en: "Mandarin Courses", bn: "কোর্সসমূহ" },
      { href: "/academy/students", en: "Scholars Directory", bn: "শিক্ষার্থী তালিকা" },
      { href: "/community", en: "Community", bn: "কমিউনিটি" },
    ],
    activePrefixes: ["/academy", "/community"],
  },
  vocabulary: {
    id: "vocabulary",
    en: "Vocabulary",
    bn: "ভোকাবুলারি",
    items: [
      { href: "/hsk", en: "HSK Vocabulary", bn: "HSK ভোকাবুলারি" },
      { href: "/hsk/1", en: "HSK 1", bn: "HSK ১" },
      { href: "/hsk/2", en: "HSK 2", bn: "HSK ২" },
      { href: "/hsk/3", en: "HSK 3", bn: "HSK ৩" },
    ],
    activePrefixes: ["/hsk"],
  },
  apps: {
    id: "resources",
    en: "Resources",
    bn: "রিসোর্স",
    items: [
      { href: "/apps", en: "Suggested Apps", bn: "প্রস্তাবিত অ্যাপস" },
      { href: "/pdf", en: "PDF", bn: "পিডিএফ" },
    ],
    activePrefixes: ["/apps", "/pdf"],
  },
} as const;

// Type for dropdown IDs
type DropdownId = keyof typeof DROPDOWNS;

// ============================================
// COMPONENT
// ============================================

export default function Nav() {
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();

  // State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownId | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Refs
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Helper: Get translated text
  const t = useCallback(
    (en: string, bn: string) => {
      return language === "en" ? en : bn;
    },
    [language],
  );

  // Helper: Check if route is active
  const isActive = useCallback(
    (href: string) => {
      if (href === "/") return pathname === href;
      return pathname === href || pathname.startsWith(`${href}/`);
    },
    [pathname],
  );

  // Helper: Check if dropdown should be active
  const isDropdownActive = useCallback(
    (dropdownId: DropdownId) => {
      const dropdown = DROPDOWNS[dropdownId];
      return dropdown.activePrefixes.some((prefix) =>
        pathname === prefix || pathname.startsWith(`${prefix}/`),
      );
    },
    [pathname],
  );

  // Effects
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close everything on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  // Escape key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenDropdown(null);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Desktop outside click
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

  // Mobile outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isMobile) return;
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen, isMobile]);

  // Handlers
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
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isMobileMenuOpen) setOpenDropdown(null);
  };

  // ============================================
  // RENDER HELPERS
  // ============================================

  // Render a single link
  const renderLink = (href: string, label: string, onClick?: () => void) => {
    const active = isActive(href);
    return (
      <Link
        href={href}
        onClick={onClick || closeAll}
        className={`block px-4 py-3 md:py-2 text-base md:text-sm font-medium transition-colors rounded-lg md:rounded-md ${
          active
            ? "text-primary bg-primary/10"
            : "text-text hover:text-primary hover:bg-primary/5"
        }`}
      >
        {label}
      </Link>
    );
  };

  // Render a dropdown button (desktop)
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
          className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors rounded-md ${
            active || isOpen
              ? "text-primary bg-primary/10"
              : "text-text hover:text-primary hover:bg-primary/5"
          }`}
          aria-expanded={isOpen}
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
          <div className="absolute left-0 mt-1 w-52 bg-background border border-border rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
            {dropdown.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeAll}
                className={`block px-4 py-2 text-sm transition-colors ${
                  isActive(item.href)
                    ? "text-primary bg-primary/10 font-semibold"
                    : "text-text hover:bg-primary/5 hover:text-primary"
                }`}
              >
                {t(item.en, item.bn)}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Render mobile dropdown (accordion)
  const renderMobileDropdown = (dropdownId: DropdownId) => {
    const dropdown = DROPDOWNS[dropdownId];
    const isOpen = openDropdown === dropdownId;
    const label = t(dropdown.en, dropdown.bn);
    const active = isDropdownActive(dropdownId);

    return (
      <div className="border-b border-border/50 last:border-0">
        <button
          type="button"
          onClick={() => toggleDropdown(dropdownId)}
          className={`flex items-center justify-between w-full px-4 py-3 text-base font-medium transition-colors rounded-lg ${
            active || isOpen
              ? "text-primary bg-primary/10"
              : "text-text hover:text-primary hover:bg-primary/5"
          }`}
          aria-expanded={isOpen}
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
          <div className="pl-6 pb-2 space-y-1">
            {dropdown.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeAll}
                className={`block px-4 py-2.5 text-sm transition-colors rounded-lg ${
                  isActive(item.href)
                    ? "text-primary bg-primary/10 font-semibold"
                    : "text-text/80 hover:text-primary hover:bg-primary/5"
                }`}
              >
                {t(item.en, item.bn)}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <nav
      ref={navRef}
      className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            onClick={closeAll}
            className="shrink-0 flex items-center gap-2"
          >
            <Image
              src="/assets/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="h-8 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {/* Main links */}
            {MAIN_LINKS.map((link) => (
              <div key={link.id}>
                {renderLink(link.href, t(link.en, link.bn))}
              </div>
            ))}

            {/* Dropdowns (Academy, Vocabulary, Resources) */}
            {Object.keys(DROPDOWNS).map((id) => (
              <div key={id}>{renderDesktopDropdown(id as DropdownId)}</div>
            ))}

            {/* Controls */}
            <div className="flex items-center space-x-2 ml-4">
              <button
                type="button"
                onClick={toggleLanguage}
                className="px-3 py-2 text-sm font-medium text-text hover:text-primary hover:bg-primary/5 rounded-md transition-colors"
                aria-label="Toggle language"
              >
                {language === "en" ? "বাংলা" : "English"}
              </button>
              <ThemeButton />
            </div>
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              type="button"
              onClick={toggleLanguage}
              className="px-3 py-2 text-sm font-medium text-text hover:text-primary hover:bg-primary/5 rounded-md transition-colors"
              aria-label="Toggle language"
            >
              {language === "en" ? "বাংলা" : "English"}
            </button>
            <ThemeButton />
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-text hover:text-primary hover:bg-primary/5 transition-colors"
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
            className="md:hidden bg-background border-t border-border/50 py-4 px-2"
          >
            <div className="flex flex-col space-y-1 max-w-sm mx-auto">
              {/* Main links */}
              {MAIN_LINKS.map((link) => (
                <div key={link.id}>
                  {renderLink(link.href, t(link.en, link.bn))}
                </div>
              ))}

              {/* Dropdowns */}
              {Object.keys(DROPDOWNS).map((id) => (
                <div key={id}>{renderMobileDropdown(id as DropdownId)}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}