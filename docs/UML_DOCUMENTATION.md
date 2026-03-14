# UML Documentation - MindCare Web Application

## 1. Project Overview

**Project Name:** MindCare - Mental Health Support Web Application  
**Technology Stack:** React, TypeScript, Firebase (Authentication + Firestore), Vite, Tailwind CSS  
**Core Functionality:** A mental health support platform providing stress screening, self-care tracking (gratitude journaling, wins tracking, challenges), community stories, and dashboard analytics.

---

## 2. Database Schema (Firestore)

### 2.1 Root-Level Collections

```
Firestore Root
├── users/{userId}              (Document)
│   ├── email: string
│   ├── name: string
│   ├── createdAt: timestamp
│   │
│   ├── profile/
│   │   └── achievements        (Sub-collection Document)
│   │       ├── streak7Day: boolean
│   │       ├── activityMaster: boolean
│   │       ├── journalWarrior: boolean
│   │       ├── gratitudeChampion: boolean
│   │       ├── totalAchievements: number
│   │       └── lastUpdated: timestamp
│   │
│   ├── selfCare                (Sub-collection)
│   │   └── {entryId}           (Document)
│   │       ├── gratitudeItems: string[]
│   │       ├── wins: array
│   │       ├── journalEntry: string
│   │       └── timestamp: timestamp
│   │
│   ├── gratitude               (Sub-collection)
│   │   └── {itemId}            (Document)
│   │       ├── text: string
│   │       ├── date: string
│   │       └── createdAt: timestamp
│   │
│   ├── wins                    (Sub-collection)
│   │   └── {winId}             (Document)
│   │       ├── id: number
│   │       ├── text: string
│   │       ├── date: string
│   │       └── createdAt: timestamp
│   │
│   ├── challenges              (Sub-collection)
│   │   └── {challengeId}       (Document)
│   │       ├── title: string
│   │       ├── description: string
│   │       ├── days: number
│   │       ├── totalDays: number
│   │       ├── color: string
│   │       ├── weekStart: string
│   │       └── lastUpdatedAt: timestamp
│   │
│   ├── planProgress            (Sub-collection)
│   │   └── {dateString}         (Document) - e.g., "2024-01-15"
│   │       ├── items: map<string, boolean>
│   │       ├── createdAt: timestamp
│   │       └── updatedAt: timestamp
│   │
│   └── screeningResults        (Sub-collection)
│       └── {resultId}          (Document)
│           ├── stressScore: number
│           ├── stressLevel: "Low" | "Moderate" | "High"
│           └── createdAt: timestamp
│
└── communityStories            (Collection)
    └── {storyId}               (Document)
        ├── excerpt: string
        ├── author: string | null
        ├── authorId: string | null
        ├── reactions: number
        ├── comments: number
        ├── createdAt: timestamp
        └── updatedAt: timestamp
```

### 2.2 Data Models (TypeScript Interfaces)

```typescript
// User Profile
interface UserProfile {
  uid: string;
  email: string | null;
  name: string;
  createdAt: Date;
}

// User Achievements
interface UserAchievements {
  uid: string;
  streak7Day: boolean;
  activityMaster: boolean;
  journalWarrior: boolean;
  gratitudeChampion: boolean;
  totalAchievements: number;
  lastUpdated?: any;
}

// Self-Care Entry
interface SelfCareEntry {
  id?: string;
  gratitudeItems: string[];
  wins: { id: number; text: string; date: string }[];
  journalEntry: string;
  timestamp?: any;
}

// Gratitude Item
interface GratitudeItem {
  id: string;
  text: string;
  date?: string;
  createdAt?: any;
}

// Win Entry
interface WinEntry {
  id: string;
  text: string;
  date: string;
  createdAt?: any;
}

// Challenge Item
interface ChallengeItem {
  id: string;
  title: string;
  description: string;
  days: number;
  totalDays: number;
  color: string;
  weekStart?: string;
  lastUpdatedAt?: any;
}

// Plan Progress
interface PlanProgress {
  id: string;
  items: Record<string, boolean>;
  createdAt?: any;
}

// Screening Result
interface ScreeningResult {
  userId: string;
  stressScore: number;
  stressLevel: 'Low' | 'Moderate' | 'High';
  createdAt: any;
  id?: string;
}

// Community Story
interface CommunityStory {
  id?: string;
  excerpt: string;
  author?: string | null;
  authorId?: string | null;
  reactions: number;
  comments: number;
  createdAt?: any;
}

// Dashboard Metrics
interface DashboardMetrics {
  last7Days: DayGroupedResult[];
  currentMonth: MonthGroupedResult;
  overallAverageScore: number;
  totalResults: number;
}

interface DayGroupedResult {
  date: string;
  results: ScreeningResult[];
  averageScore: number;
  counts: { Low: number; Moderate: number; High: number };
}

interface MonthGroupedResult {
  month: string;
  results: ScreeningResult[];
  averageScore: number;
  counts: { Low: number; Moderate: number; High: number };
}
```

