import type { Metadata } from 'next'
import { listPosts } from '@/lib/blog'
import BlogListClient from '@/components/blog/BlogListClient'

export const metadata: Metadata = {
  title: 'Blog — Celestial',
  description:
    'Astrology guides on natal charts, transits, synastry, and AI-powered interpretation. Beginner-friendly explainers and deep dives from the Celestial team.',
  alternates: {
    canonical: '/blog',
    languages: {
      en: '/blog',
      zh: '/blog?lang=zh',
    },
  },
  openGraph: {
    title: 'Celestial Blog — Astrology Guides & Deep Dives',
    description:
      'Learn how to read natal charts, track transits, compare synastry, and use AI for astrology interpretations.',
    url: '/blog',
    type: 'website',
  },
}

export default function BlogPage() {
  // Pre-fetch both locale lists server-side; client decides which to show
  const enPosts = listPosts('en')
  const zhPosts = listPosts('zh')

  return <BlogListClient enPosts={enPosts} zhPosts={zhPosts} />
}
