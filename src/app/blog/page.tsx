import type { Metadata } from 'next'
import { listPosts } from '@/lib/blog'
import BlogListClient from '@/components/blog/BlogListClient'

export const metadata: Metadata = {
  title: 'Astrology Blog — Free Birth Chart, Sun Moon Rising & More | Horoscope SERO',
  description:
    'Astrology guides on free birth charts, sun moon and rising, transits, synastry, and AI-powered interpretation. Beginner-friendly explainers and deep dives from the Horoscope SERO team.',
  keywords: [
    'sun moon and rising',
    'big three astrology',
    'free birth chart',
    'natal chart',
    'astrology blog',
    'astrology guides',
    'sun moon rising sign',
    'astrology for beginners',
    'transit astrology',
    'synastry',
  ],
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Astrology Blog — Free Birth Chart, Sun Moon Rising & More | Horoscope SERO',
    description:
      'Learn how to read free birth charts, understand sun moon and rising, track transits, compare synastry, and use AI for astrology interpretations.',
    url: '/blog',
    type: 'website',
  },
}

export default function BlogPage() {
  const enPosts = listPosts('en')

  return <BlogListClient enPosts={enPosts} />
}
