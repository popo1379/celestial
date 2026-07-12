'use client'

import { forwardRef, useRef, useEffect, useCallback, useState } from 'react'
import type { PlanetPosition, AxisPoint, MoonPhaseResult, AspectResult, HouseCusp } from '@/lib/astrology/engine'
import { zodiacNames, zodiacSymbols } from '@/lib/astrology/engine'
import { planetInterpretations, signInterpretations, houseInterpretations, aspectInterpretations } from '@/lib/astrology/interpretation'
import { useI18nStore } from '@/stores/i18n-store'
import { translations, defaultLocale, type Locale } from '@/i18n/translations'

interface AstrologyWheelProps {
  planets: PlanetPosition[]
  ascendant?: AxisPoint | null
  midheaven?: AxisPoint | null
  descendant?: AxisPoint | null
  imumCoeli?: AxisPoint | null
  moonPhase?: MoonPhaseResult | null
  natalAspects?: AspectResult[]
  houseCusps?: HouseCusp[] | null
  houses?: number[] | null
  size?: number
  compact?: boolean
  interactive?: boolean
}

type AstrologyWheelRef = HTMLCanvasElement | null

const MAJOR_PLANETS = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']
const BIG_THREE = ['Sun', 'Moon']

const ASPECT_DEFS = [
  { angle: 0, orb: 8, friendly: true, name: 'Conjunction' },
  { angle: 60, orb: 6, friendly: true, name: 'Sextile' },
  { angle: 90, orb: 7, friendly: false, name: 'Square' },
  { angle: 120, orb: 8, friendly: true, name: 'Trine' },
  { angle: 180, orb: 8, friendly: false, name: 'Opposition' },
]

const ELEMENT_COLORS: Record<string, string> = {
  Fire: '#ff6b4a',
  Earth: '#8b7355',
  Air: '#64b5f6',
  Water: '#4ecdc4',
}
const SIGN_ELEMENTS = ['Fire', 'Earth', 'Air', 'Water']
function getSignElementColor(signIndex: number): string {
  return ELEMENT_COLORS[SIGN_ELEMENTS[Math.floor(signIndex / 3) % 4]] || '#e0e0e0'
}

const COLOR_HARMONIOUS = '#4ecdc4'
const COLOR_CHALLENGING = '#ff6b6b'
const COLOR_ASC = '#ffd700'
const COLOR_MC = '#64b5f6'
const COLOR_DSC = '#c9a96e'
const COLOR_IC = '#a8a6a3'
const COLOR_BORDER = 'rgba(255,255,255,0.12)'
const COLOR_PLANET = '#ffffff'

interface TooltipData {
  type: 'planet' | 'sign' | 'house' | 'aspect' | 'angle'
  title: string
  subtitle?: string
  details: string[]
  keywords?: string[]
  x: number
  y: number
}

function lonToRad(lon: number): number {
  return (lon - 90) * (Math.PI / 180)
}

function polarToCartesian(cx: number, cy: number, r: number, rad: number): { x: number; y: number } {
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function diffAngle(a: number, b: number): number {
  let d = Math.abs(a - b)
  if (d > 180) d = 360 - d
  return d
}

function computeAspects(planets: PlanetPosition[]): { i: number; j: number; friendly: boolean; name: string; orb: number }[] {
  const aspects: { i: number; j: number; friendly: boolean; name: string; orb: number }[] = []
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const d = diffAngle(planets[i].longitude, planets[j].longitude)
      for (const def of ASPECT_DEFS) {
        const orb = Math.abs(d - def.angle)
        if (orb <= def.orb) {
          aspects.push({ i, j, friendly: def.friendly, name: def.name, orb })
          break
        }
      }
    }
  }
  return aspects
}

function pointToSegmentDist(px: number, py: number, x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1
  const dy = y2 - y1
  const lenSq = dx * dx + dy * dy
  if (lenSq === 0) return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2)
  let t = ((px - x1) * dx + (py - y1) * dy) / lenSq
  t = Math.max(0, Math.min(1, t))
  const projX = x1 + t * dx
  const projY = y1 + t * dy
  return Math.sqrt((px - projX) ** 2 + (py - projY) ** 2)
}

