'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { motion } from 'framer-motion'

export default function MobileTabBar() {
  const pathname = usePathname()
  const { t } = useTranslation()

  const tabs = [
    { href: '/', label: t('nav.home'), icon: '✦' },
    { href: '/chart', label: t('nav.chart'), icon: '☉' },
    { href: '/transit', label: t('nav.transit'), icon: '☽' },
    { href: '/synastry', label: t('nav.synastry'), icon: '♡' },
    { href: '/profile', label: t('nav.profile'), icon: '◈' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <LanguageSwitcher variant="mobile" />
      <div className="h-[60px] border-t border-[#1e1e2a] bg-[#0a0a0f]/90 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-lg items-center justify-around px-2">
          {tabs.map((tab) => {
            const isActive =
              tab.href === '/'
                ? pathname === '/'
                : pathname.startsWith(tab.href)
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex flex-col items-center gap-0.5"
              >
                <motion.span
                  animate={{
                    scale: isActive ? 1.15 : 1,
                    color: isActive ? '#c9a96e' : '#5a5a6a',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="text-lg"
                >
                  {tab.icon}
                </motion.span>
                <motion.span
                  animate={{
                    color: isActive ? '#c9a96e' : '#5a5a6a',
                  }}
                  className="text-[10px] font-medium"
                >
                  {tab.label}
                </motion.span>
                {isActive && (
                  <motion.div
                    layoutId="mobile-tab-indicator"
                    className="absolute -top-px left-2 right-2 h-0.5 rounded-full bg-[#c9a96e]"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
