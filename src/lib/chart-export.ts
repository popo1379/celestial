'use client'

import type { ChartResult } from '@/lib/astrology/engine'

export interface ExportOptions {
  format: 'png' | 'jpg'
  size: 'standard' | 'high'
  includeWatermark: boolean
  includeInfo: boolean
}

export async function exportChart(
  canvas: HTMLCanvasElement,
  chart: ChartResult,
  options: ExportOptions = { format: 'png', size: 'standard', includeWatermark: true, includeInfo: true }
): Promise<void> {
  const scale = options.size === 'high' ? 4 : 2
  const targetSize = options.size === 'high' ? 2048 : 1024

  const exportCanvas = document.createElement('canvas')
  exportCanvas.width = targetSize + 160
  exportCanvas.height = targetSize + 200
  const ctx = exportCanvas.getContext('2d')
  if (!ctx) return

  ctx.fillStyle = '#0a0a0f'
  ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height)

  const chartScale = targetSize / canvas.width
  ctx.save()
  ctx.translate(80, 80)
  ctx.scale(chartScale, chartScale)
  ctx.drawImage(canvas, 0, 0)
  ctx.restore()

  if (options.includeInfo) {
    ctx.fillStyle = '#e8e6e3'
    ctx.font = 'bold 18px "Playfair Display", serif'
    ctx.textAlign = 'center'
    ctx.fillText(
      `${chart.sun.signName} Sun · ${chart.moon.signName} Moon · ${chart.ascendant?.signName || 'Unknown'} Rising`,
      exportCanvas.width / 2,
      targetSize + 120
    )

    ctx.fillStyle = '#a8a6a3'
    ctx.font = '12px "Inter", sans-serif'
    ctx.fillText(
      'Celestial — Western Astrology',
      exportCanvas.width / 2,
      targetSize + 145
    )

    ctx.fillStyle = '#6a6865'
    ctx.font = '10px "Inter", sans-serif'
    const planetList = chart.planets
      .map((p) => `${p.symbol} ${p.signName}`)
      .join(' · ')
    ctx.fillText(planetList, exportCanvas.width / 2, targetSize + 165)
  }

  if (options.includeWatermark) {
    ctx.fillStyle = 'rgba(201, 169, 110, 0.15)'
    ctx.font = 'bold 48px "Playfair Display", serif'
    ctx.textAlign = 'right'
    ctx.fillText('Celestial', exportCanvas.width - 20, exportCanvas.height - 20)
  }

  const mimeType = options.format === 'png' ? 'image/png' : 'image/jpeg'
  const quality = options.format === 'jpg' ? 0.95 : undefined
  const dataUrl = exportCanvas.toDataURL(mimeType, quality)

  const link = document.createElement('a')
  link.download = `celestial-chart-${Date.now()}.${options.format}`
  link.href = dataUrl
  link.click()
}

export function getExportFormats(): { id: 'png' | 'jpg'; label: string; description: string }[] {
  return [
    { id: 'png', label: 'PNG', description: 'Lossless, transparent background' },
    { id: 'jpg', label: 'JPG', description: 'Smaller file size, opaque background' },
  ]
}

export function getExportSizes(): { id: 'standard' | 'high'; label: string; description: string }[] {
  return [
    { id: 'standard', label: 'Standard', description: '1024 × 1024 pixels' },
    { id: 'high', label: 'High Quality', description: '2048 × 2048 pixels' },
  ]
}
