'use client'

import { motion } from 'framer-motion'
import { useTranslation } from '@/hooks/useTranslation'

const testimonials = [
  { key: 't1' },
  { key: 't2' },
  { key: 't3' },
]

export default function TestimonialsSection() {
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
            {t('testimonials.title')}
          </h2>
          <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-[#c9a96e]/60 to-transparent" />
          <p className="mx-auto mt-4 max-w-2xl text-sm text-[#6a6865] sm:text-base">
            {t('testimonials.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-2xl border border-[#1e1e2a] bg-[#0f0f15]/50 p-6 backdrop-blur-sm"
            >
              <div className="mb-4 flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="h-4 w-4 text-[#c9a96e]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm leading-relaxed text-[#a8a6a3]">
                "{t(`testimonials.${item.key}.content`)}"
              </p>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#c9a96e]/10 text-sm font-bold text-[#c9a96e]">
                  {t(`testimonials.${item.key}.initial`)}
                </div>
                <div>
                  <div className="text-sm font-medium text-[#e8e6e3]">
                    {t(`testimonials.${item.key}.name`)}
                  </div>
                  <div className="text-xs text-[#6a6865]">
                    {t(`testimonials.${item.key}.role`)}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
