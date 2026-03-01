import React, { useEffect, useRef, useState } from 'react'
import { getAudioEngine } from '@/lib/audioEngine'

interface PianoProps {
  onNoteOn?: (midiNote: number) => void
  onNoteOff?: (midiNote: number) => void
  highlightedNotes?: Set<number>
  disableInput?: boolean
}

// 25 keys from C3 (36) to C5 (60)
const PIANO_KEYS = Array.from({ length: 25 }, (_, i) => i + 48)
const KEY_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const OCTAVE_START = 4

// Computer keyboard to MIDI note mapping - organized for ergonomic hand position
// Total: 25 keys from C4 to C6
const KEY_MAP: Record<string, number> = {
  // ===== PRIMARY POSITION (Home Row - Most Comfortable) =====
  // LEFT HAND - bottom white keys (C4-E4)
  'a': 48, // C4
  's': 50, // D4
  'd': 52, // E4
  // CENTER - middle white keys (F4-B4)
  'f': 53, // F4
  'g': 55, // G4
  'h': 57, // A4
  // RIGHT HAND - upper white keys (B4-E5)
  'j': 59, // B4
  'k': 60, // C5
  'l': 62, // D5
  ';': 64, // E5

  // ===== EXTENDED REACH (Bottom Row) =====
  // More white keys for higher octave
  '\'': 65, // F5
  'm': 67, // G5
  ',': 69, // A5
  '.': 71, // B5
  '/': 72, // C6

  // ===== SHARPS/FLATS (Top Row - Number keys) =====
  // Easily accessible for chromatic play
  'q': 49,  // C#4
  'w': 51,  // D#4
  'e': 54,  // F#4
  'r': 56,  // G#4
  't': 58,  // A#4
  'y': 61,  // C#5
  'u': 63,  // D#5
  'i': 66,  // F#5
  'o': 68,  // G#5
  'p': 70,  // A#5
}

// Create reverse mapping: MIDI note to keyboard keys (first occurrence)
const MIDI_TO_KEY_MAP: Record<number, string> = {}
const MIDI_TO_ALL_KEYS: Record<number, string[]> = {}

for (const [key, midiNote] of Object.entries(KEY_MAP)) {
  const note = Number(midiNote)
  if (!MIDI_TO_ALL_KEYS[note]) {
    MIDI_TO_ALL_KEYS[note] = []
  }
  MIDI_TO_ALL_KEYS[note].push(key.toUpperCase())
  if (!MIDI_TO_KEY_MAP[note]) {
    MIDI_TO_KEY_MAP[note] = key.toUpperCase()
  }
}

