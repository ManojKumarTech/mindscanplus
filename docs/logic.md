# Core Business Logic & Systems

This document explains the primary mechanisms driving the MindScan+ application.

## 1. The Adaptive Screening Engine
*(Introduced to solve survey fatigue and provide granular, actonable data)*

### How it works:
The system uses a two-phase smart questionnaire:
1. **Base Phase:** The user is asked "Base Questions" categorized by **Themes** (e.g., *Worry, Panic*). They answer on a `1-5` severity scale. 
2. **Follow-Up Phase:** The system immediately evaluates the highest-scoring theme. Instead of asking generic questions, it fetches 15 rigorously targeted questions explicitly designed for that specific `Severity Level` (1 through 5).

### Why this matters:
- A user scoring `1` (Not at all) on "Panic" will be asked questions to confirm they are physically grounded and safe.
- A user scoring `5` (Extremely) on "Panic" will be assessed for acute crisis symptoms (hyperventilation, fear of fainting).
- **This prevents users in crisis from feeling invalidated by "easy" questions, and prevents calm users from being alarmed by "extreme" questions.**

### Data Structures
- **Question Definitions:** Located in `src/data/adaptiveQuestions.ts`
- **State Machine Engine:** Located in `src/hooks/useAdaptiveScreeningFlow.ts`

### Weighted Scoring Algorithm
To plot these varied questions fairly on a single dashboard, the engine uses a Weighted Score (0-100 scale). 
- The **Base Severity (1-5)** dictates the 20-point bracket the user falls into. 
- The average of the **15 Follow-Up Questions** determines where within that 20-point bracket the final score lands.
- *Example:* A Base Severity of `3` puts the user in the `40-60` bracket. If their 15 follow-up questions average to exactly `3.0`, their final weighted score is `50 / 100`.

---

## 2. Dashboard Analytics & Streaks

The Dashboard (`Dashboard.tsx`) consumes the user's historical screening data from Firebase.

### Tracking Logic
- The Dashboard pulls the last 7 days of `ScreeningResult` documents.
- It calculates streaks by counting consecutive days backward from *today* where at least one screening was logged. Look at `currentStreak` inside `Dashboard.tsx`.
- The Bar Chart (`ChartBar.tsx`) interprets the `stressScore` value. A tall bar signifies *higher* stress. The color dynamically shifts:
    - `< 2.0`: Green (Low Stress / Maintenance)
    - `< 3.5`: Amber (Moderate Stress / Caution)
    - `> 3.5`: Red (High Stress / Crisis)

### Achievements
Achievements (like "Journal Warrior" or "7-Day Streak") are calculated in real-time by analyzing the user's `activityStats` from `useSelfCareStats.ts`. Once an achievement threshold is crossed, it unlocks visually on the Dashboard.

---

## 3. Firebase Architecture

The app uses Firebase Authentication and Firestore.

**Primary Collections:**
- `/users/{userId}`: Root document for a user.
- `/users/{userId}/screeningResults`: Sub-collection containing all historical Adaptive Screening nodes.
- `/users/{userId}/journalEntries`: Sub-collection for journaling.
- `/users/{userId}/gratitudeItems`: Sub-collection for the gratitude log.

See `src/services/` for the individual API wrappers handling CRUD operations for these collections.
