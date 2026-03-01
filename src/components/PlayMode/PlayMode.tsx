import React, { useState, useEffect } from 'react'
import { Piano } from '../Piano'
import { usePlayModeStore } from '@/store/playModeStore'
import { getAudioEngine } from '@/lib/audioEngine'
import { Recorder } from '@/lib/recorder'

export const PlayMode: React.FC = () => {
  const {
    recorder,
    isRecording,
    recordings,
    currentInstrument,
    tempo,
    startRecording,
    stopRecording,
    setInstrument,
    setTempo,
    deleteRecording,
    exportAsJSON,
    importFromJSON,
  } = usePlayModeStore()

  const [showImport, setShowImport] = useState(false)
  const [importInput, setImportInput] = useState('')

  const audioEngine = getAudioEngine()

  useEffect(() => {
    audioEngine.setInstrument(currentInstrument)
  }, [currentInstrument, audioEngine])

  const handleImport = () => {
    if (importFromJSON(importInput)) {
      setImportInput('')
      setShowImport(false)
    } else {
      alert('Invalid JSON format')
    }
  }

  const handleExport = () => {
    const json = exportAsJSON()
    const element = document.createElement('a')
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(json)}`)
    element.setAttribute('download', 'piano-recordings.json')
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="flex flex-col gap-6 p-6 bg-gradient-to-b from-gray-800 to-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold">Play Mode</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-700 rounded-lg p-4">
        <div>
          <label className="block text-sm text-gray-300 mb-2">Instrument</label>
          <select
            value={currentInstrument}
            onChange={(e) => setInstrument(e.target.value as any)}
            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white"
          >
            <option value="piano">Piano</option>
            <option value="synth">Synth</option>
            <option value="organ">Organ</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-2">Tempo (BPM)</label>
          <input
            type="number"
            value={tempo}
            onChange={(e) => setTempo(Number(e.target.value))}
            min="40"
            max="220"
            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`flex-1 px-4 py-2 rounded font-bold transition-colors ${
              isRecording
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isRecording ? '⏹ Stop Recording' : '⏺ Start Recording'}
          </button>
        </div>
      </div>

      <div className="flex justify-center">
        <Piano onNoteOn={() => {}} />
      </div>

      {recordings.length > 0 && (
        <div className="bg-gray-700 rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4">Recordings ({recordings.length})</h2>
          <div className="space-y-2">
            {recordings.map((recording, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-600 p-3 rounded"
              >
                <div>
                  <span className="font-semibold">Recording #{index + 1}</span>
                  <span className="text-sm text-gray-300 ml-4">
                    {recording.notes.length} notes • {Math.round(recording.totalDuration / 1000)}s
                  </span>
                </div>
                <button
                  onClick={() => deleteRecording(index)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleExport}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-bold"
            >
              📥 Export as JSON
            </button>
            <button
              onClick={() => setShowImport(!showImport)}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-bold"
            >
              📤 Import JSON
            </button>
          </div>
        </div>
      )}

      {showImport && (
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-bold mb-2">Import Recordings</h3>
          <textarea
            value={importInput}
            onChange={(e) => setImportInput(e.target.value)}
            className="w-full h-24 px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white font-mono text-sm"
            placeholder="Paste JSON here..."
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleImport}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded font-bold"
            >
              Import
            </button>
            <button
              onClick={() => setShowImport(false)}
              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="text-sm text-gray-400 mt-4">
        <p>💡 Tip: Use your keyboard to play (Z-M for right hand, A-; for left hand) or click the keys</p>
      </div>
    </div>
  )
}