export const Piano: React.FC<PianoProps> = ({
  onNoteOn,
  onNoteOff,
  highlightedNotes,
  disableInput = false,
}) => {
  const [pressedKeys, setPressedKeys] = useState<Set<number>>(new Set())
  const [animatingKeys, setAnimatingKeys] = useState<Set<number>>(new Set())
  const audioEngine = getAudioEngine()
  const activeTouchesRef = useRef<Map<number, number>>(new Map())
  const animationTimeoutRef = useRef<Map<number, NodeJS.Timeout>>(new Map())

    const triggerAnimation = (midiNote: number) => {
    // Clear any existing timeout for this key
    const existingTimeout = animationTimeoutRef.current.get(midiNote)
    if (existingTimeout) clearTimeout(existingTimeout)

    // Add animation
    setAnimatingKeys((prev) => new Set([...prev, midiNote]))

    // Remove animation after it completes (longest animation is keyGlow at 400ms)
    const timeout = setTimeout(() => {
      setAnimatingKeys((prev) => {
        const next = new Set(prev)
        next.delete(midiNote)
        return next
      })
      animationTimeoutRef.current.delete(midiNote)
    }, 420)

    animationTimeoutRef.current.set(midiNote, timeout)
  }

  // Handle keyboard input
  useEffect(() => {
    if (disableInput) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      const midiNote = KEY_MAP[key]

      if (midiNote) {
        e.preventDefault()
        audioEngine.resume()
        // Always play the note for zero-latency on consecutive presses
        audioEngine.playNote(midiNote)
        onNoteOn?.(midiNote)
        triggerAnimation(midiNote)
        setPressedKeys((prev) => new Set([...prev, midiNote]))
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      const midiNote = KEY_MAP[key]

      if (midiNote) {
        audioEngine.stopNote(midiNote)
        onNoteOff?.(midiNote)
        setPressedKeys((prev) => {
          const next = new Set(prev)
          next.delete(midiNote)
          return next
        })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [pressedKeys, disableInput, onNoteOn, onNoteOff, audioEngine])

  const handleMouseDown = (midiNote: number) => {
    if (disableInput) return
    audioEngine.resume()
    audioEngine.playNote(midiNote)
    onNoteOn?.(midiNote)
    triggerAnimation(midiNote)
    setPressedKeys((prev) => new Set([...prev, midiNote]))
  }

  const handleMouseUp = (midiNote: number) => {
    audioEngine.stopNote(midiNote)
    onNoteOff?.(midiNote)
    setPressedKeys((prev) => {
      const next = new Set(prev)
      next.delete(midiNote)
      return next
    })
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLButtonElement>, midiNote: number) => {
    if (disableInput) return
    audioEngine.resume()
    audioEngine.playNote(midiNote)
    onNoteOn?.(midiNote)
    triggerAnimation(midiNote)
    setPressedKeys((prev) => new Set([...prev, midiNote]))

    // Track touch
    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches[i]
      activeTouchesRef.current.set(touch.identifier, midiNote)
    }
  }

  const handleTouchEnd = (e: React.TouchEvent<HTMLButtonElement>, midiNote: number) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i]
      const storedNote = activeTouchesRef.current.get(touch.identifier)
      if (storedNote === midiNote) {
        audioEngine.stopNote(midiNote)
        onNoteOff?.(midiNote)
        setPressedKeys((prev) => {
          const next = new Set(prev)
          next.delete(midiNote)
          return next
        })
        activeTouchesRef.current.delete(touch.identifier)
      }
    }
  }

  return (
    <div className="flex gap-1 p-6 bg-gray-900 rounded-lg shadow-lg overflow-x-auto justify-center">
      {PIANO_KEYS.map((midiNote) => {
        const keyIndex = midiNote % 12
        const octave = Math.floor(midiNote / 12)
        const keyName = KEY_NAMES[keyIndex]
        const isBlackKey = keyName.includes('#')
        const isPressed = pressedKeys.has(midiNote)
        const isHighlighted = highlightedNotes?.has(midiNote)
        const keyboardKeys = MIDI_TO_ALL_KEYS[midiNote] || []

        return (
          <div key={midiNote} className="relative flex flex-col items-center">
            <button
              onMouseDown={() => handleMouseDown(midiNote)}
              onMouseUp={() => handleMouseUp(midiNote)}
              onMouseLeave={() => handleMouseUp(midiNote)}
              onTouchStart={(e) => handleTouchStart(e, midiNote)}
              onTouchEnd={(e) => handleTouchEnd(e, midiNote)}
              disabled={disableInput}
              className={`
                focus:outline-none rounded-b flex flex-col items-center justify-between
                ${animatingKeys.has(midiNote) ? `piano-key-pressed piano-key-glow piano-key-flash ${isBlackKey ? 'piano-black-key-pressed' : 'piano-white-key-pressed'}` : ''}
                ${
                  isBlackKey
                    ? `w-10 h-28 ${animatingKeys.has(midiNote) ? '' : 'bg-gray-800'} border-2 border-gray-700 -mr-5 z-10 shadow-md
                       ${isPressed ? 'bg-gray-700 shadow-lg shadow-inset' : ''}
                       ${isHighlighted ? 'bg-yellow-500 shadow-lg shadow-yellow-400' : ''}`
                    : `w-14 h-36 ${animatingKeys.has(midiNote) ? '' : 'bg-white'} border-2 border-gray-400 shadow-md
                       ${isPressed ? 'bg-gray-50 shadow-lg' : ''}
                       ${isHighlighted ? 'bg-green-300 shadow-lg shadow-green-400' : ''}`
                }
              `}
              title={`${keyName}${octave}${keyboardKeys.length > 0 ? ` - Keys: ${keyboardKeys.join(', ')}` : ''}`}
            >
              {/* Note name and octave */}
              <div className={`flex flex-col items-center pt-2 font-bold ${
                isBlackKey ? 'text-white text-sm' : 'text-gray-900 text-base'
              }`}>
                <span className="leading-none">{keyName}</span>
                <span className="text-xs">{octave}</span>
              </div>

              {/* Keyboard shortcut */}
              <div className={`pb-1 font-mono text-xs font-bold ${
                isBlackKey ? 'text-yellow-300' : 'text-blue-600'
              } ${keyboardKeys.length > 1 ? 'text-center leading-tight' : ''}`}>
                {keyboardKeys.length > 0 ? (
                  keyboardKeys.map((k) => (
                    <div key={k}>{k}</div>
                  ))
                ) : (
                  <div className="text-gray-400 text-[10px]">—</div>
                )}
              </div>
            </button>
          </div>
        )
      })}
    </div>
  )
}
