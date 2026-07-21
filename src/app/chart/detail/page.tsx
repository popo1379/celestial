import type { Metadata } from 'next'
import ChartDetailView from './page-view'

export const metadata: Metadata = {
  title: 'Free Birth Chart — Sun, Moon and Rising | Horoscope SERO',
  description:
    'Your detailed birth chart with sun, moon, and rising sign interpretations. Explore planets, houses, aspects, and the big three of your astrology chart.',
  keywords: [
    'sun moon and rising',
    'sun moon rising sign',
    'big three astrology',
    'free birth chart',
    'natal chart',
    'birth chart wheel',
    'planet positions',
    'astrology chart reading',
    'houses and aspects',
    'moon phase chart',
    'astrology for beginners',
    'rising sign chart',
    'sun sign moon sign rising sign',
  ],
  openGraph: {
    title: 'Free Birth Chart — Sun, Moon and Rising | Horoscope SERO',
    description:
      'Detailed birth chart with sun, moon, and rising sign interpretations. Explore planets, houses, aspects, and your big three.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Birth Chart — Sun, Moon and Rising | Horoscope SERO',
    description:
      'Detailed birth chart with sun, moon, and rising sign interpretations.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function ChartDetailPage() {
  return <ChartDetailView />
}
