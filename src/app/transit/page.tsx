import type { Metadata } from 'next'
import TransitView from './page-view'

const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://opensero.com/horoscope').replace(/\/+$/, '')
const ogImage = `${appUrl}/og-image.png`

export const metadata: Metadata = {
  title: 'Daily Transit Horoscope — Today\'s Astrology Score & Lucky Omens | Horoscope SERO',
  description:
    'Get your personalized daily transit horoscope with a fortune score, lucky color and number, today\'s Moon sign, and key planetary events. Western astrology daily readings based on your natal chart.',
  keywords: [
    'daily horoscope',
    'today horoscope',
    'transit astrology',
    'daily transit',
    'astrology today',
    'lucky color',
    'lucky number',
    'moon sign today',
    'weekly horoscope',
    'monthly horoscope',
    'astrology forecast',
    'daily fortune',
  ],
  alternates: {
    canonical: `${appUrl}/transit`,
  },
  openGraph: {
    title: 'Daily Transit Horoscope — Today\'s Astrology Score & Lucky Omens',
    description:
      'Personalized daily transit horoscope with fortune score, lucky color & number, today\'s Moon sign, and key planetary events based on your natal chart.',
    url: `${appUrl}/transit`,
    type: 'website',
    locale: 'en_US',
    images: [{ url: ogImage, width: 1200, height: 630, alt: 'Horoscope SERO Daily Transit' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daily Transit Horoscope — Today\'s Astrology Score & Lucky Omens',
    description:
      'Personalized daily transit horoscope with fortune score, lucky color & number, and key planetary events.',
    images: [ogImage],
  },
}

export default function Page() {
  return <TransitView />
}
