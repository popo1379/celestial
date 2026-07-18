import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://opensero.com/horoscope').replace(/\/+$/, '')

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/*',
          '/auth/*',
          '/profile',
          '/chart/detail',
          '/chart/wheel',
          '/synastry/result',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
