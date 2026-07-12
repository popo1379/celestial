'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useSynastryStore } from '@/stores/synastry-store'
import { useAuth } from '@/hooks/useAuth'
import { useTranslation } from '@/hooks/useTranslation'
import { calculateFullNatalChart, calculateSynastryChart, calculateCompositeChart, getSignElement } from '@/lib/astrology/engine'
import { getSynastryAspectInterpretation } from '@/lib/astrology/interpretation'
import { AIInterpretButton } from '@/components/ai/AIInterpretButton'
import { AIChatDrawer } from '@/components/ai/AIChatDrawer'
import Link from 'next/link'
import type { ChartResult, SynastryResult, CompositeChartResult, AspectResult, PlanetPosition, HouseOverlayItem } from '@/lib/astrology/engine'

function DegreeDisplay({ degree }: { degree: number }) {
  const deg = Math.floor(degree)
  const min = Math.floor((degree - deg) * 60)
  return (
    <span>
      {deg}°{min.toString().padStart(2, '0')}'
    </span>
  )
}

function PlanetTag({ name, symbol, signName }: { name: string; symbol: string; signName?: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="text-lg">{symbol}</span>
      <span className="font-medium text-[#e8e6e3]">{name}</span>
      {signName && <span className="text-[#c9a96e] text-xs">{signName}</span>}
    </span>
  )
}

function getScoreColor(score: number): string {
  if (score >= 75) return 'text-emerald-400'
  if (score >= 55) return 'text-[#c9a96e]'
  if (score >= 40) return 'text-orange-400'
  return 'text-red-400'
}

function getScoreRingColor(score: number): string {
  if (score >= 75) return 'stroke-emerald-400'
  if (score >= 55) return 'stroke-[#c9a96e]'
  if (score >= 40) return 'stroke-orange-400'
  return 'stroke-red-400'
}

function getScoreLabel(score: number): string {
  if (score >= 75) return 'Strong'
  if (score >= 55) return 'Moderate'
  if (score >= 40) return 'Strained'
  return 'Challenging'
}

function LoadingSpinner({ text }: { text: string }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[#c9a96e] border-t-transparent" />
        <p className="text-sm text-[#6a6865]">{text}</p>
      </div>
    </div>
  )
}

