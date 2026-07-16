'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import type { BlogPostMeta, BlogLocale } from '@/lib/blog'

interface Props {
  enPosts: BlogPostMeta[]
  zhPosts: BlogPostMeta[]
}

export default function BlogListClient({ enPosts, zhPosts }: Props) {
  const { t, locale } = useTranslation()
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const posts = (locale === 'zh' ? zhPosts : enPosts) as BlogPostMeta[]
  const blogLocale: BlogLocale = locale === 'zh' ? 'zh' : 'en'

  const categories = useMemo(
    () => Array.from(new Set(posts.map((p) => p.category))),
    [posts]
  )

  const filtered = activeCategory
    ? posts.filter((p) => p.category === activeCategory)
    : posts

  const formatDate = (date: string) => {
    try {
      return new Intl.DateTimeFormat(blogLocale === 'zh' ? 'zh-CN' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(new Date(date))
    } catch {
      return date
    }
  }

  const linkFor = (slug: string) =>
    blogLocale === 'zh' ? `/blog/${slug}?lang=zh` : `/blog/${slug}`

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 md:py-20">
      {/* Header */}
      <header className="text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#c9a96e]">
          {t('blog.eyebrow')}
        </span>
        <h1 className="mt-3 font-serif text-3xl md:text-5xl font-bold text-[#e8e6e3]">
          {t('blog.title')}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm md:text-base leading-relaxed text-[#a8a6a3]">
          {t('blog.subtitle')}
        </p>
      </header>

      {/* Category filter */}
      <div className="mt-10 flex flex-wrap justify-center gap-2">
        <button
          onClick={() => setActiveCategory(null)}
          className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
            activeCategory === null
              ? 'bg-[#c9a96e] text-[#0a0a0f]'
              : 'bg-[#14141d] text-[#a8a6a3] hover:bg-[#1e1e2a]'
          }`}
        >
          {t('blog.allCategories')}
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-[#c9a96e] text-[#0a0a0f]'
                : 'bg-[#14141d] text-[#a8a6a3] hover:bg-[#1e1e2a]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts grid */}
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((post) => (
          <Link
            key={post.slug}
            href={linkFor(post.slug)}
            className="group flex flex-col overflow-hidden rounded-2xl border border-[#1e1e2a] bg-[#0f0f15] transition-all hover:border-[#c9a96e]/40 hover:bg-[#14141d]"
          >
            {/* Cover placeholder — gradient */}
            <div
              className="h-36 w-full bg-gradient-to-br from-[#1e1e2a] via-[#14141d] to-[#0a0a0f]"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 30% 50%, rgba(201,169,110,0.18), transparent 60%), radial-gradient(circle at 70% 30%, rgba(94,141,226,0.12), transparent 60%)',
              }}
            >
              <div className="flex h-full items-center justify-center">
                <span className="text-3xl opacity-60">✦</span>
              </div>
            </div>

            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-[#c9a96e]">
                <span>{post.category}</span>
                <span className="text-[#3a3a45]">•</span>
                <span className="text-[#6a6865]">{post.readingMinutes} {t('blog.minRead')}</span>
              </div>

              <h2 className="mt-2 font-serif text-lg font-semibold leading-snug text-[#e8e6e3] transition-colors group-hover:text-[#c9a96e]">
                {post.title}
              </h2>

              <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[#6a6865]">
                {post.description}
              </p>

              <div className="mt-auto pt-4 text-[10px] text-[#5a5a65]">
                {formatDate(post.date)}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center text-sm text-[#6a6865]">
          {t('blog.noPosts')}
        </div>
      )}
    </div>
  )
}
