import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://celestial.app'

  const routes = [
    '',
    '/chart',
    '/chart/detail',
    '/chart/wheel',
    '/synastry',
    '/synastry/result',
    '/transit',
    '/profile',
    '/ai-chat',
    '/auth/signin',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))
}
