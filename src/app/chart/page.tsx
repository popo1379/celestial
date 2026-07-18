import type { Metadata } from 'next'
import ChartView from './page-view'

const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://opensero.com/horoscope').replace(/\/+$/, '')
const ogImage = `${appUrl}/og-image.png`

export const metadata: Metadata = {
  title: 'Your Natal Chart — Free Birth Wheel & Planet Positions | Horoscope SERO',
  description:
    'View your free natal chart wheel with Sun, Moon, Rising sign, 10 planet positions, element distribution, and AI-powered interpretations. Explore the Big Three and house cusps with Western astrology.',
  keywords: [
    'natal chart',
    'birth chart',
    'my natal chart',
    'free natal chart reading',
    'birth chart wheel',
    'planet positions',
    'sun moon rising sign',
    'big three astrology',
    'astrology calculator',
    'western astrology',
    'house cusps',
    'element distribution',
  ],
  alternates: {
    canonical: `${appUrl}/chart`,
  },
  openGraph: {
    title: 'Your Natal Chart — Free Birth Wheel & Planet Positions',
    description:
      'View your free natal chart wheel with the Big Three (Sun, Moon, Rising), 10 planet positions, and AI-powered interpretations.',
    url: `${appUrl}/chart`,
    type: 'website',
    locale: 'en_US',
    images: [{ url: ogImage, width: 1200, height: 630, alt: 'Horoscope SERO Natal Chart' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your Natal Chart — Free Birth Wheel & Planet Positions',
    description:
      'Free natal chart wheel with Sun, Moon, Rising sign, 10 planets, houses, and AI astrology interpretations.',
    images: [ogImage],
  },
}

export default function Page() {
  return <ChartView />
}
