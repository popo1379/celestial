interface Props {
  url: string
  title: string
  isZh: boolean
}

export default function BlogShareBar({ url, title, isZh }: Props) {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const links = [
    {
      label: 'Twitter',
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      svg: (
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      ),
    },
    {
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      svg: (
        <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.393-.024c-.564 0-1.07.024-1.49.072-.543.054-.93.156-1.168.31a1.726 1.726 0 0 0-.547.566c-.165.273-.273.633-.324 1.083-.06.468-.09 1.05-.09 1.747v1.537h3.234l-.324 3.667h-2.91v7.98H9.101z" />
      ),
    },
    {
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      svg: (
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      ),
    },
  ]

  return (
    <div className="mt-8 flex items-center justify-between border-t border-[#1e1e2a] pt-6">
      <span className="text-xs text-[#6a6865]">
        {isZh ? '分享文章' : 'Share this post'}
      </span>
      <div className="flex items-center gap-3">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            className="text-[#6a6865] transition-colors hover:text-[#c9a96e]"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              {link.svg}
            </svg>
          </a>
        ))}
      </div>
    </div>
  )
}