function drawBackground(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, r + 4, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(15, 15, 35, 0.85)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.15)'
  ctx.lineWidth = 1.5
  ctx.stroke()
  ctx.restore()
}

function drawZodiacRing(ctx: CanvasRenderingContext2D, cx: number, cy: number, outerR: number, innerR: number, localizedZodiacNames: string[]) {
  ctx.save()
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  for (let i = 0; i < 12; i++) {
    const lon1 = i * 30
    const lon2 = (i + 1) * 30
    const rad1 = lonToRad(lon1)
    const rad2 = lonToRad(lon2)

    ctx.beginPath()
    ctx.arc(cx, cy, outerR, rad1, rad2)
    ctx.arc(cx, cy, innerR, rad2, rad1, true)
    ctx.closePath()

    const elementColor = getSignElementColor(i)
    ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.09)'
    ctx.fill()
    ctx.save()
    ctx.globalAlpha = 0.08
    ctx.fillStyle = elementColor
    ctx.fill()
    ctx.restore()

    ctx.strokeStyle = COLOR_BORDER
    ctx.lineWidth = 0.5
    ctx.stroke()

    for (let d = 0; d < 30; d += 10) {
      if (d === 0) continue
      const tickLon = lon1 + d
      const tickRad = lonToRad(tickLon)
      const tickOuter = outerR - 2
      const tickInner = outerR - 6
      const p1 = polarToCartesian(cx, cy, tickOuter, tickRad)
      const p2 = polarToCartesian(cx, cy, tickInner, tickRad)
      ctx.beginPath()
      ctx.moveTo(p1.x, p1.y)
      ctx.lineTo(p2.x, p2.y)
      ctx.strokeStyle = 'rgba(255,255,255,0.15)'
      ctx.lineWidth = 0.5
      ctx.stroke()
    }

    const midLon = lon1 + 15
    const midRad = lonToRad(midLon)
    const labelR = innerR + (outerR - innerR) * 0.65
    const pos = polarToCartesian(cx, cy, labelR, midRad)

    ctx.save()
    ctx.translate(pos.x, pos.y)
    ctx.fillStyle = elementColor
    ctx.font = `${Math.round((outerR - innerR) * 0.42)}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(zodiacSymbols[i], 0, -1)
    ctx.restore()

    const nameR = innerR + (outerR - innerR) * 0.25
    const namePos = polarToCartesian(cx, cy, nameR, midRad)
    ctx.save()
    ctx.translate(namePos.x, namePos.y)
    ctx.fillStyle = 'rgba(255,255,255,0.45)'
    ctx.font = `${Math.round((outerR - innerR) * 0.22)}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(localizedZodiacNames[i].substring(0, 4), 0, 0)
    ctx.restore()
  }

  ctx.restore()
}

