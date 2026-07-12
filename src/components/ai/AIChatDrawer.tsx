'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAIChatStore } from '@/stores/ai-chat-store'
import { AIChatMessage, TypingIndicator, ChatInput } from './AIChatMessage'
import { PresetQuestions } from './PresetQuestions'
import { ContextCard } from './ContextCard'
import type { ChartResult, SynastryResult } from '@/lib/astrology/engine'

interface AIChatDrawerProps {
  contextType: 'natal' | 'synastry'
  chart?: ChartResult | null
  chartB?: ChartResult | null
  synastry?: SynastryResult | null
}

export function AIChatDrawer({
  contextType,
  chart,
  chartB,
  synastry,
}: AIChatDrawerProps) {
  const drawerOpen = useAIChatStore((s) => s.drawerOpen)
  const setDrawerOpen = useAIChatStore((s) => s.setDrawerOpen)
  const messages = useAIChatStore((s) => s.messages)
  const isLoading = useAIChatStore((s) => s.isLoading)
  const setContextType = useAIChatStore((s) => s.setContextType)
  const setContextData = useAIChatStore((s) => s.setContextData)
  const clearMessages = useAIChatStore((s) => s.clearMessages)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Set context type and data when drawer opens
  useEffect(() => {
    if (drawerOpen) {
      setContextType(contextType)
      setContextData({
        type: contextType,
        chartData: chart,
        synastryData:
          contextType === 'synastry' && chart && chartB && synastry
            ? { chartA: chart, chartB, synastry }
            : undefined,
      })
    }
  }, [drawerOpen, contextType, chart, chartB, synastry, setContextType, setContextData])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleClose = () => {
    setDrawerOpen(false)
    // Clear messages when closing (optional — remove if you want to keep history)
    setTimeout(() => clearMessages(), 300)
  }

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-[201] flex h-full w-full max-w-[480px] flex-col border-l border-[#2a2a35] bg-[#0a0a0f]/95 backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#2a2a35] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-xl text-[#c9a96e]">✦</span>
                <div>
                  <h2 className="font-serif text-base font-semibold text-[#e8e6e3]">
                    AI Interpret
                  </h2>
                  <p className="text-[10px] uppercase tracking-wider text-[#6a6865]">
                    {contextType === 'natal' ? 'Natal Chart' : 'Synastry'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6a6865] transition-colors hover:bg-[#1f1f2a] hover:text-[#e8e6e3]"
                aria-label="Close"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Context Card */}
            <ContextCard chart={chart} chartB={chartB} contextType={contextType} />

            {/* Messages */}
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

            {/* Input */}
            <ChatInput />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
