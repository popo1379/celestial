import type { Metadata } from 'next'
import SynastryView from './page-view'

const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://opensero.com/horoscope').replace(/\/+$/, '')
const ogImage = `${appUrl}/og-image.png`

export const metadata: Metadata = {
  title: 'Synastry Compatibility — Free Relationship Astrology Chart | Horoscope SERO',
  description:
    'Compare two birth charts for free with our synastry compatibility tool. Discover relationship dynamics through Sun, Moon, Venus, and Mars aspects. Western astrology relationship analysis with AI interpretations.',
  keywords: [
    'sun moon and rising',
    'big three astrology',
    'synastry chart',
    'astrology compatibility',
    'birth chart compatibility',
    'relationship compatibility',
    'zodiac compatibility',
    'love compatibility',
    'couple astrology',
    'synastry aspects',
    'venus mars compatibility',
    'relationship astrology',
    'astrology matching',
    'partner birth chart comparison',
  ],
  alternates: {
    canonical: `${appUrl}/synastry`,
  },
  openGraph: {
    title: 'Synastry Compatibility — Free Relationship Astrology Chart',
    description:
      'Compare two birth charts for free. Discover relationship dynamics through Sun, Moon, Venus, and Mars synastry aspects with AI interpretations.',
    url: `${appUrl}/synastry`,
    type: 'website',
    locale: 'en_US',
    images: [{ url: ogImage, width: 1200, height: 630, alt: 'Horoscope SERO Synastry Compatibility' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Synastry Compatibility — Free Relationship Astrology Chart',
    description:
      'Free synastry chart comparison. Discover relationship dynamics through Sun, Moon, Venus, and Mars aspects.',
    images: [ogImage],
  },
}

export default function Page() {
  return <SynastryView />
}
