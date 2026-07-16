import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import type { Locale } from '@/i18n/translations'

export type BlogLocale = 'en' | 'zh'

export interface BlogFrontmatter {
  title: string
  description: string
  date: string // YYYY-MM-DD
  updated?: string
  author: string
  category: string
  tags: string[]
  cover?: string
  faqs?: Array<{ question: string; answer: string }>
}

export interface BlogPostMeta extends BlogFrontmatter {
  slug: string
  locale: BlogLocale
  readingTime: string
  readingMinutes: number
}

export interface BlogPost extends BlogPostMeta {
  content: string
  rawMdx: string
}

const BLOG_DIR = path.join(process.cwd(), 'src', 'content', 'blog')
const LOCALES: BlogLocale[] = ['en', 'zh']

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

/**
 * List all blog slugs for a given locale.
 */
export function listSlugs(locale: BlogLocale = 'en'): string[] {
  const dir = path.join(BLOG_DIR, locale)
  ensureDir(dir)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''))
    .sort()
}

/**
 * Get metadata for all posts in a locale, sorted by date desc.
 */
export function listPosts(locale: BlogLocale = 'en'): BlogPostMeta[] {
  const slugs = listSlugs(locale)
  const posts: BlogPostMeta[] = slugs.map((slug) => {
    const meta = getPostMeta(slug, locale)
    if (!meta) throw new Error(`Failed to load post: ${slug} (${locale})`)
    return meta
  })
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1))
}

/**
 * Read a single post's frontmatter + raw MDX (no compile).
 */
export function getPost(slug: string, locale: BlogLocale = 'en'): BlogPost | null {
  const filePath = path.join(BLOG_DIR, locale, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)
  const frontmatter = data as BlogFrontmatter
  const stats = readingTime(content)
  return {
    ...frontmatter,
    slug,
    locale,
    content,
    rawMdx: raw,
    readingTime: stats.text,
    readingMinutes: Math.max(1, Math.round(stats.minutes)),
  }
}

/**
 * Get metadata only (no content) — cheap, for listings.
 */
export function getPostMeta(slug: string, locale: BlogLocale = 'en'): BlogPostMeta | null {
  const post = getPost(slug, locale)
  if (!post) return null
  const { content: _c, rawMdx: _r, ...meta } = post
  return meta
}

/**
 * Get all unique slugs across both locales (union). Used for generateStaticParams.
 */
export function getAllSlugs(): Array<{ slug: string }> {
  const set = new Set<string>()
  for (const loc of LOCALES) {
    for (const s of listSlugs(loc)) set.add(s)
  }
  return Array.from(set).map((slug) => ({ slug }))
}

/**
 * Find prev/next post (by date desc) around the given slug.
 */
export function getAdjacentPosts(
  slug: string,
  locale: BlogLocale = 'en'
): { prev: BlogPostMeta | null; next: BlogPostMeta | null } {
  const posts = listPosts(locale) // date desc
  const idx = posts.findIndex((p) => p.slug === slug)
  if (idx === -1) return { prev: null, next: null }
  // next post in array (newer) = idx - 1; prev post (older) = idx + 1
  return {
    prev: idx + 1 < posts.length ? posts[idx + 1] : null,
    next: idx - 1 >= 0 ? posts[idx - 1] : null,
  }
}

/**
 * All unique categories for a locale.
 */
export function listCategories(locale: BlogLocale = 'en'): string[] {
  const posts = listPosts(locale)
  return Array.from(new Set(posts.map((p) => p.category)))
}

/**
 * Filter posts by category.
 */
export function getPostsByCategory(category: string, locale: BlogLocale = 'en'): BlogPostMeta[] {
  return listPosts(locale).filter((p) => p.category.toLowerCase() === category.toLowerCase())
}

export function isBlogLocale(value: string | undefined | null): value is BlogLocale {
  return value === 'en' || value === 'zh'
}

export function resolveLocale(value: string | undefined | null, fallback: BlogLocale = 'en'): BlogLocale {
  return isBlogLocale(value) ? value : fallback
}

export type { Locale }
