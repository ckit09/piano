# Plan: Web Piano Simulator (Play + Learn Modes)

## TL;DR
Build a React + Vite web app with two distinct modes:

- **Play Mode:** Free composition, recording/playback, multiple instruments, sheet music display, JSON score import
- **Learn Mode:** Practice classic songs (Mary Had a Little Lamb, Jingle Bells, Happy Birthday, 天ノ弱) with real‑time guidance (next‑key highlight, hand‑position guides, animated sheet music), progressive tempo scaling, and accuracy scoring

Deploy to GitHub Pages using workspace conventions (Vite + React 18 + TypeScript + Tailwind + Zustand).

---

## Steps

### 1. Initialize project & mode structure

1. Create Vite + React 18 + TypeScript in `piano` folder
2. Set up Tailwind CSS, path aliases, GitHub Pages config
3. Create mode context/state with Zustand (`src/store/modeStore.ts`)
4. Main layout component that switches between Play/Learn modes

### 2. Build core piano component (`src/components/Piano.tsx`)

- 25‑key keyboard (C3‑C5 range)
- Keyboard, mouse, touch input handlers
- Visual key‑press feedback
- Reusable in both modes

### 3. Implement audio engine (`src/lib/audioEngine.ts`)

- Oscillator‑based synthesis (sine/square/triangle waves)
- Multiple instruments: Piano, Synth, Organ (different envelopes)
- Frequency calculations from MIDI notes
- Volume/velocity control

### 4. Build Play Mode components (`src/components/PlayMode/`)

- Recording/playback system (`recorder.ts`)
- Instrument selector
- Sheet music display with drop‑note animation
- JSON score import/export
- Tempo/BPM controls

### 5. Create Learn Mode system (`src/components/LearnMode/`)

#### Song library (`src/lib/songs.ts`)
Define four classic songs in JSON:
- Mary Had a Little Lamb
- Jingle Bells
- Happy Birthday
- 天ノ弱

#### Guidance engine (`src/lib/learningGuide.ts`)
- Highlight next key to press in real‑time
- Hand position visualization (e.g., “Right hand: Middle finger on D”)
- Sheet music synchronized animation
- Accuracy detection (correct/wrong note feedback)
- Progressive tempo: Start slow (60 BPM), increase by 10 BPM per mistake‑free playthrough

#### Scoring system (`src/lib/scoreTracker.ts`)
- Track accuracy percentage (correct keys pressed / total notes)
- Display real‑time feedback (green highlight = correct, red = wrong)
- Show mastery level (e.g., “80 % accuracy – Good job!”)

#### LearnMode.tsx
Main component with song selector, current guidance display, and score display

### 6. Build Learn Mode UI components

- `SongSelector.tsx` – song selection interface with difficulty levels
- `Guidance.tsx` – live guidance panel (show next key + finger position)
- `ScoreBoard.tsx` – accuracy meter and progress bar
- Buttons to reset, skip ahead, or select a new song

### 7. Mode switcher & navigation (`src/components/ModeSwitch.tsx`)

- Toggle between Play Mode and Learn Mode
- Persist Play Mode state when switching to Learn Mode

### 8. Deploy to GitHub Pages

- Configure Vite base path for GitHub Pages
- Add deploy script
- Push to GitHub

---

## Verification

1. Switch between Play and Learn modes
2. In Learn Mode:
   - Select *Mary Had a Little Lamb* → press keys guided by highlight → accuracy updates in real time
   - Correct note press = green highlight + score increase
   - Wrong note = red flash + message
   - Complete song with ≥ 80 % accuracy → tempo increases for next attempt
   - Accuracy tracking persists during session
   - Switch songs mid‑session
3. Switch to Play Mode and compose freely

---

## Decisions

- Learn Mode uses “free with hints” (not a locked step‑by‑step flow) for flexibility
- Progressive tempo algorithm: +10 BPM per flawless attempt, capped at 120 BPM
- Hand position guides shown as text overlay (e.g., “Left hand pinky on C”)
- Accuracy scoring is percentage of correct notes out of total
- Songs stored as JSON in `src/lib/songs.ts` (easy to add more later, including user‑submitted songs)
- *天ノ弱* included as a bonus modern tune for motivated learners