function drawHouseRing(ctx: CanvasRenderingContext2D, cx: number, cy: number, outerR: number, innerR: number, ascendant?: AxisPoint | null) {
  ctx.save()

  const house0Lon = ascendant ? ascendant.signIndex! * 30 : 0

  for (let i = 0; i < 12; i++) {
    const lon1 = (house0Lon + i * 30) % 360
    const lon2 = (house0Lon + (i + 1) * 30) % 360
    const rad1 = lonToRad(lon1)
    const rad2 = lonToRad(lon2)

    ctx.beginPath()
    ctx.arc(cx, cy, outerR, rad1, rad2)
    ctx.arc(cx, cy, innerR, rad2, rad1, true)
    ctx.closePath()
    ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.06)'
    ctx.fill()
    ctx.strokeStyle = COLOR_BORDER
    ctx.lineWidth = 0.5
    ctx.stroke()

    const midLon = (lon1 + 15) % 360
    const midRad = lonToRad(midLon)
    const labelR = innerR + (outerR - innerR) * 0.5
    const pos = polarToCartesian(cx, cy, labelR, midRad)

    ctx.save()
    ctx.translate(pos.x, pos.y)
    ctx.fillStyle = 'rgba(255,255,255,0.55)'
    ctx.font = `${Math.round((outerR - innerR) * 0.45)}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(String(i + 1), 0, 0)
    ctx.restore()
  }

  ctx.restore()
}

function drawHouseCuspLabels(ctx: CanvasRenderingContext2D, cx: number, cy: number, innerR: number, houseCusps: HouseCusp[]) {
  ctx.save()
  ctx.font = '9px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  for (const cusp of houseCusps) {
    if (cusp.houseNumber <= 6) continue
    const rad = lonToRad(cusp.longitude)
    const pos = polarToCartesian(cx, cy, innerR - 8, rad)
    ctx.fillStyle = 'rgba(255,255,255,0.3)'
    ctx.fillText(`${cusp.signName.substring(0, 3)} ${Math.floor(cusp.longitude % 30)}°`, pos.x, pos.y)
  }

  ctx.restore()
}

function drawAspectLines(ctx: CanvasRenderingContext2D, cx: number, cy: number, planets: PlanetPosition[], orbitR: number) {
  const aspects = computeAspects(planets)

  ctx.save()
  for (const { i, j, friendly, name, orb } of aspects) {
    const rad1 = lonToRad(planets[i].longitude)
    const rad2 = lonToRad(planets[j].longitude)
    const p1 = polarToCartesian(cx, cy, orbitR, rad1)
    const p2 = polarToCartesian(cx, cy, orbitR, rad2)

    ctx.beginPath()
    ctx.moveTo(p1.x, p1.y)
    ctx.lineTo(p2.x, p2.y)

    const maxOrb = name === 'Conjunction' || name === 'Opposition' || name === 'Trine' ? 8 : 7
    const strength = 1 - (orb / maxOrb)
    ctx.globalAlpha = 0.15 + strength * 0.25

    if (friendly) {
      ctx.strokeStyle = COLOR_HARMONIOUS
      ctx.setLineDash(name === 'Sextile' || name === 'Trine' ? [4, 4] : [])
    } else {
      ctx.strokeStyle = COLOR_CHALLENGING
      ctx.setLineDash(name === 'Square' ? [2, 3] : [])
    }
    ctx.lineWidth = 1 + strength
    ctx.stroke()
    ctx.setLineDash([])
  }
  ctx.restore()
}

function drawPlanets(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  planets: PlanetPosition[],
  orbitR: number,
  compact: boolean,
): { x: number; y: number; planet: PlanetPosition }[] {
  const positions: { x: number; y: number; planet: PlanetPosition }[] = []

  ctx.save()

  const sorted = [...planets].sort((a, b) => {
    const orderA = MAJOR_PLANETS.indexOf(a.name)
    const orderB = MAJOR_PLANETS.indexOf(b.name)
    return orderA - orderB
  })

  for (const p of sorted) {
    if (compact && !BIG_THREE.includes(p.name)) continue

    const rad = lonToRad(p.longitude)
    const pos = polarToCartesian(cx, cy, orbitR, rad)

    const symbol = p.symbol || '●'
    const isLuminary = p.name === 'Sun' || p.name === 'Moon'

    const glowR = isLuminary ? 16 : 11
    const grad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, glowR)
    if (p.name === 'Sun') {
      grad.addColorStop(0, 'rgba(255, 200, 50, 0.35)')
      grad.addColorStop(1, 'rgba(255, 200, 50, 0)')
    } else if (p.name === 'Moon') {
      grad.addColorStop(0, 'rgba(200, 200, 255, 0.3)')
      grad.addColorStop(1, 'rgba(200, 200, 255, 0)')
    } else {
      grad.addColorStop(0, 'rgba(255,255,255,0.15)')
      grad.addColorStop(1, 'rgba(255,255,255,0)')
    }
    ctx.beginPath()
    ctx.arc(pos.x, pos.y, glowR, 0, Math.PI * 2)
    ctx.fillStyle = grad
    ctx.fill()

    ctx.fillStyle = COLOR_PLANET
    ctx.font = `${isLuminary ? 16 : 13}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(symbol, pos.x, pos.y + 0.5)

    if (!compact) {
      const deg = Math.floor(p.degreeInSign ?? 0)
      const min = Math.floor(((p.degreeInSign ?? 0) - deg) * 60)
      ctx.font = '8px sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.4)'
      ctx.fillText(`${deg}°${min.toString().padStart(2, '0')}'`, pos.x, pos.y + 10)
    }

    positions.push({ x: pos.x, y: pos.y, planet: p })
  }

  ctx.restore()
  return positions
}

