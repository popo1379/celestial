'use client'

import { useAIChatStore } from '@/stores/ai-chat-store'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface AIInterpretButtonProps {
  contextType: 'natal' | 'synastry'
  variant?: 'default' | 'compact'
  className?: string
}

/**
 * AI Interpret button — opens drawer on desktop, navigates to /ai-chat on mobile
 */
export function AIInterpretButton({
  contextType,
  variant = 'default',
  className = '',
}: AIInterpretButtonProps) {
  const setDrawerOpen = useAIChatStore((s) => s.setDrawerOpen)
  const setContextType = useAIChatStore((s) => s.setContextType)
  const setContextData = useAIChatStore((s) => s.setContextData)
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const handleClick = () => {
    // Set context type so mobile page knows what to do
    setContextType(contextType)
    setContextData({ type: contextType })

    if (isMobile) {
      // Navigate to mobile chat page
      router.push(`/ai-chat?type=${contextType}`)
    } else {
      // Open drawer — the drawer component on the page will set full context data
      setDrawerOpen(true)
    }
  }

  const sizeClasses =
    variant === 'compact'
      ? 'px-3 py-1.5 text-xs'
      : 'px-4 py-2 text-sm'

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#c9a96e] to-[#d4b87e] font-medium text-[#0a0a0f] transition-transform hover:scale-[1.02] active:scale-[0.98] ${sizeClasses} ${className}`}
    >
      <span>✦</span>
      <span>AI Interpret</span>
    </button>
  )
}
