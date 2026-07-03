# SubSync AI — Complete Page Specifications

**Document Classification:** Official Engineering Specification (Volume 2 of 13)  
**Author:** Principal Full-Stack Engineer & Lead Product Designer  
**Version:** 4.0.0-ENTERPRISE  

---

## 1. Page Route Topology Matrix

| Route Path | Page Name | Access Permissions | Primary Layout Shell | State Synchronization Strategy |
| :--- | :--- | :--- | :--- | :--- |
| `/` | Root Entry Interceptor | Public (Session Guard) | Full-screen Centered Spinner | Client `useAuth()` Router Push |
| `/login` | Authentication Gateway | Public (Unauthenticated) | Split-Screen Enterprise Card | Supabase GoTrue Auth Handshake |
| `/register` | Account Setup Portal | Public (Unauthenticated) | 2-Column Roadmap + Form Grid | Supabase Workspace Allocation |
| `/dashboard` | Studio Ingestion Console | Protected Workspace | Asymmetric 2-Column Dashboard | TanStack Query + Realtime WebSocket |
| `/library` | Video Asset Catalog | Protected Workspace | Toolbar + Responsive Grid/List | TanStack Infinite Query (`useInfiniteQuery`) |
| `/library/[id]` | Video Playback Studio | Protected Workspace | Split 16:9 Video Canvas + Transcript Rail | Client Video Player Imperative Ref |
| `/library/subtitles` | Subtitle Asset Manager | Protected Workspace | Toolbar + Data Grid | Bulk Selection Array State |
| `/library/subtitles/[id]` | Full-Screen Subtitle DAW Editor | Protected Workspace | High-Density 3-Panel DAW Console | Undo/Redo History Stack + AutoSave Hook |
| `/my-videos` | Job Operations Workspace | Protected Workspace | Tabbed Filter Console | TanStack Query Cache Invalidation |
| `/profile` | User Identity Overview | Protected Workspace | Centered Profile Card | Supabase User Metadata Evaluation |
| `/settings` | Security & Theme Settings | Protected Workspace | Centered Credentials & Theme Cards | `next-themes` LocalStorage Mutation |

---

## 2. Detailed Page Inspection: `/dashboard` (Studio Ingestion Console)

- **Purpose & Business Objective:** Serves as the primary operational hub where caption editors upload video URLs and subtitle files to generate live WebVTT streams.
- **Component Tree:**
  ```text
  DashboardClient
  ├── DashboardHeader (Title, Subtitle Count Badge, Keyboard Shortcut Pill)
  ├── StatusCardsBar (Video Ready, Subtitle Uploaded, Database Status)
  ├── GridContainer
  │   ├── ConfigurationStack
  │   │   ├── SourceVideoCard (Input text fields for Title & Video URL)
  │   │   ├── SubtitleUploadCard (Drop zone, File size indicator, Trash action)
  │   │   └── StylingCard (Sliders for Font Size, Color Pickers, Alignment)
  │   └── LivePreviewRail
  │       └── LivePreviewCard (Progress bar, Status pills, Copy VTT button)
  ```
- **Validation Rules & Business Heuristics:**
  - Video URLs must match strict protocol regex checks (`validateVideoUrl`).
  - `.srt` files must parse successfully without fatal character encoding errors before API dispatch.
- **States:**
  - *Empty State:* Upload card shows dashed drop target (`UploadCloud` icon).
  - *Loading State:* Dynamic progress bar (`uploadProgress` percentage) displays during file ingestion.
  - *Error State:* Sonner toast displays descriptive API failure messages.

---

## 3. Detailed Page Inspection: `/library/subtitles/[id]` (DAW Editor)

- **Purpose:** Full-screen editing environment enabling timecode shifting, text refinement, and quality assurance auditing.
- **Component Tree:** `SubtitleEditorPage` -> Top Grade Bar + Video Preview Dock + Cues Workstation Table (`EditableCue` rows) + Diagnostics Rail.
- **Business Rules:** Diagnostic engine flags reading speed violations exceeding 20 Characters Per Second (CPS) or cue durations below 0.8 seconds.
