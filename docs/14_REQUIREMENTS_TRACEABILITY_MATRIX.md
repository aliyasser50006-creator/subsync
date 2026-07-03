# SubSync AI — Requirements Traceability Matrix (RTM)

**Document Classification:** Official Engineering Specification (Volume 14 of 34)  
**Author:** Architecture Review Board & Principal QA Architect  
**Version:** 5.0.0-ENTERPRISE  

---

## 1. Traceability Methodology & Importance

The Requirements Traceability Matrix (RTM) links every high-level functional and architectural requirement directly to its interface implementation, backend API route handler, database entity, and automated verification test case.
- **Why it is important:** Without end-to-end bidirectional traceability, engineering teams cannot evaluate the regression impact of database or API refactoring.
- **Where documented:** Serves as the master QA and Product alignment table.

---

## 2. Master Requirements Traceability Matrix

| Req ID | Requirement Description | UI / Page Route | Component / Action | REST API / Server Action | Database Table / Column | Automated Test Case ID | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **REQ-AUTH-01** | User account creation via email/password credentials. | `/register` | `RegisterPage` form | `supabase.auth.signUp()` | `auth.users` (Supabase schema) | `TC-AUTH-REG-001` | Implemented |
| **REQ-AUTH-02** | Session persistence and unauthenticated redirect guard. | `/` (Entry guard) | `ProtectedRoute` | `supabase.auth.getUser()` | N/A (HTTP-only JWT cookies) | `TC-AUTH-GRD-002` | Implemented |
| **REQ-ING-01** | Ingest external video URL (HTTP/HTTPS validation). | `/dashboard` | `SourceVideoCard` | `POST /api/jobs/create` | `jobs.video_url` | `TC-ING-URL-001` | Implemented |
| **REQ-ING-02** | Parse local `.srt` caption file into memory. | `/dashboard` | `SubtitleUploadCard` | `readSubtitleFileAsText()` | N/A (Memory ArrayBuffer) | `TC-ING-SRT-002` | Implemented |
| **REQ-CNV-01** | Client-side high-speed conversion of `.srt` to WebVTT. | `/dashboard` | `DashboardClient` | `srtToVtt(srtString)` | N/A (Client converter utility)| `TC-CNV-VTT-001` | Implemented |
| **REQ-STO-01** | Secure private bucket storage of WebVTT payloads. | `/dashboard` | Storage Client | `supabase.storage.from('subtitles').upload()` | `storage.objects` (`subtitles` bucket) | `TC-STO-UPL-001` | Implemented |
| **REQ-JOB-01** | Database persistence of conversion job metadata. | `/dashboard` | `POST /api/jobs/create` | Next.js API Route Handler | `jobs` table (user_id, title, status) | `TC-JOB-CRE-001` | Implemented |
| **REQ-LIB-01** | Infinite scrolling catalog of user video projects. | `/library` | `LibraryClient` | `@tanstack/react-query` infinite scroll | `SELECT * FROM jobs WHERE user_id = auth.uid()` | `TC-LIB-INF-001` | Implemented |
| **REQ-DAW-01** | Subtitle cue timecode shifting and inline text editing. | `/library/subtitles/[id]`| `EditableCue` | `useEditorState` hook | `subtitles.subtitle_content` | `TC-DAW-MUT-001` | Implemented |
| **REQ-DAW-02** | Automated CPS (>20) and duration (<0.8s) diagnostics. | `/library/subtitles/[id]`| Diagnostics Rail | Client validation engine | N/A (Real-time memory check)| `TC-DAW-DIA-002` | Implemented |

---

## 3. Recommended Traceability Enhancements
- **Implementation Blueprint:** Integrate automated Jest unit tests binding each test suite header to its corresponding `Req ID` (`@requirement REQ-ING-01`).
