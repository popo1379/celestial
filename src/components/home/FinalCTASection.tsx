'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'

export default function FinalCTASection() {
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="text-3xl font-bold leading-tight tracking-tight text-[#e8e6e3] sm:text-5xl"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            {t('finalCTA.title')}
          </h2>
          <div className="mx-auto mt-6 h-px w-16 bg-gradient-to-r from-transparent via-[#c9a96e]/60 to-transparent" />
          <p className="mx-auto mt-6 max-w-xl text-sm text-[#6a6865] sm:text-base">
            {t('finalCTA.subtitle')}
          </p>

          <button
            onClick={() => router.push('/chart')}
            className="mt-10 inline-flex items-center gap-2 rounded-xl bg-[#c9a96e] px-8 py-3.5 text-sm font-semibold text-[#0a0a0f] transition-all duration-200 hover:bg-[#b8964f] hover:shadow-lg hover:shadow-[#c9a96e]/25"
          >
            {t('finalCTA.button')}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>

          <p className="mt-4 text-xs text-[#5a5a65]">
            {t('finalCTA.note')}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
