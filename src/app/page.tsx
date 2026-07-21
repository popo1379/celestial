import type { Metadata } from 'next'
import HomeView from './page-view'

const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://opensero.com/horoscope').replace(/\/+$/, '')
const ogImage = `${appUrl}/og-image.png`

export const metadata: Metadata = {
  title: 'Horoscope SERO — Free Birth Chart & AI Astrology Reading',
  description:
    'Generate your free natal chart in seconds. Explore daily transits, synastry compatibility, and AI-powered astrology interpretations. Western astrology with 10 planets, houses, and major aspects — no signup required.',
  keywords: [
    'sun moon and rising',
    'sun moon rising sign',
    'big three astrology',
    'free birth chart',
    'natal chart',
    'AI astrology',
    'horoscope',
    'astrology calculator',
    'zodiac signs',
    'birth chart reading',
    'astrology compatibility',
    'rising sign calculator',
    'daily horoscope',
    'my natal chart',
    'astrology for beginners',
  ],
  alternates: {
    canonical: appUrl,
  },
  openGraph: {
    title: 'Horoscope SERO — Free Birth Chart & AI Astrology Reading',
    description:
      'Generate your free natal chart, explore daily transits, compare synastry compatibility, and get AI-powered astrology interpretations.',
    url: appUrl,
    type: 'website',
    locale: 'en_US',
    images: [{ url: ogImage, width: 1200, height: 630, alt: 'Horoscope SERO — Free Birth Chart & AI Astrology' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Horoscope SERO — Free Birth Chart & AI Astrology Reading',
    description:
      'Free natal chart generator, daily transits, synastry compatibility, and AI-powered astrology interpretations.',
    images: [ogImage],
  },
}

export default function Page() {
  return <HomeView />
}
