import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { defaultLocale, type Locale } from '@/i18n/translations'

interface I18nState {
  locale: Locale
  setLocale: (locale: Locale) => void
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set) => ({
      locale: defaultLocale,
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: 'celestial-locale',
    }
  )
)
