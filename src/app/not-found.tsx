'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <div className="text-7xl sm:text-8xl font-bold text-[#c9a96e] mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
          404
        </div>
        <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#c9a96e]/60 to-transparent mx-auto mb-6" />
        <h1 className="text-xl sm:text-2xl font-semibold text-[#e8e6e3] mb-2">
          Page Not Found
        </h1>
        <p className="text-sm text-[#6a6865] mb-8 max-w-sm">
          The stars couldn&apos;t align for this page. It may have been moved or no longer exists.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#c9a96e] hover:bg-[#b8964f] text-[#0a0a0f] font-medium rounded-lg text-sm transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Back to Home
        </Link>
      </div>
    </div>
  )
}
