# CAGED Guitar System Visualizer

An interactive web application for learning the CAGED guitar system.

## Features
- **Visual fretboard** with color-coded chord shapes
- **Major and Minor Chord Support** - Full CAGED system implementation for both major and minor chord qualities
- **Chord Quality Toggle** - Seamlessly switch between major and minor chord patterns
- Navigate through all 5 CAGED positions for any chord (C, A, G, E, D)
- Show individual shapes or all shapes at once with gradient blending
- **Pentatonic Scale Overlay** - Toggle to show major/minor pentatonic scale notes over chord shapes for music theory context
- **All Notes Display** - Toggle to show natural note names (E, F, G, A, B, C, D) on all fret positions for fretboard navigation
- **Quiz Mode** - Interactive chord identification quiz with scoring system
- **Dark/Light theme toggle** with system preference detection
- Authentic neck inlay dots for reference
- Clean, minimal design focused on learning

## Installation

1. Clone or download this project
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start dev
   ```
5. Open your browser and go to `http://localhost:5173`

## Usage

### Visualizer Mode
- **Select a root chord** (C, A, G, E, or D) and **chord quality** (Major/Minor)
- Use Previous/Next buttons to cycle through the 5 shapes
- Toggle "Show All CAGED Shapes" to see the complete pattern with gradient overlays
- Toggle "Pentatonic Scale" to overlay major/minor pentatonic scale notes in green
- Toggle "All Notes" to display natural note names on fret positions for easy navigation
- Click on any colored circle in the progress indicator to jump to that shape

### Keyboard Shortcuts
- **Space**: Toggle between single shape and all shapes view
- **Arrow Keys (←/→)**: Navigate through shapes in single shape mode
- **Numbers (1-5)**: Jump directly to a specific shape position
- **S**: Toggle pentatonic scale overlay
- **N**: Toggle all notes display

### Quiz Mode
- Click "Quiz Mode" to start a chord identification quiz
- View a chord pattern on the fretboard and identify which root chord it represents
- Choose from all 5 possible chord options (C, A, G, E, D)
- Receive immediate feedback and track your score
- Review correct answers for missed questions at the end

## Building for Production

```bash
npm run build
```