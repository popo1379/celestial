import { NextResponse } from 'next/server'
import { getProfilesForUser, createProfile, deleteProfile } from '@/lib/supabase/profiles'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const profiles = await getProfilesForUser(user.id)
  return NextResponse.json({ success: true, profiles })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { name, year, month, day, hour, minute, latitude, longitude, timezoneOffset, hasExactTime } = body

  if (!name || !year || !month || !day) {
    return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
  }

  const profile = await createProfile(user.id, {
    name,
    year,
    month,
    day,
    hour,
    minute,
    latitude,
    longitude,
    timezone_offset: timezoneOffset,
    has_exact_time: hasExactTime,
  })

  if (profile) {
    return NextResponse.json({ success: true, profile }, { status: 201 })
  }

  return NextResponse.json({ success: false, error: 'Failed to create profile' }, { status: 500 })
}

export async function DELETE(request: Request) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { pathname } = new URL(request.url)
  const profileId = pathname.split('/').pop()

  if (!profileId) {
    return NextResponse.json({ success: false, error: 'Profile ID required' }, { status: 400 })
  }

  await deleteProfile(user.id, profileId)
  return NextResponse.json({ success: true })
}
