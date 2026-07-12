'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { PlanetPosition, AspectResult } from '@/lib/astrology/engine'
import { zodiacSymbols } from '@/lib/astrology/engine'
import { planetInterpretations, aspectInterpretations, signInterpretations } from '@/lib/astrology/interpretation'
import { useTranslation, usePlanetTranslator, useAspectTranslator, useSignTranslator } from '@/hooks/useTranslation'

interface AspectMatrixProps {
  planets: PlanetPosition[]
  aspects: AspectResult[]
}

const PLANET_ORDER = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']

const ASPECT_SYMBOLS: Record<string, string> = {
  Conjunction: '☌',
  Sextile: '⚹',
  Square: '□',
  Trine: '△',
  Opposition: '☍',
}

const ASPECT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Conjunction: { bg: 'rgba(255,107,107,0.15)', text: '#ff6b6b', border: '#ff6b6b' },
  Sextile: { bg: 'rgba(78,205,196,0.15)', text: '#4ecdc4', border: '#4ecdc4' },
  Square: { bg: 'rgba(255,107,107,0.15)', text: '#ff6b6b', border: '#ff6b6b' },
  Trine: { bg: 'rgba(78,205,196,0.15)', text: '#4ecdc4', border: '#4ecdc4' },
  Opposition: { bg: 'rgba(255,107,107,0.15)', text: '#ff6b6b', border: '#ff6b6b' },
}

interface AspectCell {
  type: string
  englishName: string
  symbol: string
  orb: number
  friendly: boolean
  planetA: PlanetPosition
  planetB: PlanetPosition
}

