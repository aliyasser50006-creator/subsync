# SubSync AI — REST API & Server Action Documentation

**Document Classification:** Official Engineering Specification (Volume 7 of 13)  
**Author:** Principal Backend Architect & API Specialist  
**Version:** 4.0.0-ENTERPRISE  

---

## 1. REST Endpoint Specifications

### 1.1 `POST /api/jobs/create`
- **Authentication:** Requires valid `Authorization: Bearer <Supabase_JWT>` header.
- **Request Payload Schema:**
  ```json
  {
    "title": "Production Demo",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "subtitleFile": "uuid-folder/1719900000_captions.vtt",
    "subtitleSettings": { "fontSize": 24, "fontColor": "#FFFFFF", "position": "bottom" }
  }
  ```
- **Validation & Response:** Validates media URL scheme and verifies session ownership. Returns HTTP `200 OK` with created job JSON record.

### 1.2 `PATCH /api/jobs/update`
- **Authentication:** Requires Bearer JWT header.
- **Request Payload:** `{ "jobId": "uuid", "title": "Updated Title", "videoUrl": "https://..." }`
- **Database Action:** Mutates `jobs` table strictly where `id = jobId AND user_id = auth.uid()`.

### 1.3 `GET /api/subtitles/content?path=<base64url_path>`
- **Authentication:** Evaluates session cookies or bearer token.
- **Behavior:** Decodes Base64URL string (`decodeId`), fetches raw object stream from Supabase `subtitles` bucket, and serves with explicit HTTP headers (`Content-Type: text/vtt; charset=utf-8`, `Cache-Control: private, no-store`).

---

## 2. Server Action Specifications (`lib/actions/subtitles.ts`)

- `saveSubtitleContent(id, content)`: Validates active user session on Next.js server, overwrites storage blob, and updates `updated_at` timestamp in database.
