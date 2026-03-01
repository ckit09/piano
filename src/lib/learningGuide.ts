import { Song } from './songs'

export interface HandPosition {
  hand: 'left' | 'right'
  finger: 'thumb' | 'index' | 'middle' | 'ring' | 'pinky'
  note: string
}

export interface Guidance {
  currentNoteIndex: number
  nextMidiNote: number
  nextNoteName: string
  handPosition: HandPosition
  progress: number // 0-1
}

export interface PerformanceEvent {
  noteIndex: number
  midiNote: number
  correct: boolean
  timestamp: number
}

// Simple finger position mapping (C4 start on left hand middle finger)
const FINGER_MAP: Record<number, HandPosition> = {
  48: { hand: 'left', finger: 'pinky', note: 'C4' },
  50: { hand: 'left', finger: 'ring', note: 'D4' },
  52: { hand: 'left', finger: 'middle', note: 'E4' },
  53: { hand: 'left', finger: 'index', note: 'F4' },
  55: { hand: 'left', finger: 'thumb', note: 'G4' },
  57: { hand: 'right', finger: 'thumb', note: 'A4' },
  59: { hand: 'right', finger: 'index', note: 'B4' },
  60: { hand: 'right', finger: 'middle', note: 'C5' },
  62: { hand: 'right', finger: 'ring', note: 'D5' },
  64: { hand: 'right', finger: 'pinky', note: 'E5' },
}

const MIDI_TO_NOTE: Record<number, string> = {
  48: 'C4', 50: 'D4', 52: 'E4', 53: 'F4', 55: 'G4',
  57: 'A4', 59: 'B4', 60: 'C5', 62: 'D5', 64: 'E5',
  65: 'F5', 67: 'G5', 69: 'A5', 71: 'B5', 72: 'C6'
}

export class LearningGuide {
  private song: Song
  private currentNoteIndex = 0
  private performanceHistory: PerformanceEvent[] = []

  constructor(song: Song) {
    this.song = song
  }

  getCurrentGuidance(): Guidance {
    const currentNote = this.song.notes[this.currentNoteIndex]
    const nextNote = this.song.notes[this.currentNoteIndex]
    const handPosition = FINGER_MAP[nextNote] || { hand: 'right', finger: 'thumb', note: MIDI_TO_NOTE[nextNote] || 'Unknown' }

    return {
      currentNoteIndex: this.currentNoteIndex,
      nextMidiNote: nextNote,
      nextNoteName: MIDI_TO_NOTE[nextNote] || `MIDI ${nextNote}`,
      handPosition,
      progress: this.currentNoteIndex / this.song.notes.length,
    }
  }

  recordNoteAttempt(midiNote: number, isCorrect: boolean): boolean {
    const expectedNote = this.song.notes[this.currentNoteIndex]
    const correct = midiNote === expectedNote

    this.performanceHistory.push({
      noteIndex: this.currentNoteIndex,
      midiNote,
      correct,
      timestamp: Date.now(),
    })

    if (correct) {
      this.currentNoteIndex++
      return true
    }
    return false
  }

  isComplete(): boolean {
    return this.currentNoteIndex >= this.song.notes.length
  }

  reset() {
    this.currentNoteIndex = 0
    this.performanceHistory = []
  }

  getAccuracy(): number {
    if (this.performanceHistory.length === 0) return 100
    const correct = this.performanceHistory.filter((e) => e.correct).length
    return Math.round((correct / this.performanceHistory.length) * 100)
  }

  getPerformanceHistory(): PerformanceEvent[] {
    return [...this.performanceHistory]
  }

  getCurrentTempo(baselineTempo: number): number {
    // Increase tempo by 10 BPM for each perfect playthrough
    const accuracy = this.getAccuracy()
    if (accuracy === 100) {
      return baselineTempo + 10
    }
    return baselineTempo
  }

  skipToNextNote() {
    if (!this.isComplete()) {
      this.currentNoteIndex++
    }
  }

  skipToPreviousNote() {
    if (this.currentNoteIndex > 0) {
      this.currentNoteIndex--
    }
  }
}
