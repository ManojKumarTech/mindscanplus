# Assets & Configuration Guide

This document maps out the static resources, styling choices, and configurations for MindScan+.

## Styling (Design System)

MindScan+ actively avoids standard basic HTML colors and instead utilizes a custom, modern Tailwind CSS design system heavily dependent on soft gradients and rounded, accessible interfaces.

### Core Configuration (`tailwind.config.js`)
- **Primary Color Axis:** Mint Green (`#A7F3D0`) to Sky Blue (`#7DD3FC`).
- **Accent Axis:** Rose/Pink (`#FB7185`) to Orange (`#FB923C`). 
- **Shadows:** The app uses custom soft shadows (`shadow-soft` and `shadow-softLg`) to create "floating" card interfaces rather than flat borders.

### Animations (`index.css`)
- Keyframes such as `@slideUp` and `@fadeIn` provide the micro-interactions when users transition between Screening logic blocks or view standard Dashboard panels.

## Iconography
The platform standardizes on **`lucide-react`** for all vector-based UI iconography (e.g., checks, hearts, chevrons). 

## External Media 
### Static Images
If any static images are added to the platform (e.g., placeholder avatars), they belong in `src/assets/`. 

### Embedded YouTube Audio (`src/services/resourcesData.ts`)
The `audioGuides` array uses highly-filtered, directly-embeddable YouTube IDs for the relaxation exercises. These are natively rendered via `iframe` in `Resources.tsx`. 
- **Important:** If a video shows "Unavailable", it means the uploader disabled external embedding. We specifically tested and selected only IDs that return `200` via YouTube's `oEmbed` API to prevent this.
