# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Mobile App (Flutter):**
    - `LocationService` for real-time GPS tracking and permission handling.
    - `EmergencyService` for communicating with Firebase Cloud Functions.
    - UI Screens: `LoginScreen` (Anonymous Auth), `HomeScreen` (Panic Button), `PanicConfirmScreen` (Countdown), `SilentReportScreen`.
    - State Management using `Provider` pattern (`AuthProvider`).
- **Backend (Firebase):**
    - Cloud Functions v2 implementation:
        - `triggerEmergency`: Creates incident in Firestore (Siren API mocked).
        - `cancelEmergency`: Resolves incident (Siren deactivation mocked).
        - `createSilentReport`: Stores silent alerts with sub-types.
        - `getHeatmapData`: Retreives incident location data.
    - Firestore Rules for `barrios`, `usuarios`, and `incidentes` collections.
    - `setRole.ts` script for assigning RBAC roles (`superadmin`, `comite`).
- **Web Panel (React + Vite):**
    - `ComiteDashboard`: Real-time incident visualization with ScatterChart Heatmap.
    - `SuperAdminDashboard`: Global metrics and Barrio management (Create/List).
    - `db.ts` service for centralized Firestore data fetching.
    - Authentication flow with `LoginPage`.
- **Documentation:**
    - `USER_MANUAL.md`: Guide for End Users and Committee members.
    - `AUDIT_REPORT.md`: Detailed analysis of implementation vs requirements.
    - `COMPLIANCE_MATRIX.md`: Feature-by-feature status breakdown.
    - `FUTURE_ROADMAP.md`: Strategic next steps for the project.

### Changed
- **Architecture:** Migrated Cloud Functions from v1 to v2 for improved performance and type safety.
- **Deployment:** Implemented `deploy.sh` for unified, automated deployment of Backend and Web Panel.
- **Security:** Sanitized entire repository for Open Source release:
    - Removed `google-services.json` and `GoogleService-Info.plist`.
    - Removed `.env` and `.env.local` files.
    - Replaced hardcoded API keys in `firebase_options.dart` with placeholders.
    - Updated `.gitignore` with comprehensive exclusion rules.

### Fixed
- **Deployment:** Resolved `TypeError: functions.pubsub.schedule is not a function` by upgrading to v2 scheduler.
- **Hosting:** Fixed "No currently active project" error during Web Panel deployment.
- **Dependencies:** Added missing `recharts` dependency to Web Panel.

### Removed
- **Legacy:** Deleted old v1 Cloud Functions to prevent deployment conflicts.
- **Sensitive Data:** Removed all local environment configuration files to ensure security.

---

## Roadmap

Prioritized list of pending features based on `COMPLIANCE_MATRIX.md`.

### 🔴 High Priority (Critical for MVP)
- [ ] **Mobile:** Implement **Phone Authentication** (replace Anonymous login) to verify user identity.
- [ ] **Mobile:** Implement **Push Notifications (FCM)** to alert neighbors when an emergency is triggered.

### 🟡 Medium Priority (Core Functionality)
- [ ] **Backend:** Implement real **IoT Siren Integration** (HTTP/MQTT calls to Tuya/Sonoff APIs).
- [ ] **Mobile:** Add **SuccessScreen** to provide feedback after submitting a report.
- [ ] **Backend:** Implement `generateMonthlyReport` logic in the scheduler.

### 🟢 Low Priority (Enhancements)
- [ ] **Web:** Add **PDF Export** functionality for monthly reports in `ComiteDashboard`.
- [ ] **Docs:** Create a visual **Architecture Diagram**.
