'use server'

import { createClient } from './server'
import type { BirthInfo } from '@/lib/astrology/engine'

export interface Profile {
  id: string
  user_id: string
  name: string
  year: number
  month: number
  day: number
  hour?: number
  minute?: number
  latitude?: number
  longitude?: number
  timezone_offset?: number
  has_exact_time?: boolean
  created_at: string
  updated_at: string
}

export async function getProfilesForUser(userId: string): Promise<Profile[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return data || []
}

export async function createProfile(
  userId: string,
  data: Omit<Profile, 'id' | 'user_id' | 'created_at' | 'updated_at'> & { id?: string }
): Promise<Profile | null> {
  const supabase = await createClient()
  const insertData: Record<string, any> = {
    user_id: userId,
    ...data,
  }
  if (data.id) {
    insertData.id = data.id
  }
  const { data: profile } = await supabase
    .from('profiles')
    .insert(insertData)
    .select('*')
    .single()
  return profile
}

export async function deleteProfile(userId: string, profileId: string): Promise<void> {
  const supabase = await createClient()
  await supabase
    .from('profiles')
    .delete()
    .eq('user_id', userId)
    .eq('id', profileId)
}

export async function updateProfile(
  userId: string,
  profileId: string,
  data: Partial<Omit<Profile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<Profile | null> {
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .update(data)
    .eq('user_id', userId)
    .eq('id', profileId)
    .select('*')
    .single()
  return profile
}
