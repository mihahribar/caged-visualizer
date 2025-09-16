# CAGED Guitar System Visualizer

An interactive web application for learning the CAGED guitar system.

## Features
- Visual fretboard with color-coded chord shapes
- Navigate through all 5 CAGED positions for any chord
- Show individual shapes or all shapes at once
- **Major Pentatonic Scale Overlay** - Optional toggle to show pentatonic scale notes over chord shapes for music theory context
- **Quiz Mode** - Interactive chord identification quiz with scoring system
- Dark/Light theme toggle with system preference detection
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
- Select a CAGED chord (C, A, G, E, or D)
- Use Previous/Next buttons to cycle through the 5 shapes
- Toggle "Show All CAGED Shapes" to see the complete pattern
- Toggle "Show Pentatonic Scale" to overlay major pentatonic scale notes in green
- Click on any colored circle in the progress indicator to jump to that shape

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