import React from 'react'
import { useModeStore } from '@/store/modeStore'
import { ModeSwitch } from '@/components/ModeSwitch'
import { PlayMode } from '@/components/PlayMode/PlayMode'
import { LearnMode } from '@/components/LearnMode/LearnMode'

function App() {
  const { mode } = useModeStore()

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-900">
      <ModeSwitch />
      <div className="flex-1 overflow-auto">
        {mode === 'play' ? <PlayMode /> : <LearnMode />}
      </div>
    </div>
  )
}

export default App
