import type { BlogPost } from '@/lib/blog'

interface Props {
  post: BlogPost
  appUrl: string
}

/**
 * Emits Article + FAQPage JSON-LD structured data for SEO.
 */
export default function BlogJsonLd({ post, appUrl }: Props) {
  const url = `${appUrl}/blog/${post.slug}${post.locale === 'zh' ? '?lang=zh' : ''}`

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.cover ? `${appUrl}${post.cover}` : `${appUrl}/favicon.svg`,
    datePublished: post.date,
    dateModified: post.updated || post.date,
    author: {
      '@type': 'Organization',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Horoscope SERO',
      logo: {
        '@type': 'ImageObject',
        url: `${appUrl}/favicon.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    keywords: post.tags.join(', '),
    inLanguage: post.locale === 'zh' ? 'zh-CN' : 'en-US',
  }

  const faqSchema =
    post.faqs && post.faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: post.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }
      : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </>
  )
}
