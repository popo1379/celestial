'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useTranslation } from '@/hooks/useTranslation'
import { useGuestChartStore } from '@/stores/guest-store'
import { searchCities } from '@/lib/astrology/coordinates'
import { calculateFullNatalChart, calculateDailyFortune, getSignElement, type ChartResult, type DailyFortuneResult } from '@/lib/astrology/engine'
import type { BirthInfo } from '@/lib/astrology/engine'
import type { CityCoordinate } from '@/lib/astrology/coordinates'
import FeaturesSection from '@/components/home/FeaturesSection'
import AIHighlightSection from '@/components/home/AIHighlightSection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import HowItWorksSection from '@/components/home/HowItWorksSection'
import FinalCTASection from '@/components/home/FinalCTASection'

const zodiacSymbols: Record<string, string> = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
  Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
  Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
}

function getZodiacSymbol(signName: string): string {
  return zodiacSymbols[signName] || ''
}

function formatBirthInfoForDisplay(birthInfo: BirthInfo) {
  const dateStr = `${birthInfo.month}/${birthInfo.day}/${birthInfo.year}`
  return dateStr
}

function BirthInfoForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter()
  const setBirthInfo = useGuestChartStore((s) => s.setBirthInfo)
  const { t } = useTranslation()

  const [month, setMonth] = useState('')
  const [day, setDay] = useState('')
  const [year, setYear] = useState('')
  const [hour, setHour] = useState('')
  const [minute, setMinute] = useState('')
  const [isAM, setIsAM] = useState(true)
  const [hasExactTime, setHasExactTime] = useState(true)
  const [cityQuery, setCityQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState<CityCoordinate | null>(null)
  const [cityResults, setCityResults] = useState<CityCoordinate[]>([])
  const [showCityDropdown, setShowCityDropdown] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const cityRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) {
        setShowCityDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleCityInputChange = useCallback((value: string) => {
    setCityQuery(value)
    setSelectedCity(null)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      if (value.trim().length < 2) {
        setCityResults([])
        setShowCityDropdown(false)
        return
      }
      const results = searchCities(value)
      setCityResults(results)
      setShowCityDropdown(results.length > 0)
    }, 250)
  }, [])

  function selectCity(city: CityCoordinate) {
    setSelectedCity(city)
    setCityQuery(`${city.city}, ${city.state}`)
    setShowCityDropdown(false)
    setErrors((prev) => {
      const next = { ...prev }
      delete next.city
      return next
    })
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {}
    const m = parseInt(month, 10)
    const d = parseInt(day, 10)
    const y = parseInt(year, 10)

    if (!month || isNaN(m) || m < 1 || m > 12) newErrors.month = t('form.enterMonth')
    if (!day || isNaN(d) || d < 1 || d > 31) newErrors.day = t('form.enterDay')
    if (!year || isNaN(y) || y < 1900 || y > 2100) newErrors.year = t('form.enterYear')

    if (hasExactTime) {
      const h = parseInt(hour, 10)
      const min = parseInt(minute, 10)
      if (!hour || isNaN(h) || h < 1 || h > 12) newErrors.hour = t('form.enterHour')
      if (minute && (isNaN(min) || min < 0 || min > 59)) newErrors.minute = t('form.enterMinutes')
    }

    if (!selectedCity) newErrors.city = t('form.selectCity')

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)

    let finalHour = 12
    if (hasExactTime) {
      let h = parseInt(hour, 10) || 12
      if (!isAM && h < 12) h += 12
      if (isAM && h === 12) h = 0
      finalHour = h
    }

    const birthInfo: BirthInfo = {
      year: parseInt(year, 10),
      month: parseInt(month, 10),
      day: parseInt(day, 10),
      hour: finalHour,
      minute: parseInt(minute, 10) || 0,
      latitude: selectedCity!.latitude,
      longitude: selectedCity!.longitude,
      timezoneOffset: selectedCity!.tzOffset,
      hasExactTime,
    }

    setBirthInfo(birthInfo)
    onSuccess?.()
    router.push('/chart')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-xs font-medium tracking-wider uppercase text-[#a8a6a3] mb-2">
          {t('form.birthDate')}
        </label>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <select
              value={month}
              onChange={(e) => { setMonth(e.target.value); setErrors((p) => { const n = { ...p }; delete n.month; return n }) }}
              className={`w-full bg-[#0f0f15] border ${errors.month ? 'border-red-500/50' : 'border-[#1e1e2a]'} rounded-lg px-3 py-2.5 text-[#e8e6e3] text-sm focus:outline-none focus:border-[#c9a96e]/50 focus:ring-1 focus:ring-[#c9a96e]/20 transition-colors appearance-none`}
            >
              <option value="">{t('common.month')}</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={day}
              onChange={(e) => { setDay(e.target.value); setErrors((p) => { const n = { ...p }; delete n.day; return n }) }}
              className={`w-full bg-[#0f0f15] border ${errors.day ? 'border-red-500/50' : 'border-[#1e1e2a]'} rounded-lg px-3 py-2.5 text-[#e8e6e3] text-sm focus:outline-none focus:border-[#c9a96e]/50 focus:ring-1 focus:ring-[#c9a96e]/20 transition-colors appearance-none`}
            >
              <option value="">{t('common.day')}</option>
              {Array.from({ length: 31 }, (_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>
          <div>
            <input
              type="number"
              placeholder={t('common.year')}
              value={year}
              onChange={(e) => { setYear(e.target.value); setErrors((p) => { const n = { ...p }; delete n.year; return n }) }}
              className={`w-full bg-[#0f0f15] border ${errors.year ? 'border-red-500/50' : 'border-[#1e1e2a]'} rounded-lg px-3 py-2.5 text-[#e8e6e3] text-sm focus:outline-none focus:border-[#c9a96e]/50 focus:ring-1 focus:ring-[#c9a96e]/20 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
            />
          </div>
        </div>
        {errors.month || errors.day || errors.year ? (
          <p className="text-red-400 text-xs mt-1">{errors.month || errors.day || errors.year}</p>
        ) : null}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium tracking-wider uppercase text-[#a8a6a3]">
            {t('form.birthTime')}
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={!hasExactTime}
              onChange={(e) => setHasExactTime(!e.target.checked)}
              className="w-3.5 h-3.5 rounded border-[#1e1e2a] bg-[#0f0f15] text-[#c9a96e] focus:ring-[#c9a96e]/30 focus:ring-offset-0 accent-[#c9a96e]"
            />
            <span className="text-xs text-[#6a6865] hover:text-[#a8a6a3] transition-colors">
              {t('form.unknownTime')}
            </span>
          </label>
        </div>
        {hasExactTime && (
          <div className="flex gap-3 items-start">
            <div className="flex-1">
              <select
                value={hour}
                onChange={(e) => { setHour(e.target.value); setErrors((p) => { const n = { ...p }; delete n.hour; return n }) }}
                className={`w-full bg-[#0f0f15] border ${errors.hour ? 'border-red-500/50' : 'border-[#1e1e2a]'} rounded-lg px-3 py-2.5 text-[#e8e6e3] text-sm focus:outline-none focus:border-[#c9a96e]/50 focus:ring-1 focus:ring-[#c9a96e]/20 transition-colors appearance-none`}
              >
                <option value="">{t('common.hour')}</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <select
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
                className="w-full bg-[#0f0f15] border border-[#1e1e2a] rounded-lg px-3 py-2.5 text-[#e8e6e3] text-sm focus:outline-none focus:border-[#c9a96e]/50 focus:ring-1 focus:ring-[#c9a96e]/20 transition-colors appearance-none"
              >
                <option value="">{t('common.min')}</option>
                {Array.from({ length: 60 }, (_, i) => (
                  <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                ))}
              </select>
            </div>
            <div className="flex rounded-lg border border-[#1e1e2a] overflow-hidden flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsAM(true)}
                className={`px-3 py-2.5 text-xs font-medium transition-colors ${isAM ? 'bg-[#c9a96e] text-[#0a0a0f]' : 'bg-[#0f0f15] text-[#6a6865] hover:text-[#a8a6a3]'}`}
              >
                {t('common.am')}
              </button>
              <button
                type="button"
                onClick={() => setIsAM(false)}
                className={`px-3 py-2.5 text-xs font-medium transition-colors ${!isAM ? 'bg-[#c9a96e] text-[#0a0a0f]' : 'bg-[#0f0f15] text-[#6a6865] hover:text-[#a8a6a3]'}`}
              >
                {t('common.pm')}
              </button>
            </div>
          </div>
        )}
        {errors.hour && <p className="text-red-400 text-xs mt-1">{errors.hour}</p>}
      </div>

      <div ref={cityRef} className="relative">
        <label className="block text-xs font-medium tracking-wider uppercase text-[#a8a6a3] mb-2">
          {t('form.birthPlace')}
        </label>
        <input
          type="text"
          placeholder={t('form.searchCity')}
          value={cityQuery}
          onChange={(e) => handleCityInputChange(e.target.value)}
          onFocus={() => { if (cityResults.length > 0) setShowCityDropdown(true) }}
          className={`w-full bg-[#0f0f15] border ${errors.city ? 'border-red-500/50' : 'border-[#1e1e2a]'} rounded-lg px-3 py-2.5 text-[#e8e6e3] text-sm focus:outline-none focus:border-[#c9a96e]/50 focus:ring-1 focus:ring-[#c9a96e]/20 transition-colors placeholder:text-[#6a6865]`}
        />
        <AnimatePresence>
          {showCityDropdown && cityResults.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 mt-1 w-full bg-[#14141d] border border-[#1e1e2a] rounded-lg overflow-hidden shadow-xl"
            >
              {cityResults.map((city, idx) => (
                <li
                  key={`${city.city}-${city.state}-${idx}`}
                  onClick={() => selectCity(city)}
                  className="px-3 py-2.5 text-sm text-[#e8e6e3] hover:bg-[#1e1e2a] cursor-pointer transition-colors"
                >
                  {city.city}, {city.state}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
        {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-[#c9a96e] hover:bg-[#b8964f] text-[#0a0a0f] font-semibold rounded-lg py-3 text-sm tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#c9a96e]/20"
      >
        {submitting ? t('home.generating') : t('home.generateChart')}
      </button>
    </form>
  )
}

export default function HomePage() {
  const { user, loading } = useAuth()
  const { t } = useTranslation()

  return (
    <div className="relative min-h-screen w-full">
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-6 h-6 border-2 border-[#c9a96e] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : user ? (
          <AuthenticatedView user={user} />
        ) : (
          <UnauthenticatedView />
        )}
      </div>
    </div>
  )
}

function UnauthenticatedView() {
  const { t } = useTranslation()
  return (
    <div className="min-h-[calc(100vh-3rem)] flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="text-center mb-10 sm:mb-14"
      >
        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#e8e6e3]"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Celestial
        </h1>
        <div className="mt-2 sm:mt-3 h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-[#c9a96e]/60 to-transparent mx-auto" />
        <p className="mt-4 sm:mt-5 text-lg sm:text-xl md:text-2xl text-[#c9a96e] font-light tracking-wide">
          {t('home.tagline')}
        </p>
        <p className="mt-3 text-sm sm:text-base text-[#6a6865] max-w-lg mx-auto leading-relaxed">
          {t('home.subtitle')}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <div className="bg-[#14141d]/80 backdrop-blur-sm border border-[#1e1e2a] rounded-2xl p-6 sm:p-8 shadow-xl">
          <h2 className="text-lg font-semibold text-[#e8e6e3] mb-1">{t('home.enterDetails')}</h2>
          <p className="text-xs text-[#6a6865] mb-6">{t('home.fillInfo')}</p>
          <BirthInfoForm />
        </div>
      </motion.div>

      <div className="w-full max-w-7xl mx-auto mt-20 sm:mt-32">
        <FeaturesSection />
        <AIHighlightSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <FinalCTASection />
      </div>
    </div>
  )
}

function AuthenticatedView({ user }: { user: NonNullable<ReturnType<typeof useAuth>['user']> }) {
  const [showForm, setShowForm] = useState(false)
  const email = user.email || 'seeker'
  const { t } = useTranslation()

  return (
    <div className="pb-16">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <div>
            <h1
              className="text-2xl sm:text-3xl font-bold text-[#e8e6e3]"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              {t('home.welcomeBack')}{email ? `, ${email.split('@')[0]}` : ''}
            </h1>
            <p className="text-sm text-[#6a6865] mt-1">{t('home.cosmicDashboard')}</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#c9a96e]/10 hover:bg-[#c9a96e]/20 border border-[#c9a96e]/30 text-[#c9a96e] rounded-lg text-sm transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            {t('home.newChart')}
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <TransitScoreCard />
        <BigThreeCard />
        <QuickActionsCard />
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mb-8"
          >
            <div className="bg-[#14141d]/80 backdrop-blur-sm border border-[#1e1e2a] rounded-2xl p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-[#e8e6e3] mb-1">{t('home.generateNew')}</h2>
              <p className="text-xs text-[#6a6865] mb-6">{t('home.differentProfile')}</p>
              <BirthInfoForm onSuccess={() => setShowForm(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a0a0f]/90 backdrop-blur-md border-t border-[#1e1e2a] p-3">
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full bg-[#c9a96e] text-[#0a0a0f] font-semibold rounded-lg py-3 text-sm tracking-wide transition-all duration-200"
        >
          {showForm ? t('common.close') : t('home.generateNewChart')}
        </button>
      </div>
    </div>
  )
}

function TransitScoreCard() {
  const birthInfo = useGuestChartStore((s) => s.birthInfo)
  const [fortune, setFortune] = useState<DailyFortuneResult | null>(null)
  const { t } = useTranslation()

  useEffect(() => {
    if (!birthInfo) {
      setFortune(null)
      return
    }
    try {
      const natalChart = calculateFullNatalChart(birthInfo)
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
  }, [birthInfo])

  if (!birthInfo || !fortune) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-[#14141d]/80 backdrop-blur-sm border border-[#1e1e2a] rounded-2xl p-5 sm:p-6"
      >
        <h3 className="text-xs font-medium tracking-wider uppercase text-[#a8a6a3] mb-4">
          {t('home.transitScore')}
        </h3>
        <p className="text-sm text-[#6a6865]">
          {t('home.transitScoreDesc')}
        </p>
      </motion.div>
    )
  }

  const scoreLabel = fortune.score >= 85 ? t('score.excellent') : fortune.score >= 70 ? t('score.favorable') : fortune.score >= 60 ? t('score.moderate') : t('score.challenging')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-[#14141d]/80 backdrop-blur-sm border border-[#1e1e2a] rounded-2xl p-5 sm:p-6"
    >
      <h3 className="text-xs font-medium tracking-wider uppercase text-[#a8a6a3] mb-4">
        {t('home.transitScore')}
      </h3>
      <div className="flex items-end gap-3">
        <span className="text-5xl sm:text-6xl font-bold text-[#c9a96e] leading-none">{fortune.score}</span>
        <div className="flex items-center gap-1 pb-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className={`w-4 h-4 ${star <= fortune.starRating ? 'text-[#c9a96e]' : 'text-[#2a2a35]'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <div className="h-1.5 flex-1 bg-[#1e1e2a] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#c9a96e]/60 to-[#c9a96e] rounded-full transition-all duration-700" style={{ width: `${fortune.score}%` }} />
        </div>
        <span className="text-xs text-[#6a6865]">{scoreLabel}</span>
      </div>
      <p className="mt-3 text-xs text-[#6a6865]">
        Moon in {fortune.transitMoonSign}. Lucky color: {fortune.luckyColor}, number: {fortune.luckyNumber}.
      </p>
    </motion.div>
  )
}

function BigThreeCard() {
  const birthInfo = useGuestChartStore((s) => s.birthInfo)
  const [chart, setChart] = useState<ChartResult | null>(null)
  const { t } = useTranslation()

  useEffect(() => {
    if (!birthInfo) {
      setChart(null)
      return
    }
    try {
      setChart(calculateFullNatalChart(birthInfo))
    } catch {
      setChart(null)
    }
  }, [birthInfo])

  if (!birthInfo || !chart) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-[#14141d]/80 backdrop-blur-sm border border-[#1e1e2a] rounded-2xl p-5 sm:p-6"
      >
        <h3 className="text-xs font-medium tracking-wider uppercase text-[#a8a6a3] mb-4">
          {t('home.bigThree')}
        </h3>
        <p className="text-sm text-[#6a6865]">
          {t('home.bigThreeDesc')}
        </p>
      </motion.div>
    )
  }

  const bigThree = [
    { label: 'Sun', sign: chart.sun.signName ?? '', symbol: chart.sun.symbol },
    { label: 'Moon', sign: chart.moon.signName ?? '', symbol: chart.moon.symbol },
    { label: 'Rising', sign: chart.ascendant?.signName ?? 'Unknown', symbol: chart.ascendant?.symbol ?? 'ASC' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-[#14141d]/80 backdrop-blur-sm border border-[#1e1e2a] rounded-2xl p-5 sm:p-6"
    >
      <h3 className="text-xs font-medium tracking-wider uppercase text-[#a8a6a3] mb-4">
        {t('home.bigThree')}
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {bigThree.map((item) => (
          <div key={item.label} className="text-center">
            <div className="text-2xl sm:text-3xl mb-1">{item.symbol}</div>
            <div className="text-[10px] uppercase tracking-widest text-[#6a6865]">{item.label}</div>
            <div className="text-sm font-semibold text-[#e8e6e3] mt-0.5">{item.sign}</div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function QuickActionsCard() {
  const router = useRouter()
  const birthInfo = useGuestChartStore((s) => s.birthInfo)
  const { t } = useTranslation()

  const actions = [
    {
      label: t('home.myChart'),
      description: t('home.viewChart'),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      action: () => router.push('/chart'),
      disabled: !birthInfo,
    },
    {
      label: t('nav.synastry'),
      description: t('home.compareCharts'),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      action: () => router.push('/synastry'),
      disabled: !birthInfo,
    },
    {
      label: t('nav.profile'),
      description: t('home.savedProfiles'),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      action: () => router.push('/profile'),
      disabled: false,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-[#14141d]/80 backdrop-blur-sm border border-[#1e1e2a] rounded-2xl p-5 sm:p-6"
    >
      <h3 className="text-xs font-medium tracking-wider uppercase text-[#a8a6a3] mb-4">
        {t('home.quickAccess')}
      </h3>
      <div className="space-y-2">
        {actions.map((item) => (
          <button
            key={item.label}
            onClick={item.action}
            disabled={item.disabled}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#0f0f15] border border-[#1e1e2a] hover:border-[#c9a96e]/30 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed group"
          >
            <div className="text-[#c9a96e] group-hover:scale-110 transition-transform duration-200">
              {item.icon}
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-[#e8e6e3]">{item.label}</div>
              <div className="text-[11px] text-[#6a6865]">{item.description}</div>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  )
}
