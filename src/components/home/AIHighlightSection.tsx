'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'

const presetQuestions = [
  'ai.q1',
  'ai.q2',
  'ai.q3',
]

export default function AIHighlightSection() {
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <section className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c9a96e]/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="overflow-hidden rounded-3xl border border-[#c9a96e]/20 bg-gradient-to-br from-[#1a1425]/50 via-[#0f0f15]/80 to-[#14141d]/50 p-8 sm:p-12 backdrop-blur-sm">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#c9a96e]/30 bg-[#c9a96e]/10 px-4 py-1.5">
                <span className="text-[#c9a96e]">✦</span>
                <span className="text-xs font-medium text-[#c9a96e]">
                  {t('aiHighlight.badge')}
                </span>
              </div>
              <h2
                className="text-3xl font-bold leading-tight text-[#e8e6e3] sm:text-4xl"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                {t('aiHighlight.title')}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#a8a6a3] sm:text-base">
                {t('aiHighlight.desc')}
              </p>

              <div className="mt-8 space-y-3">
                {presetQuestions.map((q, i) => (
                  <motion.div
                    key={q}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                    className="flex items-start gap-3 rounded-xl border border-[#1e1e2a] bg-[#0a0a0f]/50 px-4 py-3"
                  >
                    <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#c9a96e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                    <span className="text-sm text-[#a8a6a3]">{t(q)}</span>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={() => router.push('/chart')}
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#c9a96e] px-6 py-3 text-sm font-semibold text-[#0a0a0f] transition-all duration-200 hover:bg-[#b8964f] hover:shadow-lg hover:shadow-[#c9a96e]/20"
              >
                {t('aiHighlight.cta')}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#c9a96e]/20 to-transparent blur-2xl" />
                <div className="relative rounded-2xl border border-[#1e1e2a] bg-[#0a0a0f]/80 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500/60" />
                      <div className="h-2 w-2 rounded-full bg-yellow-500/60" />
                      <div className="h-2 w-2 rounded-full bg-green-500/60" />
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-[#5a5a65]">AI Chat</span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="h-8 w-8 flex-shrink-0 rounded-full bg-[#c9a96e]/20 flex items-center justify-center">
                        <span className="text-[#c9a96e] text-xs">U</span>
                      </div>
                      <div className="rounded-xl rounded-tl-sm bg-[#14141d] px-3 py-2 text-xs text-[#a8a6a3]">
                        {t('ai.q1')}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="h-8 w-8 flex-shrink-0 rounded-full bg-[#c9a96e]/10 flex items-center justify-center">
                        <svg className="h-4 w-4 text-[#c9a96e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                        </svg>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="h-2 w-4/5 rounded-full bg-[#c9a96e]/30" />
                        <div className="h-2 w-full rounded-full bg-[#1e1e2a]" />
                        <div className="h-2 w-3/4 rounded-full bg-[#1e1e2a]" />
                        <div className="h-2 w-5/6 rounded-full bg-[#1e1e2a]" />
                        <div className="h-2 w-2/3 rounded-full bg-[#1e1e2a]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