---

## 3. Class Diagram - Application Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              APPLICATION LAYER                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                         APP COMPONENT                                │   │
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐        │   │
│  │  │  AuthProvider  │  │ ToastProvider  │  │ BrowserRouter │        │   │
│  │  └────────────────┘  └────────────────┘  └────────────────┘        │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                         ROUTES                                       │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │   │
│  │  │   Home   │ │ Screening│ │Emotional │ │ SelfCare │ │Community│  │   │
│  │  │   Page   │ │   Page   │ │   Care   │ │   Page   │ │  Page   │  │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘  │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐                              │   │
│  │  │Dashboard │ │ Resources│ │   Admin  │  + Login (Public)            │   │
│  │  │   Page   │ │   Page   │ │   Page   │                              │   │
│  │  └──────────┘ └──────────┘ └──────────┘                              │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                           CONTEXT LAYER                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────┐      ┌─────────────────────────┐              │
│  │      AuthContext        │      │     ToastContext        │              │
│  │  ─────────────────────  │      │  ─────────────────────  │              │
│  │  - user: User | null    │      │  - toasts: Toast[]      │              │
│  │  - userProfile          │      │  ─────────────────────  │              │
│  │  - loading: boolean     │      │  + addToast()           │              │
│  │  ─────────────────────  │      │  + removeToast()        │              │
│  │  + logout()             │      │  + clearAll()           │              │
│  │  + setUserProfile()     │      │                         │              │
│  └───────────┬─────────────┘      └───────────┬─────────────┘              │
│              │                               │                              │
└──────────────┼───────────────────────────────┼──────────────────────────────┘
               │                               │
               ▼                               ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                            SERVICE LAYER                                     │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐               │
│  │  authService    │  │  userService    │  │selfCareService │               │
│  │  ─────────────  │  │  ─────────────  │  │  ─────────────  │               │
│  │+registerWith   │  │+ensureUser       │  │+saveSelfCare    │               │
│  │    Email()     │  │    Profile()     │  │    Entry()      │               │
│  │+loginWithEmail │  │+fetchUser        │  │+fetchSelfCare   │               │
│  │                │  │    Profile()     │  │    Entries()    │               │
│  │+loginWithGoogle│  │+updateUserName() │  │+addGratitude    │               │
│  │                │  │                  │  │    Item()       │               │
│  │+logout()       │  │+fetchUser         │  │                 │               │
│  │                │  │    Achievements()│  │+fetchGratitude  │               │
│  │                │  │                  │  │    Items()       │               │
│  │                │  │+updateAchievement│  │                 │               │
│  │                │  │    ()            │  │+addWin()         │               │
│  │                │  │                  │  │                 │               │
│  │                │  │+watchAchievements│  │+fetchWins()      │               │
│  │                │  │    ()            │  │                 │               │
│  └────────┬────────┘  └────────┬────────┘  │+watchChallenges │               │
│           │                   │           │    ()            │               │
│           │                   │           │                 │               │
│           ▼                   ▼           │+createChallenge │               │
│  ┌─────────────────┐  ┌─────────────────┐  │                 │               │
│  │ screeningService│  │communityService │  │+togglePlanItem()│               │
│  │  ─────────────  │  │  ─────────────  │  │                 │               │
│  │+saveScreening   │  │+postStory()      │  │+watchPlanProgress│               │
│  │    Result()     │  │                  │  │    ()            │               │
│  │                 │  │+fetchStories()   │  │                 │               │
│  │+fetchUserScreen │  │                  │  │+watchGratitude   │               │
│  │    Results()    │  │+updateStory()    │  │    Items()       │               │
│  │                 │  │                  │  │                 │               │
│  │+processDash    │  │+deleteStory()     │  │+watchWins()      │               │
│  │    boardMetrics │  │                  │  │                 │               │
│  │                 │  │+reactToStory()   │  │+watchJournal     │               │
│  │                 │  │                  │  │    Entries()     │               │
│  └─────────────────┘  └─────────────────┘  └────────┬────────┘               │
│                                                      │                        │
└──────────────────────────────────────────────────────┼────────────────────────┘
                                                       │
                                                       ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                           BACKEND LAYER (Firebase)                            │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐               │
