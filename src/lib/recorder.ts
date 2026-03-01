export interface Recording {
  notes: Array<{
    midiNote: number
    startTime: number
    duration: number
  }>
  totalDuration: number
  tempo: number
}

export class Recorder {
  private isRecording = false
  private startTime = 0
  private notes: Array<{ midiNote: number; startTime: number; endTime?: number }> = []

  start() {
    this.isRecording = true
    this.startTime = performance.now()
    this.notes = []
  }

  stop(): Recording {
    this.isRecording = false
    const totalDuration = performance.now() - this.startTime

    // Convert to note objects with duration
    const recordedNotes = this.notes.map((note) => ({
      midiNote: note.midiNote,
      startTime: note.startTime - this.startTime,
      duration: (note.endTime || performance.now()) - note.startTime,
    }))

    return {
      notes: recordedNotes,
      totalDuration,
      tempo: 120, // Default tempo
    }
  }

  recordNoteOn(midiNote: number) {
    if (this.isRecording) {
      this.notes.push({
        midiNote,
        startTime: performance.now(),
      })
    }
  }

  recordNoteOff(midiNote: number) {
    if (this.isRecording) {
      // Find the most recent note with this midiNote and set its end time
      for (let i = this.notes.length - 1; i >= 0; i--) {
        if (this.notes[i].midiNote === midiNote && this.notes[i].endTime === undefined) {
          this.notes[i].endTime = performance.now()
          break
        }
      }
    }
  }

  clear() {
    this.notes = []
    this.isRecording = false
  }

  getRecording(): Recording {
    if (this.isRecording) {
      return this.stop()
    }
    const recordedNotes = this.notes.map((note) => ({
      midiNote: note.midiNote,
      startTime: note.startTime - this.startTime,
      duration: (note.endTime || performance.now()) - note.startTime,
    }))
    const totalDuration = Math.max(...recordedNotes.map((n) => n.startTime + n.duration), 0)
    return {
      notes: recordedNotes,
      totalDuration,
      tempo: 120,
    }
  }

  isActive(): boolean {
    return this.isRecording
  }
}
