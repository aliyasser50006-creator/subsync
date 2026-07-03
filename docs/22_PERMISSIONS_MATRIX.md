# SubSync AI — Permissions & Access Control Matrix

**Document Classification:** Official Engineering Specification (Volume 22 of 34)  
**Author:** Architecture Review Board & Principal Security Engineer  
**Version:** 5.0.0-ENTERPRISE  

---

## 1. Role-Based Access Control (RBAC) & Tenant Security

SubSync AI enforces strict tenant isolation using Supabase GoTrue UUIDs evaluated against PostgreSQL Row-Level Security policies.

---

## 2. Exhaustive Permissions Matrix

| Resource / Action | Public Visitor | Authenticated Tenant Owner | Foreign Authenticated Tenant | System Admin / Service Role | Enforcement Layer |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **View Landing Page (`/`)** | Allowed | Redirected to `/dashboard` | Redirected to `/dashboard` | Allowed | Next.js Router Interceptor |
| **Sign In / Register** | Allowed | Redirected to `/dashboard` | Redirected to `/dashboard` | Allowed | Client Route Guard |
| **Create Job (`POST /api/jobs/create`)** | Denied (`401`) | Allowed | Allowed (Creates in own workspace)| Allowed | API Token Verification |
| **Select Job Records (`SELECT FROM jobs`)**| Denied | Allowed (Where `auth.uid() = user_id`)| Denied (RLS filters out foreign rows)| Allowed (Bypasses RLS)| PostgreSQL RLS Policy |
| **Mutate Subtitles (`PATCH /api/jobs/update`)**| Denied (`401`)| Allowed (Where `id` matches)| Denied (`404 Not Found`)| Allowed | API Handler + RLS |
| **Download Blob (`GET /api/subtitles/content`)**| Denied | Allowed | Denied | Allowed | Storage Bucket RLS |
