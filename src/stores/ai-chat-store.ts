'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  error?: boolean
}

interface AIContextData {
  type: 'natal' | 'synastry'
  chartData?: unknown
  synastryData?: unknown
}

interface AIChatState {
  messages: ChatMessage[]
  isLoading: boolean
  drawerOpen: boolean
  contextType: 'natal' | 'synastry'
  contextData: AIContextData | null

  // Actions
  setDrawerOpen: (open: boolean) => void
  setContextType: (type: 'natal' | 'synastry') => void
  setContextData: (data: AIContextData) => void
  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  setLoading: (loading: boolean) => void
  clearMessages: () => void
  sendMessage: (message: string) => Promise<void>
}

export const useAIChatStore = create<AIChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      isLoading: false,
      drawerOpen: false,
      contextType: 'natal',
      contextData: null,

      setDrawerOpen: (open) => set({ drawerOpen: open }),
      setContextType: (type) => set({ contextType: type }),
      setContextData: (data) => set({ contextData: data }),
      addMessage: (msg) =>
        set((state) => ({
          messages: [
            ...state.messages,
            {
              ...msg,
              id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              timestamp: Date.now(),
            },
          ],
        })),
      setLoading: (loading) => set({ isLoading: loading }),
      clearMessages: () => set({ messages: [] }),

      sendMessage: async (message: string) => {
        const state = get()

        // Add user message
        get().addMessage({ role: 'user', content: message })
        get().setLoading(true)

        try {
          const history = state.messages
            .filter((m) => !m.error)
            .map((m) => ({ role: m.role, content: m.content }))

          const response = await fetch('/api/ai-chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message,
              context: state.contextData || { type: state.contextType },
              history,
            }),
          })

          const data = await response.json()

          if (data.error || !data.reply) {
            get().addMessage({
              role: 'assistant',
              content: data.error || 'Sorry, I encountered an error. Please try again.',
              error: true,
            })
          } else {
            get().addMessage({ role: 'assistant', content: data.reply })
          }
        } catch (error) {
          const msg = error instanceof Error ? error.message : 'Network error'
          get().addMessage({
            role: 'assistant',
            content: `Error: ${msg}`,
            error: true,
          })
        } finally {
          get().setLoading(false)
        }
      },
    }),
    {
      name: 'celestial-ai-chat',
      partialize: (state) => ({ messages: state.messages.slice(-20) }),
    },
  ),
)
