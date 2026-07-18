'use client'

import { useGuestChartStore } from '@/stores/guest-store'
import { useAuth } from '@/hooks/useAuth'
import { computeChart } from '@/lib/chart-utils'
import { AstrologyWheel } from '@/components/chart'
import {
  getSignElement,
  signElements,
  type ChartResult,
  type PlanetPosition,
} from '@/lib/astrology/engine'
import { planetInterpretations } from '@/lib/astrology/interpretation'
import { AIInterpretButton } from '@/components/ai/AIInterpretButton'
import { AIChatDrawer } from '@/components/ai/AIChatDrawer'
import { SaveProfileModal } from '@/components/profile/SaveProfileModal'
import { useTranslation } from '@/hooks/useTranslation'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const elementColors: Record<string, string> = {
  Fire: 'bg-orange-400',
  Earth: 'bg-emerald-500',
  Air: 'bg-amber-200',
  Water: 'bg-blue-400',
}

const elementSymbols: Record<string, string> = {
  Fire: '▲',
  Earth: '◆',
  Air: '○',
  Water: '▼',
}

function DegreeDisplay({ degree }: { degree: number }) {
  const deg = Math.floor(degree)
  const min = Math.floor((degree - deg) * 60)
  return (
    <span className="text-text-secondary text-sm">
      {deg}°{min.toString().padStart(2, '0')}'
    </span>
  )
}

