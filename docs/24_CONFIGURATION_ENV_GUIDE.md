# SubSync AI — Configuration & Environment Variables Guide

**Document Classification:** Official Engineering Specification (Volume 24 of 34)  
**Author:** Architecture Review Board & Principal DevOps Lead  
**Version:** 5.0.0-ENTERPRISE  

---

## 1. Environment Variable Governance

All secret API keys and configuration parameters are injected via environment variables (`.env.local` for local workstations, cloud secrets manager for Vercel/production environments). Client-side bundles only receive keys explicitly prefixed with `NEXT_PUBLIC_`.

---

## 2. Complete Environment Variable Reference

| Variable Key | Scope | Required? | Example Value | Operational Description |
| :--- | :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Client & Server | **Yes** | `https://xyzcompany.supabase.co` | HTTPS gateway endpoint for Supabase GoTrue Auth and PostgreSQL queries. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client & Server | **Yes** | `eyJhbGciOiJIUzI1NiIsInR...` | Public anonymous JWT enabling browser communication with Supabase APIs. |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server Only** | **Yes** | `eyJhbGciOiJIUzI1NiIsInR...` | High-privilege secret key bypassing Row-Level Security for background administrative workers. |
| `MAX_UPLOAD_SIZE_BYTES` | Server Only | Optional | `15728640` | Maximum allowed `.srt`/`.vtt` file size in bytes (Default: 15 MB). |
