'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { useTranslation } from '@/hooks/useTranslation'

function ErrorContent() {
  const params = useSearchParams()
  const error = params.get('error')
  const errorDescription = params.get('error_description')
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] p-4">
      <div className="w-full max-w-md rounded-xl border border-[#1e1e2a] bg-[#0f0f15] p-8 text-center shadow-2xl">
        <div className="mb-4 text-5xl">⚠️</div>
        <h1 className="mb-3 font-serif text-2xl text-[#c9a96e]">
          {t('auth.authFailed')}
        </h1>
        <p className="mb-2 text-sm text-[#a8a6a3]">
          {t('auth.couldNotComplete')}
        </p>
        {error && (
          <p className="mb-1 rounded-lg bg-[#14141d] px-3 py-2 text-xs text-red-400">
            {error}
          </p>
        )}
        {errorDescription && (
          <p className="mb-4 text-xs text-[#6a6865]">{errorDescription}</p>
        )}
        <div className="mt-6 space-y-2">
          <Link
            href="/auth/signin"
            className="block rounded-lg bg-[#c9a96e] px-4 py-2 text-sm font-medium text-black transition hover:bg-[#b8964f]"
          >
            {t('auth.backToSignin')}
          </Link>
          <Link
            href="/"
            className="block text-xs text-[#6a6865] transition hover:text-[#a8a6a3]"
          >
            {t('auth.returnHome')}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function AuthCodeErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0f]" />}>
      <ErrorContent />
    </Suspense>
  )
}
