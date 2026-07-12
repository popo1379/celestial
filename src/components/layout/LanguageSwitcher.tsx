'use client'

import { motion } from 'framer-motion'
import { useI18nStore } from '@/stores/i18n-store'
import { locales, type Locale } from '@/i18n/translations'

const localeLabels: Record<Locale, string> = {
  en: 'EN',
  zh: '中文',
}

interface LanguageSwitcherProps {
  variant?: 'desktop' | 'mobile'
}

export function LanguageSwitcher({ variant = 'desktop' }: LanguageSwitcherProps) {
  const locale = useI18nStore((s) => s.locale)
  const setLocale = useI18nStore((s) => s.setLocale)

  if (variant === 'mobile') {
    return (
      <div className="flex items-center justify-center gap-1 border-b border-[#1e1e2a] bg-[#0a0a0f]/90 px-4 py-2 backdrop-blur-md">
        <div className="inline-flex rounded-lg border border-[#1e1e2a] bg-[#14141d] p-0.5">
          {locales.map((loc) => {
            const isActive = locale === loc
            return (
              <button
                key={loc}
                onClick={() => setLocale(loc)}
                className="relative px-3 py-1 text-xs font-medium transition-colors"
                style={{ color: isActive ? '#0a0a0f' : '#6a6865' }}
              >
                {isActive && (
                  <motion.div
                    layoutId="lang-mobile-indicator"
                    className="absolute inset-0 rounded-md bg-[#c9a96e]"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{localeLabels[loc]}</span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="inline-flex rounded-lg border border-[#1e1e2a] bg-[#14141d] p-0.5">
      {locales.map((loc) => {
        const isActive = locale === loc
        return (
          <button
            key={loc}
            onClick={() => setLocale(loc)}
            className="relative px-2.5 py-1 text-xs font-medium transition-colors"
            style={{ color: isActive ? '#0a0a0f' : '#6a6865' }}
            aria-label={`Switch to ${loc}`}
          >
            {isActive && (
              <motion.div
                layoutId="lang-desktop-indicator"
                className="absolute inset-0 rounded-md bg-[#c9a96e]"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
            <span className="relative z-10">{localeLabels[loc]}</span>
          </button>
        )
      })}
    </div>
  )
}
