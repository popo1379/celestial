'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocalProfile } from '@/hooks/useLocalProfile'
import { useGuestChartStore } from '@/stores/guest-store'
import { calculateNatalChart } from '@/lib/astrology/engine'
import type { BirthInfo } from '@/lib/astrology/engine'
import { searchCities, cityList } from '@/lib/astrology/coordinates'
import type { CityCoordinate } from '@/lib/astrology/coordinates'
import { useTranslation, type Locale } from '@/hooks/useTranslation'

function getCityFromCoordinates(latitude: number, longitude: number): CityCoordinate | null {
  return cityList.find(c => 
    Math.abs(c.latitude - latitude) < 0.001 && 
    Math.abs(c.longitude - longitude) < 0.001
  ) || null
}

function formatDate(month: number, day: number, year: number, locale: Locale): string {
  const dateObj = new Date(year, month - 1, day)
  return dateObj.toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatTime(hour: number, minute: number): string {
  const h = hour % 12 || 12
  const ampm = hour < 12 ? 'AM' : 'PM'
  return `${h}:${minute.toString().padStart(2, '0')} ${ampm}`
}

function getSunSignName(birthInfo: BirthInfo): string {
  try {
    const chart = calculateNatalChart(birthInfo)
    return chart.sun.signName || 'Unknown'
  } catch {
    return 'Unknown'
  }
}

const zodiacSymbols: Record<string, string> = {
  Aries: '\u2648', Taurus: '\u2649', Gemini: '\u264A', Cancer: '\u264B',
  Leo: '\u264C', Virgo: '\u264D', Libra: '\u264E', Scorpio: '\u264F',
  Sagittarius: '\u2650', Capricorn: '\u2651', Aquarius: '\u2652', Pisces: '\u2653',
}

export default function ProfileView() {
  const router = useRouter()
  const { t, locale } = useTranslation()
  const { profiles, save, remove, loaded, syncing, defaultId, setDefault } = useLocalProfile()
  const setBirthInfo = useGuestChartStore((s) => s.setBirthInfo)
  const [showForm, setShowForm] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const [name, setName] = useState('')
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

  function handleSaveProfile(e: React.FormEvent) {
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

    const profileData = {
      name: name.trim() || '',
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

    save(profileData)
    resetForm()
    setShowForm(false)
    setSubmitting(false)
  }

  function resetForm() {
    setName('')
    setMonth('')
    setDay('')
    setYear('')
    setHour('')
    setMinute('')
    setIsAM(true)
    setHasExactTime(true)
    setCityQuery('')
    setSelectedCity(null)
    setCityResults([])
    setErrors({})
  }

  function handleViewChart(profile: BirthInfo) {
    setBirthInfo(profile)
    router.push('/chart')
  }

  function handleDelete(id: string) {
    remove(id)
    setDeleteConfirmId(null)
  }

  const sortedProfiles = [...profiles].sort((a, b) => b.createdAt - a.createdAt)

  return (
    <main className="min-h-screen bg-bg-primary px-4 pb-24 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="font-serif text-3xl font-bold text-text-primary">
              {t('profile.title')}
            </h1>
            <p className="mt-1 text-sm text-text-tertiary">{t('profile.subtitle')}</p>
          </div>
          <button
            onClick={() => {
              resetForm()
              setShowForm(!showForm)
            }}
            className="flex items-center gap-2 rounded-lg border border-accent-gold/30 bg-accent-gold/10 px-4 py-2 text-sm font-medium text-accent-gold transition-all duration-200 hover:bg-accent-gold/20"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            {showForm ? t('common.cancel') : t('profile.addProfile')}
          </button>
        </motion.div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mb-8 rounded-2xl border border-bg-secondary bg-bg-elevated/80 p-6 backdrop-blur-sm sm:p-8">
                <h2 className="mb-1 text-lg font-semibold text-text-primary">{t('profile.newProfile')}</h2>
                <p className="mb-6 text-xs text-text-tertiary">{t('profile.enterBirth')}</p>

                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div>
                    <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-text-secondary">
                      {t('profile.profileName')}
                    </label>
                    <input
                      type="text"
                      placeholder={t('profile.namePlaceholder')}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-lg border border-bg-secondary bg-bg-secondary px-3 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary transition-colors focus:border-accent-gold/50 focus:outline-none focus:ring-1 focus:ring-accent-gold/20"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-text-secondary">
                      {t('form.birthDate')}
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <select
                          value={month}
                          onChange={(e) => { setMonth(e.target.value); setErrors((p) => { const n = { ...p }; delete n.month; return n }) }}
                          className={`w-full appearance-none rounded-lg border bg-bg-secondary px-3 py-2.5 text-sm text-text-primary transition-colors focus:outline-none focus:ring-1 focus:ring-accent-gold/20 ${errors.month ? 'border-challenging/50' : 'border-bg-secondary focus:border-accent-gold/50'}`}
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
                          className={`w-full appearance-none rounded-lg border bg-bg-secondary px-3 py-2.5 text-sm text-text-primary transition-colors focus:outline-none focus:ring-1 focus:ring-accent-gold/20 ${errors.day ? 'border-challenging/50' : 'border-bg-secondary focus:border-accent-gold/50'}`}
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
                          className={`w-full rounded-lg border bg-bg-secondary px-3 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary transition-colors focus:outline-none focus:ring-1 focus:ring-accent-gold/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${errors.year ? 'border-challenging/50' : 'border-bg-secondary focus:border-accent-gold/50'}`}
                        />
                      </div>
                    </div>
                    {(errors.month || errors.day || errors.year) && (
                      <p className="mt-1 text-xs text-challenging">{errors.month || errors.day || errors.year}</p>
                    )}
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-xs font-medium uppercase tracking-wider text-text-secondary">
                        {t('form.birthTime')}
                      </label>
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="checkbox"
                          checked={!hasExactTime}
                          onChange={(e) => setHasExactTime(!e.target.checked)}
                          className="h-3.5 w-3.5 rounded border-bg-secondary bg-bg-secondary text-accent-gold accent-accent-gold focus:ring-accent-gold/30 focus:ring-offset-0"
                        />
                        <span className="text-xs text-text-tertiary transition-colors hover:text-text-secondary">
                          {t('form.unknownTime')}
                        </span>
                      </label>
                    </div>
                    {hasExactTime && (
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <select
                            value={hour}
                            onChange={(e) => { setHour(e.target.value); setErrors((p) => { const n = { ...p }; delete n.hour; return n }) }}
                            className={`w-full appearance-none rounded-lg border bg-bg-secondary px-3 py-2.5 text-sm text-text-primary transition-colors focus:outline-none focus:ring-1 focus:ring-accent-gold/20 ${errors.hour ? 'border-challenging/50' : 'border-bg-secondary focus:border-accent-gold/50'}`}
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
                            className="w-full appearance-none rounded-lg border border-bg-secondary bg-bg-secondary px-3 py-2.5 text-sm text-text-primary transition-colors focus:border-accent-gold/50 focus:outline-none focus:ring-1 focus:ring-accent-gold/20"
                          >
                            <option value="">{t('common.min')}</option>
                            {Array.from({ length: 60 }, (_, i) => (
                              <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex flex-shrink-0 overflow-hidden rounded-lg border border-bg-secondary">
                          <button
                            type="button"
                            onClick={() => setIsAM(true)}
                            className={`px-3 py-2.5 text-xs font-medium transition-colors ${isAM ? 'bg-accent-gold text-bg-primary' : 'bg-bg-secondary text-text-tertiary hover:text-text-secondary'}`}
                          >
                            {t('common.am')}
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsAM(false)}
                            className={`px-3 py-2.5 text-xs font-medium transition-colors ${!isAM ? 'bg-accent-gold text-bg-primary' : 'bg-bg-secondary text-text-tertiary hover:text-text-secondary'}`}
                          >
                            {t('common.pm')}
                          </button>
                        </div>
                      </div>
                    )}
                    {errors.hour && <p className="mt-1 text-xs text-challenging">{errors.hour}</p>}
                  </div>

                  <div ref={cityRef} className="relative">
                    <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-text-secondary">
                      {t('form.birthPlace')}
                    </label>
                    <input
                      type="text"
                      placeholder={t('form.searchCity')}
                      value={cityQuery}
                      onChange={(e) => handleCityInputChange(e.target.value)}
                      onFocus={() => { if (cityResults.length > 0) setShowCityDropdown(true) }}
                      className={`w-full rounded-lg border bg-bg-secondary px-3 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary transition-colors focus:outline-none focus:ring-1 focus:ring-accent-gold/20 ${errors.city ? 'border-challenging/50' : 'border-bg-secondary focus:border-accent-gold/50'}`}
                    />
                    <AnimatePresence>
                      {showCityDropdown && cityResults.length > 0 && (
                        <motion.ul
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.15 }}
                          className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-bg-secondary bg-[#14141d] shadow-xl"
                        >
                          {cityResults.map((city, idx) => (
                            <li
                              key={`${city.city}-${city.state}-${idx}`}
                              onClick={() => selectCity(city)}
                              className="cursor-pointer px-3 py-2.5 text-sm text-text-primary transition-colors hover:bg-bg-secondary"
                            >
                              {city.city}, {city.state}
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                    {errors.city && <p className="mt-1 text-xs text-challenging">{errors.city}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-lg bg-accent-gold py-3 text-sm font-semibold tracking-wide text-bg-primary transition-all duration-200 hover:bg-accent-gold/90 hover:shadow-lg hover:shadow-accent-gold/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? t('profile.saving') : t('profile.saveProfile')}
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!loaded ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent-gold border-t-transparent" />
            <p className="mt-3 text-xs text-text-tertiary">{syncing ? t('profile.syncing') : t('common.loading')}</p>
          </div>
        ) : sortedProfiles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-dashed border-bg-secondary bg-bg-elevated/50 px-6 py-16 text-center backdrop-blur-sm"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-gold/10">
              <svg className="h-8 w-8 text-accent-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="mb-1 font-serif text-xl font-semibold text-text-primary">
              {t('profile.noProfiles')}
            </h3>
            <p className="mb-6 text-sm text-text-tertiary">
              {t('profile.addFirst')}
            </p>
            <button
              onClick={() => {
                resetForm()
                setShowForm(true)
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-accent-gold px-6 py-2.5 text-sm font-medium text-bg-primary transition-colors hover:bg-accent-gold/90"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              {t('profile.addProfile')}
            </button>
          </motion.div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {sortedProfiles.map((profile, index) => {
              const sunSignName = getSunSignName(profile)
              return (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group rounded-xl border border-bg-secondary bg-bg-elevated p-5 transition-all duration-200 hover:border-accent-gold/40 hover:shadow-lg hover:shadow-accent-gold/5"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-lg font-semibold text-text-primary">
                          {profile.name || t('profile.profile') + ' ' + (index + 1)}
                        </h3>
                        {defaultId === profile.id && (
                          <span className="rounded-full border border-accent-gold/40 bg-accent-gold/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent-gold">
                            {t('profile.default') || 'Default'}
                          </span>
                        )}
                      </div>
                      {profile.name && (
                        <p className="text-xs text-text-tertiary">
                          {t('profile.profile')} {index + 1}
                        </p>
                      )}
                    </div>
                    {sunSignName && zodiacSymbols[sunSignName] && (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-gold/10 text-xl text-accent-gold">
                        {zodiacSymbols[sunSignName]}
                      </div>
                    )}
                  </div>

                  <div className="mb-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="h-4 w-4 flex-shrink-0 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                      <span className="text-text-secondary">{formatDate(profile.month, profile.day, profile.year, locale)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="h-4 w-4 flex-shrink-0 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-text-secondary">
                        {profile.hasExactTime && profile.hour !== undefined
                          ? formatTime(profile.hour, profile.minute || 0)
                          : t('profile.unknownTime')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="h-4 w-4 flex-shrink-0 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      <span className="text-text-secondary">
                        {profile.latitude && profile.longitude
                          ? (() => {
                              const city = getCityFromCoordinates(profile.latitude, profile.longitude)
                              return city ? `${city.city}, ${city.state}` : t('profile.unknownLocation')
                            })()
                          : t('profile.unknownPlace')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-lg">{zodiacSymbols[sunSignName] || '\u2609'}</span>
                      <span className="font-medium text-accent-gold">{sunSignName + ' ' + t('profile.sunSign')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleViewChart(profile)}
                      className="flex-1 rounded-lg border border-accent-gold/30 bg-accent-gold/10 px-3 py-2 text-sm font-medium text-accent-gold transition-all duration-200 hover:bg-accent-gold/20"
                    >
                      {t('profile.viewChart')}
                    </button>
                    {defaultId !== profile.id && (
                      <button
                        onClick={() => setDefault(profile.id)}
                        className="rounded-lg border border-bg-secondary px-3 py-2 text-xs font-medium text-text-tertiary transition-colors hover:border-accent-gold/40 hover:text-accent-gold"
                        title={t('profile.setAsDefault') || 'Set as default'}
                      >
                        {t('profile.setAsDefault') || 'Set Default'}
                      </button>
                    )}
                    {deleteConfirmId === profile.id ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDelete(profile.id)}
                          className="rounded-lg bg-challenging px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-challenging/80"
                        >
                          {t('common.confirm')}
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="rounded-lg border border-bg-secondary px-3 py-2 text-sm text-text-tertiary transition-colors hover:text-text-secondary"
                        >
                          {t('common.cancel')}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(profile.id)}
                        className="rounded-lg p-2 text-text-tertiary transition-colors hover:text-challenging"
                        title={t('profile.deleteProfile')}
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
