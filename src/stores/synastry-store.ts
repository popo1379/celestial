import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BirthInfo } from '@/lib/astrology/engine'

interface SynastryState {
  personA: BirthInfo | null
  personB: BirthInfo | null
  setPersonA: (info: BirthInfo) => void
  setPersonB: (info: BirthInfo) => void
  clear: () => void
}

export const useSynastryStore = create<SynastryState>()(
  persist(
    (set) => ({
      personA: null,
      personB: null,
      setPersonA: (info) => set({ personA: info }),
      setPersonB: (info) => set({ personB: info }),
      clear: () => set({ personA: null, personB: null }),
    }),
    {
      name: 'celestial-synastry',
    }
  )
)
