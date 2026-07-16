import type { Metadata } from "next";
import { Playfair_Display, Inter, Noto_Serif_SC, Noto_Sans_SC } from "next/font/google";
import "./globals.css";
import DesktopNav from "@/components/layout/DesktopNav";
import MobileTabBar from "@/components/layout/MobileTabBar";
import Footer from "@/components/layout/Footer";
import CosmicBackground from "@/components/layout/CosmicBackground";

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

// Search engine verification codes (set via Vercel env vars)
const googleVerification = process.env.GOOGLE_SITE_VERIFICATION || ''
const bingVerification = process.env.BING_SITE_VERIFICATION || ''

export const metadata: Metadata = {
  title: "Celestial — Discover Your Cosmic Blueprint",
  description: "Generate your free natal chart, explore daily transits, compare synastry compatibility, and get AI-powered astrology interpretations. Western astrology with 10 planets, houses, and aspects.",
  keywords: [
    'natal chart', 'birth chart', 'astrology', 'AI astrology',
    'synastry chart', 'relationship compatibility', 'daily horoscope',
    'transit astrology', 'planet positions', 'zodiac signs',
    'free birth chart', 'astrology calculator',
  ],
  authors: [{ name: 'Celestial' }],
  creator: 'Celestial',
  publisher: 'Celestial',
  alternates: {
    canonical: appUrl,
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'Celestial — Discover Your Cosmic Blueprint',
    description: 'Generate your free natal chart, explore daily transits, compare synastry, and get AI-powered astrology interpretations.',
    url: appUrl,
    siteName: 'Celestial',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Celestial — Discover Your Cosmic Blueprint',
    description: 'Free natal chart, daily transits, synastry, and AI astrology interpretations.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  ...(googleVerification ? { verification: { google: googleVerification } } : {}),
  ...(bingVerification ? { other: { 'msvalidate.01': bingVerification } } : {}),
};

// JSON-LD structured data
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Celestial',
  url: appUrl,
  logo: `${appUrl}/favicon.svg`,
  description: 'Free online astrology platform offering natal charts, daily transits, synastry, and AI-powered interpretations.',
  sameAs: [
    'https://twitter.com/celestial',
    'https://github.com/popo1379/celestial',
  ],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Celestial',
  url: appUrl,
  description: 'Free natal chart, daily transits, synastry, and AI astrology interpretations.',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${appUrl}/?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <CosmicBackground />
        <DesktopNav />
        <main className="pt-0 md:pt-16 pb-[100px] md:pb-0">
          {children}
        </main>
        <Footer />
        <MobileTabBar />
      </body>
    </html>
  );
}
