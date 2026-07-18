'use client'

import { useState, useEffect, useCallback } from 'react'
import type { BirthInfo } from '@/lib/astrology/engine'
import { useAuth } from './useAuth'

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

interface StoredProfile extends BirthInfo {
  id: string
  name: string
  createdAt: number
}

export function useLocalProfile() {
  const [profiles, setProfiles] = useState<StoredProfile[]>([])
  const [loaded, setLoaded] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    const loadProfiles = async () => {
      if (user) {
        setSyncing(true)
        try {
          const response = await fetch(`${BASE_PATH}/api/profiles`)
          const data = await response.json()
          if (data.success && data.profiles) {
            const cloudProfiles: StoredProfile[] = data.profiles.map((p: any) => ({
              id: p.id,
              name: p.name,
              year: p.year,
              month: p.month,
              day: p.day,
              hour: p.hour,
              minute: p.minute,
              latitude: p.latitude,
              longitude: p.longitude,
              timezoneOffset: p.timezone_offset,
              hasExactTime: p.has_exact_time,
              createdAt: new Date(p.created_at).getTime(),
            }))
            setProfiles(cloudProfiles)
            localStorage.setItem('celestial_profiles', JSON.stringify(cloudProfiles))
          }
        } catch {
          const stored = localStorage.getItem('celestial_profiles')
          if (stored) {
            try {
              setProfiles(JSON.parse(stored))
            } catch {}
          }
        }
        setSyncing(false)
      } else {
        const stored = localStorage.getItem('celestial_profiles')
        if (stored) {
          try {
            setProfiles(JSON.parse(stored))
          } catch {}
        }
      }
      setLoaded(true)
    }

    loadProfiles()
  }, [user])

  const save = useCallback(async (data: Omit<StoredProfile, 'id' | 'createdAt'>) => {
    const newProfile: StoredProfile = { ...data, id: crypto.randomUUID(), createdAt: Date.now() }
    const updated = [...profiles, newProfile]
    setProfiles(updated)
    localStorage.setItem('celestial_profiles', JSON.stringify(updated))

    if (user) {
      try {
        const res = await fetch(`${BASE_PATH}/api/profiles`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        if (!res.ok) {
          const errText = await res.text().catch(() => '')
          console.error('[profiles] POST failed:', res.status, errText)
        }
      } catch (e) {
        console.error('[profiles] POST error:', e)
      }
    }

    return newProfile
  }, [profiles, user])

  const remove = useCallback(async (id: string) => {
    const updated = profiles.filter(p => p.id !== id)
    setProfiles(updated)
    localStorage.setItem('celestial_profiles', JSON.stringify(updated))

    if (user) {
      try {
        await fetch(`${BASE_PATH}/api/profiles/${id}`, {
          method: 'DELETE',
        })
      } catch {}
    }
  }, [profiles, user])

  return { profiles, save, remove, loaded, syncing }
}
