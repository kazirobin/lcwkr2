import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Noto_Sans_Bengali, Lora } from "next/font/google";
import "./globals.css";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import { LanguageProvider } from "@/i18n";
import ThemeProvider from "@/providers/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Bangla face for the whole site. Variable font — no weight list needed.
const notoSansBengali = Noto_Sans_Bengali({
  variable: "--font-noto-sans-bengali",
  subsets: ["latin", "bengali"],
  display: "swap",
});

// Reading serif for the HSK workbook surface — structural headings, lesson
// numbers, the vocabulary glossary. One face, two weights, latin only.
const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://lcwkr.vercel.app";

const SITE_DESCRIPTION =
  "A free, structured path from your first Pinyin sound to HSK 6 — live classes six days a week and a practice community that answers back, every lesson taught in Bangla.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Learn Chinese with Kazi Robin",
    template: "%s · Learn Chinese with Kazi Robin",
  },
  description: SITE_DESCRIPTION,
  applicationName: "Learn Chinese with Kazi Robin",
  openGraph: {
    type: "website",
    siteName: "Learn Chinese with Kazi Robin",
    locale: "bn_BD",
    alternateLocale: ["en_US"],
    url: SITE_URL,
    title: "Learn Chinese with Kazi Robin",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Learn Chinese with Kazi Robin",
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn"
      className={`${geistSans.variable} ${geistMono.variable} ${notoSansBengali.variable} ${lora.variable} font-bn h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-text focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-background"
        >
          Skip to content
        </a>
        <ThemeProvider>
          <LanguageProvider>
            <Nav />
            <main id="main-content" className="flex-1 pt-16 sm:pt-20">
              {children}
            </main>
            <Footer />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