function ElementBadge({ element }: { element: string }) {
  const { t } = useTranslation()
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium text-black ${
        elementColors[element] || 'bg-text-tertiary'
      }`}
    >
      <span className="text-[10px]">{elementSymbols[element] || ''}</span>
      {t(`element.${element.toLowerCase()}`)}
    </span>
  )
}

function BigThreeCard({
  label,
  planet,
  symbol,
  signName,
  degree,
  element,
}: {
  label: string
  planet?: PlanetPosition
  symbol: string
  signName: string
  degree: number
  element: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center rounded-xl border border-accent-gold/30 bg-bg-elevated p-6 text-center"
    >
      <span className="mb-1 text-xs uppercase tracking-widest text-text-tertiary">
        {label}
      </span>
      <span className="mb-2 text-5xl">{symbol}</span>
      <span className="mb-1 text-xl font-semibold text-text-primary">
        {signName}
      </span>
      <DegreeDisplay degree={degree} />
      <div className="mt-3">
        <ElementBadge element={element} />
      </div>
    </motion.div>
  )
}

function PlanetCard({
  planet,
  index,
  isLocked,
}: {
  planet: PlanetPosition
  index: number
  isLocked: boolean
}) {
  const [open, setOpen] = useState(false)
  const interpretation = planetInterpretations[planet.name]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`rounded-xl border ${
        open ? 'border-accent-gold/50' : 'border-bg-secondary'
      } bg-bg-elevated transition-colors`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-4 px-5 py-4 text-left"
      >
        <span className="w-8 text-center text-2xl">{planet.symbol}</span>
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className="font-medium text-text-primary">{planet.name}</span>
            <span className="text-sm text-accent-gold">{planet.signName}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-tertiary">
            <DegreeDisplay degree={planet.degreeInSign ?? 0} />
            {planet.house && <span>House {planet.house}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isLocked && (
            <span className="text-sm text-text-tertiary">🔒</span>
          )}
          <motion.svg
            animate={{ rotate: open ? 180 : 0 }}
            className="h-4 w-4 text-text-tertiary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </div>
      </button>
      <AnimatePresence>
        {open && interpretation && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-bg-secondary"
          >
            <div className="px-5 py-4">
              <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-accent-gold-dim">
                {interpretation.domain}
              </span>
              <p className="text-sm leading-relaxed text-text-secondary">
                {interpretation.description}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {interpretation.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="rounded-full bg-bg-secondary px-2 py-0.5 text-xs text-text-tertiary"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function ElementBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? (count / total) * 100 : 0
  return (
    <div className="flex items-center gap-3">
      <span className="w-16 text-right text-sm font-medium text-text-secondary">
        {label}
      </span>
      <div className="h-3 flex-1 overflow-hidden rounded-full bg-bg-secondary">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
      <span className="w-6 text-right text-sm text-text-tertiary">{count}</span>
    </div>
  )
}

export default function ChartView() {
  const { t } = useTranslation()
  const { birthInfo } = useGuestChartStore()
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [chart, setChart] = useState<ChartResult | null>(null)
  const [chartLoading, setChartLoading] = useState(true)
  const [saveModalOpen, setSaveModalOpen] = useState(false)
  const [showSaveToast, setShowSaveToast] = useState(false)

  const isLoggedIn = !!user

  const handleSaveSuccess = () => {
    setSaveModalOpen(false)
    setShowSaveToast(true)
    setTimeout(() => setShowSaveToast(false), 2500)
  }

  useEffect(() => {
    if (authLoading) return
    if (!birthInfo) {
      router.replace('/')
      return
    }
    setChartLoading(true)
    const result = computeChart(birthInfo)
    setChart(result)
    setChartLoading(false)
  }, [birthInfo, authLoading, router])

  if (authLoading || chartLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-accent-gold border-t-transparent" />
          <p className="text-sm text-text-tertiary">{t('chart.calculating')}</p>
        </div>
      </div>
    )
  }

  if (!chart || !chart.planets.length) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary">
        <p className="text-text-tertiary">{t('chart.unable')}</p>
      </div>
    )
  }

  const bigThree = [
    {
      label: t('chart.sun'),
      symbol: chart.sun.symbol,
      signName: chart.sun.signName ?? '',
      degree: chart.sun.degreeInSign ?? 0,
      element: getSignElement(chart.sun.signIndex ?? 0),
    },
    {
      label: t('chart.moon'),
      symbol: chart.moon.symbol,
      signName: chart.moon.signName ?? '',
      degree: chart.moon.degreeInSign ?? 0,
      element: getSignElement(chart.moon.signIndex ?? 0),
    },
    {
      label: t('chart.rising'),
      symbol: chart.ascendant?.symbol ?? 'ASC',
      signName: chart.ascendant?.signName ?? t('chart.unknown'),
      degree: chart.ascendant?.degreeInSign ?? 0,
      element: getSignElement(chart.ascendant?.signIndex ?? 0),
    },
  ]

  const planetsWithIndex = chart.planets.map((p, i) => ({ ...p, index: i }))
  const visiblePlanets = isLoggedIn
    ? planetsWithIndex
    : planetsWithIndex.slice(0, 3)

  const elementCounts: Record<string, number> = { Fire: 0, Earth: 0, Air: 0, Water: 0 }
  for (const p of chart.planets) {
    const el = getSignElement(p.signIndex ?? 0)
    if (elementCounts[el] !== undefined) elementCounts[el]++
  }
  const totalPlanets = chart.planets.length

  return (
    <main className="min-h-screen bg-bg-primary px-4 pb-24 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 text-center"
        >
          <h1 className="font-serif text-3xl font-bold text-text-primary">
            {t('chart.title')}
          </h1>
          <p className="mt-1 text-sm text-text-tertiary">
            {chart.sun.signName} {t('chart.sun')} · {chart.moon.signName} {t('chart.moon')} ·{' '}
            {chart.ascendant ? `${chart.ascendant.signName} ${t('chart.rising')}` : t('chart.unknownRising')}
          </p>
        </motion.div>

        <section className="mb-10">
          <div className="grid gap-4 sm:grid-cols-3">
            {bigThree.map((item) => (
              <BigThreeCard key={item.label} {...item} />
            ))}
          </div>
        </section>

        {/* Chart Wheel Visualization */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl font-semibold text-text-primary">
              {t('chart.chartWheel')}
            </h2>
            <Link
              href="/chart/detail"
              className="flex items-center gap-2 rounded-lg border border-accent-gold/30 bg-bg-elevated px-4 py-2 text-sm font-medium text-accent-gold transition-colors hover:border-accent-gold/60"
            >
              <span>{t('chart.viewFullDetails')}</span>
              <span>→</span>
            </Link>
          </div>
          <div className="flex justify-center">
            <AstrologyWheel
              planets={chart.planets}
              ascendant={chart.ascendant}
              midheaven={chart.midheaven}
              descendant={chart.descendant}
              imumCoeli={chart.imumCoeli}
              moonPhase={chart.moonPhase}
              houseCusps={chart.houseCusps}
              houses={chart.houses}
              size={420}
              interactive={isLoggedIn}
            />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => birthInfo && setSaveModalOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-accent-gold/40 bg-accent-gold/10 px-4 py-2 text-sm font-medium text-accent-gold transition-all duration-200 hover:bg-accent-gold/20"
            >
              <span>💾</span>
              {t('profile.saveChart')}
            </button>
            <Link
              href="/chart/wheel"
              className="flex items-center gap-2 rounded-lg border border-bg-secondary bg-bg-elevated px-4 py-2 text-xs font-medium text-text-tertiary transition-colors hover:border-accent-gold/50 hover:text-accent-gold"
            >
              <span>⛶</span>
              {t('chart.fullscreenView')}
            </Link>
          </div>
        </section>

        {/* AI Interpret */}
        <section className="mb-10 flex justify-center">
          <AIInterpretButton contextType="natal" />
        </section>

        <section className="mb-10">
          <h2 className="mb-4 font-serif text-xl font-semibold text-text-primary">
            {t('chart.planetPositions')}
          </h2>
          <div className="space-y-2">
            {visiblePlanets.map((p) => (
              <PlanetCard key={p.name} planet={p} index={p.index} isLocked={false} />
            ))}
          </div>
          {!isLoggedIn && chart.planets.length > 3 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-xl border border-dashed border-accent-gold/30 bg-bg-elevated px-5 py-6 text-center"
            >
              <p className="mb-2 text-lg">✨</p>
              <p className="mb-1 font-medium text-text-primary">
                {t('chart.signinUnlock')}
              </p>
              <Link
                href="/auth/signin"
                className="mt-3 inline-block rounded-lg bg-accent-gold px-5 py-2 text-sm font-medium text-black transition-colors hover:bg-accent-gold/90"
              >
                {t('nav.signin')}
              </Link>
            </motion.div>
          )}
        </section>

        <section className="mb-10">
          <h2 className="mb-4 font-serif text-xl font-semibold text-text-primary">
            {t('chart.elementDistribution')}
          </h2>
          <div className="rounded-xl border border-bg-secondary bg-bg-elevated p-5">
            <div className="space-y-3">
              {Object.entries(elementCounts).map(([el, count]) => (
                <ElementBar
                  key={el}
                  label={t(`element.${el.toLowerCase()}`)}
                  count={count}
                  total={totalPlanets}
                  color={elementColors[el] ?? 'bg-text-tertiary'}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 font-serif text-xl font-semibold text-text-primary">
            {t('chart.todaysTransit')}
          </h2>
          <div className="rounded-xl border border-bg-secondary bg-bg-elevated p-6">
            {isLoggedIn ? (
              <div className="flex items-center gap-5">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-accent-gold/40">
                  <span className="font-serif text-3xl font-bold text-accent-gold">78</span>
                </div>
                <div>
                  <p className="font-medium text-text-primary">Transit Score</p>
                  <p className="mt-1 text-sm text-text-tertiary">
                    A favorable energy flow today. More details coming soon.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-2xl text-text-tertiary">🔒</span>
                <div>
                  <p className="font-medium text-text-primary">
                    Sign in to see your daily transit
                  </p>
                  <Link
                    href="/auth/signin"
                    className="mt-1 inline-block text-sm text-accent-gold underline-offset-2 hover:underline"
                  >
                    {t('nav.signin')}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        {!isLoggedIn && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-accent-gold/20 bg-gradient-to-b from-bg-elevated to-bg-secondary p-8 text-center"
          >
            <h2 className="mb-2 font-serif text-2xl font-bold text-text-primary">
              Unlock Your Complete Chart
            </h2>
            <p className="mb-6 text-sm text-text-tertiary">
              Get the full picture of your cosmic blueprint
            </p>
            <ul className="mx-auto mb-8 max-w-sm space-y-3 text-left">
              {[
                'Full planet interpretations',
                'House positions & meanings',
                'Aspect analysis',
                'Daily transits',
                'Synastry compatibility',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-text-secondary">
                  <span className="text-accent-gold">✦</span>
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href="/auth/signin"
              className="inline-block rounded-lg bg-accent-gold px-8 py-3 font-medium text-black transition-colors hover:bg-accent-gold/90"
            >
              Sign In &mdash; It&apos;s Free
            </Link>
          </motion.section>
        )}
      </div>
      <AIChatDrawer contextType="natal" chart={chart} />

      {birthInfo && (
        <SaveProfileModal
          open={saveModalOpen}
          onClose={() => setSaveModalOpen(false)}
          birthInfo={birthInfo}
          maxProfiles={20}
        />
      )}

      <AnimatePresence>
        {showSaveToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-accent-gold/40 bg-bg-elevated px-5 py-3 text-sm font-medium text-text-primary shadow-lg shadow-accent-gold/10 backdrop-blur-sm"
          >
            <span className="mr-2 text-accent-gold">✦</span>
            {t('profile.saveSuccess')}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
