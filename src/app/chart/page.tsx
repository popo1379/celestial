import type { Metadata } from 'next'
import ChartView from './page-view'

const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://opensero.com/horoscope').replace(/\/+$/, '')
const ogImage = `${appUrl}/og-image.png`

export const metadata: Metadata = {
  title: 'Your Natal Chart — Free Birth Wheel & Planet Positions | Horoscope SERO',
  description:
    'View your free natal chart wheel with Sun, Moon, Rising sign, 10 planet positions, element distribution, and AI-powered interpretations. Explore the Big Three and house cusps with Western astrology.',
  keywords: [
    'sun moon and rising',
    'sun moon rising sign',
    'big three astrology',
    'natal chart',
    'birth chart',
    'my natal chart',
    'free natal chart reading',
    'birth chart wheel',
    'planet positions',
    'sun sign moon sign rising sign',
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
  return (
    <>
      <h1 className="sr-only">Your Natal Chart — Free Birth Wheel & Planet Positions | Horoscope SERO</h1>
      <ChartView />
      <section className="relative z-10 mx-auto max-w-4xl px-4 pb-16 pt-8 text-sm text-[#8a8885]">
        <div className="rounded-2xl border border-[#1e1e2a] bg-[#0f0f15]/80 p-6 sm:p-8">
          <h2 className="mb-4 font-serif text-xl font-semibold text-[#e8e6e3]">Understanding Your Natal Chart</h2>
          <p className="mb-4 leading-relaxed">
            A natal chart (birth chart) is a map of where all the planets were in their journey around the Sun at the exact moment you were born.
            This celestial snapshot reveals your unique astrological fingerprint — a cosmic blueprint that influences your personality, relationships, career path, and life purpose.
            At Horoscope SERO, we use precise Swiss Ephemeris algorithms to calculate accurate planet positions, house cusps, and aspects for your free birth chart.
          </p>
          <h3 className="mb-2 mt-6 font-serif text-lg font-semibold text-[#e8e6e3]">The Big Three: Sun, Moon, and Rising</h3>
          <p className="mb-4 leading-relaxed">
            Your Sun sign represents your core identity, ego, and conscious self — the essence of who you are.
            Your Moon sign governs your emotions, instincts, and inner world — how you react and what makes you feel secure.
            Your Rising sign (Ascendant) is the lens through which the world sees you — it shapes your appearance, first impressions, and approach to new experiences.
            Together, these three placements form the personality triangle that astrologers consider the foundation of your chart.
            Understanding your Sun, Moon, and Rising combination helps you navigate life with greater self-awareness and authenticity.
          </p>
          <h3 className="mb-2 mt-6 font-serif text-lg font-semibold text-[#e8e6e3]">Planets, Houses, and Aspects</h3>
          <p className="mb-4 leading-relaxed">
            Beyond the Big Three, your natal chart contains ten planets, each representing different facets of your psyche.
            Mercury governs communication and thinking patterns. Venus rules love, beauty, and values. Mars drives ambition, passion, and assertiveness.
            Jupiter brings expansion, luck, and wisdom, while Saturn teaches discipline, responsibility, and life lessons.
            The outer planets — Uranus, Neptune, and Pluto — represent generational themes and deep transformational forces.
            These planets fall into twelve houses, each governing a specific area of life such as career, relationships, home, and spirituality.
            The angles (aspects) between planets reveal how these energies interact, creating harmony or tension that shapes your unique life story.
          </p>
          <h3 className="mb-2 mt-6 font-serif text-lg font-semibold text-[#e8e6e3]">How to Read Your Birth Chart</h3>
          <p className="mb-4 leading-relaxed">
            Start by examining your Sun, Moon, and Rising signs to understand your core personality.
            Then look at which houses your planets occupy — this shows where in your life each planetary energy is most active.
            Pay attention to conjunctions (planets close together), which create intense blended energies.
            Trines and sextiles indicate natural talents and flowing opportunities, while squares and oppositions highlight growth areas and internal conflicts.
            Our AI astrology chat can help you interpret these placements in plain language, offering personalized insights based on your unique chart configuration.
          </p>
          <p className="leading-relaxed">
            Generate your free natal chart today and begin exploring the cosmic patterns that make you uniquely you.
            No signup is required — simply enter your birth details and unlock the wisdom written in the stars.
          </p>
        </div>
      </section>
    </>
  )
}
