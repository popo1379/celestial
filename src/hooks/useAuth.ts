'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import type { User } from '@supabase/supabase-js'

const isSupabaseConfigured =
  typeof window !== 'undefined' &&
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = isSupabaseConfigured ? createClient() : null

  useEffect(() => {
    if (!supabase) {
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
  }, [])

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) return { error: new Error('Supabase not configured') }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    return { error }
  }, [supabase])

  const signInWithGithub = useCallback(async () => {
    if (!supabase) return { error: new Error('Supabase not configured') }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    return { error }
  }, [supabase])

  const signInWithEmail = useCallback(async (email: string) => {
    if (!supabase) return { error: new Error('Supabase not configured') }
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    return { error }
  }, [supabase])

  const signOut = useCallback(async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    router.push('/')
  }, [supabase, router])

  return { user, loading, signInWithGoogle, signInWithGithub, signInWithEmail, signOut }
}
