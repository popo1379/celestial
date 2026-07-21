'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useCallback } from 'react'
import { useAuthStore } from '@/stores/auth-store'

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
import type { User } from '@supabase/supabase-js'

const isSupabaseConfigured =
  typeof window !== 'undefined' &&
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const isTestMode = typeof window !== 'undefined' && process.env.NEXT_PUBLIC_TEST_MODE === 'true'

export function useAuth() {
  const user = useAuthStore((s) => s.user)
  const loading = useAuthStore((s) => s.loading)
  const setUser = useAuthStore((s) => s.setUser)
  const setLoading = useAuthStore((s) => s.setLoading)
  const clear = useAuthStore((s) => s.clear)
  const router = useRouter()
  const supabase = isSupabaseConfigured ? createClient() : null

  useEffect(() => {
    if (!supabase) {
      if (isTestMode) {
        try {
          const stored = localStorage.getItem('test_user')
          if (stored) {
            setUser(JSON.parse(stored))
          }
        } catch {
          localStorage.removeItem('test_user')
        }
      }
      setLoading(false)
      return
    }

    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch {
        setUser(null)
      }
      setLoading(false)
    }

    fetchUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (event !== 'INITIAL_SESSION') {
        router.refresh()
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, setUser, setLoading, router])

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) return { error: new Error('Supabase not configured') }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}${BASE_PATH}/auth/callback` },
    })
    return { error }
  }, [supabase])

  const signInWithGithub = useCallback(async () => {
    if (!supabase) return { error: new Error('Supabase not configured') }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${window.location.origin}${BASE_PATH}/auth/callback` },
    })
    return { error }
  }, [supabase])

  const signInWithEmail = useCallback(async (email: string) => {
    if (!supabase) {
      if (!isTestMode) return { error: new Error('Supabase not configured') }
      const mockUser = {
        id: `test_${Date.now()}`,
        email: email,
        aud: 'authenticated',
        emailConfirmedAt: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {},
        identities: [],
        is_anonymous: false,
      } as User
      localStorage.setItem('test_user', JSON.stringify(mockUser))
      setUser(mockUser)
      return { error: null }
    }
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}${BASE_PATH}/auth/callback` },
    })
    return { error }
  }, [supabase, setUser])

  const signOut = useCallback(async () => {
    if (!supabase) {
      localStorage.removeItem('test_user')
      clear()
      router.push('/')
      return
    }
    await supabase.auth.signOut()
    clear()
    router.push('/')
  }, [supabase, router, clear])

  return { user, loading, signInWithGoogle, signInWithGithub, signInWithEmail, signOut }
}