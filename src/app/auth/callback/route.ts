import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? `${BASE_PATH}/profile`
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  // Supabase may redirect here with an error param if the link is invalid/expired
  if (error) {
    const params = new URLSearchParams({
      error,
      ...(errorDescription ? { error_description: errorDescription } : {}),
    })
    return NextResponse.redirect(`${origin}${BASE_PATH}/auth/auth-code-error?${params.toString()}`)
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(`${origin}${next}`)
    const params = new URLSearchParams({
      error: 'session_exchange_failed',
      error_description: error.message,
    })
    return NextResponse.redirect(`${origin}${BASE_PATH}/auth/auth-code-error?${params.toString()}`)
  }

  return NextResponse.redirect(
    `${origin}${BASE_PATH}/auth/auth-code-error?error=missing_code`
  )
}
