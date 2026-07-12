'use client'

import { useI18nStore } from '@/stores/i18n-store'
import { translations, defaultLocale, type Locale } from '@/i18n/translations'

/**
 * Translation hook — returns a t() function bound to the current locale.
 * Falls back to English if the key is missing in the current locale.
 */
export function useTranslation() {
  const locale = useI18nStore((s) => s.locale)
  const setLocale = useI18nStore((s) => s.setLocale)

  const t = (key: string): string => {
    const dict = translations[locale] ?? translations[defaultLocale]
    return dict[key] ?? translations[defaultLocale][key] ?? key
  }

  return { t, locale, setLocale }
}

/**
 * Translate a zodiac sign name (e.g. 'Leo' -> '狮子座' when locale is zh)
 */
export function useSignTranslator() {
  const { t, locale } = useTranslation()

  const signKeyMap: Record<string, string> = {
    Aries: 'sign.aries',
    Taurus: 'sign.taurus',
    Gemini: 'sign.gemini',
    Cancer: 'sign.cancer',
    Leo: 'sign.leo',
    Virgo: 'sign.virgo',
    Libra: 'sign.libra',
    Scorpio: 'sign.scorpio',
    Sagittarius: 'sign.sagittarius',
    Capricorn: 'sign.capricorn',
    Aquarius: 'sign.aquarius',
    Pisces: 'sign.pisces',
  }

  const translateSign = (signName: string | undefined | null): string => {
    if (!signName) return ''
    if (locale === 'en') return signName
    const key = signKeyMap[signName]
    return key ? t(key) : signName
  }

  return { translateSign, locale }
}

/**
 * Translate a planet name (e.g. 'Mercury' -> '水星' when locale is zh)
 */
export function usePlanetTranslator() {
  const { t, locale } = useTranslation()

  const planetKeyMap: Record<string, string> = {
    Sun: 'planet.sun',
    Moon: 'planet.moon',
    Mercury: 'planet.mercury',
    Venus: 'planet.venus',
    Mars: 'planet.mars',
    Jupiter: 'planet.jupiter',
    Saturn: 'planet.saturn',
    Uranus: 'planet.uranus',
    Neptune: 'planet.neptune',
    Pluto: 'planet.pluto',
  }

  const translatePlanet = (planetName: string | undefined | null): string => {
    if (!planetName) return ''
    if (locale === 'en') return planetName
    const key = planetKeyMap[planetName]
    return key ? t(key) : planetName
  }

  return { translatePlanet, locale }
}

/**
 * Translate an aspect name (e.g. 'Conjunction' -> '合相' when locale is zh)
 */
export function useAspectTranslator() {
  const { t, locale } = useTranslation()

  const aspectKeyMap: Record<string, string> = {
    Conjunction: 'aspect.conjunction',
    Sextile: 'aspect.sextile',
    Square: 'aspect.square',
    Trine: 'aspect.trine',
    Opposition: 'aspect.opposition',
  }

  const translateAspect = (aspectName: string | undefined | null): string => {
    if (!aspectName) return ''
    if (locale === 'en') return aspectName
    const key = aspectKeyMap[aspectName]
    return key ? t(key) : aspectName
  }

  return { translateAspect, locale }
}

/**
 * Translate a sign mode (e.g. 'Cardinal' -> '基本' when locale is zh)
 */
export function useModeTranslator() {
  const { t, locale } = useTranslation()

  const modeKeyMap: Record<string, string> = {
    Cardinal: 'mode.cardinal',
    Fixed: 'mode.fixed',
    Mutable: 'mode.mutable',
  }

  const translateMode = (modeName: string | undefined | null): string => {
    if (!modeName) return ''
    if (locale === 'en') return modeName
    const key = modeKeyMap[modeName]
    return key ? t(key) : modeName
  }

  return { translateMode, locale }
}

/**
 * Translate a moon phase name (e.g. 'Full Moon' -> '满月' when locale is zh)
 */
export function useMoonPhaseTranslator() {
  const { t, locale } = useTranslation()

  const phaseKeyMap: Record<string, string> = {
    'New Moon': 'moonphase.newMoon',
    'Waxing Crescent': 'moonphase.waxingCrescent',
    'First Quarter': 'moonphase.firstQuarter',
    'Waxing Gibbous': 'moonphase.waxingGibbous',
    'Full Moon': 'moonphase.fullMoon',
    'Waning Gibbous': 'moonphase.waningGibbous',
    'Last Quarter': 'moonphase.lastQuarter',
    'Waning Crescent': 'moonphase.waningCrescent',
  }

  const translateMoonPhase = (phaseName: string | undefined | null): string => {
    if (!phaseName) return ''
    if (locale === 'en') return phaseName
    const key = phaseKeyMap[phaseName]
    return key ? t(key) : phaseName
  }

  return { translateMoonPhase, locale }
}

export type { Locale }
