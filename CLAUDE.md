# CAGED Visualizer Project - Claude Development Guide

## Project Overview
Interactive React web application for learning the CAGED guitar system - a guitar learning method that teaches 5 chord shapes that can be moved up and down the neck. The app includes both an interactive visualizer and a quiz mode for chord identification practice. **Now supports both major and minor chord qualities** with complete CAGED implementation for all chord types.

**Live Site**: [caged.hribar.org](https://caged.hribar.org)

## Architecture Summary
- **Pattern**: Modern React SPA with custom hook architecture
- **State Management**: React hooks with context for theme/navigation, local state for component logic
- **UI Approach**: Component composition with separation of concerns
- **Data Flow**: Props down, callbacks up pattern with custom hooks encapsulating complex logic

## Tech Stack
- **Framework**: React 19.1.1 + TypeScript 5.8.3
- **Build Tool**: Vite 7.1.2 with React plugin
- **Styling**: TailwindCSS 4.1.12 (latest version with native CSS support)
- **Development**: ESLint 9.33.0 with TypeScript ESLint
- **Deployment**: GitHub Actions → GitHub Pages

## Project Structure
```
src/
├── App.tsx                     # Root app with navigation logic
├── main.tsx                    # React entry point
├── index.css                   # Global styles + TailwindCSS
├── components/                 # React components
│   ├── CAGEDVisualizer.tsx    # Main visualizer component
│   ├── QuizPage.tsx           # Quiz mode entry point
│   ├── QuizResults.tsx        # Quiz completion screen
│   ├── AppNavigation.tsx      # Top navigation bar
│   ├── FretboardDisplay.tsx   # Guitar fretboard renderer
│   ├── CAGEDNavigation.tsx    # CAGED shape navigation
│   ├── ChordQualityToggle.tsx # Major/minor toggle
│   ├── ShowAllToggle.tsx      # Show all shapes toggle
│   ├── AllNotesToggle.tsx     # All notes display toggle
│   ├── QuizModeToggle.tsx     # Quiz mode navigation
│   └── ...                    # Additional UI components
├── hooks/                     # Custom React hooks
│   ├── useCAGEDLogic.ts      # Core CAGED calculation logic
│   ├── useCAGEDState.ts      # Visualizer state management
│   ├── useCAGEDSequence.ts   # CAGED shape sequencing
│   ├── useQuiz.ts            # Quiz state management
│   ├── useQuizLogic.ts       # Quiz question generation
│   ├── useQuizState.ts       # Quiz state handling
│   ├── useQuizPreferences.ts # Quiz preferences
│   ├── useKeyboardNavigation.ts # Keyboard shortcuts
│   ├── useTheme.ts           # Theme management
│   ├── useNavigation.ts      # App navigation
│   └── ...                    # Additional hooks
├── contexts/                  # React contexts
│   ├── ThemeContext.tsx      # Dark/light theme management
│   ├── theme.ts              # Theme type definitions
│   ├── NavigationContext.tsx # App navigation state
│   └── NavigationContextCore.ts # Navigation core logic
├── constants/                 # Static data and configuration
│   ├── index.ts              # CAGED system data/patterns
│   └── quizConfig.ts         # Quiz generation settings
├── types/                     # TypeScript type definitions
│   ├── index.ts              # Main types (CAGED, Quiz)
│   └── navigation.ts         # Navigation types
└── assets/                    # Static assets
```

## Code Conventions & Patterns

### Naming Conventions
- **Components**: PascalCase (`CAGEDVisualizer.tsx`)
- **Hooks**: camelCase with `use` prefix (`useCAGEDLogic.ts`)
- **Types**: PascalCase interfaces (`ChordType`, `QuizSession`)
- **Constants**: SCREAMING_SNAKE_CASE (`CAGED_SHAPE_DATA`)
- **Files**: PascalCase for components, camelCase for utilities

### Component Patterns
- **Functional components only** - no class components
- **Custom hooks for logic** - components focus on rendering
- **Props interface definitions** - always typed
- **Conditional rendering** - using `&&` and ternary operators
- **Event handlers** - named with `handle` or `on` prefix

### State Management Patterns
- **Local state**: `useState` for simple component state
- **Complex logic**: Custom hooks with `useMemo` for expensive calculations
- **Global state**: React Context (Theme, Navigation)
- **State updates**: Immutable patterns with proper dependencies

### TypeScript Usage
- **Strict mode enabled** - full type checking
- **Interface over type** - for object shapes
- **Union types** - for limited options (`ChordType = 'C' | 'A' | 'G' | 'E' | 'D'`)
- **Type exports** - explicit type-only imports/exports
- **Generic types** - used sparingly, mainly in hooks

### Styling Approach
- **TailwindCSS utility classes** - primary styling method
- **CSS custom properties** - for complex fretboard layout
- **Dark mode support** - using Tailwind's dark: prefix
- **Responsive design** - mobile-first approach
- **CSS Grid/Flexbox** - for complex layouts

## Key Dependencies & Their Purpose
- **@tailwindcss/vite**: TailwindCSS 4.x integration with Vite
- **react**: Core React library (latest v19)
- **typescript**: Full TypeScript support
- **@vitejs/plugin-react**: Vite React support with Fast Refresh
- **eslint**: Code quality with React hooks rules

## Development Workflow

### Available Scripts
```bash
npm run dev      # Development server (http://localhost:5173)
npm run build    # Production build (runs TypeScript check first)
npm run lint     # ESLint code quality check  
npm run preview  # Preview production build locally
```

### Development Process
1. **Start dev server**: `npm run dev`
2. **Code changes**: Auto-reload via Vite HMR
3. **Type checking**: Continuous via TypeScript
4. **Code quality**: Run `npm run lint` before commits
5. **Build testing**: `npm run build` before deployment

### Deployment Process
- **Trigger**: Push to `main` branch
- **CI/CD**: GitHub Actions (`.github/workflows/deploy.yml`)
- **Build**: `npm ci && npm run build`
- **Deploy**: GitHub Pages from `/dist` folder
- **Domain**: Custom domain configured via CNAME

## Music Theory Context (CAGED System)
The app implements the CAGED guitar system with full major and minor chord support:

### Chord Shapes and Qualities
- **5 chord shapes**: C, A, G, E, D - moveable patterns for both major and minor
- **Major chord patterns**: Original CAGED system implementation
- **Minor chord patterns**: Parallel implementation with flattened thirds
- **Chord quality toggle**: Seamless switching between major/minor via `ChordQuality` type

### Music Theory Implementation
- **Chromatic intervals**: Mathematical chord transposition for all qualities
- **Major chord intervals**: Root (0), Major Third (4), Perfect Fifth (7)
- **Minor chord intervals**: Root (0), Minor Third (3), Perfect Fifth (7)
- **Pentatonic scales**: Major (0,2,4,7,9) and Minor (0,3,5,7,10) pentatonic intervals
- **Fretboard logic**: 15 frets, standard tuning (E-A-D-G-B-E)
- **Pattern calculation**: Shape + quality + position = chord voicing
- **Visual overlays**: Color-coded shapes with gradient blending for overlapping patterns

### Data Structure Organization
- **`CAGED_SHAPES_BY_QUALITY`**: Combined data structure organizing major/minor patterns
- **Dynamic shape selection**: Runtime selection based on `chordQuality` state
- **Consistent color coding**: Same colors for major/minor versions of each shape
- **Root note preservation**: Same root note positions for major/minor variants

## Claude-Specific Guidance

### Context Guidelines
When asking Claude for help with this project:
1. **Specify component location** - include file paths
2. **Mention feature area** - visualizer vs quiz vs theme/navigation
3. **Include TypeScript context** - types are crucial for accuracy
4. **Reference existing patterns** - point to similar code when requesting changes

### Effective Prompts
```
"Add a new feature to the visualizer component that [description]. Follow the existing pattern in CAGEDVisualizer.tsx and use the custom hooks pattern."

"Fix a bug in the quiz system where [issue]. The quiz logic is in src/hooks/useQuiz.ts and the UI is in src/components/QuizQuestion.tsx."

"Update the theme system to support [new feature]. The theme context is in src/contexts/ThemeContext.tsx."
```

### Code Generation Guidelines
- **Follow existing patterns** - check neighboring components first
- **Use TypeScript interfaces** - define types before implementation  
- **Leverage custom hooks** - extract complex logic from components
- **Maintain accessibility** - include ARIA labels and semantic HTML
- **Follow TailwindCSS patterns** - use utility classes, avoid custom CSS
- **Test responsive behavior** - consider mobile/desktop layouts

### Important Constraints
- **Music theory accuracy** - CAGED calculations must be mathematically correct
- **Performance** - use `useMemo` for expensive calculations
- **Accessibility** - keyboard navigation, screen reader support
- **Mobile support** - responsive design is crucial
- **TypeScript strict mode** - all code must pass type checking

### File Organization Rules
- **Components**: UI rendering only, delegate logic to hooks
- **Hooks**: Encapsulate state and complex calculations
- **Constants**: Static data, no logic
- **Types**: TypeScript definitions only
- **Contexts**: Global state management

### Common Task Templates

#### Adding New Quiz Features
1. Update types in `src/types/index.ts`
2. Modify quiz logic in `src/hooks/useQuiz.ts` or related hooks
3. Update UI components in `src/components/Quiz*.tsx`
4. Test with different chord combinations

#### Modifying CAGED Logic
1. Review music theory in `src/constants/index.ts`
2. Update calculation logic in `src/hooks/useCAGEDLogic.ts`
3. Test with all chord shapes and positions
4. Verify visual accuracy on fretboard

#### Adding UI Components
1. Create component file in `src/components/`
2. Define props interface with TypeScript
3. Use existing TailwindCSS patterns
4. Import and integrate in parent component
5. Test dark/light theme compatibility

#### Theme/Styling Changes
1. Check existing TailwindCSS usage patterns
2. Update classes in component files
3. Test dark mode compatibility
4. Verify responsive behavior

### Common Gotchas
- **CAGED calculations**: Off-by-one errors in fret calculations
- **React 19 patterns**: Use latest React patterns, not legacy approaches
- **TailwindCSS 4.x**: Uses different syntax than v3.x
- **TypeScript strict**: All props and state must be properly typed
- **Mobile layout**: Fretboard display needs special mobile considerations

### Testing Approach
- **Manual testing**: No automated test suite currently
- **Cross-browser**: Test in Chrome, Firefox, Safari
- **Device testing**: Desktop and mobile layouts
- **Music accuracy**: Verify chord patterns with actual guitar
- **Performance**: Check for smooth animations and interactions

### Integration Points
- **GitHub Pages**: Static site deployment
- **GitHub Actions**: CI/CD pipeline
- **TailwindCSS**: Styling system integration
- **TypeScript**: Type checking integration
- **ESLint**: Code quality integration

## Project-Specific Notes

### Unique Architectural Decisions
- **Custom hooks pattern**: Logic separated from UI completely
- **Mathematical chord calculation**: Real music theory implementation
- **Gradient overlay system**: Complex visual blending for overlapping patterns
- **Context-minimal approach**: Only theme and navigation in context

### Performance Considerations
- **useMemo for calculations**: CAGED logic is memoized
- **Minimal re-renders**: State changes are targeted
- **Efficient gradient generation**: Dynamic CSS generation
- **Vite build optimization**: Tree shaking and bundling

### Security Considerations
- **Static site**: No server-side vulnerabilities
- **No user data**: No storage or data collection
- **XSS prevention**: React's built-in protections
- **Dependency security**: Regular npm audit

### Browser Compatibility
- **Modern browsers only**: Uses latest React and TailwindCSS features
- **ES6+ features**: Arrow functions, destructuring, etc.
- **CSS Grid support**: Required for fretboard layout
- **Dark mode support**: CSS custom properties

### Environment Configuration
- **Development**: Vite dev server with HMR
- **Production**: Static build optimized for GitHub Pages
- **TypeScript**: Strict mode enabled
- **ESLint**: Configured for React + TypeScript

This guide provides the essential context for effective Claude collaboration on the CAGED Visualizer project. The combination of music theory accuracy, modern React patterns, and clean architecture makes this a unique learning application that requires both technical and domain expertise.