│  │    Firebase     │  │  Firebase Auth  │  │ Firebase        │               │
│  │    App          │  │                 │  │ Firestore       │               │
│  │  ─────────────  │  │  ─────────────  │  │  ─────────────  │               │
│  │+initializeApp()│  │+ getAuth()      │  │+ getFirestore() │               │
│  │                │  │                 │  │                 │               │
│  │                │  │+ createUserWith │  │+ collection()   │               │
│  │                │  │    EmailAndPass │  │                 │               │
│  │                │  │                 │  │+ doc()           │               │
│  │                │  │+ signInWith     │  │                 │               │
│  │                │  │    EmailAndPass │  │+ addDoc()        │               │
│  │                │  │                 │  │                 │               │
│  │                │  │+ signInWith     │  │+ getDoc()        │               │
│  │                │  │    Popup (Google)│  │                 │               │
│  │                │  │                 │  │+ updateDoc()     │               │
│  │                │  │+ signOut()      │  │                 │               │
│  │                │  │                 │  │+ deleteDoc()     │               │
│  │                │  │+ onAuthState    │  │                 │               │
│  │                │  │    Changed()    │  │+ onSnapshot()    │               │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘               │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Use Case Diagram

```
                              ┌─────────────────────────┐
                              │      USER              │
                              └───────────┬─────────────┘
                                          │
          ┌───────────────┬───────────────┼───────────────┬───────────────┐
          │               │               │               │               │
          ▼               ▼               ▼               ▼               ▼
   ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
   │  Register   │ │   Login     │ │   Logout    │ │ View Profile│ │  View Home  │
   │  Account    │ │  (Email/    │ │             │ │             │ │             │
   │             │ │   Google)   │ │             │ │             │ │             │
   └──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └──────┬──────┘
          │               │               │               │               │
          └───────────────┴───────────────┴───────────────┴───────────────┘
                                          │
                                          ▼
                         ┌────────────────────────────────┐
                         │   AUTHENTICATED USER           │
                         └──────────────┬─────────────────┘
                                        │
     ┌──────────────┬──────────────┬─────┴────┬──────────────┬──────────────┐
     │              │              │          │              │              │
     ▼              ▼              ▼          ▼              ▼              ▼
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ Complete │ │  Track   │ │   Add    │ │   Add    │ │  View    │ │  View    │
│ Stress   │ │ Self-Care│ │Gratitude │ │   Wins   │ │Community │ │Dashboard │
│Screening │ │  Plan    │ │  Items   │ │          │ │ Stories  │ │ Metrics  │
└────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘
     │            │            │            │            │            │
     ▼            ▼            ▼            ▼            ▼            ▼
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│   View    │ │  Create  │ │ Delete   │ │ Delete   │ │ Reactate │ │ View     │
│ Results   │ │Challenges│ │Gratitude │ │   Wins   │ │  Stories │ │Analytics │
│           │ │          │ │  Items   │ │          │ │          │ │          │
└──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘
                                                                 │
                                                                 ▼
                                              ┌────────────────────────────────┐
                                              │      ADMIN (if admin role)     │
                                              └──────────────┬────────────────┘
                                                             │
                                                  ┌──────────┴──────────┐
                                                  │                     │
                                                  ▼                     ▼
                                           ┌─────────────┐       ┌─────────────┐
                                           │   Manage    │       │    View     │
                                           │   Users     │       │   All Data  │
                                           └─────────────┘       └─────────────┘
```

---

## 5. Sequence Diagrams

### 5.1 User Registration Flow

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  User   │     │LoginPage│     │AuthServ │     │Firebase │     │Firestore│
└────┬────┘     └───┬─────┘     └───┬─────┘     └───┬─────┘     └───┬─────┘
     │             │               │               │               │
     │ 1.Submit   │               │               │               │
     │  register  │               │               │               │
     │───────────>│               │               │               │
     │             │ 2.register   │               │               │
     │             │  WithEmail() │               │               │
     │             │─────────────>│               │               │
     │             │              │ 3.createUser  │               │
     │             │              │  WithEmail    │
     │             │              │──────────────>│               │
     │             │              │               │────4.create──>│
     │             │              │               │    user doc   │
     │             │              │               │<───5.user─────│
     │             │              │               │     created   │
     │             │              │<──────────────│               │
     │             │              │    6.auth     │               │
     │             │              │    result     │               │
     │             │<─────────────│               │               │
     │             │ 7.redirect   │               │               │
     │<────────────│  to Home     │               │               │
     │ 8.Success   │               │               │               │
