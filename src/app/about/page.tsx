import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About — Celestial',
  description: 'Learn about Celestial — our story, philosophy, and approach to modern astrology.',
  openGraph: {
    title: 'About — Celestial',
    description: 'Learn about Celestial — our story, philosophy, and approach to modern astrology.',
  },
  twitter: {
    card: 'summary',
    title: 'About — Celestial',
    description: 'Learn about Celestial — our story, philosophy, and approach to modern astrology.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

function t(key: string, locale: string): string {
  const en: Record<string, string> = {
    'about.title': 'About Celestial',
    'about.subtitle': 'Your gateway to understanding the cosmos within and around you.',
    'about.story.title': 'Our Story',
    'about.story.content': 'Celestial was born from a simple idea: that the ancient wisdom of astrology should be accessible to everyone, beautifully presented, and powered by modern technology.\n\nWe believe that your birth chart is a map of your cosmic potential — a tool for self-reflection, growth, and understanding. Our mission is to help you decode that map with clarity and depth.',
    'about.philosophy.title': 'Our Philosophy',
    'about.philosophy.content': 'Astrology is not about predestination — it is about potential. The stars do not dictate your fate, but they reveal patterns, energies, and opportunities that you can work with consciously.\n\nWe approach astrology with respect for its traditional roots and a modern, psychological perspective. Our tools are designed to empower you, not to limit you.',
    'about.features.title': 'What We Offer',
    'about.features.natalChart.title': 'Natal Chart Analysis',
    'about.features.natalChart.desc': 'Comprehensive birth chart with 10 planets, 12 houses, and major aspects',
    'about.features.aiInterpretation.title': 'AI Interpretation',
    'about.features.aiInterpretation.desc': 'Ask our AI astrologer anything about your chart',
    'about.features.dailyTransit.title': 'Daily Transit',
    'about.features.dailyTransit.desc': 'Personalized daily horoscope and planetary events',
    'about.features.synastry.title': 'Synastry',
    'about.features.synastry.desc': 'Relationship compatibility analysis between two charts',
    'about.tech.title': 'Our Approach',
    'about.tech.content': 'We use the Whole Sign house system, one of the oldest and most traditional house systems in Western astrology. Our calculations include all 10 major celestial bodies (Sun through Pluto) and the major aspects (conjunction, sextile, square, trine, opposition).\n\nOur AI interpretation feature combines your chart data with advanced language models to provide nuanced, context-aware insights tailored to you.',
    'about.disclaimer.title': 'Disclaimer',
    'about.disclaimer.content': 'Celestial provides astrological information for entertainment and self-reflection purposes only. It is not a substitute for professional advice. Always consult with qualified professionals for medical, legal, financial, or psychological matters.',
  }

  const zh: Record<string, string> = {
    'about.title': '关于 Celestial',
    'about.subtitle': '理解你内在和周围宇宙的门户。',
    'about.story.title': '我们的故事',
    'about.story.content': 'Celestial 诞生于一个简单的想法：占星学这门古老的智慧应该让每个人都能接触到，以精美的方式呈现，并由现代技术驱动。\n\n我们相信，你的出生星盘是你宇宙潜能的地图——一个用于自我反思、成长和理解的工具。我们的使命是帮助你清晰而深入地解读这张地图。',
    'about.philosophy.title': '我们的理念',
    'about.philosophy.content': '占星学不是关于宿命论——而是关于潜能。星辰并不决定你的命运，但它们揭示了你可以有意识地与之合作的模式、能量和机遇。\n\n我们以尊重传统根源和现代心理学视角的态度来对待占星学。我们的工具旨在赋予你力量，而不是限制你。',
    'about.features.title': '我们提供什么',
    'about.features.natalChart.title': '本命盘分析',
    'about.features.natalChart.desc': '包含 10 颗行星、12 宫位和主要相位的完整出生星盘',
    'about.features.aiInterpretation.title': 'AI 解读',
    'about.features.aiInterpretation.desc': '向我们的 AI 占星师询问任何关于你星盘的问题',
    'about.features.dailyTransit.title': '每日行运',
    'about.features.dailyTransit.desc': '个性化每日运势和行星事件',
    'about.features.synastry.title': '合盘',
    'about.features.synastry.desc': '两个星盘之间的关系契合度分析',
    'about.tech.title': '我们的方法',
    'about.tech.content': '我们使用整宫制（Whole Sign house system），这是西方占星学中最古老和最传统的宫位系统之一。我们的计算包括全部 10 颗主要天体（太阳到冥王星）和主要相位（合相、六分相、四分相、三分相、对分相）。\n\n我们的 AI 解读功能将您的星盘数据与先进的语言模型相结合，为您提供量身定制的、有上下文感知的细致洞察。',
    'about.disclaimer.title': '免责声明',
    'about.disclaimer.content': 'Celestial 提供的占星信息仅供娱乐和自我反思目的使用。它不能替代专业建议。对于医疗、法律、财务或心理问题，请始终咨询合格的专业人士。',
  }

  const dict = locale === 'zh' ? zh : en
  return dict[key] || key
}

export default function AboutPage() {
  const locale = 'en'

  const features = ['natalChart', 'aiInterpretation', 'dailyTransit', 'synastry']

  return (
    <main className="min-h-screen bg-[#0a0a0f] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="text-center animate-fade-in">
          <h1
            className="text-4xl font-bold text-[#e8e6e3] sm:text-5xl"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            {t('about.title', locale)}
          </h1>
          <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-[#c9a96e]/60 to-transparent" />
          <p className="mx-auto mt-6 max-w-xl text-sm text-[#6a6865] sm:text-base">
            {t('about.subtitle', locale)}
          </p>
        </div>

        <div className="mt-16 space-y-12">
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-xl font-semibold text-[#e8e6e3]">
              {t('about.story.title', locale)}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#a8a6a3] whitespace-pre-line">
              {t('about.story.content', locale)}
            </p>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-xl font-semibold text-[#e8e6e3]">
              {t('about.philosophy.title', locale)}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#a8a6a3] whitespace-pre-line">
              {t('about.philosophy.content', locale)}
            </p>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-xl font-semibold text-[#e8e6e3]">
              {t('about.features.title', locale)}
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {features.map((f) => (
                <div key={f} className="rounded-xl border border-[#1e1e2a] bg-[#0f0f15]/50 p-4">
                  <h3 className="text-sm font-medium text-[#c9a96e]">
                    {t(`about.features.${f}.title`, locale)}
                  </h3>
                  <p className="mt-1 text-xs text-[#6a6865]">
                    {t(`about.features.${f}.desc`, locale)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-xl font-semibold text-[#e8e6e3]">
              {t('about.tech.title', locale)}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#a8a6a3] whitespace-pre-line">
              {t('about.tech.content', locale)}
            </p>
          </div>

          <div
            className="animate-fade-in rounded-2xl border border-[#c9a96e]/20 bg-[#c9a96e]/5 p-6"
            style={{ animationDelay: '0.5s' }}
          >
            <h2 className="text-lg font-semibold text-[#c9a96e]">
              {t('about.disclaimer.title', locale)}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#a8a6a3]">
              {t('about.disclaimer.content', locale)}
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
