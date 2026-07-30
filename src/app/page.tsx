import type { Metadata } from 'next'
import HomeView from './page-view'

const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://opensero.com/horoscope').replace(/\/+$/, '')
const ogImage = `${appUrl}/og-image.png`

export const metadata: Metadata = {
  title: 'Horoscope SERO — Sun Moon Rising Sign Calculator',
  description:
    'Horoscope SERO: Discover your Sun, Moon, and Rising signs in seconds. Free Big Three astrology chart with precise planet positions, daily transits, synastry compatibility, and AI-powered interpretations. No signup required.',
  keywords: [
    'Horoscope SERO',
    'sun moon and rising',
    'sun moon rising sign',
    'big three astrology',
    'what is my sun moon and rising',
    'sun sign moon sign rising sign calculator',
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
    title: 'Horoscope SERO — Sun Moon Rising Sign Calculator',
    description:
      'Discover your Sun, Moon, and Rising signs in seconds. Free Big Three astrology chart with precise planet positions, transits, and AI interpretations.',
    url: appUrl,
    type: 'website',
    locale: 'en_US',
    siteName: 'Horoscope SERO',
    images: [{ url: ogImage, width: 1200, height: 630, alt: 'Horoscope SERO — Sun Moon Rising Sign Calculator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Horoscope SERO — Sun Moon Rising Sign Calculator',
    description:
      'Discover your Sun, Moon, and Rising signs. Free Big Three astrology chart with daily transits and AI interpretations.',
    images: [ogImage],
  },
}

export default function Page() {
  return (
    <>
      <h2 className="sr-only">Horoscope SERO — Sun Moon Rising Sign Calculator</h2>
      <HomeView />
      <section className="relative z-10 mx-auto max-w-4xl px-4 pb-16 pt-8 text-sm text-[#8a8885]">
        <div className="rounded-2xl border border-[#1e1e2a] bg-[#0f0f15]/80 p-6 sm:p-8">
          <h2 className="mb-4 font-serif text-xl font-semibold text-[#e8e6e3]">Horoscope SERO — Sun Moon Rising Sign Calculator</h2>
          <p className="mb-4 leading-relaxed">
            <strong className="text-[#c9a96e]">Horoscope SERO</strong> (opensero.com/horoscope) is a free online astrology platform designed to help you explore the cosmos within you.
            Discover your Sun, Moon, and Rising signs — the Big Three that form the foundation of your astrological identity.
            Generate your personalized natal chart in seconds using precise Swiss Ephemeris calculations.
            Whether you are a beginner curious about astrology or an experienced seeker looking for deep insights,
            our tools provide accurate planet positions, house cusps, aspects, and element distributions.
          </p>
          <p className="mb-4 leading-relaxed">
            Your birth chart is a celestial snapshot of the sky at the moment you were born.
            It reveals your core personality through the Sun sign, your emotional nature through the Moon sign,
            and your outward demeanor through the Rising sign (Ascendant).
            The Sun represents your core identity and ego — who you are at your essence.
            The Moon governs your emotions, instincts, and subconscious reactions.
            The Rising sign is the mask you wear when meeting the world, shaping first impressions and your approach to new situations.
            Together, these three placements create the personality triangle that influences how you think, feel, and act.
          </p>
          <h3 className="mb-2 mt-6 font-serif text-lg font-semibold text-[#e8e6e3]">What You Can Do Here</h3>
          <ul className="mb-4 list-disc space-y-1 pl-5 leading-relaxed">
            <li>Calculate your Sun, Moon, and Rising signs in seconds</li>
            <li>Generate a free natal chart with precise planet positions</li>
            <li>Explore daily transit horoscopes personalized to your birth chart</li>
            <li>Compare synastry compatibility between two charts</li>
            <li>Get AI-powered astrology interpretations and insights</li>
            <li>Save your birth profiles for quick access</li>
          </ul>
          <h3 className="mb-2 mt-6 font-serif text-lg font-semibold text-[#e8e6e3]">Understanding Your Big Three</h3>
          <p className="mb-4 leading-relaxed">
            The <strong className="text-[#c9a96e]">Sun sign</strong> represents your core identity and ego — who you are at your essence.
            The <strong className="text-[#c9a96e]">Moon sign</strong> governs your emotions, instincts, and inner world — how you react and what makes you feel secure.
            The <strong className="text-[#c9a96e]">Rising sign</strong> (Ascendant) is the lens through which the world sees you — it shapes your appearance, first impressions, and approach to new situations.
            Beyond the Big Three, we calculate the positions of all ten planets — Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, and Pluto —
            across the twelve astrological houses, showing how different areas of your life are influenced by planetary energies.
          </p>
          <p className="leading-relaxed">
            Start your astrological journey today — no signup required.
            Simply enter your birth date, time, and location to calculate your Sun, Moon, and Rising signs and uncover the secrets written in the stars.
          </p>
        </div>
      </section>
    </>
  )
}
