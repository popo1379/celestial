'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useGuestChartStore } from '@/stores/guest-store'
import { useAuth } from '@/hooks/useAuth'
import { AstrologyWheel } from '@/components/chart'
import AspectMatrix from '@/components/chart/AspectMatrix'
import {
  calculateFullNatalChart,
  type ChartResult,
} from '@/lib/astrology/engine'
import { exportChart, getExportFormats, getExportSizes, type ExportOptions } from '@/lib/chart-export'
import { useTranslation, useSignTranslator } from '@/hooks/useTranslation'

export default function WheelPage() {
  const { t } = useTranslation()
  const { translateSign, locale } = useSignTranslator()
  const { birthInfo } = useGuestChartStore()
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [chart, setChart] = useState<ChartResult | null>(null)
  const [chartLoading, setChartLoading] = useState(true)
  const [showExportModal, setShowExportModal] = useState(false)
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'png',
    size: 'standard',
    includeWatermark: true,
    includeInfo: true,
  })
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const isLoggedIn = !!user

  useEffect(() => {
    if (authLoading) return
    if (!birthInfo) {
      router.replace('/')
      return
    }
    setChartLoading(true)
    try {
      const result = calculateFullNatalChart(birthInfo)
      setChart(result)
    } catch (e) {
      console.error('Chart calculation error:', e)
    }
    setChartLoading(false)
  }, [birthInfo, authLoading, router])

  const handleExport = async () => {
    const canvas = canvasRef.current
    if (!canvas || !chart) return
    await exportChart(canvas, chart, exportOptions)
    setShowExportModal(false)
  }

  if (authLoading || chartLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[#c9a96e] border-t-transparent" />
          <p className="text-sm text-[#6a6865]">{t('chart.calculating')}</p>
        </div>
      </div>
    )
  }

  if (!chart || !chart.planets.length) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
        <p className="text-sm text-[#6a6865]">{t('chart.unable')}</p>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-[#0a0a0f] px-4 pb-24 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md mt-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-[#1e1e2a] bg-[#0f0f15] p-8"
          >
            <span className="text-3xl">🔒</span>
            <h2 className="mt-4 font-serif text-xl font-semibold text-[#e8e6e3]">
              {t('chartDetail.signinToView')}
            </h2>
            <p className="mt-2 text-sm text-[#6a6865]">
              {t('chartDetail.signinDesc')}
            </p>
            <button
              onClick={() => router.push('/auth/signin')}
              className="mt-6 inline-block rounded-lg bg-[#c9a96e] px-8 py-3 font-medium text-[#0a0a0f] transition-colors hover:bg-[#b8964f]"
            >
              {t('nav.signin')}
            </button>
          </motion.div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] px-4 pb-24 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center justify-between"
        >
          <div>
            <button
              onClick={() => router.back()}
              className="mb-2 flex items-center gap-2 text-xs text-[#6a6865] hover:text-[#a8a6a3] transition-colors"
            >
              ← {t('wheel.backToDetail')}
            </button>
            <h1 className="font-serif text-3xl font-bold text-[#e8e6e3]">
              {t('wheel.title')}
            </h1>
            <p className="mt-1 text-sm text-[#6a6865]">
              {translateSign(chart.sun.signName)} {t('chart.sun')} · {translateSign(chart.moon.signName)} {t('chart.moon')} ·{' '}
              {chart.ascendant ? `${translateSign(chart.ascendant.signName)} ${t('chart.rising')}` : t('chart.unknownRising')}
            </p>
          </div>
          <button
            onClick={() => setShowExportModal(true)}
            className="rounded-lg border border-[#1e1e2a] bg-[#0f0f15] px-4 py-2 text-sm font-medium text-[#a8a6a3] transition-colors hover:border-[#c9a96e]/50 hover:text-[#c9a96e]"
          >
            {t('wheel.exportChart')}
          </button>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex justify-center">
            <div style={{ width: '100%', maxWidth: 600 }}>
              <AstrologyWheel
                ref={canvasRef}
                planets={chart.planets}
                ascendant={chart.ascendant}
                midheaven={chart.midheaven}
                descendant={chart.descendant}
                imumCoeli={chart.imumCoeli}
                moonPhase={chart.moonPhase}
                natalAspects={chart.natalAspects}
                houseCusps={chart.houseCusps}
                houses={chart.houses}
                size={600}
                interactive={true}
              />
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <AspectMatrix planets={chart.planets} aspects={chart.natalAspects || []} />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-[#1e1e2a] bg-[#0f0f15] p-5"
        >
          <h3 className="mb-4 font-serif text-lg font-semibold text-[#e8e6e3]">
            {t('wheel.summary')}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#c9a96e]">{chart.planets.length}</div>
              <div className="text-xs text-[#6a6865]">{t('wheel.planets')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#4ecdc4]">
                {(chart.natalAspects || []).filter((a) => a.friendly).length}
              </div>
              <div className="text-xs text-[#6a6865]">{t('wheel.harmonious')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#ff6b6b]">
                {(chart.natalAspects || []).filter((a) => !a.friendly).length}
              </div>
              <div className="text-xs text-[#6a6865]">{t('wheel.challenging')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#a8a6a3]">{chart.houseCusps?.length || 0}</div>
              <div className="text-xs text-[#6a6865]">{t('wheel.houses')}</div>
            </div>
          </div>
        </motion.section>
      </div>

      <AnimatePresence>
        {showExportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowExportModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-xl border border-[#1e1e2a] bg-[#0f0f15] p-5 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="mb-4 font-serif text-lg font-semibold text-[#e8e6e3]">
                {t('wheel.exportChart')}
              </h3>

              <div className="mb-4">
                <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#6a6865]">
                  {t('wheel.format')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {getExportFormats().map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setExportOptions((prev) => ({ ...prev, format: f.id }))}
                      className={`rounded-lg border p-3 text-left transition-colors ${
                        exportOptions.format === f.id
                          ? 'border-[#c9a96e] bg-[#c9a96e]/10'
                          : 'border-[#1e1e2a] bg-[#0a0a0f]'
                      }`}
                    >
                      <span className="text-sm font-medium text-[#e8e6e3]">{f.label}</span>
                      <p className="text-[10px] text-[#6a6865] mt-0.5">{f.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#6a6865]">
                  {t('wheel.size')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {getExportSizes().map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setExportOptions((prev) => ({ ...prev, size: s.id }))}
                      className={`rounded-lg border p-3 text-left transition-colors ${
                        exportOptions.size === s.id
                          ? 'border-[#c9a96e] bg-[#c9a96e]/10'
                          : 'border-[#1e1e2a] bg-[#0a0a0f]'
                      }`}
                    >
                      <span className="text-sm font-medium text-[#e8e6e3]">{s.label}</span>
                      <p className="text-[10px] text-[#6a6865] mt-0.5">{s.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4 space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeWatermark}
                    onChange={(e) =>
                      setExportOptions((prev) => ({ ...prev, includeWatermark: e.target.checked }))
                    }
                    className="h-4 w-4 rounded border-[#1e1e2a] bg-[#0a0a0f] text-[#c9a96e] focus:ring-[#c9a96e]"
                  />
                  <span className="text-sm text-[#a8a6a3]">{t('wheel.includeWatermark')}</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeInfo}
                    onChange={(e) =>
                      setExportOptions((prev) => ({ ...prev, includeInfo: e.target.checked }))
                    }
                    className="h-4 w-4 rounded border-[#1e1e2a] bg-[#0a0a0f] text-[#c9a96e] focus:ring-[#c9a96e]"
                  />
                  <span className="text-sm text-[#a8a6a3]">{t('wheel.includeInfo')}</span>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="flex-1 rounded-lg border border-[#1e1e2a] px-4 py-2 text-sm font-medium text-[#6a6865] transition-colors hover:text-[#a8a6a3]"
                >
                  {t('wheel.cancel')}
                </button>
                <button
                  onClick={handleExport}
                  className="flex-1 rounded-lg bg-[#c9a96e] px-4 py-2 text-sm font-medium text-[#0a0a0f] transition-colors hover:bg-[#b8964f]"
                >
                  {t('wheel.export')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
