import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://celestial.app').replace(/\/+$/, '')

  const routes: { path: string; priority: number; changeFrequency: 'daily' | 'weekly' | 'monthly' }[] = [
    { path: '', priority: 1, changeFrequency: 'weekly' },
    { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/privacy', priority: 0.3, changeFrequency: 'monthly' },
    { path: '/terms', priority: 0.3, changeFrequency: 'monthly' },
    { path: '/chart', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/chart/detail', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/chart/wheel', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/synastry', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/synastry/result', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/transit', priority: 0.9, changeFrequency: 'daily' },
    { path: '/profile', priority: 0.5, changeFrequency: 'weekly' },
    { path: '/ai-chat', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/auth/signin', priority: 0.3, changeFrequency: 'monthly' },
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}