```

### 5.2 Self-Care Entry Flow

```
┌──────────┐   ┌────────────┐   ┌──────────────┐   ┌─────────┐
│  User    │   │SelfCarePage│   │selfCareServ  │   │Firestore│
└────┬─────┘   └─────┬──────┘   └──────┬───────┘   └────┬────┘
     │              │                   │                 │
     │ 1.Submit     │                   │                 │
     │ self-care    │                   │                 │
     │ entry        │                   │                 │
     │─────────────>│                   │                 │
     │              │ 2.saveSelfCare    │                 │
     │              │    Entry()         │                 │
     │              │──────────────────>│                 │
     │              │                    │ 3.addDoc()      │
     │              │                    │────────────────>│
     │              │                    │                 │──> selfCare
     │              │                    │                 │    collection
     │              │                    │<───4.docRef─────│
     │              │                    │     created     │
     │              │<───────────────────│                 │
     │<─────────────│ 5.Success toast    │                 │
     │ 6.Display    │                   │                 │
     │ updated list │                   │                 │
```

### 5.3 Dashboard Metrics Loading Flow

```
┌───────────┐   ┌────────────┐   ┌──────────────┐   ┌────────────┐
│ Dashboard │   │useDashboard│   │screeningServ │   │ Firestore  │
│   Page    │   │  Metrics   │   │              │   │            │
└─────┬─────┘   └─────┬──────┘   └──────┬───────┘   └─────┬──────┘
      │              │                  │                 │
      │ 1. Load      │                  │                 │
      │  dashboard   │                  │                 │
      │─────────────>│                  │                 │
      │              │ 2. Fetch         │                 │
      │              │  screenings      │                 │
      │              │─────────────────>│                 │
      │              │                  │───> query       │
      │              │                  │    screeningRslts│
      │              │                  │<────results─────│
      │              │ 3. processDash   │                 │
      │              │  boardMetrics()  │                 │
      │              │<─────────────────│                 │
      │              │ 4. DashboardData │                 │
      │              │                  │                 │
      │<─────────────│ 5. Display        │                 │
      │ 6. Render    │                   │                 │
      │ charts       │                   │                 │
