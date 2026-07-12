'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useSynastryStore } from '@/stores/synastry-store'
import { useAuth } from '@/hooks/useAuth'
import { searchCities } from '@/lib/astrology/coordinates'
import { useTranslation } from '@/hooks/useTranslation'
import type { BirthInfo } from '@/lib/astrology/engine'
import type { CityCoordinate } from '@/lib/astrology/coordinates'

interface PersonFormProps {
  label: string
  onSave: (info: BirthInfo) => void
}

function PersonForm({ label, onSave }: PersonFormProps) {
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
  const [saved, setSaved] = useState(false)

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

    if (!selectedCity) newErrors.city = t('form.selectBirthCity')

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSave() {
    if (!validate()) return

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

    onSave(birthInfo)
    setSaved(true)
  }

  const inputClass = (field: string) =>
    `w-full bg-[#0f0f15] border ${errors[field] ? 'border-red-500/50' : 'border-[#1e1e2a]'} rounded-lg px-3 py-2.5 text-[#e8e6e3] text-sm focus:outline-none focus:border-[#c9a96e]/50 focus:ring-1 focus:ring-[#c9a96e]/20 transition-colors appearance-none`

  return (
    <div className="bg-[#14141d]/80 backdrop-blur-sm border border-[#1e1e2a] rounded-2xl p-6 sm:p-8">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-semibold text-[#e8e6e3]">{label}</h2>
        {saved && (
          <span className="flex items-center gap-1 text-xs text-emerald-400">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {t('common.saved')}
          </span>
        )}
      </div>
      <p className="text-xs text-[#6a6865] mb-6">{t('synastry.enterBirthFor')} {label.toLowerCase()}</p>

      <div className="space-y-6">
        <div>
          <label className="block text-xs font-medium tracking-wider uppercase text-[#a8a6a3] mb-2">
            {t('form.birthDate')}
          </label>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <select
                value={month}
                onChange={(e) => { setMonth(e.target.value); setErrors((p) => { const n = { ...p }; delete n.month; return n }); setSaved(false) }}
                className={inputClass('month')}
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
                onChange={(e) => { setDay(e.target.value); setErrors((p) => { const n = { ...p }; delete n.day; return n }); setSaved(false) }}
                className={inputClass('day')}
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
                onChange={(e) => { setYear(e.target.value); setErrors((p) => { const n = { ...p }; delete n.year; return n }); setSaved(false) }}
                className={`${inputClass('year')} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
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
                onChange={(e) => { setHasExactTime(!e.target.checked); setSaved(false) }}
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
                  onChange={(e) => { setHour(e.target.value); setErrors((p) => { const n = { ...p }; delete n.hour; return n }); setSaved(false) }}
                  className={inputClass('hour')}
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
                  onChange={(e) => { setMinute(e.target.value); setSaved(false) }}
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
                  onClick={() => { setIsAM(true); setSaved(false) }}
                  className={`px-3 py-2.5 text-xs font-medium transition-colors ${isAM ? 'bg-[#c9a96e] text-[#0a0a0f]' : 'bg-[#0f0f15] text-[#6a6865] hover:text-[#a8a6a3]'}`}
                >
                  {t('common.am')}
                </button>
                <button
                  type="button"
                  onClick={() => { setIsAM(false); setSaved(false) }}
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
            onChange={(e) => { handleCityInputChange(e.target.value); setSaved(false) }}
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
          type="button"
          onClick={handleSave}
          className={`w-full py-2.5 rounded-lg text-sm font-semibold tracking-wide transition-all duration-200 ${
            saved
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
              : 'bg-[#c9a96e]/10 hover:bg-[#c9a96e]/20 border border-[#c9a96e]/30 text-[#c9a96e] hover:shadow-lg hover:shadow-[#c9a96e]/10'
          }`}
        >
          {saved ? t('synastry.profileSaved') : `${t('synastry.save')} ${label}`}
        </button>
      </div>
    </div>
  )
}

export default function SynastryPage() {
  const { t } = useTranslation()
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { personA, personB, setPersonA, setPersonB } = useSynastryStore()
  const [navigating, setNavigating] = useState(false)

  const bothSaved = personA !== null && personB !== null

  function handleCompare() {
    if (!bothSaved) return
    setNavigating(true)
    router.push('/synastry/result')
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
            {t('synastry.title')}
          </h1>
          <p className="mt-2 text-sm text-[#6a6865]">
            {t('synastry.subtitle')}
          </p>
          <div className="mt-3 h-px w-16 mx-auto bg-gradient-to-r from-transparent via-[#c9a96e]/60 to-transparent" />
        </motion.div>

        {authLoading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="w-6 h-6 border-2 border-[#c9a96e] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !user ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto mt-12 rounded-xl border border-[#1e1e2a] bg-[#14141d]/80 backdrop-blur-sm p-8 text-center"
          >
            <span className="text-3xl">🔒</span>
            <h2 className="mt-4 font-serif text-xl font-semibold text-[#e8e6e3]">
              {t('synastry.signinToUse')}
            </h2>
            <p className="mt-2 text-sm text-[#6a6865]">
              {t('synastry.createAccount')}
            </p>
            <button
              onClick={() => router.push('/auth/signin')}
              className="mt-6 inline-block rounded-lg bg-[#c9a96e] px-8 py-3 font-medium text-[#0a0a0f] transition-colors hover:bg-[#b8964f]"
            >
              {t('synastry.signinFree')}
            </button>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <PersonForm label={t('synastry.personA')} onSave={setPersonA} />
              <PersonForm label={t('synastry.personB')} onSave={setPersonB} />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <button
                onClick={handleCompare}
                disabled={!bothSaved || navigating}
                className="bg-[#c9a96e] hover:bg-[#b8964f] text-[#0a0a0f] font-semibold rounded-lg px-10 py-3.5 text-sm tracking-wide transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#c9a96e]/20"
              >
                {navigating ? (
                  <span className="flex items-center gap-2 justify-center">
                    <span className="w-4 h-4 border-2 border-[#0a0a0f] border-t-transparent rounded-full animate-spin" />
                    {t('synastry.calculating')}
                  </span>
                ) : (
                  t('synastry.letsCompare')
                )}
              </button>
              {!bothSaved && (
                <p className="mt-3 text-xs text-[#6a6865]">
                  {t('synastry.saveBoth')}
                </p>
              )}
            </motion.div>
          </>
        )}
      </div>
    </main>
  )
}
