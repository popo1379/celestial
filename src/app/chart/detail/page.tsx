'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useGuestChartStore } from '@/stores/guest-store'
import { useAuth } from '@/hooks/useAuth'
import { useTranslation, useSignTranslator, usePlanetTranslator, useAspectTranslator, useModeTranslator, useMoonPhaseTranslator } from '@/hooks/useTranslation'
import { AstrologyWheel } from '@/components/chart'
import {
  calculateFullNatalChart,
  getSignElement,
  getSignMode,
  type ChartResult,
  type AspectResult,
  type PlanetPosition,
  type HouseCusp,
  type AxisPoint,
  type MoonPhaseResult,
  type AsteroidResult,
} from '@/lib/astrology/engine'
import {
  planetInterpretations,
  signInterpretations,
  houseInterpretations,
  aspectInterpretations,
  moonPhaseInterpretations,
  asteroidInterpretations,
} from '@/lib/astrology/interpretation'

function DegreeDisplay({ degree }: { degree: number }) {
  const deg = Math.floor(degree)
  const min = Math.floor((degree - deg) * 60)
  return (
    <span className="text-[#a8a6a3] text-sm">
      {deg}°{min.toString().padStart(2, '0')}'
    </span>
  )
}

const aspectSymbols: Record<string, string> = {
  Conjunction: '☌',
  Sextile: '⚹',
  Square: '□',
  Trine: '△',
  Opposition: '☍',
}

