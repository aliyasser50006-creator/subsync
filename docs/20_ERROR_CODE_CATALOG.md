# SubSync AI — Error Code Catalog & Exception Taxonomy

**Document Classification:** Official Engineering Specification (Volume 20 of 34)  
**Author:** Architecture Review Board & Principal Systems Architect  
**Version:** 5.0.0-ENTERPRISE  

---

## 1. Enterprise Error Code Taxonomy

| Error Code | HTTP Status | Origin Layer | Description & Root Cause | Client-Facing Toast Message | Recommended Log Level |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `AUTH_INVALID_CREDENTIALS` | `400 Bad Request` | Supabase GoTrue | Submitted email/password combination failed authentication verification. | "Invalid login credentials. Please try again." | `WARN` |
| `AUTH_MISSING_BEARER` | `401 Unauthorized` | API Route Handlers | API request dispatched without an `Authorization: Bearer` header. | "Session expired. Please sign in again." | `ERROR` |
| `INGEST_INVALID_MEDIA_URL` | `422 Unprocessable` | `/api/jobs/create` | Video URL failed schema validation or pointed to unsupported media protocols. | "Invalid video URL format. Please provide an HTTP/HTTPS link." | `WARN` |
| `STORAGE_UPLOAD_FAILED` | `502 Bad Gateway` | Supabase Storage | S3 storage bucket rejected binary upload due to network interruption or RLS failure. | "Failed to upload caption file. Please retry." | `ERROR` |
| `DB_RLS_POLICY_VIOLATION` | `403 Forbidden` | PostgreSQL RLS | Authenticated user attempted to mutate or query records owned by another tenant UUID. | "Access denied. You do not have permission to access this resource." | `CRITICAL` |
