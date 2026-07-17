'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useTranslation } from '@/hooks/useTranslation'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { motion } from 'framer-motion'

export default function DesktopNav() {
  const pathname = usePathname()
  const { user, loading, signInWithGoogle, signOut } = useAuth()
  const { t } = useTranslation()

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/chart', label: t('nav.chart') },
    { href: '/transit', label: t('nav.transit') },
    { href: '/synastry', label: t('nav.synastry') },
    { href: '/blog', label: t('nav.blog') },
    { href: '/profile', label: t('nav.profile') },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 hidden md:block">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <span className="text-xl">✦</span>
          <span
            className="font-serif text-lg font-bold tracking-wide text-[#e8e6e3]"
            style={{ fontVariant: 'small-caps' }}
          >
            Horoscope SERO
          </span>
        </Link>

        {/* Center nav links */}
        <div className="flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium transition-colors"
                style={{ color: isActive ? '#c9a96e' : '#6a6865' }}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="desktop-nav-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-[#c9a96e]"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </div>

        {/* Right: language switcher + auth */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher variant="desktop" />
          {loading ? (
            <div className="h-8 w-20 animate-pulse rounded-lg bg-[#1e1e2a]" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1e1e2a] text-xs font-bold text-[#c9a96e]">
                {user.email?.[0]?.toUpperCase() ?? 'U'}
              </div>
              <button
                onClick={signOut}
                className="text-xs text-[#6a6865] transition-colors hover:text-[#a8a6a3]"
              >
                {t('nav.signout')}
              </button>
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className="rounded-lg bg-[#c9a96e] px-4 py-2 text-sm font-medium text-[#0a0a0f] transition-colors hover:bg-[#b8964f]"
            >
              {t('nav.signin')}
            </Link>
          )}
        </div>
      </div>

      {/* Backdrop line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#1e1e2a] to-transparent" />
    </nav>
  )
}
