# CAGED Guitar System Visualizer

An interactive web application for learning the CAGED guitar system.

## Features
- Visual fretboard with color-coded chord shapes
- Navigate through all 5 CAGED positions for any chord
- Show individual shapes or all shapes at once
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

- Select a CAGED chord (C, A, G, E, or D)
- Use Previous/Next buttons to cycle through the 5 shapes
- Toggle "Show All CAGED Shapes" to see the complete pattern
- Click on any colored circle in the progress indicator to jump to that shape

## Building for Production

```bash
npm run build
```