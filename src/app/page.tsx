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
  return (
    <>
      <h1 className="sr-only">Horoscope SERO — Free Birth Chart & AI Astrology Reading</h1>
      <HomeView />
      <section className="relative z-10 mx-auto max-w-4xl px-4 pb-16 pt-8 text-sm text-[#8a8885]">
        <div className="rounded-2xl border border-[#1e1e2a] bg-[#0f0f15]/80 p-6 sm:p-8">
          <h2 className="mb-4 font-serif text-xl font-semibold text-[#e8e6e3]">Free Birth Chart & Astrology Tools</h2>
          <p className="mb-4 leading-relaxed">
            Horoscope SERO is a free online astrology platform designed to help you explore the cosmos within you.
            Generate your personalized natal chart in seconds using precise Swiss Ephemeris calculations.
            Discover your Sun sign, Moon sign, and Rising sign — the Big Three that form the foundation of your astrological identity.
            Whether you are a beginner curious about astrology or an experienced seeker looking for deep insights,
            our tools provide accurate planet positions, house cusps, aspects, and element distributions.
          </p>
          <p className="mb-4 leading-relaxed">
            Your birth chart is a celestial snapshot of the sky at the moment you were born.
            It reveals your core personality through the Sun sign, your emotional nature through the Moon sign,
            and your outward demeanor through the Rising sign (Ascendant).
            Beyond the Big Three, we calculate the positions of all ten planets — Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, and Pluto —
            across the twelve astrological houses, showing how different areas of your life are influenced by planetary energies.
          </p>
          <h3 className="mb-2 mt-6 font-serif text-lg font-semibold text-[#e8e6e3]">What You Can Do Here</h3>
          <ul className="mb-4 list-disc space-y-1 pl-5 leading-relaxed">
            <li>Generate a free natal chart with your Sun, Moon, and Rising sign</li>
            <li>Explore daily transit horoscopes personalized to your birth chart</li>
            <li>Compare synastry compatibility between two charts</li>
            <li>Get AI-powered astrology interpretations and insights</li>
            <li>Save your birth profiles for quick access</li>
          </ul>
          <h3 className="mb-2 mt-6 font-serif text-lg font-semibold text-[#e8e6e3]">Understanding Your Big Three</h3>
          <p className="mb-4 leading-relaxed">
            The Sun represents your core identity and ego — who you are at your essence.
            The Moon governs your emotions, instincts, and subconscious reactions.
            The Rising sign (Ascendant) is the mask you wear when meeting the world, shaping first impressions and your approach to new situations.
            Together, these three placements create the personality triangle that influences how you think, feel, and act.
            Understanding this dynamic helps you navigate relationships, career choices, and personal growth with greater clarity.
          </p>
          <p className="leading-relaxed">
            Start your astrological journey today — no signup required.
            Simply enter your birth date, time, and location to generate your free birth chart and uncover the secrets written in the stars.
          </p>
        </div>
      </section>
    </>
  )
}
