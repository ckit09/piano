import { create } from 'zustand'

export type Mode = 'play' | 'learn'

interface ModeStore {
  mode: Mode
  setMode: (mode: Mode) => void
}

export const useModeStore = create<ModeStore>((set) => ({
  mode: 'play',
  setMode: (mode) => set({ mode }),
}))
