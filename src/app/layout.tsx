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
  title: {
    default: 'Horoscope SERO — Sun Moon Rising Sign Calculator',
    template: '%s | Horoscope SERO',
  },
  description:
    'Horoscope SERO: Discover your Sun, Moon, and Rising signs in seconds. Free Big Three astrology chart with precise planet positions, daily transits, synastry compatibility, and AI-powered interpretations.',
  keywords: [
    'Horoscope SERO',
    'opensero',
    'sun moon and rising',
    'sun moon rising sign',
    'big three astrology',
    'what is my sun moon and rising',
    'sun sign moon sign rising sign calculator',
    'natal chart',
    'birth chart',
    'astrology',
    'AI astrology',
    'synastry chart',
    'relationship compatibility',
    'daily horoscope',
    'transit astrology',
    'planet positions',
    'zodiac signs',
    'free birth chart',
    'astrology calculator',
    'horoscope',
  ],
  authors: [{ name: 'Horoscope SERO' }],
  creator: 'Horoscope SERO',
  publisher: 'Horoscope SERO',
  alternates: {
    canonical: appUrl,
  },
  icons: {
    icon: [
      { url: `${basePath}/favicon-96x96.png`, sizes: '96x96', type: 'image/png' },
      { url: `${basePath}/favicon-48x48.png`, sizes: '48x48', type: 'image/png' },
      { url: `${basePath}/favicon.ico`, sizes: 'any', type: 'image/x-icon' },
      { url: `${basePath}/favicon.svg`, sizes: 'any', type: 'image/svg+xml' },
    ],
    shortcut: `${basePath}/favicon.ico`,
    apple: `${basePath}/favicon-192x192.png`,
    other: [
      { rel: 'mask-icon', url: `${basePath}/favicon.svg`, color: '#c9a96e' },
    ],
  },
  manifest: `${basePath}/site.webmanifest`,
  openGraph: {
    title: 'Horoscope SERO — Sun Moon Rising Sign Calculator',
    description: 'Horoscope SERO: Discover your Sun, Moon, and Rising signs in seconds. Free Big Three astrology chart with precise planet positions, transits, and AI interpretations.',
    url: appUrl,
    siteName: 'Horoscope SERO',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: `${appUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Horoscope SERO — Sun Moon Rising Sign Calculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Horoscope SERO — Sun Moon Rising Sign Calculator',
    description: 'Discover your Sun, Moon, and Rising signs. Free Big Three astrology chart with daily transits and AI interpretations.',
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
  alternateName: ['Horoscope SERO', 'FreeHoro', 'opensero'],
  url: appUrl,
  logo: `${appUrl}/favicon-192x192.png`,
  image: `${appUrl}/og-image.png`,
  description: 'Horoscope SERO is a free online astrology platform offering Sun Moon Rising sign calculator, Big Three birth chart, daily transits, synastry, and AI-powered interpretations.',
  slogan: 'Discover the cosmos within you',
  foundingDate: '2026',
  founders: [{
    '@type': 'Organization',
    name: 'Horoscope SERO',
  }],
  sameAs: [
    'https://github.com/popo1379/celestial',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    url: `${appUrl}/about`,
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Horoscope SERO',
  alternateName: 'Horoscope SERO — Sun Moon Rising Sign Calculator',
  url: appUrl,
  description: 'Horoscope SERO: Discover your Sun, Moon, and Rising signs in seconds. Free Big Three astrology chart with daily transits, synastry, and AI interpretations.',
  keywords: 'Horoscope SERO, sun moon and rising, sun moon rising sign, big three astrology, free birth chart, natal chart, horoscope',
  inLanguage: 'en',
  publisher: {
    '@type': 'Organization',
    name: 'Horoscope SERO',
    url: appUrl,
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: `${appUrl}/chart`,
    'query-input': 'birth details',
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Horoscope SERO — Sun Moon Rising Sign Calculator',
  serviceType: 'Sun Moon Rising sign calculation and astrology interpretation',
  provider: {
    '@type': 'Organization',
    name: 'Horoscope SERO',
    url: appUrl,
  },
  areaServed: 'Worldwide',
  description:
    'Horoscope SERO: Free Sun Moon Rising sign calculator and Big Three astrology chart. Generate your natal chart with precise planet positions, daily transits, synastry compatibility, and AI-powered astrology interpretations based on Western astrology.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free Sun Moon Rising sign calculator with optional account for saving profiles and charts.',
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
      <head>
        <link rel="author" href={`${appUrl}/about`} />
        <link rel="publisher" href={`${appUrl}/about`} />
      </head>
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