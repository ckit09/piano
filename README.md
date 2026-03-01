# Web Piano Simulator 🎹

A React + Vite web application featuring two distinct modes for playing and learning piano.

## Features

### Play Mode 🎵
- **Free Composition**: Play freely on a 25-key keyboard (C3-C5 range)
- **Multiple Instruments**: Choose from Piano, Synth, or Organ with realistic audio synthesis
- **Recording/Playback**: Record your compositions and save them
- **JSON Import/Export**: Share your recordings as JSON files
- **Tempo Control**: Adjust playback speed (40-220 BPM)
- **Multi-Input Support**: Keyboard, mouse, and touch input

### Learn Mode 📖
- **Song Library**: Practice 4 classic songs:
  - Mary Had a Little Lamb (Easy)
  - Jingle Bells (Medium)
  - Happy Birthday (Easy)
  - 天ノ弱/Teno Yowai (Hard)
- **Real-Time Guidance**: 
  - Highlighted next key to press
  - Hand position guides (finger and hand indicators)
  - Live accuracy feedback
- **Progressive Difficulty**: Tempo increases by 10 BPM after perfect playthroughs
- **Accuracy Tracking**: Real-time accuracy percentage and mastery level display
- **Session Persistence**: Switch between songs while maintaining progress

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Audio Engine**: Web Audio API with oscillator synthesis

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building

```bash
npm run build
```

### Preview Build

```bash
npm run preview
```

## Keyboard Controls

The piano layout is designed for **natural hand positioning** on a QWERTY keyboard, with the most frequently used keys on the home row for optimal comfort and speed.

### Primary Position (Home Row - ASDFGHJKL;)
This is the most comfortable position, matching traditional touch-typing posture. All 10 white keys for main playing:

**Left Hand (A, S, D)**
- **A**: C4 (left pinky)
- **S**: D4 (left ring finger)
- **D**: E4 (left middle finger)

**Center Octave (F, G, H)**
- **F**: F4 (left index finger)
- **G**: G4 (center - left thumb)
- **H**: A4 (center - right thumb)

**Right Hand (J, K, L, ;)**
- **J**: B4 (right index finger)
- **K**: C5 (right middle finger)
- **L**: D5 (right ring finger)
- **;** (semicolon): E5 (right pinky)

### Extended Reach (Bottom Row - ZXVNM)
Additional white keys for higher octave without moving hands far:
- **Z**: F5
- **X**: G5
- **V**: A5
- **N**: B5
- **M**: C6

### Sharp/Flat Notes (Top Row - QWERTYUIOP)
All chromatic notes easily accessible without losing hand position:
- **Q**: C#4
- **W**: D#4
- **E**: F#4
- **R**: G#4
- **T**: A#4
- **Y**: C#5
- **U**: D#5
- **I**: F#5
- **O**: G#5
- **P**: A#5

## Audio Engine Details

### Instruments

**Piano**
- Waveform: Sine
- ADSR: Quick attack, medium decay
- Realistic piano envelope

**Synth**
- Waveform: Square
- ADSR: Medium attack, sustained tone
- Electronic sound

**Organ**
- Waveform: Sine
- ADSR: Instant attack, full sustain
- Classic organ tone

### Frequency Calculation

Uses standard MIDI note to frequency conversion:
- Base note: A4 (MIDI 69) = 440 Hz
- Formula: `frequency = 440 × 2^((midiNote - 69) / 12)`

## Project Structure

```
piano/
├── src/
│   ├── components/
│   │   ├── Piano.tsx                 # Main piano keyboard component
│   │   ├── ModeSwitch.tsx            # Mode toggle component
│   │   ├── PlayMode/
│   │   │   └── PlayMode.tsx          # Play mode interface
│   │   └── LearnMode/
│   │       ├── LearnMode.tsx         # Learn mode interface
│   │       ├── SongSelector.tsx      # Song selection UI
│   │       ├── Guidance.tsx          # Real-time guidance display
│   │       └── ScoreBoard.tsx        # Accuracy & progress display
│   ├── lib/
│   │   ├── audioEngine.ts            # Web Audio API implementation
│   │   ├── recorder.ts               # Recording functionality
│   │   ├── songs.ts                  # Song library definitions
│   │   └── learningGuide.ts          # Learning guide logic
│   ├── store/
│   │   ├── modeStore.ts              # Global mode state (Zustand)
│   │   ├── playModeStore.ts          # Play mode state
│   │   └── learnModeStore.ts         # Learn mode state
│   ├── App.tsx                       # Main app component
│   ├── main.tsx                      # Entry point
│   └── index.css                     # Global styles
├── index.html
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

## Verification Checklist

- ✅ Switch between Play and Learn modes
- ✅ In Learn Mode:
  - Select songs with difficulty indicators
  - Press highlighted keys for guidance
  - View real-time accuracy (green = correct, red = wrong)
  - Accuracy updates in real-time
  - Tempo increases after perfect playthroughs
  - Switch songs mid-session
- ✅ In Play Mode:
  - Compose freely with keyboard/mouse/touch
  - Switch instruments
  - Record and save compositions
  - Export/import as JSON

## Deployment

### GitHub Pages

The project is configured to deploy to GitHub Pages. Set your repository URL in `vite.config.ts` (currently set to `/piano/`).

To deploy:

```bash
npm run deploy
```

Or use the automatic GitHub Actions workflow on push to main.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers with Web Audio API support

## License

MIT
