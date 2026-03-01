export type WaveType = 'sine' | 'square' | 'triangle'
export type InstrumentType = 'piano' | 'synth' | 'organ'

interface OscillatorSettings {
  waveType: WaveType
  attackTime: number
  decayTime: number
  sustainLevel: number
  releaseTime: number
}

const INSTRUMENT_SETTINGS: Record<InstrumentType, OscillatorSettings> = {
  piano: {
    waveType: 'sine',
    attackTime: 0.01,
    decayTime: 0.3,
    sustainLevel: 0.0,
    releaseTime: 1.0,
  },
  synth: {
    waveType: 'square',
    attackTime: 0.1,
    decayTime: 0.2,
    sustainLevel: 0.7,
    releaseTime: 0.3,
  },
  organ: {
    waveType: 'sine',
    attackTime: 0.05,
    decayTime: 0.0,
    sustainLevel: 1.0,
    releaseTime: 0.5,
  },
}

// MIDI note to frequency conversion
function noteToFrequency(midiNote: number): number {
  return 440 * Math.pow(2, (midiNote - 69) / 12)
}

export class AudioEngine {
  private audioContext: AudioContext
  private activeOscillators: Map<number, { osc: OscillatorNode; gain: GainNode; isActive: boolean }>
  private masterGain: GainNode
  private currentInstrument: InstrumentType = 'piano'

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    this.activeOscillators = new Map()
    this.masterGain = this.audioContext.createGain()
    this.masterGain.gain.value = 0.2
    this.masterGain.connect(this.audioContext.destination)
  }

  setInstrument(instrument: InstrumentType) {
    this.currentInstrument = instrument
  }

  playNote(midiNote: number, velocity: number = 1.0) {
    // If note is already playing, stop it first for zero-latency replay
    const entry = this.activeOscillators.get(midiNote)
    if (entry && entry.isActive) {
      // Immediately stop the current note without release time
      entry.gain.gain.cancelScheduledValues(this.audioContext.currentTime)
      entry.gain.gain.setValueAtTime(0, this.audioContext.currentTime)
      entry.osc.stop(this.audioContext.currentTime)
      entry.isActive = false
      this.activeOscillators.delete(midiNote)
    }

    const settings = INSTRUMENT_SETTINGS[this.currentInstrument]
    const frequency = noteToFrequency(midiNote)

    const osc = this.audioContext.createOscillator()
    osc.type = settings.waveType
    osc.frequency.value = frequency

    const gain = this.audioContext.createGain()
    gain.gain.setValueAtTime(0, this.audioContext.currentTime)
    gain.gain.linearRampToValueAtTime(
      velocity * 0.3,
      this.audioContext.currentTime + settings.attackTime
    )
    gain.gain.linearRampToValueAtTime(
      settings.sustainLevel * 0.3,
      this.audioContext.currentTime + settings.attackTime + settings.decayTime
    )

    osc.connect(gain)
    gain.connect(this.masterGain)
    osc.start()

    this.activeOscillators.set(midiNote, { osc, gain, isActive: true })
  }

  stopNote(midiNote: number) {
    const entry = this.activeOscillators.get(midiNote)
    if (!entry) return

    const settings = INSTRUMENT_SETTINGS[this.currentInstrument]
    const releaseStart = this.audioContext.currentTime
    const releaseEnd = releaseStart + settings.releaseTime

    entry.gain.gain.setValueAtTime(entry.gain.gain.value, releaseStart)
    entry.gain.gain.linearRampToValueAtTime(0, releaseEnd)

    entry.osc.stop(releaseEnd)
    entry.isActive = false

    setTimeout(() => {
      this.activeOscillators.delete(midiNote)
    }, settings.releaseTime * 1000)
  }

  stopAllNotes() {
    for (const [midiNote] of this.activeOscillators) {
      this.stopNote(midiNote)
    }
  }

  setMasterVolume(volume: number) {
    this.masterGain.gain.value = Math.max(0, Math.min(1, volume))
  }

  resume() {
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }
  }
}

// Singleton instance
let engineInstance: AudioEngine | null = null

export function getAudioEngine(): AudioEngine {
  if (!engineInstance) {
    engineInstance = new AudioEngine()
  }
  return engineInstance
}
