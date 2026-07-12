'use client'
import { useState, useEffect, useCallback } from 'react'
import type { BirthInfo } from '@/lib/astrology/engine'

interface StoredProfile extends BirthInfo {
  id: string
  name: string
  createdAt: number
}

export function useLocalProfile() {
  const [profiles, setProfiles] = useState<StoredProfile[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('celestial_profiles')
    if (stored) {
      try { setProfiles(JSON.parse(stored)) } catch {}
    }
    setLoaded(true)
  }, [])

  const save = useCallback((data: Omit<StoredProfile, 'id' | 'createdAt'>) => {
    const newProfile: StoredProfile = { ...data, id: crypto.randomUUID(), createdAt: Date.now() }
    const updated = [...profiles, newProfile]
    setProfiles(updated)
    localStorage.setItem('celestial_profiles', JSON.stringify(updated))
    return newProfile
  }, [profiles])

  const remove = useCallback((id: string) => {
    const updated = profiles.filter(p => p.id !== id)
    setProfiles(updated)
    localStorage.setItem('celestial_profiles', JSON.stringify(updated))
  }, [profiles])

  return { profiles, save, remove, loaded }
}
