'use client'

import { useEffect, useState, useMemo } from 'react'

// Seeded random — deterministic, prevents SSR/CSR hydration mismatch
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// 12 zodiac symbols for the wheel
const zodiacSymbols = [
  '♈', '♉', '♊', '♋', '♌', '♍',
  '♎', '♏', '♐', '♑', '♒', '♓',
]

// Generate deterministic star positions
function useStarField(count: number, seed: number) {
  return useMemo(() => {
    const rng = mulberry32(seed)
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: rng() * 100,
      y: rng() * 100,
      size: 0.5 + rng() * 1.5,
      opacity: 0.4 + rng() * 0.6,
      delay: rng() * 5,
      duration: 3 + rng() * 4,
      gold: rng() > 0.75,
    }))
  }, [count, seed])
}

// Generate deterministic meteor positions
function useMeteors(count: number, seed: number) {
  return useMemo(() => {
    const rng = mulberry32(seed)
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      startX: 10 + rng() * 80,
      startY: -5 + rng() * 20,
      angle: 25 + rng() * 30,
      delay: rng() * 8,
      duration: 6 + rng() * 5,
      length: 80 + rng() * 120,
    }))
  }, [count, seed])
}

// Generate deterministic constellation line positions (edges)
function useConstellations(seed: number) {
  return useMemo(() => {
    const rng = mulberry32(seed)
    const groups: { points: { x: number; y: number }[]; corner: 'tl' | 'tr' | 'bl' | 'br' }[] = []
    const corners: ('tl' | 'tr' | 'bl' | 'br')[] = ['tl', 'tr', 'bl', 'br']
    corners.forEach((corner) => {
      const numPoints = 4 + Math.floor(rng() * 3)
      const baseX = corner.includes('l') ? 0 : 70
      const baseY = corner.includes('t') ? 0 : 70
      const points = Array.from({ length: numPoints }, () => ({
        x: baseX + rng() * 30,
        y: baseY + rng() * 30,
      }))
      groups.push({ points, corner })
    })
    return groups
  }, [seed])
}

export default function CosmicBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const stars = useStarField(180, 42)
  const meteors = useMeteors(8, 137)
  const constellations = useConstellations(256)

  return (
    <div className="cosmic-bg" aria-hidden="true">
      {/* Star layer — CSS gradient based (always renders, no hydration issue) */}
      <div className="cosmic-bg__stars-css" />

      {/* Star layer — React rendered particles */}
      {mounted && (
        <div className="cosmic-bg__stars-particles">
          {stars.map((star) => (
            <span
              key={star.id}
              className="cosmic-star"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                opacity: star.opacity,
                animationDelay: `${star.delay}s`,
                animationDuration: `${star.duration}s`,
                background: star.gold ? '#c9a96e' : '#ffffff',
                boxShadow: star.gold
                  ? `0 0 ${star.size * 3}px rgba(201,169,110,0.8)`
                  : `0 0 ${star.size * 2.5}px rgba(255,255,255,0.6)`,
              }}
            />
          ))}
        </div>
      )}

      {/* Central rotating zodiac wheel */}
      {mounted && (
        <div className="cosmic-bg__wheel">
          <ZodiacWheel />
        </div>
      )}

      {/* Edge constellation lines */}
      {mounted && (
        <div className="cosmic-bg__constellations">
          {constellations.map((group, gi) => (
            <svg
              key={gi}
              className="constellation-svg"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              style={{
                left: group.corner.includes('l') ? '0' : 'auto',
                right: group.corner.includes('r') ? '0' : 'auto',
                top: group.corner.includes('t') ? '0' : 'auto',
                bottom: group.corner.includes('b') ? '0' : 'auto',
              }}
            >
              {group.points.map((pt, i) =>
                i < group.points.length - 1 ? (
                  <line
                    key={i}
                    x1={pt.x}
                    y1={pt.y}
                    x2={group.points[i + 1].x}
                    y2={group.points[i + 1].y}
                    stroke="rgba(201,169,110,0.3)"
                    strokeWidth="0.15"
                    strokeLinecap="round"
                  />
                ) : null
              )}
              {group.points.map((pt, i) => (
                <circle
                  key={`pt-${i}`}
                  cx={pt.x}
                  cy={pt.y}
                  r="0.4"
                  fill="rgba(201,169,110,0.5)"
                />
              ))}
            </svg>
          ))}
        </div>
      )}

      {/* Golden shooting stars */}
      {mounted && (
        <div className="cosmic-bg__meteors">
          {meteors.map((m) => (
            <span
              key={m.id}
              className="cosmic-meteor"
              style={{
                left: `${m.startX}%`,
                top: `${m.startY}%`,
                '--meteor-angle': `${m.angle}deg`,
                '--meteor-length': `${m.length}px`,
                animationDelay: `${m.delay}s`,
                animationDuration: `${m.duration}s`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      {/* Vignette mask — lighter, lets background show through at edges */}
      <div className="cosmic-bg__vignette" />
    </div>
  )
}

function ZodiacWheel() {
  const radius = 240
  const center = 300
  const symbolRadius = 200
  const innerRadius = 160

  return (
    <svg
      viewBox="0 0 600 600"
      className="zodiac-wheel-svg"
      style={{ filter: 'drop-shadow(0 0 20px rgba(201,169,110,0.3))' }}
    >
      {/* Outer ring */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="rgba(201,169,110,0.5)"
        strokeWidth="1.5"
      />
      {/* Inner ring */}
      <circle
        cx={center}
        cy={center}
        r={innerRadius}
        fill="none"
        stroke="rgba(201,169,110,0.3)"
        strokeWidth="1"
      />
      {/* 12 division lines */}
      {zodiacSymbols.map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180)
        const x1 = center + innerRadius * Math.cos(angle)
        const y1 = center + innerRadius * Math.sin(angle)
        const x2 = center + radius * Math.cos(angle)
        const y2 = center + radius * Math.sin(angle)
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="rgba(201,169,110,0.35)"
            strokeWidth="1"
          />
        )
      })}
      {/* Zodiac symbols */}
      {zodiacSymbols.map((symbol, i) => {
        const angle = (i * 30 - 75) * (Math.PI / 180)
        const x = center + symbolRadius * Math.cos(angle)
        const y = center + symbolRadius * Math.sin(angle)
        return (
          <text
            key={i}
            x={x}
            y={y}
            fill="rgba(201,169,110,0.6)"
            fontSize="18"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {symbol}
          </text>
        )
      })}
      {/* Center dot */}
      <circle cx={center} cy={center} r="3" fill="rgba(201,169,110,0.5)" />
    </svg>
  )
}
