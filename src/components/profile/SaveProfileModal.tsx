'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from '@/hooks/useTranslation'
import { useAuth } from '@/hooks/useAuth'
import type { BirthInfo } from '@/lib/astrology/engine'
import { calculateNatalChart } from '@/lib/astrology/engine'
import { useLocalProfile } from '@/hooks/useLocalProfile'

interface SaveProfileModalProps {
  open: boolean
  onClose: () => void
  birthInfo: BirthInfo
  maxProfiles?: number
}

const zodiacSymbols: Record<string, string> = {
  Aries: '\u2648', Taurus: '\u2649', Gemini: '\u264A', Cancer: '\u264B',
  Leo: '\u264C', Virgo: '\u264D', Libra: '\u264E', Scorpio: '\u264F',
  Sagittarius: '\u2650', Capricorn: '\u2651', Aquarius: '\u2652', Pisces: '\u2653',
}

export function SaveProfileModal({ open, onClose, birthInfo, maxProfiles = 20 }: SaveProfileModalProps) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { profiles, save } = useLocalProfile()
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setName('')
      setError('')
      setSaving(false)
    }
  }, [open])

  const sunSign = (() => {
    try {
      const chart = calculateNatalChart(birthInfo)
      return chart.sun.signName || ''
    } catch {
      return ''
    }
  })()

  const birthDateStr = `${birthInfo.month}/${birthInfo.day}/${birthInfo.year}`

  const atLimit = profiles.length >= maxProfiles

  async function handleSave() {
    if (saving) return
    const trimmed = name.trim()
    if (!trimmed) {
      setError(t('profile.enterName') || 'Please enter a profile name')
      return
    }
    if (atLimit) {
      setError(t('profile.limitReached') || `You can only save up to ${maxProfiles} profiles. Please delete one first.`)
      return
    }

    setSaving(true)
    setError('')

    try {
      await save({
        name: trimmed,
        year: birthInfo.year,
        month: birthInfo.month,
        day: birthInfo.day,
        hour: birthInfo.hour,
        minute: birthInfo.minute,
        latitude: birthInfo.latitude,
        longitude: birthInfo.longitude,
        timezoneOffset: birthInfo.timezoneOffset,
        hasExactTime: birthInfo.hasExactTime,
      })
      onClose()
    } catch (e) {
      setError(t('profile.saveFailed') || 'Failed to save profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* 移动端：从底部滑出的全宽弹窗 */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
          >
            <div className="max-h-[85vh] overflow-y-auto rounded-t-2xl border-b-0 border-l border-r border-t border-[#1e1e2a] bg-[#0f0f15] shadow-2xl">
              {/* 拖拽指示条 */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="h-1 w-10 rounded-full bg-[#2a2a3a]" />
              </div>

              <div className="px-5 pb-6">
                <h2 className="mb-1 font-serif text-lg font-semibold text-[#e8e6e3]">
                  {t('profile.saveChart') || 'Save Chart to Profiles'}
                </h2>
                <p className="mb-4 text-sm text-[#6a6865]">
                  {t('profile.saveChartDesc') || 'Give this chart a name to save it to your profiles.'}
                </p>

                <div className="mb-4 flex items-center gap-3 rounded-xl border border-[#1e1e2a] bg-[#14141d] p-3">
                  {sunSign && zodiacSymbols[sunSign] && (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#c9a96e]/10 text-xl text-[#c9a96e]">
                      {zodiacSymbols[sunSign]}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#e8e6e3]">
                      {sunSign} {t('chart.sun')}
                    </p>
                    <p className="text-xs text-[#6a6865]">{birthDateStr}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#6a6865]">
                    {t('profile.profileName')}
                  </label>
                  <input
                    type="text"
                    autoFocus
                    placeholder={t('profile.namePlaceholder')}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      if (error) setError('')
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSave()
                    }}
                    disabled={saving || atLimit}
                    className="w-full rounded-lg border border-[#2a2a3a] bg-[#14141d] px-3 py-2.5 text-sm text-[#e8e6e3] placeholder:text-[#6a6865] transition-colors focus:border-[#c9a96e]/50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                {error && (
                  <p className="mb-4 text-xs text-red-400">{error}</p>
                )}

                {!user && (
                  <p className="mb-4 text-xs text-[#6a6865]">
                    {t('profile.saveLocalHint') || 'Saved locally. Sign in to sync across devices.'}
                  </p>
                )}

                {atLimit && user && (
                  <p className="mb-4 text-xs text-[#6a6865]">
                    {t('profile.atLimitHint') || `You have ${maxProfiles} profiles. Delete one to save more.`}
                  </p>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    disabled={saving}
                    className="flex-1 rounded-lg border border-[#2a2a3a] bg-transparent py-3 text-sm font-medium text-[#6a6865] transition-colors hover:border-[#c9a96e]/30 hover:text-[#e8e6e3] disabled:opacity-50"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving || atLimit}
                    className="flex-1 rounded-lg bg-[#c9a96e] py-3 text-sm font-semibold text-[#0a0a0f] transition-colors hover:bg-[#b8964f] disabled:opacity-50"
                  >
                    {saving ? t('profile.saving') : t('common.save')}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* PC端：居中弹窗 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-4 bottom-4 z-50 hidden w-[90%] max-w-md -translate-x-1/2 flex-col md:flex"
          >
            <div className="flex-1 overflow-y-auto rounded-2xl border border-[#c9a96e]/30 bg-[#0f0f15] p-6 shadow-2xl">
              <h2 className="mb-1 font-serif text-xl font-semibold text-text-primary">
                {t('profile.saveChart') || 'Save Chart to Profiles'}
              </h2>
              <p className="mb-5 text-sm text-text-tertiary">
                {t('profile.saveChartDesc') || 'Give this chart a name to save it to your profiles.'}
              </p>

              <div className="mb-5 flex items-center gap-3 rounded-xl border border-bg-secondary bg-bg-secondary/50 p-3">
                {sunSign && zodiacSymbols[sunSign] && (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-gold/10 text-xl text-accent-gold">
                    {zodiacSymbols[sunSign]}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary">
                    {sunSign} {t('chart.sun')}
                  </p>
                  <p className="text-xs text-text-tertiary">{birthDateStr}</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-text-secondary">
                  {t('profile.profileName')}
                </label>
                <input
                  type="text"
                  autoFocus
                  placeholder={t('profile.namePlaceholder')}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (error) setError('')
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave()
                  }}
                  disabled={saving || atLimit}
                  className="w-full rounded-lg border border-bg-secondary bg-bg-secondary px-3 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary transition-colors focus:border-accent-gold/50 focus:outline-none focus:ring-1 focus:ring-accent-gold/20 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {error && (
                <p className="mb-4 text-xs text-challenging">{error}</p>
              )}

              {!user && (
                <p className="mb-4 text-xs text-text-tertiary">
                  {t('profile.saveLocalHint') || 'Saved locally. Sign in to sync across devices.'}
                </p>
              )}

              {atLimit && user && (
                <p className="mb-4 text-xs text-text-tertiary">
                  {t('profile.atLimitHint') || `You have ${maxProfiles} profiles. Delete one to save more.`}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  disabled={saving}
                  className="flex-1 rounded-lg border border-bg-secondary bg-transparent py-2.5 text-sm font-medium text-text-secondary transition-colors hover:border-accent-gold/30 hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || atLimit}
                  className="flex-1 rounded-lg bg-accent-gold py-2.5 text-sm font-semibold text-bg-primary transition-all duration-200 hover:bg-accent-gold/90 hover:shadow-lg hover:shadow-accent-gold/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? t('profile.saving') : t('common.save')}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
