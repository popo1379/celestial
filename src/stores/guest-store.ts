import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BirthInfo } from '@/lib/astrology/engine'

interface GuestChartState {
  birthInfo: BirthInfo | null
  setBirthInfo: (info: BirthInfo) => void
  clearBirthInfo: () => void
}

export const useGuestChartStore = create<GuestChartState>()(
  persist(
    (set) => ({
      birthInfo: null,
      setBirthInfo: (info) => set({ birthInfo: info }),
      clearBirthInfo: () => set({ birthInfo: null }),
    }),
    {
      name: 'celestial-guest-chart',
    }
  )
)
