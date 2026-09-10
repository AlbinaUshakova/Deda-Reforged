import "./globals.css";
import "./styles/header-alphabet.css";
import "./styles/flashcards.css";
import "./styles/blocks-game.css";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";
import AppChrome from "@/components/AppChrome";
import StandaloneModeSync from "@/components/StandaloneModeSync";
import VercelAnalytics from "@/components/VercelAnalytics";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const uiFont = localFont({
  src: "../public/fonts/Manrope-Variable.ttf",
  variable: "--font-manrope",
  display: "swap",
  weight: "200 800",
});

const displayFont = localFont({
  src: "../public/fonts/NunitoSans-Variable.ttf",
  variable: "--font-nunito-sans",
  display: "swap",
  weight: "200 1000",
});

const georgianFont = localFont({
  src: "../public/fonts/NotoSansGeorgian-Variable.ttf",
  variable: "--font-noto-georgian",
  display: "swap",
  weight: "100 900",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Deda - start reading through play.",
  description: "Learn unfamiliar symbols, read real words early, and build reading confidence through short playful lessons.",
  openGraph: {
    title: "Deda - start reading through play.",
    description: "Learn unfamiliar symbols, read real words early, and build reading confidence through short playful lessons.",
    url: "/",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image-v2",
        width: 1200,
        height: 630,
        alt: "Deda - start reading through play.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Deda - start reading through play.",
    description: "Learn unfamiliar symbols, read real words early, and build reading confidence through short playful lessons.",
    images: ["/og-image-v2"],
  },
  icons: {
    icon: "/images/deda-app-icon.png",
    shortcut: "/images/deda-app-icon.png",
    apple: "/images/deda-app-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Deda",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${uiFont.variable} ${displayFont.variable} ${georgianFont.variable}`}
    >
      <body className="min-h-screen min-h-[100dvh] text-[var(--app-text)]">
        <StandaloneModeSync />
        <AppChrome>{children}</AppChrome>
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <VercelAnalytics />
      </body>
    </html>
  );
}
