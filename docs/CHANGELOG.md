# Changelog

All notable changes to the MindScan+ project will be documented in this file.

## [Unreleased]

### Added
- **Screening Form UX:** Highlight missing questions visually when continuing the assessment. 
- **Auto-scroll:** Automated scrolling triggers in the screening form leading users intuitively from invalid/incomplete input blocks back to the final submission button.
- **`.firebaserc`:** Tracking deployment alias for Firebase Hosting to `"mindscanplus"`.

### Changed
- **Community Likes:** Authenticated users can now update the reactions of Community Stories (persisted locally across reloads while correctly incrementing server-side).
- **Firebase Deploy Targets:** Updated `firebase.json`'s `public` destination to `dist` (Vite's default build folder) instead of the erroneous `build` folder.
- **Firestore Logic:** Relaxed story modification constraints in `firestore.rules` allowing non-authors to apply `update` operations exclusively designed for liking stories.

### Removed
- **Community Details:** The extraneous "Comment/Message" icon counter from stories in the Community page, since no comment threading feature actively exists.
