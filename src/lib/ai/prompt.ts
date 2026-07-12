import type { ChartResult, SynastryResult, PlanetPosition, AspectResult } from '@/lib/astrology/engine'

export interface AIContext {
  type: 'natal' | 'synastry'
  chartData?: ChartResult
  synastryData?: {
    chartA: ChartResult
    chartB: ChartResult
    synastry: SynastryResult
  }
}

/**
 * Format planet positions for AI context
 */
function formatPlanets(planets: PlanetPosition[]): string {
  return planets
    .map(p => {
      const deg = Math.floor(p.degreeInSign ?? 0)
      const min = Math.floor(((p.degreeInSign ?? 0) - deg) * 60)
      return `${p.name} in ${p.signName} ${deg}°${min.toString().padStart(2, '0')}'${p.house ? ` (House ${p.house})` : ''}`
    })
    .join('\n')
}

/**
 * Format aspects for AI context
 */
function formatAspects(aspects: AspectResult[], limit = 10): string {
  if (!aspects || aspects.length === 0) return 'No major aspects found.'
  const sorted = [...aspects].sort((a, b) => a.orb - b.orb)
  return sorted
    .slice(0, limit)
    .map(a => {
      const planetA = a.planetA?.name || 'Unknown'
      const planetB = a.planetB?.name || 'Unknown'
      return `${planetA} ${a.englishName} ${planetB} (orb: ${a.orb.toFixed(1)}°, ${a.friendly ? 'harmonious' : 'challenging'})`
    })
    .join('\n')
}

/**
 * Build the system prompt for natal chart interpretation
 */
export function buildNatalSystemPrompt(chart: ChartResult): string {
  const bigThree = `Sun: ${chart.sun.signName} ${Math.floor(chart.sun.degreeInSign ?? 0)}°
Moon: ${chart.moon.signName} ${Math.floor(chart.moon.degreeInSign ?? 0)}°
Ascendant: ${chart.ascendant?.signName ?? 'Unknown'}`

  const planets = formatPlanets(chart.planets)
  const aspects = formatAspects(chart.natalAspects || [])

  const houses = chart.houseCusps && chart.houseCusps.length > 0
    ? chart.houseCusps.map(h => `House ${h.houseNumber}: ${h.signName}`).join('\n')
    : 'House data not available (birth time unknown)'

  return `You are Celestial AI, an expert Western astrology interpreter with deep knowledge of natal charts, planetary placements, aspects, and houses.

The user has the following natal chart:

BIG THREE:
${bigThree}

ALL PLANET POSITIONS:
${planets}

MAJOR ASPECTS (sorted by orb):
${aspects}

HOUSES:
${houses}

Guidelines:
- Provide insightful, personalized, and supportive interpretations
- Reference specific chart placements when relevant (e.g., "Your Sun in Leo suggests...")
- Use clear, accessible language — avoid overly technical jargon
- Be encouraging and constructive, even when discussing challenging aspects
- Keep responses concise (under 400 words unless asked for detail)
- If asked about predictions, frame them as tendencies and potentials, not certainties
- Focus on psychological and spiritual growth perspectives`
}

/**
 * Build the system prompt for synastry (compatibility) interpretation
 */
export function buildSynastrySystemPrompt(
  chartA: ChartResult,
  chartB: ChartResult,
  synastry: SynastryResult,
): string {
  const personA = `Person A:
- Sun: ${chartA.sun.signName}
- Moon: ${chartA.moon.signName}
- Ascendant: ${chartA.ascendant?.signName ?? 'Unknown'}
- Venus: ${chartA.venus?.signName ?? 'Unknown'}
- Mars: ${chartA.mars?.signName ?? 'Unknown'}`

  const personB = `Person B:
- Sun: ${chartB.sun.signName}
- Moon: ${chartB.moon.signName}
- Ascendant: ${chartB.ascendant?.signName ?? 'Unknown'}
- Venus: ${chartB.venus?.signName ?? 'Unknown'}
- Mars: ${chartB.mars?.signName ?? 'Unknown'}`

  const compatibilityScore = synastry.compatibilityScore
  const positiveCount = synastry.positiveCount
  const challengeCount = synastry.challengeCount

  const topAspects = synastry.aspects
    .sort((a, b) => a.orb - b.orb)
    .slice(0, 8)
    .map(a => {
      const planetA = a.planetA?.name || 'Unknown'
      const planetB = a.planetB?.name || 'Unknown'
      return `${planetA} ${a.englishName} ${planetB} (orb: ${a.orb.toFixed(1)}°, ${a.friendly ? 'harmonious' : 'challenging'})`
    })
    .join('\n')

  return `You are Celestial AI, an expert Western astrology relationship and synastry interpreter.

You are analyzing the compatibility between two people based on their natal charts and synastry aspects.

${personA}

${personB}

SYNASTRY SUMMARY:
- Compatibility Score: ${compatibilityScore}/100
- Harmonious Aspects: ${positiveCount}
- Challenging Aspects: ${challengeCount}

TOP SYNASTRY ASPECTS:
${topAspects}

Guidelines:
- Provide balanced, insightful relationship analysis
- Highlight both strengths and growth areas
- Reference specific planetary interactions (e.g., "His Moon trine her Sun creates emotional harmony...")
- Be constructive and supportive — frame challenges as growth opportunities
- Keep responses concise (under 400 words unless asked for detail)
- Avoid definitive predictions about relationship outcomes
- Focus on understanding dynamics and mutual growth`
}

/**
 * Preset questions for natal chart context
 */
export const natalPresetQuestions = [
  "What does my Sun sign reveal about my core identity?",
  "How does my Moon sign affect my emotional life?",
  "What does my Ascendant say about how others see me?",
  "Explain the most significant aspect in my chart",
  "What are my chart's dominant strengths and challenges?",
  "How do my planetary placements affect my career?",
]

/**
 * Preset questions for synastry context
 */
export const synastryPresetQuestions = [
  "What is the overall compatibility between us?",
  "What are our relationship's strongest points?",
  "What challenges might we face together?",
  "How do our Moon signs affect our emotional connection?",
  "What does our Venus-Mars aspect mean for romance?",
]
