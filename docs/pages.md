# Feature & Page Guide

This document maps out the core React pages and their specific responsibilities within MindScan+.

## Primary Routes (`src/pages/*`)

### 1. **Dashboard (`Dashboard.tsx`)**
- **URI:** `/dashboard`
- **Purpose:** The central hub for user analytics. Displays the 7-day screening trend, recent mental health history, and earned achievements.
- **Key Hook Integration:** Uses `useDashboardMetrics` to calculate streaks based on historical screening data. It also monitors recent `activityStats` to render earned Achievement Badges.

### 2. **Adaptive Screening (`Screening.tsx`)**
- **URI:** `/screening`
- **Purpose:** The cornerstone of the app. It takes users through the dynamic two-step questionnaire.
- **Key Hook Integration:** Relies heavily on `useAdaptiveScreeningFlow.ts`. The UI explicitly reacts to exactly which `Severtity Bracket` the user triggered in phase one.

### 3. **Resources (`Resources.tsx`)**
- **URI:** `/resources`
- **Purpose:** An India-specific emotional health directory. 
- **Features:** 
    - Verified crisis helplines (Tele MANAS, iCall, Snehi).
    - Educational mental health articles formatted with filter pills.
    - Inline YouTube Embeds (Classical/Yoga/Meditation).
    - Links to active Indian professional telehealth platforms.

### 4. **Self-Care Toolset (`SelfCare.tsx`)**
- **URI:** `/self-care`
- **Purpose:** Interactive tools for grounding. Includes breathing visualizer graphics, journaling inputs, and gratitude logging. All tools persist directly to Firebase.

### 5. **Emotional Care Hub (`EmotionalCare.tsx`)**
- **URI:** `/emotional-care`
- **Purpose:** Curated "quick-fix" emotional relief options (like quick CBT reframing tips or emergency grounding exercises) outside the formal structured self-care routines.

### 6. **Community Board (`Community.tsx`)**
- **URI:** `/community`
- **Purpose:** An anonymous support forum where users can post their feelings and receive support or emoji reactions securely via Firebase.

---
*For a deeper dive into the exact State Management driving these pages, please see `logic.md`.*
