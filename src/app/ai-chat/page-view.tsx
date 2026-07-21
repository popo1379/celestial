'use client'

import { Suspense, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAIChatStore } from '@/stores/ai-chat-store'
import { AIChatMessage, TypingIndicator, ChatInput } from '@/components/ai/AIChatMessage'
import { PresetQuestions } from '@/components/ai/PresetQuestions'
import { ContextCard } from '@/components/ai/ContextCard'
import { useGuestChartStore } from '@/stores/guest-store'
import { useSynastryStore } from '@/stores/synastry-store'
import { computeChart } from '@/lib/chart-utils'
import { calculateFullNatalChart, calculateSynastryChart } from '@/lib/astrology/engine'
import type { ChartResult, SynastryResult } from '@/lib/astrology/engine'

function AIChatContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const contextType = (searchParams.get('type') as 'natal' | 'synastry') || 'natal'

  const messages = useAIChatStore((s) => s.messages)
  const isLoading = useAIChatStore((s) => s.isLoading)
  const setContextType = useAIChatStore((s) => s.setContextType)
  const setContextData = useAIChatStore((s) => s.setContextData)
  const clearMessages = useAIChatStore((s) => s.clearMessages)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const birthInfo = useGuestChartStore((s) => s.birthInfo)
  const personA = useSynastryStore((s) => s.personA)
  const personB = useSynastryStore((s) => s.personB)

  const chart = birthInfo ? computeChart(birthInfo) : null
  const chartA = personA ? calculateFullNatalChart(personA) : null
  const chartB = personB ? calculateFullNatalChart(personB) : null
  const synastry = chartA && chartB ? calculateSynastryChart(chartA, chartB) : null

  useEffect(() => {
    setContextType(contextType)
    setContextData({
      type: contextType,
      chartData: chart,
      synastryData:
        contextType === 'synastry' && chartA && chartB && synastry
          ? { chartA, chartB, synastry }
          : undefined,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextType])

  const prevMessagesLen = useRef(messages.length)
  useEffect(() => {
    if (messages.length > prevMessagesLen.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
    prevMessagesLen.current = messages.length
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages])

  useEffect(() => {
    return () => {
      clearMessages()
    }
  }, [clearMessages])

  return (
    <div className="fixed inset-0 z-10 flex h-screen h-[100dvh] flex-col bg-[#0a0a0f]">
      <header className="flex items-center justify-between border-b border-[#2a2a35] px-4 py-3">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#9a9895] transition-colors hover:text-[#e8e6e3]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span className="text-sm">Back</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-lg text-[#c9a96e]">✦</span>
          <div>
            <h1 className="font-serif text-base font-semibold text-[#e8e6e3]">
              AI Interpret
            </h1>
            <p className="text-[10px] uppercase tracking-wider text-[#6a6865]">
              {contextType === 'natal' ? 'Natal Chart' : 'Synastry'}
            </p>
          </div>
        </div>
        <div className="w-16" />
      </header>

      <ContextCard
        chart={chart || chartA}
        chartB={contextType === 'synastry' ? (chartB ?? undefined) : undefined}
        contextType={contextType}
      />

      <div className="flex-1 overflow-y-auto py-2">
        {messages.length === 0 && (
          <PresetQuestions contextType={contextType} />
        )}
        {messages.map((msg) => (
          <AIChatMessage key={msg.id} message={msg} />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-[#2a2a35] p-3 bg-[#0a0a0f]">
        <ChatInput />
      </div>
    </div>
  )
}

export default function AIChatView() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-[#0a0a0f]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#c9a96e] border-t-transparent" />
        </div>
      }
    >
      <AIChatContent />
    </Suspense>
  )
}