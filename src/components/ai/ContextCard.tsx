'use client'

import type { ChartResult } from '@/lib/astrology/engine'

interface ContextCardProps {
  chart?: ChartResult | null
  chartB?: ChartResult | null
  contextType: 'natal' | 'synastry'
}

function PlanetBadge({ name, symbol, signName }: { name: string; symbol: string; signName?: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-lg">{symbol}</span>
      <div className="flex flex-col leading-tight">
        <span className="text-[10px] uppercase text-[#6a6865]">{name}</span>
        <span className="text-xs font-medium text-[#c9a96e]">{signName || '—'}</span>
      </div>
    </div>
  )
}

export function ContextCard({ chart, chartB, contextType }: ContextCardProps) {
  if (!chart) return null

  if (contextType === 'synastry' && chartB) {
    return (
      <div className="mx-4 mb-2 rounded-xl border border-[#2a2a35] bg-[#0f0f15]/60 p-3 backdrop-blur-sm">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-[#c9a96e]">♡</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#9a9895]">
            Synastry Context
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="mb-1 text-[10px] uppercase text-[#6a6865]">Person A</p>
            <div className="flex gap-3">
              <PlanetBadge name="Sun" symbol="☉" signName={chart.sun?.signName} />
              <PlanetBadge name="Moon" symbol="☽" signName={chart.moon?.signName} />
              <PlanetBadge name="Asc" symbol="Asc" signName={chart.ascendant?.signName} />
            </div>
          </div>
          <div>
            <p className="mb-1 text-[10px] uppercase text-[#6a6865]">Person B</p>
            <div className="flex gap-3">
              <PlanetBadge name="Sun" symbol="☉" signName={chartB.sun?.signName} />
              <PlanetBadge name="Moon" symbol="☽" signName={chartB.moon?.signName} />
              <PlanetBadge name="Asc" symbol="Asc" signName={chartB.ascendant?.signName} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-4 mb-2 rounded-xl border border-[#2a2a35] bg-[#0f0f15]/60 p-3 backdrop-blur-sm">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-[#c9a96e]">✦</span>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#9a9895]">
          Your Natal Chart
        </span>
      </div>
      <div className="flex flex-wrap gap-4">
        <PlanetBadge name="Sun" symbol="☉" signName={chart.sun?.signName} />
        <PlanetBadge name="Moon" symbol="☽" signName={chart.moon?.signName} />
        <PlanetBadge name="Ascendant" symbol="Asc" signName={chart.ascendant?.signName} />
        <PlanetBadge name="Mercury" symbol="☿" signName={chart.mercury?.signName} />
        <PlanetBadge name="Venus" symbol="♀" signName={chart.venus?.signName} />
        <PlanetBadge name="Mars" symbol="♂" signName={chart.mars?.signName} />
      </div>
    </div>
  )
}
