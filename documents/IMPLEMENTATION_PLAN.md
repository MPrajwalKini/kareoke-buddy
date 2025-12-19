# Implementation Plan

## Phase 1: Project Setup
- [ ] Initialize Monorepo structure (Web + Mobile + Shared).
- [ ] Configure TypeScript and Linting.
- [ ] Setup Tailwind CSS for Web.

## Phase 2: Core Logic (Shared/Lib)
- [ ] Define TypeScript Interfaces (`PlaylistItem`, `Playlist`).
- [ ] Implement Excel/CSV Parser (`xlsx` library).
- [ ] Implement Playback State Machine (Store/Context).
- [ ] Implement YouTube URL Parser & Validator.

## Phase 3: Web Implementation (Next.js)
- [ ] **UI Layout**: Sidebar (Playlist), Main Stage (Player), Controls (Bottom).
- [ ] **File Input**: Drag & Drop zone for Excel + Video Files.
- [ ] **Playlist Manager**: Render list, sorting, status indicators.
- [ ] **Players**:
    - Build `LocalVideoPlayer` component.
    - Build `YouTubePlayer` component.
    - Build `UnifiedPlayer` container.
- [ ] **Integration**: Connect State Machine to UI.

## Phase 4: Mobile Implementation (React Native)
- [ ] **Navigation**: Screen setup.
- [ ] **Permission**: File system permissions (Android/iOS).
- [ ] **File Picker**: Folder scanning logic.
- [ ] **Players**:
    - `react-native-video` for local.
    - `react-native-youtube-iframe` for YouTube.
- [ ] **Sync**: Ensure logic parity with Web.

## Phase 5: Polish & Testing
- [ ] Error handling (Missing files).
- [ ] Styling (Animations, Glassmorphism).
- [ ] Responsive Design.
