'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { BirthInfo } from '@/lib/astrology/engine'
import { useAuth } from './useAuth'

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
const MAX_PROFILES = 20

interface StoredProfile extends BirthInfo {
  id: string
  name: string
  createdAt: number
}

function mapCloudProfile(p: any): StoredProfile {
  return {
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
  }
}

function readLocalProfiles(): StoredProfile[] {
  try {
    const stored = localStorage.getItem('celestial_profiles')
    if (stored) return JSON.parse(stored)
  } catch {}
  return []
}

function writeLocalProfiles(profiles: StoredProfile[]) {
  localStorage.setItem('celestial_profiles', JSON.stringify(profiles))
}

export function useLocalProfile() {
  const [profiles, setProfiles] = useState<StoredProfile[]>([])
  const [loaded, setLoaded] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const { user } = useAuth()
  const prevUserIdRef = useRef<string | null>(null)

  useEffect(() => {
    const userId = user?.id || null
    const userIdChanged = prevUserIdRef.current !== userId
    prevUserIdRef.current = userId

    const loadProfiles = async () => {
      if (user) {
        setSyncing(true)
        try {
          const response = await fetch(`${BASE_PATH}/api/profiles`)
          const data = await response.json()
          if (data.success && data.profiles) {
            const cloudProfiles: StoredProfile[] = data.profiles.map(mapCloudProfile)
            const localProfiles = readLocalProfiles()

            const cloudIds = new Set(cloudProfiles.map(p => p.id))
            const localOnly = localProfiles.filter(p => !cloudIds.has(p.id))

            const remainingSlots = MAX_PROFILES - cloudProfiles.length
            if (localOnly.length > 0 && remainingSlots > 0) {
              const toUpload = localOnly
                .sort((a, b) => b.createdAt - a.createdAt)
                .slice(0, remainingSlots)

              for (const profile of toUpload) {
                try {
                  await fetch(`${BASE_PATH}/api/profiles`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      id: profile.id,
                      name: profile.name,
                      year: profile.year,
                      month: profile.month,
                      day: profile.day,
                      hour: profile.hour,
                      minute: profile.minute,
                      latitude: profile.latitude,
                      longitude: profile.longitude,
                      timezoneOffset: profile.timezoneOffset,
                      hasExactTime: profile.hasExactTime,
                    }),
                  })
                } catch (e) {
                  console.error('[profiles] sync upload failed:', profile.id, e)
                }
              }

              const refreshRes = await fetch(`${BASE_PATH}/api/profiles`)
              const refreshData = await refreshRes.json()
              if (refreshData.success && refreshData.profiles) {
                const finalProfiles: StoredProfile[] = refreshData.profiles.map(mapCloudProfile)
                setProfiles(finalProfiles)
                writeLocalProfiles(finalProfiles)
                setSyncing(false)
                setLoaded(true)
                return
              }
            }

            setProfiles(cloudProfiles)
            writeLocalProfiles(cloudProfiles)
          }
        } catch {
          const localProfiles = readLocalProfiles()
          setProfiles(localProfiles)
        }
        setSyncing(false)
      } else {
        const localProfiles = readLocalProfiles()
        setProfiles(localProfiles)
      }
      setLoaded(true)
    }

    loadProfiles()
  }, [user])

  const save = useCallback(async (data: Omit<StoredProfile, 'id' | 'createdAt'> & { id?: string }) => {
    const id = data.id || crypto.randomUUID()
    const newProfile: StoredProfile = {
      ...data,
      id,
      createdAt: Date.now(),
    }
    const updated = [...profiles, newProfile]
    setProfiles(updated)
    writeLocalProfiles(updated)

    if (user) {
      try {
        const res = await fetch(`${BASE_PATH}/api/profiles`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id,
            name: data.name,
            year: data.year,
            month: data.month,
            day: data.day,
            hour: data.hour,
            minute: data.minute,
            latitude: data.latitude,
            longitude: data.longitude,
            timezoneOffset: data.timezoneOffset,
            hasExactTime: data.hasExactTime,
          }),
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
    writeLocalProfiles(updated)

    if (user) {
      try {
        await fetch(`${BASE_PATH}/api/profiles/${id}`, {
          method: 'DELETE',
        })
      } catch {}
    }
  }, [profiles, user])

  return { profiles, save, remove, loaded, syncing, maxProfiles: MAX_PROFILES }
}