export default function AspectMatrix({ planets, aspects }: AspectMatrixProps) {
  const { t } = useTranslation()
  const { translatePlanet } = usePlanetTranslator()
  const { translateAspect } = useAspectTranslator()
  const { translateSign } = useSignTranslator()

  const [selectedCell, setSelectedCell] = useState<AspectCell | null>(null)
  const [filter, setFilter] = useState<'all' | 'friendly' | 'challenging'>('all')

  const filterOptions = [
    { id: 'all', label: t('aspect.matrix.all') },
    { id: 'friendly', label: t('aspect.matrix.friendly') },
    { id: 'challenging', label: t('aspect.matrix.challenging') },
  ]

  const sortedPlanets = useMemo(() => {
    return [...planets].sort(
      (a, b) => PLANET_ORDER.indexOf(a.name) - PLANET_ORDER.indexOf(b.name)
    )
  }, [planets])

  const aspectMatrix = useMemo(() => {
    const matrix: (AspectCell | null)[][] = []
    for (let i = 0; i < sortedPlanets.length; i++) {
      matrix[i] = []
      for (let j = 0; j < sortedPlanets.length; j++) {
        if (i <= j) {
          matrix[i][j] = null
          continue
        }
        const p1 = sortedPlanets[i]
        const p2 = sortedPlanets[j]
        const aspect = aspects.find(
          (a) =>
            (a.planetA?.name === p1.name && a.planetB?.name === p2.name) ||
            (a.planetA?.name === p2.name && a.planetB?.name === p1.name)
        )
        if (aspect) {
          matrix[i][j] = {
            type: aspect.type,
            englishName: aspect.englishName,
            symbol: aspect.symbol,
            orb: aspect.orb,
            friendly: aspect.friendly,
            planetA: p1,
            planetB: p2,
          }
        } else {
          matrix[i][j] = null
        }
      }
    }
    return matrix
  }, [sortedPlanets, aspects])

  const handleCellClick = (cell: AspectCell | null) => {
    setSelectedCell(cell)
  }

  const filteredMatrix = useMemo(() => {
    if (filter === 'all') return aspectMatrix
    return aspectMatrix.map((row) =>
      row.map((cell) => (cell && cell.friendly === (filter === 'friendly')) ? cell : null)
    )
  }, [aspectMatrix, filter])

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-serif text-lg font-semibold text-[#e8e6e3]">
          {t('aspect.matrix.title')}
        </h3>
        <div className="flex gap-2">
          {filterOptions.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as typeof filter)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === f.id
                  ? 'border border-[#c9a96e] text-[#c9a96e] bg-[#c9a96e]/10'
                  : 'border border-[#1e1e2a] text-[#6a6865] bg-[#0f0f15] hover:text-[#a8a6a3]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-[#1e1e2a] bg-[#0f0f15] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e1e2a] bg-[#0a0a0f]">
                <th className="p-2 text-left text-xs font-medium uppercase tracking-wider text-[#6a6865] w-16"></th>
                {sortedPlanets.map((p) => (
                  <th
                    key={p.name}
                    className="p-2 text-center text-xs font-medium uppercase tracking-wider text-[#6a6865]"
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-base">{p.symbol}</span>
                      <span className="text-[10px] mt-0.5">{translatePlanet(p.name)}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e2a]">
              {sortedPlanets.map((p1, i) => (
                <tr key={p1.name}>
                  <td className="p-2 border-r border-[#1e1e2a] bg-[#0a0a0f]">
                    <div className="flex flex-col items-center">
                      <span className="text-base">{p1.symbol}</span>
                      <span className="text-[10px] mt-0.5 text-[#6a6865]">{translatePlanet(p1.name)}</span>
                    </div>
                  </td>
                  {sortedPlanets.map((p2, j) => {
                    const cell = filteredMatrix[i]?.[j]
                    const isDiagonal = i === j
                    const isUpperTriangle = i < j

                    if (isDiagonal) {
                      return (
                        <td
                          key={p2.name}
                          className="p-2 text-center border-r border-[#1e1e2a] bg-[#0a0a0f]"
                        >
                          <span className="text-lg font-bold text-[#c9a96e]">·</span>
                        </td>
                      )
                    }

                    if (isUpperTriangle) {
                      return (
                        <td
                          key={p2.name}
                          className="p-2 text-center border-r border-[#1e1e2a] bg-[#0a0a0f]/50"
                        >
                          <span className="text-[#2a2a35]">·</span>
                        </td>
                      )
                    }

                    return (
                      <td
                        key={p2.name}
                        className={`p-1 text-center border-r border-[#1e1e2a] cursor-pointer transition-all hover:scale-105 ${
                          cell
                            ? `bg-[${ASPECT_COLORS[cell.type]?.bg}]`
                            : 'bg-[#0a0a0f]/30'
                        }`}
                        onClick={() => handleCellClick(cell)}
                      >
                        {cell ? (
                          <div className="flex flex-col items-center">
                            <span
                              className="text-base font-bold"
                              style={{ color: ASPECT_COLORS[cell.type]?.text }}
                            >
                              {cell.symbol}
                            </span>
                            <span className="text-[10px] mt-0.5 text-[#6a6865]">
                              {cell.orb.toFixed(1)}°
                            </span>
                          </div>
                        ) : (
                          <span className="text-[#2a2a35]">·</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedCell && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setSelectedCell(null)}
          >
            <motion.div
              className="w-full max-w-md rounded-xl border border-[#1e1e2a] bg-[#0f0f15] p-5 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{selectedCell.planetA.symbol}</span>
                  <span
                    className="text-xl font-bold"
                    style={{ color: ASPECT_COLORS[selectedCell.type]?.text }}
                  >
                    {selectedCell.symbol}
                  </span>
                  <span className="text-2xl">{selectedCell.planetB.symbol}</span>
                </div>
                <button
                  onClick={() => setSelectedCell(null)}
                  className="text-[#6a6865] hover:text-[#a8a6a3]"
                >
                  ✕
                </button>
              </div>

              <div className="mb-3">
                <span className="text-sm font-medium text-[#e8e6e3]">
                  {translatePlanet(selectedCell.planetA.name)} {translateAspect(selectedCell.englishName)} {translatePlanet(selectedCell.planetB.name)}
                </span>
                <div className="flex items-center gap-3 mt-1 text-xs text-[#6a6865]">
                  <span>{t('aspect.matrix.orb')}: {selectedCell.orb.toFixed(1)}°</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      selectedCell.friendly
                        ? 'bg-[#4ecdc4]/10 text-[#4ecdc4]'
                        : 'bg-[#ff6b6b]/10 text-[#ff6b6b]'
                    }`}
                  >
                    {selectedCell.friendly ? t('chartDetail.harmonious') : t('chartDetail.challenging')}
                  </span>
                </div>
              </div>

              <div className="mb-4 space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#c9a96e]">{translateSign(selectedCell.planetA.signName)}</span>
                  <span className="text-[#6a6865]">({selectedCell.planetA.symbol})</span>
                  <span className="text-[#6a6865]">→</span>
                  <span className="text-[#c9a96e]">{translateSign(selectedCell.planetB.signName)}</span>
                  <span className="text-[#6a6865]">({selectedCell.planetB.symbol})</span>
                </div>
              </div>

              {aspectInterpretations[selectedCell.englishName] && (
                <div className="mb-4">
                  <p className="text-xs leading-relaxed text-[#a8a6a3]">
                    {aspectInterpretations[selectedCell.englishName].description}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <div className="flex-1">
                  <span className="text-[10px] uppercase tracking-wider text-[#6a6865]">
                    {translatePlanet(selectedCell.planetA.name)}
                  </span>
                  <p className="text-xs text-[#a8a6a3] mt-0.5">
                    {planetInterpretations[selectedCell.planetA.name]?.domain}
                  </p>
                </div>
                <div className="flex-1">
                  <span className="text-[10px] uppercase tracking-wider text-[#6a6865]">
                    {translatePlanet(selectedCell.planetB.name)}
                  </span>
                  <p className="text-xs text-[#a8a6a3] mt-0.5">
                    {planetInterpretations[selectedCell.planetB.name]?.domain}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
