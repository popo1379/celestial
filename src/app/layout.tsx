import type { Metadata } from "next";
import { Playfair_Display, Inter, Noto_Serif_SC, Noto_Sans_SC } from "next/font/google";
import "./globals.css";
import DesktopNav from "@/components/layout/DesktopNav";
import { MobileTopBar } from "@/components/layout/MobileTopBar";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
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

const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://opensero.com/horoscope').replace(/\/+$/, '')
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

const googleVerification = process.env.GOOGLE_SITE_VERIFICATION || ''
const bingVerification = process.env.BING_SITE_VERIFICATION || ''

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: "Horoscope SERO — Free Birth Chart & AI Astrology",
  description: "Generate your free natal chart, explore daily transits, compare synastry compatibility, and get AI-powered astrology interpretations. Western astrology with 10 planets, houses, and aspects.",
  keywords: [
    'natal chart', 'birth chart', 'astrology', 'AI astrology',
    'synastry chart', 'relationship compatibility', 'daily horoscope',
    'transit astrology', 'planet positions', 'zodiac signs',
    'free birth chart', 'astrology calculator', 'horoscope',
  ],
  authors: [{ name: 'Horoscope SERO' }],
  creator: 'Horoscope SERO',
  publisher: 'Horoscope SERO',
  alternates: {
    canonical: appUrl,
  },
  icons: {
    icon: [
      { url: `${basePath}/favicon.ico`, sizes: '16x16', type: 'image/x-icon' },
      { url: `${basePath}/favicon.svg`, sizes: 'any', type: 'image/svg+xml' },
    ],
    shortcut: `${basePath}/favicon.ico`,
    apple: `${basePath}/favicon.svg`,
  },
  manifest: `${basePath}/site.webmanifest`,
  openGraph: {
    title: 'Horoscope SERO — Free Birth Chart & AI Astrology',
    description: 'Generate your free natal chart, explore daily transits, compare synastry, and get AI-powered astrology interpretations.',
    url: appUrl,
    siteName: 'Horoscope SERO',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: `${appUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Horoscope SERO — Free Birth Chart & AI Astrology',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Horoscope SERO — Free Birth Chart & AI Astrology',
    description: 'Free natal chart, daily transits, synastry, and AI astrology interpretations.',
    images: [`${appUrl}/og-image.png`],
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

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Horoscope SERO',
  url: appUrl,
  logo: `${appUrl}/favicon.svg`,
  description: 'Free online astrology platform offering natal charts, daily transits, synastry, and AI-powered interpretations.',
  sameAs: [
    'https://github.com/popo1379/celestial',
  ],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Horoscope SERO',
  url: appUrl,
  description: 'Free natal chart, daily transits, synastry, and AI astrology interpretations.',
  inLanguage: 'en',
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Horoscope SERO Astrology Services',
  serviceType: 'Astrology chart calculation and interpretation',
  provider: {
    '@type': 'Organization',
    name: 'Horoscope SERO',
    url: appUrl,
  },
  areaServed: 'Worldwide',
  description:
    'Free online astrology services including natal chart generation, daily transit horoscopes, synastry compatibility, and AI-powered astrology interpretations based on Western astrology.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free access with optional account for saving profiles and charts.',
  },
  url: appUrl,
  category: 'Astrology & Horoscope',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${playfair.variable} ${notoSerifSC.variable} ${notoSansSC.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
        <CosmicBackground />
        <DesktopNav />
        <MobileTopBar />
        <main className="pt-14 md:pt-16">
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </main>
      </body>
    </html>
  );
}