function AspectsTab({ aspects }: { aspects: AspectResult[] }) {
  const { t } = useTranslation()
  const { translateAspect } = useAspectTranslator()
  const { translatePlanet } = usePlanetTranslator()
  const { translateSign } = useSignTranslator()
  const [filter, setFilter] = useState<string>('All')
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const aspectTypes = ['All', 'Conjunction', 'Sextile', 'Square', 'Trine', 'Opposition'] as const

  const filtered = useMemo(() => {
    if (filter === 'All') return aspects
    return aspects.filter((a) => a.type === filter)
  }, [aspects, filter])

  if (!aspects.length) {
    return (
      <div className="rounded-xl border border-[#1e1e2a] bg-[#0f0f15] p-6 text-center">
        <p className="text-sm text-[#6a6865]">{t('chartDetail.noAspects')}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {aspectTypes.map((type) => (
          <button
            key={type}
            onClick={() => { setFilter(type); setExpandedIndex(null) }}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === type
                ? 'border border-[#c9a96e] text-[#c9a96e] bg-[#c9a96e]/10'
                : 'border border-[#1e1e2a] text-[#6a6865] bg-[#0f0f15] hover:text-[#a8a6a3]'
            }`}
          >
            {type === 'All' ? t('aspect.matrix.all') : `${aspectSymbols[type] || ''} ${translateAspect(type)}`}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-[#1e1e2a] bg-[#0f0f15] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e1e2a] bg-[#0a0a0f]">
                <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6a6865]">{t('chartDetail.planetA')}</th>
                <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6a6865]">{t('chartDetail.aspect')}</th>
                <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6a6865]">{t('chartDetail.planetB')}</th>
                <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6a6865]">{t('chartDetail.orb')}</th>
                <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6a6865]">{t('chartDetail.nature')}</th>
                <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6a6865]">{t('chartDetail.intensity')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e2a]">
              {filtered.map((aspect, idx) => {
                const isExpanded = expandedIndex === idx
                return (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className={`transition-colors cursor-pointer ${
                      isExpanded ? 'bg-[#1e1e2a]/40' : 'hover:bg-[#1e1e2a]/20'
                    }`}
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  >
                    <td className="px-3 py-3">
                      <span className="flex items-center gap-2">
                        <span className="text-base">{aspect.planetA?.symbol}</span>
                        <span className="text-[#e8e6e3] font-medium">{translatePlanet(aspect.planetA?.name)}</span>
                        {aspect.planetA?.signName && (
                          <span className="text-[#c9a96e] text-xs">{translateSign(aspect.planetA.signName)}</span>
                        )}
                        {aspect.planetA?.house && (
                          <span className="text-[#6a6865] text-xs">H{aspect.planetA.house}</span>
                        )}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="flex items-center gap-2">
                        <span className="text-base">{aspect.symbol}</span>
                        <span className="text-[#a8a6a3] text-xs">{translateAspect(aspect.englishName)}</span>
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="flex items-center gap-2">
                        <span className="text-base">{aspect.planetB?.symbol}</span>
                        <span className="text-[#e8e6e3] font-medium">{translatePlanet(aspect.planetB?.name)}</span>
                        {aspect.planetB?.signName && (
                          <span className="text-[#c9a96e] text-xs">{translateSign(aspect.planetB.signName)}</span>
                        )}
                        {aspect.planetB?.house && (
                          <span className="text-[#6a6865] text-xs">H{aspect.planetB.house}</span>
                        )}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-[#a8a6a3] text-xs">{aspect.orb.toFixed(1)}°</td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                          aspect.friendly
                            ? 'bg-[#4ecdc4]/10 text-[#4ecdc4]'
                            : 'bg-[#ff6b6b]/10 text-[#ff6b6b]'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            aspect.friendly ? 'bg-[#4ecdc4]' : 'bg-[#ff6b6b]'
                          }`}
                        />
                        {aspect.friendly ? t('chartDetail.harmonious') : t('chartDetail.challenging')}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-xs text-[#a8a6a3]">
                        {(aspect.intensity ?? Math.abs(aspect.score)).toFixed(1)}
                      </span>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <AnimatePresence>
          {expandedIndex !== null && filtered[expandedIndex] && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-[#1e1e2a]"
            >
              <div className="bg-[#0a0a0f] px-4 py-4">
                <p className="text-sm leading-relaxed text-[#a8a6a3]">
                  {aspectInterpretations[filtered[expandedIndex].englishName]?.description || t('chartDetail.noInterp')}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function PlanetsTab({ chart }: { chart: ChartResult }) {
  const { t } = useTranslation()
  const { translateSign, locale } = useSignTranslator()
  const { translatePlanet } = usePlanetTranslator()
  const { translateMode } = useModeTranslator()
  const planetOrder = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']

  // Essential dignities (simplified: domicile + exaltation)
  const dignities: Record<string, Record<string, string>> = {
    Sun: { Leo: 'Domicile', Aries: 'Exaltation' },
    Moon: { Cancer: 'Domicile', Taurus: 'Exaltation' },
    Mercury: { Gemini: 'Domicile', Virgo: 'Domicile' },
    Venus: { Taurus: 'Domicile', Libra: 'Domicile', Pisces: 'Exaltation' },
    Mars: { Aries: 'Domicile', Scorpio: 'Domicile', Capricorn: 'Exaltation' },
    Jupiter: { Sagittarius: 'Domicile', Pisces: 'Domicile', Cancer: 'Exaltation' },
    Saturn: { Capricorn: 'Domicile', Aquarius: 'Domicile', Libra: 'Exaltation' },
    Uranus: { Aquarius: 'Domicile' },
    Neptune: { Pisces: 'Domicile' },
    Pluto: { Scorpio: 'Domicile' },
  }

  // Detriment and fall (simplified)
  const debilities: Record<string, Record<string, string>> = {
    Sun: { Aquarius: 'Detriment', Libra: 'Fall' },
    Moon: { Capricorn: 'Detriment', Scorpio: 'Fall' },
    Mercury: { Sagittarius: 'Detriment', Pisces: 'Detriment' },
    Venus: { Scorpio: 'Detriment', Aries: 'Detriment', Virgo: 'Fall' },
    Mars: { Libra: 'Detriment', Taurus: 'Detriment', Cancer: 'Fall' },
    Jupiter: { Gemini: 'Detriment', Virgo: 'Detriment', Capricorn: 'Fall' },
    Saturn: { Cancer: 'Detriment', Leo: 'Detriment', Aries: 'Fall' },
    Uranus: { Leo: 'Detriment' },
    Neptune: { Virgo: 'Detriment' },
    Pluto: { Taurus: 'Detriment' },
  }

  // Retrograde planets (simplified: Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto can be retrograde)
  // We mark outer planets as commonly retrograde for visualization
  const retrogradePlanets = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']
  // For simplicity, outer planets (Jupiter+) are often retrograde; we'll mark Uranus/Neptune/Pluto as commonly retro
  const commonlyRetrograde = new Set(['Uranus', 'Neptune', 'Pluto'])

  const sortedPlanets = useMemo(() => {
    return [...chart.planets].sort(
      (a, b) => planetOrder.indexOf(a.name) - planetOrder.indexOf(b.name)
    )
  }, [chart.planets])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {sortedPlanets.map((planet, idx) => {
        const interp = planetInterpretations[planet.name]
        const signInterp = planet.signIndex !== undefined
          ? signInterpretations[planet.signName || '']
          : undefined
        const element = planet.signIndex !== undefined
          ? getSignElement(planet.signIndex)
          : ''
        const mode = planet.signIndex !== undefined
          ? getSignMode(planet.signIndex)
          : ''
        const signName = planet.signName || ''
        const dignity = dignities[planet.name]?.[signName]
        const debility = debilities[planet.name]?.[signName]
        const isRetro = commonlyRetrograde.has(planet.name)

        return (
          <motion.div
            key={planet.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="rounded-xl border border-[#1e1e2a] bg-[#0f0f15] p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl w-8 text-center">{planet.symbol}</span>
              <div>
                <span className="font-medium text-[#e8e6e3]">
                  {translatePlanet(planet.name)}
                  {isRetro && <span className="ml-1.5 text-xs text-[#ff6b6b]" title={t('chartDetail.retrograde')}>℞</span>}
                </span>
                <div className="flex items-center gap-2 text-xs text-[#a8a6a3]">
                  <span className="text-[#c9a96e]">{translateSign(planet.signName)}</span>
                  <DegreeDisplay degree={planet.degreeInSign ?? 0} />
                  {planet.house && <span>{locale === 'zh' ? `第${planet.house}宫` : `House ${planet.house}`}</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {element && (
                <span className="rounded-full bg-[#1e1e2a] px-2 py-0.5 text-xs text-[#a8a6a3]">
                  {t(`element.${element.toLowerCase()}`)}
                </span>
              )}
              {mode && (
                <span className="rounded-full bg-[#1e1e2a] px-2 py-0.5 text-xs text-[#a8a6a3]">
                  {translateMode(mode)}
                </span>
              )}
              {interp && (
                <span className="text-xs text-[#c9a96e]">{interp.domain}</span>
              )}
              {dignity && (
                <span className="rounded-full bg-[#4ecdc4]/10 px-2 py-0.5 text-xs text-[#4ecdc4]">
                  {dignity === 'Domicile' ? t('chartDetail.domicile') : t('chartDetail.exaltation')}
                </span>
              )}
              {debility && (
                <span className="rounded-full bg-[#ff6b6b]/10 px-2 py-0.5 text-xs text-[#ff6b6b]">
                  {debility === 'Detriment' ? t('chartDetail.detriment') : t('chartDetail.fall')}
                </span>
              )}
              {isRetro && (
                <span className="rounded-full bg-[#ff6b6b]/10 px-2 py-0.5 text-xs text-[#ff6b6b]">
                  {t('chartDetail.retrograde')}
                </span>
              )}
            </div>

            {interp && (
              <p className="text-xs leading-relaxed text-[#a8a6a3]">{interp.description}</p>
            )}

            {signInterp && (
              <div className="mt-2 pt-2 border-t border-[#1e1e2a]">
                <p className="text-xs leading-relaxed text-[#6a6865] italic">
                  {signInterp.description}
                </p>
              </div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

function HousesTab({ chart }: { chart: ChartResult }) {
  const { t } = useTranslation()
  const { translateSign, locale } = useSignTranslator()
  const { translatePlanet } = usePlanetTranslator()

  if (!chart.houseCusps || !chart.houseCusps.length) {
    return (
      <div className="rounded-xl border border-[#1e1e2a] bg-[#0f0f15] p-6 text-center">
        <p className="text-sm text-[#6a6865]">
          {t('chartDetail.noHouses')}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {chart.houseCusps.map((cusp, idx) => {
        const houseInterp = houseInterpretations[cusp.houseNumber - 1]
        const planetsInHouse = cusp.planetsInHouse || []

        return (
          <motion.div
            key={cusp.houseNumber}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
            className="rounded-xl border border-[#1e1e2a] bg-[#0f0f15] p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1e1e2a] text-xs font-bold text-[#c9a96e]">
                  {cusp.houseNumber}
                </span>
                <span className="font-medium text-[#e8e6e3] text-sm">
                  {houseInterp?.title || (locale === 'zh' ? `第${cusp.houseNumber}宫` : `House ${cusp.houseNumber}`)}
                </span>
              </div>
              <span className="text-xs text-[#c9a96e]">{translateSign(cusp.signName)}</span>
            </div>

            {cusp.rulingPlanet && (
              <div className="flex items-center gap-1 mb-2 text-xs text-[#6a6865]">
                <span>{t('chartDetail.ruler')} {cusp.rulingPlanet.symbol}</span>
                <span>{translatePlanet(cusp.rulingPlanet.name)}</span>
              </div>
            )}

            {planetsInHouse.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {planetsInHouse.map((p) => (
                  <span
                    key={p.name}
                    className="inline-flex items-center gap-1 rounded-md bg-[#1e1e2a] px-2 py-0.5 text-xs text-[#e8e6e3]"
                  >
                    <span>{p.symbol}</span>
                    {translatePlanet(p.name)}
                  </span>
                ))}
              </div>
            )}

            {houseInterp && (
              <p className="text-xs leading-relaxed text-[#6a6865] mt-1">
                {houseInterp.description}
              </p>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

function AnglesTab({ chart }: { chart: ChartResult }) {
  const { t } = useTranslation()
  const { translateSign, locale } = useSignTranslator()
  const angles: { label: string; point: AxisPoint | null | undefined; symbol: string }[] = [
    { label: 'Ascendant', point: chart.ascendant, symbol: 'ASC' },
    { label: 'Descendant', point: chart.descendant, symbol: 'DSC' },
    { label: 'Midheaven', point: chart.midheaven, symbol: 'MC' },
    { label: 'Imum Coeli', point: chart.imumCoeli, symbol: 'IC' },
  ]

  const hasAngles = angles.some((a) => a.point)

  if (!hasAngles) {
    return (
      <div className="rounded-xl border border-[#1e1e2a] bg-[#0f0f15] p-6 text-center">
        <p className="text-sm text-[#6a6865]">
          {t('chartDetail.noAngles')}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {angles.map(({ label, point, symbol }, idx) => {
        if (!point) return null

        const signInterp = point.signIndex !== undefined
          ? signInterpretations[point.signName || '']
          : undefined

        return (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="rounded-xl border border-[#1e1e2a] bg-[#0f0f15] p-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1e1e2a] text-sm font-bold text-[#c9a96e]">
                {symbol}
              </span>
              <div>
                <span className="font-medium text-[#e8e6e3]">{label}</span>
                <div className="flex items-center gap-2 text-xs text-[#a8a6a3]">
                  <span className="text-[#c9a96e]">{translateSign(point.signName)}</span>
                  <DegreeDisplay degree={point.degreeInSign ?? 0} />
                </div>
              </div>
            </div>

            {signInterp && (
              <p className="text-xs leading-relaxed text-[#a8a6a3]">
                {signInterp.description}
              </p>
            )}

            {point.house && (
              <span className="mt-2 inline-block text-xs text-[#6a6865]">
                {locale === 'zh' ? `第${point.house}宫` : `House ${point.house}`}
              </span>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

function MoonAsteroidsTab({ chart }: { chart: ChartResult }) {
  const { t } = useTranslation()
  const { translateMoonPhase } = useMoonPhaseTranslator()
  const { translateSign } = useSignTranslator()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h3 className="mb-3 font-serif text-base font-semibold text-[#e8e6e3]">{t('chartDetail.moonPhase')}</h3>
        {chart.moonPhase ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-[#1e1e2a] bg-[#0f0f15] p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{getMoonPhaseSymbol(chart.moonPhase.phaseIndex)}</span>
              <div>
                <span className="font-medium text-[#e8e6e3]">{translateMoonPhase(chart.moonPhase.phaseName)}</span>
                <div className="flex items-center gap-3 text-xs text-[#a8a6a3]">
                  <span>{t('chartDetail.illumination')}: {(chart.moonPhase.illumination * 100).toFixed(0)}%</span>
                  <span>{t('chartDetail.age')}: {chart.moonPhase.age.toFixed(1)} days</span>
                </div>
              </div>
            </div>
            {moonPhaseInterpretations[chart.moonPhase.phaseName] && (
              <p className="text-xs leading-relaxed text-[#a8a6a3]">
                {moonPhaseInterpretations[chart.moonPhase.phaseName].description}
              </p>
            )}
          </motion.div>
        ) : (
          <div className="rounded-xl border border-[#1e1e2a] bg-[#0f0f15] p-4 text-center">
            <p className="text-xs text-[#6a6865]">{t('chartDetail.moonPhaseUnavailable')}</p>
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-3 font-serif text-base font-semibold text-[#e8e6e3]">{t('chartDetail.asteroids')}</h3>
        {chart.asteroids && chart.asteroids.length > 0 ? (
          <div className="space-y-3">
            {chart.asteroids.map((asteroid, idx) => {
              const interp = asteroidInterpretations[asteroid.name]
              return (
                <motion.div
                  key={asteroid.name}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="rounded-xl border border-[#1e1e2a] bg-[#0f0f15] p-4"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl w-6 text-center">{asteroid.symbol}</span>
                    <div>
                      <span className="font-medium text-[#e8e6e3]">{asteroid.name}</span>
                      <div className="flex items-center gap-2 text-xs text-[#a8a6a3]">
                        <span className="text-[#c9a96e]">{translateSign(asteroid.signName)}</span>
                        <DegreeDisplay degree={asteroid.degreeInSign} />
                      </div>
                    </div>
                    {interp && (
                      <span className="ml-auto text-xs text-[#c9a96e]">{interp.domain}</span>
                    )}
                  </div>
                  {interp && (
                    <p className="text-xs leading-relaxed text-[#a8a6a3]">{interp.description}</p>
                  )}
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-[#1e1e2a] bg-[#0f0f15] p-4 text-center">
            <p className="text-xs text-[#6a6865]">{t('chartDetail.asteroidsUnavailable')}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function getMoonPhaseSymbol(phaseIndex: number): string {
  const symbols = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘']
  return symbols[phaseIndex] || '🌑'
}

type TabId = 'aspects' | 'planets' | 'houses' | 'angles' | 'moon'

export default function ChartDetailPage() {
  const { t } = useTranslation()
  const { translateSign } = useSignTranslator()
  const { birthInfo } = useGuestChartStore()
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [chart, setChart] = useState<ChartResult | null>(null)
  const [chartLoading, setChartLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabId>('aspects')

  const isLoggedIn = !!user

  const tabs = [
    { id: 'aspects', label: t('chartDetail.aspects') },
    { id: 'planets', label: t('chartDetail.planets') },
    { id: 'houses', label: t('chartDetail.houses') },
    { id: 'angles', label: t('chartDetail.angles') },
    { id: 'moon', label: t('chartDetail.moonAsteroids') },
  ] as const

  useEffect(() => {
    if (authLoading) return
    if (!birthInfo) {
      router.replace('/')
      return
    }
    setChartLoading(true)
    try {
      const result = calculateFullNatalChart(birthInfo)
      setChart(result)
    } catch (e) {
      console.error('Chart calculation error:', e)
    }
    setChartLoading(false)
  }, [birthInfo, authLoading, router])

  if (authLoading || chartLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[#c9a96e] border-t-transparent" />
          <p className="text-sm text-[#6a6865]">{t('chartDetail.calculating')}</p>
        </div>
      </div>
    )
  }

  if (!chart || !chart.planets.length) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
        <p className="text-sm text-[#6a6865]">{t('chart.unable')}</p>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-[#0a0a0f] px-4 pb-24 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md mt-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-[#1e1e2a] bg-[#0f0f15] p-8"
          >
            <span className="text-3xl">🔒</span>
            <h2 className="mt-4 font-serif text-xl font-semibold text-[#e8e6e3]">
              {t('chartDetail.signinToView')}
            </h2>
            <p className="mt-2 text-sm text-[#6a6865]">
              {t('chartDetail.signinDesc')}
            </p>
            <button
              onClick={() => router.push('/auth/signin')}
              className="mt-6 inline-block rounded-lg bg-[#c9a96e] px-8 py-3 font-medium text-[#0a0a0f] transition-colors hover:bg-[#b8964f]"
            >
              {t('nav.signin')}
            </button>
          </motion.div>
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
          className="mb-6 text-center"
        >
          <h1 className="font-serif text-3xl font-bold text-[#e8e6e3]">
            {t('chartDetail.detail')}
          </h1>
          <p className="mt-1 text-sm text-[#6a6865]">
            {translateSign(chart.sun.signName)} {t('chart.sun')} · {translateSign(chart.moon.signName)} {t('chart.moon')} ·{' '}
            {chart.ascendant ? `${translateSign(chart.ascendant.signName)} ${t('chart.rising')}` : t('chart.unknownRising')}
          </p>
        </motion.div>

        {/* Interactive Astrology Wheel */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg font-semibold text-[#e8e6e3]">
              {t('chart.chartWheel')}
            </h2>
            <button
              onClick={() => router.push('/chart/wheel')}
              className="flex items-center gap-2 rounded-lg border border-[#1e1e2a] bg-[#0f0f15] px-3 py-1.5 text-xs font-medium text-[#6a6865] transition-colors hover:border-[#c9a96e]/50 hover:text-[#c9a96e]"
            >
              <span>⛶</span>
              {t('chartDetail.fullscreen')}
            </button>
          </div>
          <div className="flex justify-center">
            <AstrologyWheel
              planets={chart.planets}
              ascendant={chart.ascendant}
              midheaven={chart.midheaven}
              descendant={chart.descendant}
              imumCoeli={chart.imumCoeli}
              moonPhase={chart.moonPhase}
              natalAspects={chart.natalAspects}
              houseCusps={chart.houseCusps}
              houses={chart.houses}
              size={520}
              interactive={true}
            />
          </div>
        </motion.section>

        <div className="mb-6 flex flex-wrap gap-1 border-b border-[#1e1e2a]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'border-[#c9a96e] text-[#c9a96e]'
                  : 'border-transparent text-[#6a6865] hover:text-[#a8a6a3]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'aspects' && <AspectsTab aspects={chart.natalAspects || []} />}
            {activeTab === 'planets' && <PlanetsTab chart={chart} />}
            {activeTab === 'houses' && <HousesTab chart={chart} />}
            {activeTab === 'angles' && <AnglesTab chart={chart} />}
            {activeTab === 'moon' && <MoonAsteroidsTab chart={chart} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  )
}
