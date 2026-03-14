# MindScan+ (Mental Wellness Application)

Welcome to the central documentation for MindScan+. This platform is designed to provide users with adaptive stress screening, actionable emotional care resources, daily progress tracking, and access to verified Indian mental health professionals.

## Documentation Structure

This `/docs` folder acts as the single source of truth for the codebase architecture, logic flows, and page documentation.

### Core Documentation
- **[Feature & Page Guide](./pages.md)**: Details the purpose and function of each main UI route (Dashboard, Screening, Resources, etc.).
- **[Business Logic & Systems](./logic.md)**: Explains the internal mechanisms like the Adaptive Screening Engine, Streak calculation, and Firebase data structures.
- **[Asset Guidelines](./assets.md)**: Describes where images, SVGs, and audio embeds are stored or referenced.
- **[Changelog](./CHANGELOG.md)**: Documentation of recent bug fixes, features, and config upgrades.

### Legacy / Supplemental Documents
*These files were historically used during development but are still relevant for understanding earlier architectural decisions:*
- `UML_DOCUMENTATION.md` - Original class structures and UML planning.
- `TODO.md` - Ongoing project backlog.
- `FIXES_SUMMARY.md` / `SELFCARE_FIXES.md` - Historical change logs for specific module rebuilds.
- `TESTING_CHECKLIST.md` - QA guidelines.

## Quick Start
1. Run `npm install`
2. Run `npm run dev` to start the Vite development server.
3. The app is connected to Firebase for Authentication and Firestore (Database). Check `src/backend/firebase.ts` for configuration.

---
*Maintained by the MindScan+ Development Team (2024-2025).*
