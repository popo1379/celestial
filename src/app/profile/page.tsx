import type { Metadata } from 'next'
import ProfileView from './page-view'

export const metadata: Metadata = {
  title: 'My Profile — Sun, Moon and Rising Saved Charts | Horoscope SERO',
  description:
    'Manage your saved birth charts. Track your sun, moon, and rising sign profiles, sync across devices, and access your free birth chart history anytime.',
  keywords: [
    'sun moon and rising',
    'sun moon rising sign',
    'big three astrology',
    'my profile',
    'saved birth chart',
    'birth chart profile',
    'free birth chart',
    'natal chart',
    'saved profiles',
    'my natal chart',
    'astrology profile',
    'chart history',
  ],
  openGraph: {
    title: 'My Profile — Saved Birth Charts | Horoscope SERO',
    description:
      'Manage your saved birth charts. Track your sun, moon, and rising sign profiles anytime.',
  },
  twitter: {
    card: 'summary',
    title: 'My Profile — Saved Birth Charts | Horoscope SERO',
    description: 'Manage your saved birth charts with sun, moon, and rising signs.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function ProfilePage() {
  return <ProfileView />
}
