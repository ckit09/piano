import React, { useState } from 'react'
import { getAllSongs } from '@/lib/songs'
import { useLearnModeStore } from '@/store/learnModeStore'
import { SongSelector } from './SongSelector'
import { Guidance } from './Guidance'
import { ScoreBoard } from './ScoreBoard'
import { Piano } from '../Piano'
import { getAudioEngine } from '@/lib/audioEngine'

export const LearnMode: React.FC = () => {
  const {
    currentSongId,
    guide,
    isPlaying,
    accuracy,
    tempo,
    loadSong,
    recordAttempt,
    resetSong,
  } = useLearnModeStore()

  const songs = getAllSongs()
  const audioEngine = getAudioEngine()

  const handleSongSelect = (songId: string) => {
    if (songId) {
      loadSong(songId)
    }
  }

  const handlePianoNoteOn = (midiNote: number) => {
    if (!guide || !currentSongId) return

    const guidance = guide.getCurrentGuidance()
    const isCorrect = midiNote === guidance.nextMidiNote

    recordAttempt(midiNote, isCorrect)

    if (!isCorrect) {
      // Wrong note - visual feedback via Piano component
      audioEngine.setMasterVolume(0.1) // Quieter wrong note
    } else {
      audioEngine.setMasterVolume(0.2) // Normal volume for correct
    }
  }

  const handleReset = () => {
    resetSong()
  }

  const highlightedNotes = guide
    ? (new Set([guide.getCurrentGuidance().nextMidiNote]) as Set<number>)
    : (new Set() as Set<number>)

  return (
    <div className="flex flex-col gap-6 p-6 bg-gradient-to-b from-gray-800 to-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold">Learn Mode</h1>

      {!currentSongId ? (
        <SongSelector songs={songs} onSelectSong={handleSongSelect} />
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {songs.find((s) => s.id === currentSongId)?.title}
            </h2>
            <button
              onClick={() => {
                loadSong('')
              }}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
            >
              Change Song
            </button>
          </div>

          <Guidance guide={guide} tempo={tempo} />
          <ScoreBoard accuracy={accuracy} progress={guide?.getCurrentGuidance().progress || 0} />

          <div className="flex justify-center">
            <Piano
              onNoteOn={handlePianoNoteOn}
              highlightedNotes={highlightedNotes}
            />
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded font-bold"
            >
              Reset
            </button>
            {guide?.isComplete() && (
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded font-bold"
              >
                Song Complete! Try Again
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
