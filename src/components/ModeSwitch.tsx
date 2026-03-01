import React from 'react'
import { useModeStore } from '@/store/modeStore'

export const ModeSwitch: React.FC = () => {
  const { mode, setMode } = useModeStore()

  return (
    <div className="p-4 bg-gray-900 border-b border-gray-700">
      <div className="flex gap-4 max-w-6xl mx-auto">
        <button
          onClick={() => setMode('play')}
          className={`px-6 py-3 rounded-lg font-bold transition-colors ${
            mode === 'play'
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
          }`}
        >
          🎹 Play Mode
        </button>
        <button
          onClick={() => setMode('learn')}
          className={`px-6 py-3 rounded-lg font-bold transition-colors ${
            mode === 'learn'
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
          }`}
        >
          📖 Learn Mode
        </button>
      </div>
    </div>
  )
}
