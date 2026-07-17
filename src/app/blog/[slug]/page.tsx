import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import Link from 'next/link'
import {
  getPost,
  getAllSlugs,
  getAdjacentPosts,
  resolveLocale,
  type BlogLocale,
} from '@/lib/blog'
import BlogShareBar from '@/components/blog/BlogShareBar'
import BlogJsonLd from '@/components/blog/BlogJsonLd'

export const dynamic = 'force-static'
export const dynamicParams = false

interface PageProps {
  params: { slug: string }
  searchParams: { lang?: string }
}

export function generateStaticParams() {
  return getAllSlugs()
}

export function generateMetadata({ params, searchParams }: PageProps): Metadata {
  const requestedLocale = resolveLocale(searchParams.lang)
  let post = getPost(params.slug, requestedLocale)
  if (!post && requestedLocale !== 'en') {
    post = getPost(params.slug, 'en')
  }
  if (!post) return {}

  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://opensero.com/horoscope').replace(/\/+$/, '')
  const url = `${appUrl}/blog/${post.slug}${post.locale === 'zh' ? '?lang=zh' : ''}`
  const altEn = `${appUrl}/blog/${post.slug}`
  const altZh = `${appUrl}/blog/${post.slug}?lang=zh`

  return {
    title: `${post.title} — Horoscope SERO`,
    description: post.description,
    keywords: post.tags,
    alternates: {
      canonical: url,
      languages: {
        en: altEn,
        zh: altZh,
      },
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.updated || post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  }
}

export default function BlogPostPage({ params, searchParams }: PageProps) {
  const requestedLocale: BlogLocale = resolveLocale(searchParams.lang)
  let post = getPost(params.slug, requestedLocale)

  // Fallback to English if the requested locale version is missing
  if (!post && requestedLocale !== 'en') {
    post = getPost(params.slug, 'en')
  }
  if (!post) notFound()

  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://opensero.com/horoscope').replace(/\/+$/, '')
  // Use the post's actual locale for adjacent nav (handles fallback case)
  const { prev, next } = getAdjacentPosts(post.slug, post.locale)
  const isZh = post.locale === 'zh'

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat(isZh ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date))

  const otherLocaleHref = isZh ? `/blog/${post.slug}` : `/blog/${post.slug}?lang=zh`
  const otherLocaleLabel = isZh ? 'English' : '中文'

  return (
    <article className="mx-auto max-w-3xl px-6 py-12 md:py-20">
      <BlogJsonLd post={post} appUrl={appUrl} />

      {/* Back link */}
      <Link
        href={`/blog${isZh ? '?lang=zh' : ''}`}
        className="inline-flex items-center text-xs text-[#6a6865] transition-colors hover:text-[#c9a96e]"
      >
        ← {isZh ? '返回博客' : 'Back to blog'}
      </Link>

      {/* Header */}
      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-[#c9a96e]/10 px-3 py-1 font-medium text-[#c9a96e]">
            {post.category}
          </span>
          <span className="text-[#5a5a65]">·</span>
          <span className="text-[#6a6865]">{post.readingMinutes} {isZh ? '分钟阅读' : 'min read'}</span>
        </div>

        <h1 className="mt-4 font-serif text-3xl md:text-4xl font-bold leading-tight text-[#e8e6e3]">
          {post.title}
        </h1>

        <p className="mt-4 text-base md:text-lg leading-relaxed text-[#a8a6a3]">
          {post.description}
        </p>

        <div className="mt-6 flex items-center justify-between border-t border-[#1e1e2a] pt-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1e1e2a] text-xs font-bold text-[#c9a96e]">
              {post.author.charAt(0)}
            </div>
            <div className="text-xs">
              <div className="font-medium text-[#e8e6e3]">{post.author}</div>
              <div className="text-[#5a5a65]">
                {formatDate(post.date)}
                {post.updated && post.updated !== post.date && (
                  <span className="ml-2 italic">· {isZh ? '更新于' : 'updated'} {formatDate(post.updated)}</span>
                )}
              </div>
            </div>
          </div>

          <Link
            href={otherLocaleHref}
            className="rounded-md border border-[#1e1e2a] px-2.5 py-1 text-[10px] text-[#a8a6a3] transition-colors hover:border-[#c9a96e]/40 hover:text-[#c9a96e]"
          >
            {otherLocaleLabel}
          </Link>
        </div>
      </header>

      {/* MDX body */}
      <div className="blog-prose mt-10">
        <MDXRemote
          source={post.content}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [
                rehypeSlug,
                [rehypeAutolinkHeadings, { behavior: 'wrap' }],
              ],
            },
          }}
        />
      </div>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-2 border-t border-[#1e1e2a] pt-6">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[#14141d] px-3 py-1 text-[10px] text-[#6a6865]"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Share */}
      <BlogShareBar
        url={`${appUrl}/blog/${post.slug}${isZh ? '?lang=zh' : ''}`}
        title={post.title}
        isZh={isZh}
      />

      {/* Prev / Next */}
      {(prev || next) && (
        <nav className="mt-12 grid gap-4 sm:grid-cols-2">
          {prev ? (
            <Link
              href={`/blog/${prev.slug}${isZh ? '?lang=zh' : ''}`}
              className="group rounded-xl border border-[#1e1e2a] bg-[#0f0f15] p-5 transition-colors hover:border-[#c9a96e]/40"
            >
              <div className="text-[10px] uppercase tracking-wider text-[#5a5a65]">
                ← {isZh ? '上一篇' : 'Previous'}
              </div>
              <div className="mt-1 text-sm font-medium text-[#e8e6e3] group-hover:text-[#c9a96e]">
                {prev.title}
              </div>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              href={`/blog/${next.slug}${isZh ? '?lang=zh' : ''}`}
              className="group rounded-xl border border-[#1e1e2a] bg-[#0f0f15] p-5 text-right transition-colors hover:border-[#c9a96e]/40"
            >
              <div className="text-[10px] uppercase tracking-wider text-[#5a5a65]">
                {isZh ? '下一篇' : 'Next'} →
              </div>
              <div className="mt-1 text-sm font-medium text-[#e8e6e3] group-hover:text-[#c9a96e]">
                {next.title}
              </div>
            </Link>
          ) : (
            <div />
          )}
        </nav>
      )}

      {/* CTA */}
      <div className="mt-16 rounded-2xl border border-[#c9a96e]/20 bg-gradient-to-br from-[#14141d] to-[#0f0f15] p-8 text-center">
        <h3 className="font-serif text-xl font-semibold text-[#e8e6e3]">
          {isZh ? '探索你自己的星盘' : 'Explore your own chart'}
        </h3>
        <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-[#a8a6a3]">
          {isZh
            ? '把理论付诸实践——免费生成本命盘，查看 10 颗行星、12 个宫位和主要相位。'
            : 'Put theory into practice — generate your free natal chart with 10 planets, 12 houses, and major aspects.'}
        </p>
        <Link
          href="/chart"
          className="mt-4 inline-block rounded-lg bg-[#c9a96e] px-5 py-2 text-sm font-medium text-[#0a0a0f] transition-colors hover:bg-[#b8964f]"
        >
          {isZh ? '生成本命盘' : 'Generate my chart'}
        </Link>
      </div>
    </article>
  )
}