```

---

## 6. Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         COMPONENT HIERARCHY                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  App                                                                      │
│  ├── AuthProvider ◄────────────────┐                                       │
│  │   └── AuthContext               │                                       │
│  │                                   │                                       │
│  ├── ToastProvider ◄───────────────┤                                       │
│  │   └── ToastContext              │                                       │
│  │                                   │                                       │
│  ├── BrowserRouter                  │                                       │
│  │   └── Routes                      │                                       │
│  │       ├── /login → LoginPage      │                                       │
│  │       │                            │                                       │
│  │       ├── RequireAuth (Protected Route Wrapper)                         │
│  │       │   └── Routes              │                                       │
│  │       │       ├── / → HomePage    │                                       │
│  │       │       ├── /screening → ScreeningPage                            │
│  │       │       │       └── ScreeningFlow (Hook-based)                   │
│  │       │       │                                                    │
│  │       │       ├── /emotional-care → EmotionalCarePage                 │
│  │       │       │                                                    │
│  │       │       ├── /self-care → SelfCarePage                           │
│  │       │       │       ├── GratitudeList                               │
│  │       │       │       ├── WinsTracker                                 │
│  │       │       │       ├── JournalSection                              │
│  │       │       │       ├── SelfCarePlan                                │
│  │       │       │       └── SelfCareSummary                             │
│  │       │       │                                                    │
│  │       │       ├── /community → CommunityPage                          │
│  │       │       │                                                    │
│  │       │       ├── /dashboard → DashboardPage                          │
│  │       │       │       └── StatsCard, ChartBar                        │
│  │       │       │                                                    │
│  │       │       ├── /resources → ResourcesPage                          │
│  │       │       │                                                    │
│  │       │       └── /admin → AdminPage                                  │
│  │       │                                                             │
│  │       └── Layout Components                                          │
│  │           ├── Navbar                                                 │
│  │           └── Footer                                                 │
│  │                                                                     │
│  └── UI Components (Reusable)                                          │
│      ├── Button                                                         │
│      ├── Card                                                           │
│      ├── ChartBar                                                       │
│      ├── ErrorBanner                                                    │
│      ├── Loader                                                         │
│      └── StatsCard                                                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. State Management Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         STATE MANAGEMENT                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      AUTHENTICATION STATE                            │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐               │   │
│  │  │    user     │  │ userProfile │  │   loading   │               │   │
│  │  │  User|null  │  │  {name,     │  │  boolean    │               │   │
│  │  │             │  │   email}    │  │             │               │   │
│  │  │             │  │    |null    │  │             │               │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘               │   │
│  │                                                                      │   │
│  │  Source: Firebase Auth (onAuthStateChanged)                        │   │
│  │  Managed by: AuthContext                                           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        TOAST STATE                                   │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │ toasts: Array<{id, message, type: 'success'|'error'|'info', │   │   │
│  │  │               duration}>                                      │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  │                                                                      │   │
│  │  Managed by: ToastContext                                          │   │
│  │  Functions: addToast(), removeToast(), clearAll()                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    APPLICATION STATE                                │   │
│  │                                                                      │   │
│  │  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐          │   │
│  │  │  SCREENING    │ │   SELF-CARE   │ │  COMMUNITY    │          │   │
│  │  │  State        │ │    State      │ │    State      │          │   │
│  │  │ ──────────── │ │ ─────────────  │ │ ────────────  │          │   │
│  │  │+ currentStep  │ │+ gratitude[]  │ │+ stories[]    │          │   │
│  │  │+ answers[]    │ │+ wins[]       │ │+ isLoading    │          │   │
│  │  │+ score        │ │+ journalEntry │ │+ error        │          │   │
│  │  │+ result       │ │+ challenges[] │ │               │          │   │
│  │  │               │ │+ planProgress │ │               │          │   │
│  │  └───────┬───────┘ └───────┬───────┘ └───────┬───────┘          │   │
│  │          │                 │                 │                  │   │
│  │          ▼                 ▼                 ▼                      │   │
│  │  ┌───────────────────────────────────────────────────────────┐   │   │
│  │  │              FIRESTORE (Realtime Subscriptions)           │   │   │
│  │  │  onSnapshot() listeners for real-time updates            │   │   │
│  │  └───────────────────────────────────────────────────────────┘   │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Package/Module Structure

```
src/
├── main.tsx                    # Application entry point
├── App.tsx                     # Root component with providers and routing
├── index.css                   # Global styles
│
├── backend/
│   ├── firebase.ts             # Firebase initialization
│   └── firebase.d.ts           # Firebase type declarations
│
├── context/
│   ├── AuthContext.tsx         # Authentication state management
│   └── ToastContext.tsx        # Toast notification system
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx          # Navigation bar
│   │   └── Footer.tsx          # Footer component
│   │
│   ├── ui/                     # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── ChartBar.tsx
│   │   ├── ErrorBanner.tsx
│   │   ├── Loader.tsx
│   │   └── StatsCard.tsx
│   │
│   ├── selfcare/               # Self-care feature components
│   │   ├── GratitudeList.tsx
│   │   ├── JournalSection.tsx
│   │   ├── SelfCarePlan.tsx
│   │   ├── SelfCareSummary.tsx
│   │   └── WinsTracker.tsx
│   │
│   ├── chatbot/                # Chatbot component (future)
│   │
│   └── RequireAuth.tsx         # Route protection component
│
├── pages/                      # Page components
│   ├── Admin.tsx
│   ├── Community.tsx
│   ├── Dashboard.tsx
│   ├── EmotionalCare.tsx
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Resources.tsx
│   ├── Screening.tsx
│   └── SelfCare.tsx
│
├── services/                    # Business logic layer
│   ├── authService.ts          # Authentication functions
│   ├── userService.ts          # User profile & achievements
│   ├── selfCareService.ts      # Self-care data operations
│   ├── screeningService.ts     # Screening & metrics
│   └── communityService.ts     # Community stories
│
├── hooks/                      # Custom React hooks
│   ├── useAchievements.ts
│   ├── useCommunityStories.ts
│   ├── useDashboardMetrics.ts
│   ├── useScreeningFlow.ts
│   ├── useSelfCareData.ts
│   ├── useSelfCareStats.ts
│   ├── useSelfCareSummary.ts
│   └── useUserScreenings.ts
│
└── utils/
    └── dateUtils.ts            # Date formatting utilities
