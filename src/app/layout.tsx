import type { Metadata } from "next";
import { Playfair_Display, Inter, Noto_Serif_SC, Noto_Sans_SC } from "next/font/google";
import "./globals.css";
import DesktopNav from "@/components/layout/DesktopNav";
import MobileTabBar from "@/components/layout/MobileTabBar";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSerifSC = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif-sc",
  display: "swap",
});

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans-sc",
  display: "swap",
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://celestial.app'

export const metadata: Metadata = {
  title: "Celestial — Discover Your Cosmic Blueprint",
  description: "Western astrology natal chart, daily transits, and synastry",
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'Celestial — Discover Your Cosmic Blueprint',
    description: 'Western astrology natal chart, daily transits, and synastry',
    url: appUrl,
    siteName: 'Celestial',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Celestial — Discover Your Cosmic Blueprint',
    description: 'Western astrology natal chart, daily transits, and synastry',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${playfair.variable} ${notoSerifSC.variable} ${notoSansSC.variable}`} suppressHydrationWarning>
      <body>
        <div className="starfield" aria-hidden="true" />
        <DesktopNav />
        <main className="pt-0 md:pt-16 pb-[100px] md:pb-0">
          {children}
        </main>
        <MobileTabBar />
      </body>
    </html>
  );
}
