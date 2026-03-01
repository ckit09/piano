export interface Song {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  tempo: number // Starting tempo in BPM
  notes: number[] // MIDI notes
  durations: number[] // Note durations in beats
}

// MIDI note mapping for reference:
// C3=36, D3=38, E3=40, F3=41, G3=43, A3=45, B3=47
// C4=48, D4=50, E4=52, F4=53, G4=55, A4=57, B4=59
// C5=60, D5=62, E5=64, F5=65, G5=67, A5=69, B5=71

export const SONGS: Record<string, Song> = {
  mary: {
    id: 'mary',
    title: 'Mary Had a Little Lamb',
    description: 'A classic nursery rhyme',
    difficulty: 'easy',
    tempo: 120,
    notes: [
      64, 62, 60, 62, 64, 64, 64, // Mary had a little lamb
      62, 62, 62, 64, 67, 67, // little lamb, little lamb
      64, 62, 60, 62, 64, 64, 64, 64, 64, 62, 62, 64, 62, 60 // Mary had a little lamb, its fleece was white as snow
    ],
    durations: [1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2]
  },
  jingle: {
    id: 'jingle',
    title: 'Jingle Bells',
    description: 'A festive holiday song',
    difficulty: 'medium',
    tempo: 130,
    notes: [
      64, 64, 64, 64, 64, 64, 64, 67, 60, 62, 64, // Jingle bells, jingle bells
      65, 65, 65, 65, 65, 64, 64, 64, 64, 62, 62, 64, 62, 67, // Jingle all the way
      64, 64, 64, 64, 64, 64, 64, 67, 60, 62, 64, // Oh what fun it is to ride
      65, 65, 65, 65, 65, 64, 64, 64, 64, 64, 62, 62, 64, 62, 67 // In a one horse open sleigh
    ],
    durations: [1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2]
  },
  happy: {
    id: 'happy',
    title: 'Happy Birthday',
    description: 'The classic birthday song',
    difficulty: 'easy',
    tempo: 120,
    notes: [
      60, 60, 62, 60, 65, 64, // Happy birthday to you
      60, 60, 62, 60, 67, 65, // Happy birthday to you
      60, 60, 72, 69, 65, 64, 62, // Happy birthday dear (name)
      70, 70, 69, 65, 67, 65 // Happy birthday to you
    ],
    durations: [1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2]
  },
  tenoyowai: {
    id: 'tenoyowai',
    title: '天ノ弱 (Teno Yowai)',
    description: 'A beautiful Japanese song',
    difficulty: 'hard',
    tempo: 100,
    notes: [
      60, 62, 64, 62, 60, 62, 64, 65, 64, 62, 64, 65, 67, 65, 64,
      62, 60, 62, 64, 62, 60, 62, 64, 65, 64, 62, 60, 62, 64, 65
    ],
    durations: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2]
  }
}

export function getSong(id: string): Song | undefined {
  return SONGS[id]
}

export function getAllSongs(): Song[] {
  return Object.values(SONGS)
}