```

---

## 9. Relationships Summary

### User-to-Data Relationships
| Entity | Collection | Relationship |
|--------|-----------|--------------|
| User | `users/{uid}` | One-to-One (profile) |
| User | `users/{uid}/achievements` | One-to-One |
| User | `users/{uid}/selfCare` | One-to-Many |
| User | `users/{uid}/gratitude` | One-to-Many |
| User | `users/{uid}/wins` | One-to-Many |
| User | `users/{uid}/challenges` | One-to-Many |
| User | `users/{uid}/planProgress` | One-to-Many (by date) |
| User | `users/{uid}/screeningResults` | One-to-Many |
| User | `communityStories` | Many-to-Many (author) |

### Service Dependencies
```
authService
    └── firebase/auth

userService
    ├── firebase/auth
    └── firebase/firestore

selfCareService
    └── firebase/firestore

screeningService
    └── firebase/firestore

communityService
    └── firebase/firestore
```

---

## 10. Key Security Rules (Firestore)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // User can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Achievements subcollection
      match /profile/achievements {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      // User subcollections
      match /{subcollection}/{documentId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Community stories - read by all, write by authenticated users
    match /communityStories/{storyId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.authorId;
    }
  }
}
```

---

## 11. API Summary

### Authentication API
| Function | Description | Parameters |
|----------|-------------|------------|
| `registerWithEmail` | Register with email/password | email, password, name |
| `loginWithEmail` | Login with email/password | email, password |
| `loginWithGoogle` | Login with Google OAuth | - |
| `logout` | Sign out current user | - |

### User Service API
| Function | Description | Parameters |
|----------|-------------|------------|
| `ensureUserProfile` | Create/update user profile | user, customName? |
| `fetchUserProfile` | Get user profile | uid |
| `updateUserName` | Update user name | uid, name |
| `fetchUserAchievements` | Get user achievements | uid |
| `updateAchievement` | Update specific achievement | uid, achievementKey, value |
| `watchAchievements` | Real-time achievement subscription | uid, onUpdate, onError |

### Self-Care Service API
| Function | Description | Parameters |
|----------|-------------|------------|
| `saveSelfCareEntry` | Save complete self-care entry | userId, entry |
| `fetchSelfCareEntries` | Get all self-care entries | userId |
| `addGratitudeItem` | Add gratitude item | userId, item, dateStr? |
| `fetchGratitudeItems` | Get all gratitude items | userId |
| `addWin` | Add a win entry | userId, win, dateStr? |
| `fetchWins` | Get all wins | userId |
| `deleteGratitudeItem` | Remove gratitude item | userId, itemId |
| `deleteWinById` | Remove a win | userId, winId |
| `createChallenge` | Create new challenge | userId, challenge |
| `updateChallengeProgress` | Update challenge days | userId, challengeId, days |
| `togglePlanItem` | Toggle plan item for date | userId, dateStr, key, value |
| `watchGratitudeItems` | Real-time gratitude subscription | userId, dateStr, onUpdate |
| `watchWins` | Real-time wins subscription | userId, dateStr, onUpdate |
| `watchChallenges` | Real-time challenges subscription | userId, onUpdate |
| `watchPlanProgress` | Real-time plan progress subscription | userId, dateStr, onUpdate |
| `watchJournalEntries` | Real-time journal subscription | userId, onUpdate |

### Screening Service API
| Function | Description | Parameters |
|----------|-------------|------------|
| `saveScreeningResult` | Save stress screening | userId, score, level |
| `fetchUserScreeningResults` | Get user screening history | userId |
| `processDashboardMetrics` | Calculate dashboard data | results |

### Community Service API
| Function | Description | Parameters |
|----------|-------------|------------|
| `postStory` | Submit new story | excerpt, author?, authorId? |
| `fetchStories` | Get paginated stories | pageSize?, cursor? |
| `fetchUserStories` | Get stories by user | userId, pageSize? |
| `updateStory` | Update story content | storyId, newExcerpt |
| `deleteStory` | Delete a story | storyId |
| `reactToStory` | Add reaction to story | storyId |

---

*Document generated for UML diagram creation. Last updated: Project development phase.*

