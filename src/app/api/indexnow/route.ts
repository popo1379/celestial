import { NextRequest, NextResponse } from 'next/server'
import { listPosts } from '@/lib/blog'

// Pre-deployed indexnow key file: public/<KEY>.txt
const INDEXNOW_KEY = '7d2f8a9b4c6e3f5a1b8d2c7e4f6a3b5d'

const INDEXNOW_ENDPOINTS = [
  'https://www.bing.com/indexnow',
  'https://search.yandex.com/indexnow',
  'https://search.seznam.cz/indexnow',
]

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Admin token must match to prevent abuse — set via env var
function requireAuth(req: NextRequest): NextResponse | null {
  const token = process.env.INDEXNOW_ADMIN_TOKEN
  if (!token) {
    return NextResponse.json(
      { error: 'INDEXNOW_ADMIN_TOKEN not configured on server' },
      { status: 500 },
    )
  }
  const given =
    req.nextUrl.searchParams.get('token') ||
    req.headers.get('x-indexnow-token') ||
    ''
  if (given !== token) {
    return NextResponse.json(
      { error: 'Unauthorized. Provide ?token=INDEXNOW_ADMIN_TOKEN' },
      { status: 401 },
    )
  }
  return null
}

function buildDefaultUrls(baseUrl: string): string[] {
  const staticPaths = [
    '',
    '/about',
    '/chart',
    '/synastry',
    '/transit',
    '/ai-chat',
    '/blog',
    '/blog/sun-moon-rising-signs',
    '/blog/how-to-find-sun-moon-rising',
    '/blog/sun-moon-rising-meaning',
    '/blog/sun-moon-rising-personality-triangle',
    '/privacy',
    '/terms',
  ]
  const urls = staticPaths.map((p) => `${baseUrl}${p}`)
  try {
    const posts = listPosts('en')
    const postUrls = posts.map((p) => `${baseUrl}/blog/${p.slug}`)
    return Array.from(new Set([...urls, ...postUrls]))
  } catch {
    return urls
  }
}

async function submitBatch(
  endpoint: string,
  payload: { host: string; key: string; keyLocation: string; urlList: string[] },
) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  })
  const body = await res.text()
  return { endpoint, ok: res.ok, status: res.status, body: body.slice(0, 500) }
}

export async function POST(req: NextRequest) {
  const authErr = requireAuth(req)
  if (authErr) return authErr

  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://opensero.com/horoscope').replace(
    /\/+$/,
    '',
  )
  const { host, pathname: basePath } = new URL(baseUrl)
  const keyLocation =
    basePath && basePath !== '/'
      ? `${baseUrl}/${INDEXNOW_KEY}.txt`
      : `https://${host}/${INDEXNOW_KEY}.txt`

  let body: { urls?: string[]; dry?: boolean } = {}
  try {
    body = (await req.json()) as typeof body
  } catch {
    /* optional body */
  }

  const urls = body.urls && Array.isArray(body.urls) && body.urls.length
    ? body.urls
    : buildDefaultUrls(baseUrl)

  const dry = body.dry === true

  const payload = {
    host,
    key: INDEXNOW_KEY,
    keyLocation,
    urlList: urls,
  }

  if (dry) {
    return NextResponse.json({
      mode: 'dry-run',
      baseUrl,
      host,
      key: INDEXNOW_KEY,
      keyLocation,
      urlCount: urls.length,
      urls,
      endpoints: INDEXNOW_ENDPOINTS,
    })
  }

  const results = await Promise.all(
    INDEXNOW_ENDPOINTS.map((e) => submitBatch(e, payload)),
  )

  return NextResponse.json({
    baseUrl,
    host,
    keyLocation,
    submitted: urls.length,
    urls,
    results,
  })
}

export async function GET(req: NextRequest) {
  const authErr = requireAuth(req)
  if (authErr) return authErr

  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://opensero.com/horoscope').replace(
    /\/+$/,
    '',
  )
  const { host, pathname: basePath } = new URL(baseUrl)
  const keyLocation =
    basePath && basePath !== '/'
      ? `${baseUrl}/${INDEXNOW_KEY}.txt`
      : `https://${host}/${INDEXNOW_KEY}.txt`

  const dry = req.nextUrl.searchParams.get('dry') === '1'
  const urls = buildDefaultUrls(baseUrl)

  if (dry) {
    return NextResponse.json({
      mode: 'dry-run',
      baseUrl,
      host,
      key: INDEXNOW_KEY,
      keyLocation,
      urlCount: urls.length,
      urls,
      endpoints: INDEXNOW_ENDPOINTS,
    })
  }

  const payload = {
    host,
    key: INDEXNOW_KEY,
    keyLocation,
    urlList: urls,
  }
  const results = await Promise.all(
    INDEXNOW_ENDPOINTS.map((e) => submitBatch(e, payload)),
  )

  return NextResponse.json({
    baseUrl,
    host,
    keyLocation,
    submitted: urls.length,
    urls,
    results,
  })
}
