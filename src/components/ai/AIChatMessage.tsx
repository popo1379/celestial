'use client'

import { useState } from 'react'
import { useAIChatStore, type ChatMessage } from '@/stores/ai-chat-store'

export function AIChatMessage({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} px-4 py-2`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
          isUser
            ? 'rounded-br-md bg-[#c9a96e] text-[#0a0a0f]'
            : message.error
              ? 'rounded-bl-md border border-red-500/30 bg-red-950/30 text-red-200'
              : 'rounded-bl-md border border-[#2a2a35] bg-[#16161e] text-[#e8e6e3]'
        }`}
      >
        {!isUser && !message.error && (
          <div className="mb-1 flex items-center gap-1.5">
            <span className="text-[#c9a96e]">✦</span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-[#6a6865]">
              Horoscope SERO AI
            </span>
          </div>
        )}
        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
      </div>
    </div>
  )
}

export function TypingIndicator() {
  return (
    <div className="flex justify-start px-4 py-2">
      <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-[#2a2a35] bg-[#16161e] px-4 py-3">
        <div className="flex gap-1">
          <span className="h-2 w-2 animate-bounce rounded-full bg-[#c9a96e]" style={{ animationDelay: '0ms' }} />
          <span className="h-2 w-2 animate-bounce rounded-full bg-[#c9a96e]" style={{ animationDelay: '150ms' }} />
          <span className="h-2 w-2 animate-bounce rounded-full bg-[#c9a96e]" style={{ animationDelay: '300ms' }} />
        </div>
        <span className="text-xs text-[#6a6865]">AI is thinking...</span>
      </div>
    </div>
  )
}

export function ChatInput() {
  const sendMessage = useAIChatStore((s) => s.sendMessage)
  const isLoading = useAIChatStore((s) => s.isLoading)
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage(input.trim())
    setInput('')
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-[#2a2a35] p-3">
      <div className="flex items-end gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSubmit(e)
            }
          }}
          placeholder="Ask about your chart..."
          rows={1}
          disabled={isLoading}
          className="flex-1 resize-none rounded-xl border border-[#2a2a35] bg-[#16161e] px-3 py-2 text-sm text-[#e8e6e3] placeholder-[#6a6865] focus:border-[#c9a96e]/40 focus:outline-none disabled:opacity-50"
          style={{ maxHeight: '120px' }}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c9a96e] text-[#0a0a0f] transition-colors hover:bg-[#d4b87e] disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Send"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </form>
  )
}
