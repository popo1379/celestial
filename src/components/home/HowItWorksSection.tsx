'use client'

import { motion } from 'framer-motion'
import { useTranslation } from '@/hooks/useTranslation'

const steps = [
  { key: 'step1', number: '01' },
  { key: 'step2', number: '02' },
  { key: 'step3', number: '03' },
]

export default function HowItWorksSection() {
  const { t } = useTranslation()

  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <h2
            className="text-3xl font-bold tracking-tight text-[#e8e6e3] sm:text-4xl"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            {t('howItWorks.title')}
          </h2>
          <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-[#c9a96e]/60 to-transparent" />
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative text-center"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#c9a96e]/10">
                <span
                  className="text-2xl font-bold text-[#c9a96e]"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  {step.number}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-[#e8e6e3]">
                {t(`howItWorks.${step.key}.title`)}
              </h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-[#6a6865]">
                {t(`howItWorks.${step.key}.desc`)}
              </p>

              {index < steps.length - 1 && (
                <div className="absolute right-0 top-8 hidden h-px w-8 bg-gradient-to-r from-[#c9a96e]/30 to-transparent md:block" style={{ transform: 'translateX(50%)' }} />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
