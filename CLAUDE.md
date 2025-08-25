# CAGED Visualizer Project

## Overview
Interactive React web application for learning the CAGED guitar system. Built with Vite, TypeScript, and TailwindCSS.

## Tech Stack
- **Framework**: React 19.1.1 + TypeScript
- **Build Tool**: Vite 7.1.2  
- **Styling**: TailwindCSS 4.1.12
- **Development**: ESLint for code quality

## Project Structure
```
src/
   App.tsx                    # Main app component (clean, optimized)
   components/
      CAGEDVisualizer.tsx     # Core visualizer component (TypeScript, optimized)
   constants/
      index.ts                # CAGED system constants and configuration
   types/
      index.ts                # TypeScript interfaces and types
   main.tsx                   # React entry point
   index.css                  # Global styles with TailwindCSS
   vite-env.d.ts             # Vite environment types
.github/workflows/
   deploy.yml                 # GitHub Actions deployment workflow
```

## Key Features
- Interactive guitar fretboard visualization
- 5 CAGED chord shapes (C, A, G, E, D positions)
- Color-coded chord patterns with gradient overlays
- Toggle between single shape and all shapes view
- Responsive design with clean fretboard layout
- Real-time position switching and navigation

## Available Scripts
- `npm run dev` - Start development server (http://localhost:5173)
- `npm run build` - Build for production (runs TypeScript check first)
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Deployment
- **GitHub Actions**: Automated deployment to GitHub Pages via `.github/workflows/deploy.yml`
- **Trigger**: Automatically deploys on push to main branch
- **Process**: Builds project with `npm run build` and deploys `/dist` folder
- **Custom Domain**: Configured for caged.hribar.org
- **Setup**: Repository Settings → Pages → Source: "GitHub Actions"

## Development Notes
- Main visualizer logic in `src/components/CAGEDVisualizer.tsx` (fully TypeScript, optimized with useMemo)
- CAGED constants and types extracted to separate modules for better maintainability
- Uses mathematical chord transposition based on chromatic intervals
- Supports gradient visualization for overlapping chord positions
- Implements authentic guitar neck with proper string tuning (E-A-D-G-B-E)
- Fretboard renders 15 frets with standard position markers (3rd, 5th, 7th, 9th, 12th)
- Clean, modern React patterns with proper type safety
- TailwindCSS for rapid styling and responsive design
