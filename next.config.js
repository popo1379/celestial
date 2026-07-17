/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Deploy under subdirectory on the apex domain: opensero.com/horoscope
  basePath: '/horoscope',
  images: {
    domains: [],
  },
  async headers() {
    const securityHeaders = [
      {
        key: 'X-Frame-Options',
        value: 'SAMEORIGIN',
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()',
      },
      {
        key: 'X-DNS-Prefetch-Control',
        value: 'on',
      },
    ]
    return [
      {
        // Next.js auto-prefixes with basePath for headers/redirects/rewrites
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

module.exports = nextConfig
