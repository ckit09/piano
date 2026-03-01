import { create } from 'zustand'
import { LearningGuide } from '@/lib/learningGuide'
import { Song, getSong } from '@/lib/songs'

interface LearnModeStore {
  currentSongId: string | null
  guide: LearningGuide | null
  isPlaying: boolean
  accuracy: number
  tempo: number

  loadSong: (songId: string) => Song | null
  setIsPlaying: (playing: boolean) => void
  recordAttempt: (midiNote: number, isCorrect: boolean) => boolean
  resetSong: () => void
  skipToNextNote: () => void
  skipToPreviousNote: () => void
  updateTempo: (tempo: number) => void
}

export const useLearnModeStore = create<LearnModeStore>((set, get) => ({
  currentSongId: null,
  guide: null,
  isPlaying: false,
  accuracy: 0,
  tempo: 120,

  loadSong: (songId: string) => {
    if (!songId) {
      set({
        currentSongId: null,
        guide: null,
        isPlaying: false,
      })
      return null
    }

    const song = getSong(songId)
    if (!song) return null

    const guide = new LearningGuide(song)
    set({
      currentSongId: songId,
      guide,
      isPlaying: false,
      accuracy: 100,
      tempo: song.tempo,
    })
    return song
  },

  setIsPlaying: (playing: boolean) => {
    set({ isPlaying: playing })
  },

  recordAttempt: (midiNote: number, isCorrect: boolean) => {
    const state = get()
    if (!state.guide) return false

    const success = state.guide.recordNoteAttempt(midiNote, isCorrect)
    const newAccuracy = state.guide.getAccuracy()
    const newTempo = state.guide.getCurrentTempo(state.tempo)

    set({
      accuracy: newAccuracy,
      tempo: newTempo,
    })

    return success
  },

  resetSong: () => {
    const state = get()
    if (state.currentSongId && state.guide) {
      state.guide.reset()
      const song = getSong(state.currentSongId)
      set({
        accuracy: 100,
        tempo: song?.tempo || 120,
        isPlaying: false,
      })
    }
  },

  skipToNextNote: () => {
    const state = get()
    state.guide?.skipToNextNote()
    set({ accuracy: state.guide?.getAccuracy() || 0 })
  },

  skipToPreviousNote: () => {
    const state = get()
    state.guide?.skipToPreviousNote()
    set({ accuracy: state.guide?.getAccuracy() || 0 })
  },

  updateTempo: (tempo: number) => {
    set({ tempo: Math.max(40, Math.min(220, tempo)) })
  },
}))