function CompatibilityScoreCard({ synastry }: { synastry: SynastryResult }) {
  const { t } = useTranslation()
  const score = synastry.compatibilityScore
  const circumference = 2 * Math.PI * 54
  const offset = circumference - (score / 100) * circumference

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl border border-[#1e1e2a] bg-[#14141d]/80 backdrop-blur-sm p-6 sm:p-8 text-center"
    >
      <h2 className="mb-6 font-serif text-xl font-semibold text-[#e8e6e3]">
        {t('synastry.compatibilityScore')}
      </h2>

      <div className="flex flex-col items-center">
        <div className="relative">
          <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60" cy="60" r="54"
              fill="none"
              stroke="#1e1e2a"
              strokeWidth="6"
            />
            <motion.circle
              cx="60" cy="60" r="54"
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              className={getScoreRingColor(score)}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className={`text-4xl font-bold font-serif ${getScoreColor(score)}`}
            >
              {score}
            </motion.span>
          </div>
        </div>

        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className={`mt-3 text-sm font-medium ${getScoreColor(score)}`}
        >
          {getScoreLabel(score)}
        </motion.span>
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            {t('synastry.harmonious')}
          </span>
          <span className="text-[#e8e6e3] font-medium">{synastry.positiveCount}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-red-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            {t('synastry.challenging')}
          </span>
          <span className="text-[#e8e6e3] font-medium">{synastry.challengeCount}</span>
        </div>

        <div className="pt-3 border-t border-[#1e1e2a]">
          <div className="flex justify-between text-xs text-[#6a6865] mb-2">
            <span>{t('synastry.ratio')}</span>
            <span>{synastry.positiveCount}:{synastry.challengeCount}</span>
          </div>
          <div className="h-2 bg-[#1e1e2a] rounded-full overflow-hidden flex">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${synastry.totalAspects > 0 ? (synastry.positiveCount / synastry.totalAspects) * 100 : 0}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full bg-emerald-400 rounded-full"
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${synastry.totalAspects > 0 ? (synastry.challengeCount / synastry.totalAspects) * 100 : 0}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full bg-red-400 rounded-full"
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function AspectsTable({ aspects }: { aspects: AspectResult[] }) {
  const { t } = useTranslation()
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  if (aspects.length === 0) {
    return (
      <div className="rounded-xl border border-[#1e1e2a] bg-[#14141d]/80 backdrop-blur-sm p-6 text-center">
        <p className="text-[#6a6865] text-sm">{t('synastry.noAspects')}</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-[#1e1e2a] bg-[#14141d]/80 backdrop-blur-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1e1e2a] bg-[#0f0f15]">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6a6865]">{t('synastry.personALabel')}</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6a6865]">{t('synastry.aspect')}</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6a6865]">{t('synastry.personBLabel')}</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6a6865]">{t('synastry.orb')}</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6a6865]">{t('synastry.nature')}</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6a6865]">{t('synastry.details')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e2a]">
            {aspects.map((aspect, idx) => {
              const isExpanded = expandedIndex === idx
              const interpretation = getSynastryAspectInterpretation(
                aspect.planetA?.name ?? '',
                aspect.englishName,
                aspect.planetB?.name ?? ''
              )

              return (
                <motion.tr
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className={`transition-colors ${isExpanded ? 'bg-[#1e1e2a]/40' : 'hover:bg-[#1e1e2a]/20'}`}
                >
                  <td className="px-4 py-3">
                    <PlanetTag
                      name={aspect.planetA?.name ?? ''}
                      symbol={aspect.planetA?.symbol ?? ''}
                      signName={aspect.planetA?.signName}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2">
                      <span className="text-base">{aspect.symbol}</span>
                      <span className="text-[#e8e6e3]">{aspect.englishName}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <PlanetTag
                      name={aspect.planetB?.name ?? ''}
                      symbol={aspect.planetB?.symbol ?? ''}
                      signName={aspect.planetB?.signName}
                    />
                  </td>
                  <td className="px-4 py-3 text-[#a8a6a3]">
                    {aspect.orb.toFixed(1)}°
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      aspect.friendly
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${aspect.friendly ? 'bg-emerald-400' : 'bg-red-400'}`} />
                      {aspect.friendly ? t('synastry.harmonious') : t('synastry.challenging')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                      className="text-[#c9a96e] hover:text-[#b8964f] transition-colors text-xs font-medium"
                    >
                      {isExpanded ? t('synastry.less') : t('synastry.more')}
                    </button>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {expandedIndex !== null && aspects[expandedIndex] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-[#1e1e2a]"
          >
            <div className="px-4 py-4 bg-[#0f0f15]">
              <p className="text-sm text-[#a8a6a3] leading-relaxed">
                {getSynastryAspectInterpretation(
                  aspects[expandedIndex].planetA?.name ?? '',
                  aspects[expandedIndex].englishName,
                  aspects[expandedIndex].planetB?.name ?? ''
                )}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function HouseOverlaySection({
  title,
  items,
  fromLabel,
  toLabel,
}: {
  title: string
  items: HouseOverlayItem[]
  fromLabel: string
  toLabel: string
}) {
  const { t } = useTranslation()

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-[#1e1e2a] bg-[#14141d]/80 backdrop-blur-sm p-6">
        <h3 className="font-serif text-lg font-semibold text-[#e8e6e3] mb-4">{title}</h3>
        <p className="text-sm text-[#6a6865]">No house overlay data available.</p>
      </div>
    )
  }

  const grouped: Record<number, HouseOverlayItem[]> = {}
  for (const item of items) {
    if (!grouped[item.house]) grouped[item.house] = []
    grouped[item.house].push(item)
  }

  return (
    <div className="rounded-xl border border-[#1e1e2a] bg-[#14141d]/80 backdrop-blur-sm p-6">
      <h3 className="font-serif text-lg font-semibold text-[#e8e6e3] mb-1">{title}</h3>
      <p className="text-xs text-[#6a6865] mb-5">
        {fromLabel}{t('synastry.planetsInHouses')} {toLabel}{t('synastry.houses')}
      </p>

      <div className="space-y-3">
        {Object.entries(grouped).sort(([a], [b]) => Number(a) - Number(b)).map(([houseNum, planets]) => (
          <div
            key={houseNum}
            className="rounded-lg border border-[#1e1e2a] bg-[#0f0f15] p-3"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-[#c9a96e]">
                House {houseNum}
              </span>
              <span className="text-[10px] text-[#6a6865]">
                {t(`house.${houseNum}`)}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {planets.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#1e1e2a] text-xs text-[#e8e6e3]"
                >
                  <span>{item.planet.symbol}</span>
                  {item.planet.name}
                  {item.planet.signName && (
                    <span className="text-[#c9a96e]">{item.planet.signName}</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CompositeChartSection({ composite }: { composite: CompositeChartResult }) {
  const [isOpen, setIsOpen] = useState(false)

  const sortedPlanets = useMemo(() => {
    const order = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']
    return [...composite.planets].sort(
      (a, b) => order.indexOf(a.name) - order.indexOf(b.name)
    )
  }, [composite.planets])

  return (
    <div className="rounded-xl border border-[#1e1e2a] bg-[#14141d]/80 backdrop-blur-sm overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 text-left transition-colors hover:bg-[#0f0f15]"
      >
        <div>
          <h2 className="font-serif text-xl font-semibold text-[#e8e6e3]">
            Composite Chart
          </h2>
          <p className="text-xs text-[#6a6865] mt-0.5">
            The midpoint chart of your combined energies
          </p>
        </div>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="w-5 h-5 text-[#6a6865] flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-[#1e1e2a]"
          >
            <div className="px-6 py-5 space-y-6">
              {composite.ascendant && (
                <div className="flex items-center gap-3 pb-4 border-b border-[#1e1e2a]">
                  <span className="text-xl">ASC</span>
                  <div>
                    <span className="font-medium text-[#e8e6e3]">{composite.ascendant.signName}</span>
                    <span className="text-[#a8a6a3] ml-2">
                      <DegreeDisplay degree={composite.ascendant.degreeInSign ?? 0} />
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sortedPlanets.map((planet, idx) => (
                  <motion.div
                    key={planet.name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center gap-3 rounded-lg border border-[#1e1e2a] bg-[#0f0f15] px-3 py-2.5"
                  >
                    <span className="text-xl w-8 text-center">{planet.symbol}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[#e8e6e3]">{planet.name}</span>
                        <span className="text-xs text-[#c9a96e]">{planet.signName}</span>
                      </div>
                      <div className="text-xs text-[#6a6865]">
                        <DegreeDisplay degree={planet.degreeInSign ?? 0} />
                        {planet.house && <span> · House {planet.house}</span>}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {composite.natalAspects && composite.natalAspects.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-[#a8a6a3] mb-3 uppercase tracking-wider">
                    Composite Aspects
                  </h3>
                  <div className="space-y-1.5">
                    {composite.natalAspects.map((asp, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 text-sm rounded-lg border border-[#1e1e2a] bg-[#0f0f15] px-3 py-2"
                      >
                        <span className="text-base">{asp.symbol}</span>
                        <span className="text-[#e8e6e3]">{asp.englishName}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          asp.friendly ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'
                        }`}>
                          {asp.friendly ? '+' : '–'}
                        </span>
                        <span className="text-[#6a6865] text-xs ml-auto">{asp.orb.toFixed(1)}°</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function SynastryResultPage() {
  const { t } = useTranslation()
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { personA, personB } = useSynastryStore()

  const [chartA, setChartA] = useState<ChartResult | null>(null)
  const [chartB, setChartB] = useState<ChartResult | null>(null)
  const [synastry, setSynastry] = useState<SynastryResult | null>(null)
  const [composite, setComposite] = useState<CompositeChartResult | null>(null)
  const [calculating, setCalculating] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return

    if (!personA || !personB) {
      router.replace('/synastry')
      return
    }

    if (!user) {
      setCalculating(false)
      return
    }

    setCalculating(true)
    setError(null)

    try {
      const resultA = calculateFullNatalChart(personA)
      const resultB = calculateFullNatalChart(personB)

      if (!resultA.planets.length || !resultB.planets.length) {
        setError('Unable to calculate one or both charts. Please check the birth details.')
        setCalculating(false)
        return
      }

      const synastryResult = calculateSynastryChart(resultA, resultB)
      const compositeResult = calculateCompositeChart(resultA, resultB)

      setChartA(resultA)
      setChartB(resultB)
      setSynastry(synastryResult)
      setComposite(compositeResult)
    } catch (e) {
      console.error('Synastry calculation error:', e)
      setError('An error occurred while calculating the synastry chart.')
    }

    setCalculating(false)
  }, [personA, personB, user, authLoading, router])

  if (authLoading || calculating) {
    return (
      <main className="min-h-screen bg-[#0a0a0f]">
        <LoadingSpinner text={t('synastry.loadingSynastry')} />
      </main>
    )
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#0a0a0f] px-4 pb-24 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md mt-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-[#1e1e2a] bg-[#14141d]/80 backdrop-blur-sm p-8"
          >
            <span className="text-3xl">🔒</span>
            <h2 className="mt-4 font-serif text-xl font-semibold text-[#e8e6e3]">
              Sign in to View Results
            </h2>
            <p className="mt-2 text-sm text-[#6a6865]">
              Synastry results are available for signed-in users.
            </p>
            <button
              onClick={() => router.push('/auth/signin')}
              className="mt-6 inline-block rounded-lg bg-[#c9a96e] px-8 py-3 font-medium text-[#0a0a0f] transition-colors hover:bg-[#b8964f]"
            >
              Sign In
            </button>
          </motion.div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#0a0a0f] px-4 pb-24 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md mt-16 text-center">
          <div className="rounded-xl border border-red-500/20 bg-[#14141d]/80 backdrop-blur-sm p-8">
            <span className="text-3xl">⚠️</span>
            <h2 className="mt-4 font-serif text-xl font-semibold text-[#e8e6e3]">
              Calculation Error
            </h2>
            <p className="mt-2 text-sm text-[#a8a6a3]">{error}</p>
            <button
              onClick={() => router.push('/synastry')}
              className="mt-6 inline-block rounded-lg bg-[#c9a96e] px-8 py-3 font-medium text-[#0a0a0f] transition-colors hover:bg-[#b8964f]"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] px-4 pb-24 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#e8e6e3]">
            Synastry Results
          </h1>
          <p className="mt-2 text-sm text-[#6a6865]">
            {chartA?.sun.signName} Sun · {chartA?.moon.signName} Moon
            {' '}&mdash;{' '}
            {chartB?.sun.signName} Sun · {chartB?.moon.signName} Moon
          </p>
          <div className="mt-3 h-px w-16 mx-auto bg-gradient-to-r from-transparent via-[#c9a96e]/60 to-transparent" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            {synastry && <CompatibilityScoreCard synastry={synastry} />}
          </div>

          <div className="lg:col-span-2 space-y-4">
            {chartA && chartB && (
              <div className="rounded-xl border border-[#1e1e2a] bg-[#14141d]/80 backdrop-blur-sm p-5">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <span className="text-xs font-medium uppercase tracking-wider text-[#6a6865]">{t('synastry.personALabel')}</span>
                    <div className="mt-1 text-sm text-[#e8e6e3]">
                      <span className="text-lg">{chartA.sun.symbol}</span> {chartA.sun.signName} Sun
                    </div>
                    <div className="text-xs text-[#a8a6a3]">
                      <span>{chartA.moon.symbol}</span> {chartA.moon.signName} Moon
                      {chartA.ascendant && <span> · {chartA.ascendant.signName} Rising</span>}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-medium uppercase tracking-wider text-[#6a6865]">{t('synastry.personBLabel')}</span>
                    <div className="mt-1 text-sm text-[#e8e6e3]">
                      <span className="text-lg">{chartB.sun.symbol}</span> {chartB.sun.signName} Sun
                    </div>
                    <div className="text-xs text-[#a8a6a3]">
                      <span>{chartB.moon.symbol}</span> {chartB.moon.signName} Moon
                      {chartB.ascendant && <span> · {chartB.ascendant.signName} Rising</span>}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-8 flex justify-center">
          <AIInterpretButton contextType="synastry" />
        </div>

        <div className="mb-8">
          <h2 className="mb-4 font-serif text-xl font-semibold text-[#e8e6e3]">
            {t('synastry.aspects')}
          </h2>
          {synastry && <AspectsTable aspects={synastry.aspects} />}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {synastry && (
            <>
              <HouseOverlaySection
                title={`${t('synastry.personALabel')}${t('synastry.planetsInHouses')} ${t('synastry.personBLabel')}${t('synastry.houses')}`}
                items={synastry.houseOverlay.AintoB}
                fromLabel={t('synastry.personALabel')}
                toLabel={t('synastry.personBLabel')}
              />
              <HouseOverlaySection
                title={`${t('synastry.personBLabel')}${t('synastry.planetsInHouses')} ${t('synastry.personALabel')}${t('synastry.houses')}`}
                items={synastry.houseOverlay.BintoA}
                fromLabel={t('synastry.personBLabel')}
                toLabel={t('synastry.personALabel')}
              />
            </>
          )}
        </div>

        <div className="mb-8">
          {composite && <CompositeChartSection composite={composite} />}
        </div>

        <div className="text-center">
          <Link
            href="/synastry"
            className="inline-flex items-center gap-2 text-sm text-[#c9a96e] hover:text-[#b8964f] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Compare Different Profiles
          </Link>
        </div>
      </div>
      <AIChatDrawer
        contextType="synastry"
        chart={chartA}
        chartB={chartB}
        synastry={synastry}
      />
    </main>
  )
}
