'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useTranslation } from '@/hooks/useTranslation'
import { motion, AnimatePresence } from 'framer-motion'

export function MobileTopBar() {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { user, loading, signOut } = useAuth()
  const { t } = useTranslation()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (mounted && pathname.includes('/ai-chat')) {
    return null
  }

  const navLinks = [
    { href: '/', label: t('nav.home'), icon: '✦' },
    { href: '/chart', label: t('nav.chart'), icon: '☉' },
    { href: '/transit', label: t('nav.transit'), icon: '☽' },
    { href: '/synastry', label: t('nav.synastry'), icon: '♡' },
    { href: '/blog', label: t('nav.blog'), icon: '📖' },
    { href: '/ai-chat', label: 'AI Chat', icon: '🤖' },
    { href: '/profile', label: t('nav.profile'), icon: '◈' },
  ]

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 md:hidden"
      >
        <div className="flex h-14 items-center justify-between border-b border-[#1e1e2a] bg-[#0a0a0f]/95 px-4 backdrop-blur-md">
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-[#e8e6e3] transition-colors hover:bg-[#1e1e2a]"
          >
            <span className="text-xl">☰</span>
          </button>

          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg">✦</span>
            <span
              className="font-serif text-sm font-bold tracking-wide text-[#e8e6e3]"
              style={{ fontVariant: 'small-caps' }}
            >
              Horoscope
            </span>
          </Link>

          {loading ? (
            <div className="h-8 w-20 animate-pulse rounded-lg bg-[#1e1e2a]" />
          ) : user ? (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1e1e2a] text-xs font-bold text-[#c9a96e]">
                {user.email?.[0]?.toUpperCase() ?? 'U'}
              </div>
              <button
                onClick={signOut}
                className="rounded-lg bg-[#1e1e2a] px-3 py-1.5 text-xs font-medium text-[#6a6865] transition-colors hover:bg-[#2a2a3a] hover:text-[#ff6b6b]"
              >
                {t('nav.signout')}
              </button>
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className="rounded-lg bg-[#c9a96e] px-3 py-1.5 text-xs font-medium text-[#0a0a0f] transition-colors hover:bg-[#b8964f]"
            >
              {t('nav.signin')}
            </Link>
          )}
        </div>
      </motion.nav>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-64 border-r border-[#1e1e2a] bg-[#0a0a0f] md:hidden"
            >
              <div className="flex h-14 items-center justify-between border-b border-[#1e1e2a] px-4">
                <span
                  className="font-serif text-sm font-bold tracking-wide text-[#e8e6e3]"
                  style={{ fontVariant: 'small-caps' }}
                >
                  Menu
                </span>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6a6865] transition-colors hover:bg-[#1e1e2a]"
                >
                  <span className="text-sm">✕</span>
                </button>
              </div>

              <div className="flex flex-col gap-1 p-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-[#6a6865] transition-colors hover:bg-[#1e1e2a] hover:text-[#e8e6e3]"
                  >
                    <span className="text-lg">{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
              </div>

              {user && (
                <div className="absolute bottom-0 left-0 right-0 border-t border-[#1e1e2a] p-4">
                  <button
                    onClick={() => {
                      signOut()
                      setDrawerOpen(false)
                    }}
                    className="w-full rounded-lg bg-[#1e1e2a] px-4 py-3 text-sm font-medium text-[#6a6865] transition-colors hover:bg-[#2a2a3a] hover:text-[#ff6b6b]"
                  >
                    {t('nav.signout')}
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}