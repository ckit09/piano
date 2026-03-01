import React from 'react'
import { LearningGuide } from '@/lib/learningGuide'

interface GuidanceProps {
  guide: LearningGuide | null
  tempo: number
}

const fingerNames = {
  thumb: '👍 Thumb',
  index: '☝️ Index',
  middle: '☝️ Middle',
  ring: '👉 Ring',
  pinky: '👉 Pinky',
}

export const Guidance: React.FC<GuidanceProps> = ({ guide, tempo }) => {
  if (!guide) {
    return <div>Select a song to begin</div>
  }

  const guidance = guide.getCurrentGuidance()

  return (
    <div className="bg-gray-700 rounded-lg p-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm text-gray-400 mb-2">NEXT NOTE</h3>
          <div className="text-4xl font-bold text-green-400">
            {guidance.nextNoteName}
          </div>
        </div>

        <div>
          <h3 className="text-sm text-gray-400 mb-2">FINGER POSITION</h3>
          <div className="text-xl">
            {guidance.handPosition.hand === 'left' ? '🖐️ LEFT HAND' : '🖐️ RIGHT HAND'}
          </div>
          <div className="text-lg font-bold text-blue-400">
            {fingerNames[guidance.handPosition.finger]}
          </div>
        </div>

        <div>
          <h3 className="text-sm text-gray-400 mb-2">CURRENT TEMPO</h3>
          <div className="text-3xl font-bold text-yellow-400">
            {tempo} BPM
          </div>
        </div>

        <div>
          <h3 className="text-sm text-gray-400 mb-2">PROGRESS</h3>
          <div className="w-full bg-gray-600 rounded h-4">
            <div
              className="bg-green-500 h-4 rounded transition-all"
              style={{ width: `${guidance.progress * 100}%` }}
            />
          </div>
          <div className="text-sm mt-1">
            {`${Math.round(guidance.progress * 100)}%`}
          </div>
        </div>
      </div>
    </div>
  )
}
