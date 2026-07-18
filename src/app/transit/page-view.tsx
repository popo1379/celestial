'use client'

import { useAuth } from '@/hooks/useAuth'
import { useGuestChartStore } from '@/stores/guest-store'
import {
  calculateFullNatalChart,
  calculateDailyFortune,
  type ChartResult,
  type DailyFortuneResult,
  type TransitEvent,
} from '@/lib/astrology/engine'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/hooks/useTranslation'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`h-4 w-4 ${star <= rating ? 'text-accent-gold' : 'text-[#2a2a35]'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function IntensityDots({ intensity }: { intensity: number }) {
  const fullDots = Math.min(10, Math.max(1, Math.round(intensity)))
  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className={`h-1.5 w-1.5 rounded-full ${
              i < fullDots ? 'bg-accent-gold' : 'bg-[#1e1e2a]'
            }`}
          />
        ))}
      </div>
      <span className="ml-1 text-[10px] text-text-tertiary">{intensity}</span>
    </div>
  )
}

function TransitEventCard({ event, index }: { event: TransitEvent; index: number }) {
  const { t } = useTranslation()
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="rounded-xl border border-[#1e1e2a] bg-bg-secondary p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="truncate text-sm font-semibold text-text-primary">
              {event.title}
            </h4>
            <span
              className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                event.friendly
                  ? 'bg-positive/15 text-positive'
                  : 'bg-challenging/15 text-challenging'
              }`}
            >
              {event.friendly ? t('transit.friendly') : t('transit.challenging')}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-text-tertiary">
            {event.domain && (
              <span>{t(`domain.${event.domain.toLowerCase()}`)}</span>
            )}
            {event.house && <span>{t('transit.house')} {event.house}</span>}
            {event.orb > 0 && <span>{t('transit.orb')}: {event.orb.toFixed(1)}°</span>}
          </div>
          {event.keywords.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {event.keywords.slice(0, 3).map((kw) => (
                <span
                  key={kw}
                  className="rounded-full bg-[#1a1a25] px-2 py-0.5 text-[10px] text-text-tertiary"
                >
                  {kw}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="shrink-0 pt-0.5">
          <IntensityDots intensity={event.intensity} />
        </div>
      </div>
    </motion.div>
  )
}

export default function TransitView() {
  const { user, loading: authLoading } = useAuth()
  const { t, locale } = useTranslation()
  const birthInfo = useGuestChartStore((s) => s.birthInfo)
  const [fortune, setFortune] = useState<DailyFortuneResult | null>(null)
  const [chartLoading, setChartLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!user || !birthInfo) {
      setChartLoading(false)
      setFortune(null)
      return
    }
    setChartLoading(true)
    try {
      const natalChart: ChartResult = calculateFullNatalChart(birthInfo)
      const house1Cusp = natalChart.ascendant
        ? natalChart.ascendant.signIndex! * 30
        : undefined

      const now = new Date()
      const result = calculateDailyFortune(
        natalChart,
        {
          year: now.getFullYear(),
          month: now.getMonth() + 1,
          day: now.getDate(),
        },
        house1Cusp,
      )

      setFortune(result)
    } catch {
      setFortune(null)
    }
    setChartLoading(false)
  }, [authLoading, user, birthInfo])

  const today = new Date()
  const formattedDate = today.toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  if (authLoading || chartLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-accent-gold border-t-transparent" />
          <p className="text-sm text-text-tertiary">{t('transit.calculating')}</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-bg-primary px-4 pb-24 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2 text-center"
          >
            <h1 className="font-serif text-3xl font-bold text-text-primary">
              {t('transit.title')}
            </h1>
            <p className="mt-1 text-sm text-text-tertiary">{formattedDate}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-10 max-w-lg rounded-xl border border-accent-gold/20 bg-gradient-to-b from-bg-elevated to-bg-secondary p-8 text-center"
          >
            <span className="text-4xl">✨</span>
            <h2 className="mt-4 font-serif text-2xl font-bold text-text-primary">
              {t('transit.signinSee')}
            </h2>
            <p className="mt-2 text-sm text-text-tertiary">
              {t('transit.discoverMoving')}
            </p>
            <ul className="mx-auto mt-6 max-w-xs space-y-3 text-left">
              {[
                t('transit.personalizedScore'),
                t('transit.planetaryEvents'),
                t('transit.luckyColorNumber'),
              ].map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-3 text-sm text-text-secondary"
                >
                  <span className="text-accent-gold">✦</span>
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href="/auth/signin"
              className="mt-8 inline-block rounded-lg bg-accent-gold px-8 py-3 font-medium text-black transition-colors hover:bg-accent-gold/90"
            >
              {t('nav.signin')}
            </Link>
          </motion.div>
        </div>
      </main>
    )
  }

  if (user && !birthInfo) {
    return (
      <main className="min-h-screen bg-bg-primary px-4 pb-24 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2 text-center"
          >
            <h1 className="font-serif text-3xl font-bold text-text-primary">
              {t('transit.title')}
            </h1>
            <p className="mt-1 text-sm text-text-tertiary">{formattedDate}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-10 max-w-lg rounded-xl border border-accent-gold/20 bg-gradient-to-b from-bg-elevated to-bg-secondary p-8 text-center"
          >
            <span className="text-4xl">🌙</span>
            <h2 className="mt-4 font-serif text-2xl font-bold text-text-primary">
              {t('transit.generateFirst')}
            </h2>
            <p className="mt-2 text-sm text-text-tertiary">
              {t('transit.enterBirthDetails')}
            </p>
            <Link
              href="/"
              className="mt-8 inline-block rounded-lg bg-accent-gold px-8 py-3 font-medium text-black transition-colors hover:bg-accent-gold/90"
            >
              {t('transit.enterBirthDetailsBtn')}
            </Link>
          </motion.div>
        </div>
      </main>
    )
  }

  const events = fortune?.events.filter((e) => e.type !== 'house') ?? []
  const houseEvents = fortune?.events.filter((e) => e.type === 'house') ?? []

  return (
    <main className="min-h-screen bg-bg-primary px-4 pb-24 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="font-serif text-3xl font-bold text-text-primary">
            {t('transit.title')}
          </h1>
          <p className="mt-1 text-sm text-text-tertiary">{formattedDate}</p>
        </motion.div>

        {fortune && (
          <>
            <section className="mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="rounded-2xl border border-[#1e1e2a] bg-bg-elevated p-6 sm:p-8"
              >
                <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
                  <div className="flex shrink-0 flex-col items-center">
                    <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-accent-gold/30">
                      <span className="font-serif text-5xl font-bold text-accent-gold">
                        {fortune.score}
                      </span>
                    </div>
                    <div className="mt-3">
                      <StarRating rating={fortune.starRating} />
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div>
                      <span className="text-xs font-medium tracking-wider uppercase text-text-tertiary">
                        {t('transit.score')}
                      </span>
                      <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                        {fortune.score >= 85
                          ? t('transit.scoreExcellent')
                          : fortune.score >= 70
                          ? t('transit.scoreFavorable')
                          : fortune.score >= 60
                          ? t('transit.scoreMixed')
                          : t('transit.scoreChallenging')}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                      <div className="rounded-xl border border-[#1e1e2a] bg-bg-secondary p-3 text-center">
                        <span className="text-[10px] font-medium uppercase tracking-wider text-text-tertiary">
                          {t('transit.luckyNumber')}
                        </span>
                        <p className="mt-1 font-serif text-2xl font-bold text-accent-gold">
                          {fortune.luckyNumber}
                        </p>
                      </div>
                      <div className="rounded-xl border border-[#1e1e2a] bg-bg-secondary p-3 text-center">
                        <span className="text-[10px] font-medium uppercase tracking-wider text-text-tertiary">
                          {t('transit.luckyColor')}
                        </span>
                        <p className="mt-1 font-serif text-2xl font-bold text-accent-gold">
                          {fortune.luckyColor}
                        </p>
                      </div>
                      <div className="col-span-2 rounded-xl border border-[#1e1e2a] bg-bg-secondary p-3 text-center sm:col-span-1">
                        <span className="text-[10px] font-medium uppercase tracking-wider text-text-tertiary">
                          {t('transit.todaysMoon')}
                        </span>
                        <p className="mt-1 font-serif text-2xl font-bold text-accent-gold">
                          {fortune.transitMoonSign}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#1e1e2a]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${fortune.score}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`h-full rounded-full ${
                      fortune.score >= 80
                        ? 'bg-gradient-to-r from-positive to-positive/60'
                        : fortune.score >= 60
                        ? 'bg-gradient-to-r from-accent-gold to-accent-gold/60'
                        : 'bg-gradient-to-r from-challenging to-challenging/60'
                    }`}
                  />
                </div>
              </motion.div>
            </section>

            <section className="mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="mb-4 font-serif text-xl font-semibold text-text-primary">
                  {t('transit.keyEvents')}
                </h2>
                {events.length > 0 ? (
                  <div className="space-y-2">
                    {events.slice(0, 10).map((event, i) => (
                      <TransitEventCard key={`${event.title}-${i}`} event={event} index={i} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-[#1e1e2a] bg-bg-elevated p-6 text-center">
                    <p className="text-sm text-text-tertiary">
                      {t('transit.noEvents')}
                    </p>
                  </div>
                )}
              </motion.div>
            </section>

            {houseEvents.length > 0 && (
              <section className="mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <h2 className="mb-4 font-serif text-xl font-semibold text-text-primary">
                    {t('transit.housePlacements')}
                  </h2>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {houseEvents.slice(0, 6).map((event, i) => (
                      <motion.div
                        key={`house-${i}`}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="rounded-xl border border-[#1e1e2a] bg-bg-secondary p-4"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-text-primary">
                            {event.transitPlanet?.name}
                          </span>
                          <span className="text-xs text-accent-gold">
                            {event.transitPlanet?.signName}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-text-tertiary">
                          {t('transit.house')} {event.house} &middot; {t(`domain.${event.domain.toLowerCase()}`)}
                        </p>
                        {event.keywords.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {event.keywords.slice(0, 3).map((kw) => (
                              <span
                                key={kw}
                                className="rounded-full bg-[#1a1a25] px-1.5 py-0.5 text-[10px] text-text-tertiary"
                              >
                                {kw}
                              </span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </section>
            )}

            <section className="mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-xl border border-[#1e1e2a] bg-bg-elevated p-6"
              >
                <h2 className="mb-4 font-serif text-xl font-semibold text-text-primary">
                  {t('transit.moonVibes')}
                </h2>
                <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-accent-gold/10">
                    <span className="text-4xl">☽</span>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <p className="text-lg font-semibold text-text-primary">
                      {t('transit.moonIn')} {fortune.transitMoonSign}
                    </p>
                    {fortune.transitMoonSign && (
                      <>
                        <p className="mt-1 text-sm font-medium text-accent-gold">
                          {t(`moon.${fortune.transitMoonSign.toLowerCase()}.vibe`)}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                          {t(`moon.${fortune.transitMoonSign.toLowerCase()}.desc`)}
                        </p>
                      </>
                    )}
                    <p className="mt-3 text-xs text-text-tertiary">
                      {t('transit.yourSunIn')} {fortune.natalSign}
                      {fortune.ascSign ? ` ${t('transit.withRising')} ${fortune.ascSign} ${t('transit.risingSuffix')}` : ''}
                    </p>
                  </div>
                </div>
              </motion.div>
            </section>
          </>
        )}
      </div>
    </main>
  )
}
