import React from 'react'

interface ScoreBoardProps {
  accuracy: number
  progress: number
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ accuracy, progress }) => {
  const getMasteryLevel = (acc: number) => {
    if (acc === 100) return 'Perfect!'
    if (acc >= 90) return 'Excellent!'
    if (acc >= 80) return 'Good!'
    if (acc >= 70) return 'Fair'
    return 'Keep Trying'
  }

  const getAccuracyColor = (acc: number) => {
    if (acc === 100) return 'text-yellow-300'
    if (acc >= 80) return 'text-green-400'
    if (acc >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="bg-gray-700 rounded-lg p-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm text-gray-400 mb-2">ACCURACY</h3>
          <div className={`text-4xl font-bold ${getAccuracyColor(accuracy)}`}>
            {accuracy}%
          </div>
          <div className="text-sm text-gray-300 mt-1">{getMasteryLevel(accuracy)}</div>
        </div>

        <div>
          <h3 className="text-sm text-gray-400 mb-2">MASTERY</h3>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded ${
                  i < Math.floor((accuracy / 100) * 5) ? 'bg-green-500' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
