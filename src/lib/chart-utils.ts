import { calculateFullNatalChart, calculateMoonPhase, type BirthInfo, type ChartResult } from './astrology/engine'

export function computeChart(birthInfo: BirthInfo): ChartResult | null {
  try {
    return calculateFullNatalChart(birthInfo)
  } catch (e) {
    console.error('Chart calculation error:', e)
    return null
  }
}
