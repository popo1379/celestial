'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { BirthInfo } from '@/lib/astrology/engine'
import { useAuth } from './useAuth'

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
const MAX_PROFILES = 20
const DEFAULT_PROFILE_KEY = 'celestial_default_profile_id'

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

function readLocalDefaultId(): string | null {
  try {
    return localStorage.getItem(DEFAULT_PROFILE_KEY) || null
  } catch {
    return null
  }
}

function writeLocalDefaultId(id: string | null) {
  if (id) {
    localStorage.setItem(DEFAULT_PROFILE_KEY, id)
  } else {
    localStorage.removeItem(DEFAULT_PROFILE_KEY)
  }
}

async function fetchCloudDefaultId(): Promise<string | null> {
  try {
    const res = await fetch(`${BASE_PATH}/api/profiles/default`)
    if (!res.ok) return null
    const data = await res.json()
    if (data.success && data.profileId) return data.profileId
    return null
  } catch {
    return null
  }
}

async function setCloudDefaultId(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_PATH}/api/profiles/default`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: id }),
    })
    if (!res.ok) return false
    const data = await res.json()
    return !!data.success
  } catch {
    return false
  }
}

export function useLocalProfile() {
  const [profiles, setProfiles] = useState<StoredProfile[]>([])
  const [defaultId, setDefaultIdState] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const { user } = useAuth()
  const prevUserIdRef = useRef<string | null | undefined>(undefined)

  useEffect(() => {
    // Run whenever user changes (including null -> user, user -> null, userA -> userB)
    const currentUserId = user?.id || null
    if (prevUserIdRef.current === currentUserId) return
    prevUserIdRef.current = currentUserId

    const loadProfiles = async () => {
      setSyncing(true)
      try {
        if (user) {
          // Logged in: pull from cloud, then merge any local-only profiles up
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

              // Re-fetch to include uploaded profiles
              const refreshRes = await fetch(`${BASE_PATH}/api/profiles`)
              const refreshData = await refreshRes.json()
              if (refreshData.success && refreshData.profiles) {
                const finalProfiles: StoredProfile[] = refreshData.profiles.map(mapCloudProfile)
                setProfiles(finalProfiles)
                writeLocalProfiles(finalProfiles)
              } else {
                setProfiles(cloudProfiles)
                writeLocalProfiles(cloudProfiles)
              }
            } else {
              setProfiles(cloudProfiles)
              writeLocalProfiles(cloudProfiles)
            }

            // Fetch default profile id from cloud
            const cloudDefaultId = await fetchCloudDefaultId()
            if (cloudDefaultId) {
              setDefaultIdState(cloudDefaultId)
              writeLocalDefaultId(cloudDefaultId)
            } else {
              // No default set on cloud yet — keep local default (may be null)
              setDefaultIdState(readLocalDefaultId())
            }
          }
        } else {
          // Not logged in: use local only
          const localProfiles = readLocalProfiles()
          setProfiles(localProfiles)
          setDefaultIdState(readLocalDefaultId())
        }
      } catch {
        const localProfiles = readLocalProfiles()
        setProfiles(localProfiles)
        setDefaultIdState(readLocalDefaultId())
      }
      setSyncing(false)
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

    // If this is the first profile, auto-set as default
    const wasFirst = profiles.length === 0
    if (wasFirst) {
      setDefaultIdState(id)
      writeLocalDefaultId(id)
      if (user) {
        await setCloudDefaultId(id)
      }
    }

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

    // If removed profile was default, pick a new default (first remaining)
    if (defaultId === id) {
      const newDefault = updated[0]?.id || null
      setDefaultIdState(newDefault)
      writeLocalDefaultId(newDefault)
      if (user && newDefault) {
        await setCloudDefaultId(newDefault)
      } else if (user && !newDefault) {
        // No profiles left; clear cloud default (best-effort)
        // Reuse endpoint with empty — but our API requires a profileId,
        // so just leave cloud default as-is; it will be corrected on next set.
      }
    }

    if (user) {
      try {
        await fetch(`${BASE_PATH}/api/profiles/${id}`, {
          method: 'DELETE',
        })
      } catch {}
    }
  }, [profiles, user, defaultId])

  const setDefault = useCallback(async (id: string) => {
    // Only allow setting default to an existing profile
    if (!profiles.some(p => p.id === id)) return
    setDefaultIdState(id)
    writeLocalDefaultId(id)
    if (user) {
      await setCloudDefaultId(id)
    }
  }, [profiles, user])

  return {
    profiles,
    save,
    remove,
    loaded,
    syncing,
    maxProfiles: MAX_PROFILES,
    defaultId,
    setDefault,
  }
}
