'use client'

import { usePathname } from 'next/navigation'
import Footer from './Footer'

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAIChat = pathname.includes('/ai-chat')

  return (
    <>
      {children}
      <div className={isAIChat ? 'hidden md:block' : ''}>
        <Footer />
      </div>
    </>
  )
}