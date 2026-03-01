import { create } from 'zustand'
import { Recorder, Recording } from '@/lib/recorder'
import { InstrumentType } from '@/lib/audioEngine'

interface PlayModeStore {
  recorder: Recorder
  isRecording: boolean
  isPlaying: boolean
  recordings: Recording[]
  currentInstrument: InstrumentType
  tempo: number

  startRecording: () => void
  stopRecording: () => void
  clearRecording: () => void
  addRecording: (recording: Recording) => void
  deleteRecording: (index: number) => void
  setInstrument: (instrument: InstrumentType) => void
  setTempo: (tempo: number) => void
  setIsPlaying: (playing: boolean) => void
  exportAsJSON: () => string
  importFromJSON: (json: string) => boolean
}

export const usePlayModeStore = create<PlayModeStore>((set, get) => ({
  recorder: new Recorder(),
  isRecording: false,
  isPlaying: false,
  recordings: [],
  currentInstrument: 'piano',
  tempo: 120,

  startRecording: () => {
    const state = get()
    state.recorder.clear()
    state.recorder.start()
    set({ isRecording: true })
  },

  stopRecording: () => {
    const state = get()
    const recording = state.recorder.stop()
    state.addRecording(recording)
    set({ isRecording: false })
  },

  clearRecording: () => {
    const state = get()
    state.recorder.clear()
    set({ isRecording: false })
  },

  addRecording: (recording: Recording) => {
    set((state) => ({
      recordings: [...state.recordings, recording],
    }))
  },

  deleteRecording: (index: number) => {
    set((state) => ({
      recordings: state.recordings.filter((_, i) => i !== index),
    }))
  },

  setInstrument: (instrument: InstrumentType) => {
    set({ currentInstrument: instrument })
  },

  setTempo: (tempo: number) => {
    set({ tempo: Math.max(40, Math.min(220, tempo)) })
  },

  setIsPlaying: (playing: boolean) => {
    set({ isPlaying: playing })
  },

  exportAsJSON: () => {
    const state = get()
    return JSON.stringify(state.recordings, null, 2)
  },

  importFromJSON: (json: string) => {
    try {
      const recordings = JSON.parse(json) as Recording[]
      set({ recordings })
      return true
    } catch {
      return false
    }
  },
}))