function drawAxisLabels(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  outerR: number,
  ascendant?: AxisPoint | null,
  midheaven?: AxisPoint | null,
  descendant?: AxisPoint | null,
  imumCoeli?: AxisPoint | null,
) {
  ctx.save()

  const axisPoints = [
    { point: ascendant, label: 'ASC', color: COLOR_ASC },
    { point: midheaven, label: 'MC', color: COLOR_MC },
    { point: descendant, label: 'DSC', color: COLOR_DSC },
    { point: imumCoeli, label: 'IC', color: COLOR_IC },
  ]

  for (const { point, label, color } of axisPoints) {
    if (!point) continue
    const rad = lonToRad(point.longitude)
    const pos = polarToCartesian(cx, cy, outerR + 16, rad)
    ctx.fillStyle = color
    ctx.font = 'bold 11px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(label, pos.x, pos.y)
  }

  ctx.restore()
}

function drawMoonPhase(ctx: CanvasRenderingContext2D, cx: number, cy: number, moonPhase: MoonPhaseResult, outerR: number, localizedPhaseName: string) {
  ctx.save()

  const r = 16
  const x = cx
  const y = cy + outerR * 0.15

  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(30,30,60,0.7)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.2)'
  ctx.lineWidth = 0.5
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2, false)
  ctx.closePath()
  ctx.save()
  ctx.clip()

  const ill = moonPhase.illumination
  const isWaxing = moonPhase.phaseIndex <= 4

  ctx.fillStyle = '#e8e8e8'
  ctx.beginPath()
  ctx.arc(x, y, r - 1, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = 'rgba(15,15,35,0.85)'
  if (ill < 0.05) {
    ctx.beginPath()
    ctx.arc(x, y, r - 1, 0, Math.PI * 2)
    ctx.fill()
  } else if (ill > 0.95) {
  } else {
    const termX = x + (isWaxing ? -1 : 1) * (r - 1) * (1 - 2 * ill)
    ctx.beginPath()
    ctx.ellipse(termX, y, (r - 1) * Math.abs(1 - 2 * ill), r - 1, 0, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.restore()

  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.font = '9px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText(localizedPhaseName, x, y + r + 4)

  ctx.restore()
}

export default forwardRef<AstrologyWheelRef, AstrologyWheelProps>(function AstrologyWheel({
  planets,
  ascendant,
  midheaven,
  descendant,
  imumCoeli,
  moonPhase,
  natalAspects,
  houseCusps,
  houses,
  size = 400,
  compact = false,
  interactive = false,
}, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const scaleRef = useRef(1)
  const [tooltip, setTooltip] = useState<TooltipData | null>(null)
  const locale = useI18nStore((s) => s.locale)

  // Build localized lookup maps
  const signKeyMap: Record<string, string> = {
    Aries: 'sign.aries', Taurus: 'sign.taurus', Gemini: 'sign.gemini', Cancer: 'sign.cancer',
    Leo: 'sign.leo', Virgo: 'sign.virgo', Libra: 'sign.libra', Scorpio: 'sign.scorpio',
    Sagittarius: 'sign.sagittarius', Capricorn: 'sign.capricorn', Aquarius: 'sign.aquarius', Pisces: 'sign.pisces',
  }
  const planetKeyMap: Record<string, string> = {
    Sun: 'planet.sun', Moon: 'planet.moon', Mercury: 'planet.mercury', Venus: 'planet.venus',
    Mars: 'planet.mars', Jupiter: 'planet.jupiter', Saturn: 'planet.saturn',
    Uranus: 'planet.uranus', Neptune: 'planet.neptune', Pluto: 'planet.pluto',
  }
  const aspectKeyMap: Record<string, string> = {
    Conjunction: 'aspect.conjunction', Sextile: 'aspect.sextile', Square: 'aspect.square',
    Trine: 'aspect.trine', Opposition: 'aspect.opposition',
  }
  const phaseKeyMap: Record<string, string> = {
    'New Moon': 'moonphase.newMoon', 'Waxing Crescent': 'moonphase.waxingCrescent',
    'First Quarter': 'moonphase.firstQuarter', 'Waxing Gibbous': 'moonphase.waxingGibbous',
    'Full Moon': 'moonphase.fullMoon', 'Waning Gibbous': 'moonphase.waningGibbous',
    'Last Quarter': 'moonphase.lastQuarter', 'Waning Crescent': 'moonphase.waningCrescent',
  }

  const t = (key: string): string => {
    const dict = translations[locale] ?? translations[defaultLocale]
    return dict[key] ?? translations[defaultLocale][key] ?? key
  }
  const trSign = (name: string | undefined | null): string => {
    if (!name) return ''
    if (locale === 'en') return name
    const key = signKeyMap[name]
    return key ? t(key) : name
  }
  const trPlanet = (name: string | undefined | null): string => {
    if (!name) return ''
    if (locale === 'en') return name
    const key = planetKeyMap[name]
    return key ? t(key) : name
  }
  const trAspect = (name: string | undefined | null): string => {
    if (!name) return ''
    if (locale === 'en') return name
    const key = aspectKeyMap[name]
    return key ? t(key) : name
  }
  const trPhase = (name: string | undefined | null): string => {
    if (!name) return ''
    if (locale === 'en') return name
    const key = phaseKeyMap[name]
    return key ? t(key) : name
  }
  const trHouse = (num: number): string => {
    if (locale === 'zh') return `第${num}宫`
    return `House ${num}`
  }

  const localizedZodiacNames = zodiacNames.map((name) => trSign(name))

  useEffect(() => {
    if (ref) {
      ;(ref as React.MutableRefObject<HTMLCanvasElement | null>).current = canvasRef.current
    }
  }, [ref])

  const planetPositionsRef = useRef<{ x: number; y: number; planet: PlanetPosition }[]>([])
  const aspectLinesRef = useRef<{ x1: number; y1: number; x2: number; y2: number; friendly: boolean; name: string; orb: number; planetA: PlanetPosition; planetB: PlanetPosition }[]>([])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const displaySize = size * scaleRef.current
    canvas.width = displaySize * dpr
    canvas.height = displaySize * dpr
    canvas.style.width = `${displaySize}px`
    canvas.style.height = `${displaySize}px`
    ctx.scale(dpr, dpr)

    const PADDING = 24
    const cx = displaySize / 2
    const cy = displaySize / 2
    const outerR = displaySize / 2 - PADDING
    const zodiacThickness = compact ? 28 : 40
    const houseThickness = compact ? 20 : 30
    const gap = 3

    const zodiacOuterR = outerR
    const zodiacInnerR = outerR - zodiacThickness
    const houseOuterR = zodiacInnerR - gap
    const houseInnerR = houseOuterR - houseThickness
    const planetOrbitR = outerR * (compact ? 0.58 : 0.55)

    ctx.clearRect(0, 0, displaySize, displaySize)

    drawBackground(ctx, cx, cy, outerR)
    drawZodiacRing(ctx, cx, cy, zodiacOuterR, zodiacInnerR, localizedZodiacNames)
    drawHouseRing(ctx, cx, cy, houseOuterR, houseInnerR, ascendant)

    if (!compact && planets.length >= 2) {
      drawAspectLines(ctx, cx, cy, planets, planetOrbitR)
    }

    const planetPos = drawPlanets(ctx, cx, cy, planets, planetOrbitR, compact)
    planetPositionsRef.current = planetPos

    drawAxisLabels(ctx, cx, cy, outerR, ascendant, midheaven, descendant, imumCoeli)

    if (!compact && houseCusps && houseCusps.length > 0) {
      drawHouseCuspLabels(ctx, cx, cy, houseInnerR, houseCusps)
    }

    if (moonPhase && !compact) {
      drawMoonPhase(ctx, cx, cy, moonPhase, outerR, trPhase(moonPhase.phaseName))
    }

    const computedAspects = computeAspects(planets)
    aspectLinesRef.current = computedAspects.map(({ i, j, friendly, name, orb }) => {
      const rad1 = lonToRad(planets[i].longitude)
      const rad2 = lonToRad(planets[j].longitude)
      const p1 = polarToCartesian(cx, cy, planetOrbitR, rad1)
      const p2 = polarToCartesian(cx, cy, planetOrbitR, rad2)
      return { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, friendly, name, orb, planetA: planets[i], planetB: planets[j] }
    })
  }, [planets, ascendant, midheaven, descendant, imumCoeli, moonPhase, natalAspects, houseCusps, houses, size, compact, localizedZodiacNames, trPhase])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const containerW = entry.contentRect.width
        if (containerW > 0 && containerW < size) {
          scaleRef.current = containerW / size
        } else {
          scaleRef.current = 1
        }
        draw()
      }
    })

    observer.observe(container)
    draw()

    return () => observer.disconnect()
  }, [draw, size])

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!interactive) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    for (const pp of planetPositionsRef.current) {
      const dx = x - pp.x
      const dy = y - pp.y
      if (dx * dx + dy * dy < 18 * 18) {
        const interp = planetInterpretations[pp.planet.name]
        const signInterp = pp.planet.signName ? signInterpretations[pp.planet.name] : undefined
        const planetName = trPlanet(pp.planet.name)
        const signName = trSign(pp.planet.signName)
        setTooltip({
          type: 'planet',
          title: `${pp.planet.symbol} ${planetName}`,
          subtitle: `${signName} ${Math.floor(pp.planet.degreeInSign ?? 0)}°${Math.floor(((pp.planet.degreeInSign ?? 0) % 1) * 60).toString().padStart(2, '0')}'${pp.planet.house ? ` · ${trHouse(pp.planet.house)}` : ''}`,
          details: interp ? [interp.description] : [t('chartDetail.noInterp')],
          keywords: interp?.keywords,
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
        return
      }
    }

    for (const line of aspectLinesRef.current) {
      const dist = pointToSegmentDist(x, y, line.x1, line.y1, line.x2, line.y2)
      if (dist < 8) {
        const aspInterp = aspectInterpretations[line.name]
        const planetAName = trPlanet(line.planetA.name)
        const planetBName = trPlanet(line.planetB.name)
        const aspectName = trAspect(line.name)
        setTooltip({
          type: 'aspect',
          title: `${line.planetA.symbol} ${aspectName} ${line.planetB.symbol}`,
          subtitle: `${planetAName} ${aspectName} ${planetBName} · ${t('aspect.matrix.orb')}: ${line.orb.toFixed(1)}°`,
          details: [
            aspInterp?.description ?? t('chartDetail.noInterp'),
            line.friendly ? t('chartDetail.harmonious') + ' — ' + (locale === 'zh' ? '自然流畅' : 'flows naturally') : t('chartDetail.challenging') + ' — ' + (locale === 'zh' ? '要求成长' : 'demands growth'),
          ],
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
        return
      }
    }

    const displaySize = size * scaleRef.current
    const cx = displaySize / 2
    const cy = displaySize / 2
    const dx = x - cx
    const dy = y - cy
    const distFromCenter = Math.sqrt(dx * dx + dy * dy)
    const outerR = displaySize / 2 - 24
    const zodiacInnerR = outerR - (compact ? 28 : 40)

    if (distFromCenter >= zodiacInnerR && distFromCenter <= outerR) {
      let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90
      if (angle < 0) angle += 360
      const signIdx = Math.floor(angle / 30)
      const signName = zodiacNames[signIdx]
      const signInterp = signInterpretations[signName]
      const element = SIGN_ELEMENTS[Math.floor(signIdx / 3) % 4]
      setTooltip({
        type: 'sign',
        title: `${zodiacSymbols[signIdx]} ${trSign(signName)}`,
        subtitle: `${t(`element.${element.toLowerCase()}`)} · ${signInterp?.mode ?? ''}`,
        details: signInterp ? [signInterp.description] : [t('chartDetail.noInterp')],
        keywords: signInterp?.personality,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
      return
    }

    const houseOuterR = zodiacInnerR - 3
    const houseInnerR = houseOuterR - (compact ? 20 : 30)

    if (distFromCenter >= houseInnerR && distFromCenter <= houseOuterR && houseCusps && houseCusps.length > 0) {
      let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90
      if (angle < 0) angle += 360
      const ascLon = ascendant ? ascendant.signIndex! * 30 : 0
      const houseIdx = Math.floor(((angle - ascLon + 360) % 360) / 30)
      const houseNum = houseIdx + 1
      const hInterp = houseInterpretations[houseNum - 1]
      const cusp = houseCusps.find(c => c.houseNumber === houseNum)
      setTooltip({
        type: 'house',
        title: trHouse(houseNum),
        subtitle: cusp ? `${trSign(cusp.signName)}${cusp.rulingPlanet ? ` · ${t('chartDetail.ruler')} ${cusp.rulingPlanet.symbol} ${trPlanet(cusp.rulingPlanet.name)}` : ''}` : '',
        details: hInterp ? [hInterp.description] : [t('chartDetail.noInterp')],
        keywords: cusp?.planetsInHouse?.map(p => trPlanet(p.name)),
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
      return
    }

    setTooltip(null)
  }, [interactive, size, compact, houseCusps, ascendant, locale, t, trSign, trPlanet, trAspect, trHouse])

  const displaySize = size * scaleRef.current
  const tooltipX = tooltip ? Math.min(tooltip.x, displaySize - 180) : 0
  const tooltipY = tooltip ? Math.max(tooltip.y - 10, 10) : 0

  return (
    <div ref={containerRef} className="relative" style={{ width: '100%', maxWidth: size, margin: '0 auto' }}>
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: 'auto', cursor: interactive ? 'pointer' : 'default' }}
        onClick={handleClick}
      />
      {tooltip && interactive && (
        <div
          className="absolute z-40 w-[280px] rounded-xl border border-[#1e1e2a] bg-[#0f0f15]/95 backdrop-blur-sm p-4 shadow-2xl pointer-events-auto"
          style={{ left: tooltipX, top: tooltipY, transform: 'translate(-50%, -110%)' }}
        >
          <div className="flex items-start justify-between mb-1">
            <span className="font-serif text-sm font-bold text-[#e8e6e3]">{tooltip.title}</span>
            <button onClick={() => setTooltip(null)} className="text-[#6a6865] hover:text-[#a8a6a3] text-xs ml-2">✕</button>
          </div>
          {tooltip.subtitle && (
            <p className="text-xs text-[#c9a96e] mb-2">{tooltip.subtitle}</p>
          )}
          {tooltip.details.map((d, i) => (
            <p key={i} className="text-xs leading-relaxed text-[#a8a6a3] mb-1.5">{d}</p>
          ))}
          {tooltip.keywords && tooltip.keywords.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {tooltip.keywords.map(kw => (
                <span key={kw} className="rounded-full bg-[#1e1e2a] px-2 py-0.5 text-[10px] text-[#6a6865]">{kw}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
})
