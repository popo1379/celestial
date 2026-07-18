import type { Metadata } from 'next'
import AIChatView from './page-view'

const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://opensero.com/horoscope').replace(/\/+$/, '')
const ogImage = `${appUrl}/og-image.png`

export const metadata: Metadata = {
  title: 'AI Astrology Chat — Personalized Birth Chart Interpretation | Horoscope SERO',
  description:
    'Chat with AI astrology for personalized natal chart and synastry interpretations. Ask about your Sun, Moon, Rising sign, planet placements, aspects, houses, and relationship compatibility. Powered by AI with Western astrology expertise.',
  keywords: [
    'AI astrology',
    'astrology AI',
    'astrology chat',
    'AI birth chart interpretation',
    'free natal chart reading',
    'astrology for beginners',
    'ask astrologer',
    'AI horoscope',
    'astrology reading online',
    'birth chart analysis',
    'astrology interpretation',
    'AI astrologer chat',
  ],
  alternates: {
    canonical: `${appUrl}/ai-chat`,
  },
  openGraph: {
    title: 'AI Astrology Chat — Personalized Birth Chart Interpretation',
    description:
      'Chat with AI astrology for personalized natal chart and synastry interpretations. Ask about planets, aspects, houses, and relationship compatibility.',
    url: `${appUrl}/ai-chat`,
    type: 'website',
    locale: 'en_US',
    images: [{ url: ogImage, width: 1200, height: 630, alt: 'Horoscope SERO AI Astrology Chat' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Astrology Chat — Personalized Birth Chart Interpretation',
    description:
      'AI-powered astrology chat for natal chart and synastry interpretations.',
    images: [ogImage],
  },
}

export default function Page() {
  return <AIChatView />
}
