/**
 * IndexNow URL Submission Script
 *
 * Pushes all URLs from sitemap.xml to Bing/Yandex/IndexNow-supported engines
 * so they are crawled within 24-72 hours instead of waiting for natural discovery.
 *
 * Usage:
 *   npx tsx src/scripts/indexnow-submit.ts
 *   INDEXNOW_KEY=<key> npx tsx src/scripts/indexnow-submit.ts
 *
 * Environment variables:
 *   NEXT_PUBLIC_APP_URL  - Site base URL (default: https://opensero.com/horoscope)
 *   INDEXNOW_KEY         - 32-char hex key matching the <key>.txt file in /public
 *   INDEXNOW_DRY_RUN     - Set to "1" to print URLs without submitting
 */

import fs from 'node:fs'
import path from 'node:path'

const SITEMAP_PATH = path.join(process.cwd(), '.next', 'static', 'sitemap.xml')
const PUBLIC_DIR = path.join(process.cwd(), 'public')

const DEFAULT_KEY = '7d2f8a9b4c6e3f5a1b8d2c7e4f6a3b5d'
const DEFAULT_BASE_URL = 'https://opensero.com/horoscope'

const INDEXNOW_ENDPOINTS = [
  'https://www.bing.com/indexnow',
  'https://search.yandex.com/indexnow',
  'https://search.seznam.cz/indexnow',
]

function discoverKey(): string {
  if (process.env.INDEXNOW_KEY) return process.env.INDEXNOW_KEY
  // Auto-discover by scanning public/*.txt for a 32-char hex filename
  try {
    const files = fs.readdirSync(PUBLIC_DIR)
    const keyFile = files.find(
      (f) => /^[0-9a-f]{32}\.txt$/i.test(f),
    )
    if (keyFile) {
      const content = fs.readFileSync(path.join(PUBLIC_DIR, keyFile), 'utf-8').trim()
      if (content && /^[0-9a-f]{32}$/i.test(content)) return content
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_KEY
}

function extractUrlsFromSitemap(xml: string): string[] {
  const matches = xml.match(/<loc>([^<]+)<\/loc>/g) || []
  return matches.map((m) => m.replace(/^<loc>|<\/loc>$/g, ''))
}

async function fetchSitemapUrls(baseUrl: string): Promise<string[]> {
  // Try on-disk first (post-build), then fall back to HTTP
  try {
    if (fs.existsSync(SITEMAP_PATH)) {
      const xml = fs.readFileSync(SITEMAP_PATH, 'utf-8')
      return extractUrlsFromSitemap(xml)
    }
  } catch {
    /* ignore */
  }
  const res = await fetch(`${baseUrl}/sitemap.xml`)
  if (!res.ok) throw new Error(`Failed to fetch sitemap: HTTP ${res.status}`)
  const xml = await res.text()
  return extractUrlsFromSitemap(xml)
}

async function submitToEndpoint(
  endpoint: string,
  payload: { host: string; key: string; keyLocation?: string; urlList: string[] },
): Promise<{ ok: boolean; status: number; detail?: string }> {
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    })
    const text = await res.text()
    return { ok: res.ok, status: res.status, detail: text || undefined }
  } catch (err) {
    return { ok: false, status: 0, detail: String(err) }
  }
}

async function main() {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || DEFAULT_BASE_URL).replace(/\/+$/, '')
  const key = discoverKey()
  const dryRun = process.env.INDEXNOW_DRY_RUN === '1' || process.argv.includes('--dry')

  const { host, pathname: basePath } = new URL(baseUrl)
  const keyLocation = basePath && basePath !== '/'
    ? `${baseUrl}/${key}.txt`
    : `https://${host}/${key}.txt`

  console.log('========================================')
  console.log(' IndexNow Submission')
  console.log('========================================')
  console.log(` Base URL  : ${baseUrl}`)
  console.log(` Host      : ${host}`)
  console.log(` Key       : ${key}`)
  console.log(` Key file  : ${keyLocation}`)
  console.log(` Dry run   : ${dryRun ? 'YES (no submission)' : 'NO'}`)
  console.log()

  let urls: string[] = []
  try {
    urls = await fetchSitemapUrls(baseUrl)
  } catch (err) {
    console.error(' Failed to load sitemap. Provide URLs manually or run `next build` first.')
    console.error(` ${String(err)}`)
    process.exit(1)
  }

  if (!urls.length) {
    console.error(' No URLs found in sitemap. Aborting.')
    process.exit(1)
  }

  console.log(` Discovered ${urls.length} URL(s) from sitemap.xml`)
  urls.forEach((u, i) => console.log(`  ${String(i + 1).padStart(3)}. ${u}`))
  console.log()

  if (dryRun) {
    console.log(' [DRY RUN] No URLs were submitted.')
    console.log(' Remove INDEXNOW_DRY_RUN=1 to actually submit.')
    return
  }

  const payload = {
    host,
    key,
    keyLocation,
    urlList: urls,
  }

  console.log(' Submitting to IndexNow endpoints...')
  let anySuccess = false
  for (const endpoint of INDEXNOW_ENDPOINTS) {
    const result = await submitToEndpoint(endpoint, payload)
    const label = result.ok ? 'OK' : 'FAIL'
    const extra = result.detail ? ` — ${result.detail.slice(0, 180)}` : ''
    console.log(`  [${label}] ${endpoint} (HTTP ${result.status})${extra}`)
    if (result.ok) anySuccess = true
  }

  console.log()
  if (anySuccess) {
    console.log(' Submission accepted. URLs should be crawled within 24-72 hours.')
    console.log(' Verify at:')
    console.log('   Bing   : https://www.bing.com/webmasters/indexnow')
    console.log('   Yandex : https://webmaster.yandex.com/')
  } else {
    console.error(' All endpoints rejected the submission.')
    console.error(' Common causes:')
    console.error('   1. Key file not reachable at:')
    console.error(`      ${keyLocation}`)
    console.error('   2. URLs must belong to the same host as the key file')
    console.error('   3. Key file content must match the key exactly')
    process.exit(1)
  }
}

main().catch((err) => {
  console.error(' Unhandled error:', err)
  process.exit(1)
})
