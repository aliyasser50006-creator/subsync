# SubSync AI — Business Rules & Domain Logic Catalog

**Document Classification:** Official Engineering Specification (Volume 18 of 34)  
**Author:** Architecture Review Board & Principal Product Manager  
**Version:** 5.0.0-ENTERPRISE  

---

## 1. Domain Logic & Invariant Catalog

| Rule ID | Domain Area | Business Rule Description | Enforcement Layer | Violation Error Code / Feedback |
| :--- | :--- | :--- | :--- | :--- |
| **BR-AUTH-01** | Identity | User account passwords must contain at least 6 alphanumeric characters. | Client & Server (`/register`) | `AUTH_WEAK_PASSWORD` ("Password must be at least 6 characters") |
| **BR-ING-01** | Video Ingestion | Input video URLs must conform strictly to `http://` or `https://` schemes. Local filesystem paths (`file://`) are blocked. | Client (`SourceVideoCard`) & API (`/api/jobs/create`) | `INGEST_INVALID_URL` ("Please enter a valid HTTP/HTTPS URL") |
| **BR-ING-02** | Subtitle Upload | Attached caption files must end with `.srt` or `.vtt` extensions and remain below 15 MB. | Client (`SubtitleUploadCard`) | `INGEST_FILE_TOO_LARGE` ("Maximum file size exceeded") |
| **BR-DAW-01** | Quality Studio | Subtitle cues exceeding 20 Characters Per Second (CPS) violate reading speed compliance standards. | Client DAW Editor (`GradeBar`) | Visual warning badge highlighted in red (`Reading Speed Violation`) |
| **BR-DAW-02** | Quality Studio | Subtitle cues with timecode durations under 0.8 seconds trigger short-duration diagnostics. | Client DAW Editor (`GradeBar`) | Visual warning badge highlighted in amber (`Short Cue Duration`) |
| **BR-TEN-01** | Data Security | Users can neither view nor mutate conversion jobs owned by foreign tenant UUIDs. | Database Row-Level Security | PostgreSQL HTTP `404 Not Found` or `401 Unauthorized` |
