import React from 'react'
import { Song } from '@/lib/songs'

interface SongSelectorProps {
  songs: Song[]
  onSelectSong: (songId: string) => void
}

const difficultyColors = {
  easy: 'bg-green-600 hover:bg-green-700',
  medium: 'bg-yellow-600 hover:bg-yellow-700',
  hard: 'bg-red-600 hover:bg-red-700',
}

export const SongSelector: React.FC<SongSelectorProps> = ({ songs, onSelectSong }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {songs.map((song) => (
        <button
          key={song.id}
          onClick={() => onSelectSong(song.id)}
          className={`p-6 rounded-lg text-left transition-transform hover:scale-105 ${difficultyColors[song.difficulty]}`}
        >
          <h3 className="text-xl font-bold mb-2">{song.title}</h3>
          <p className="text-sm mb-3">{song.description}</p>
          <div className="flex justify-between items-center text-xs">
            <span className="capitalize font-semibold">{song.difficulty}</span>
            <span>{song.notes.length} notes</span>
          </div>
        </button>
      ))}
    </div>
  )
}
