# SubSync AI — Enterprise Logging & Observability Guide

**Document Classification:** Official Engineering Specification (Volume 25 of 34)  
**Author:** Architecture Review Board & Principal Site Reliability Engineer (SRE)  
**Version:** 5.0.0-ENTERPRISE  

---

## 1. Observability Architecture & Standards

Production observability relies on structured JSON logging dispatched to central log aggregation pipelines (e.g., Datadog, Sentry, or Vercel Analytics).

---

## 2. Log Severity & Alerting Matrix

| Log Level | Trigger Heuristic | Aggregation Destination | Alerting Policy |
| :--- | :--- | :--- | :--- |
| `INFO` | Routine user logins, successful job ingestions, and batch file exports. | Vercel Analytics / Logstream | 24-hour aggregation dashboard. |
| `WARN` | Malformed URL ingestion attempts, password retry thresholds exceeded. | Datadog Security Console | Passive Slack daily report digest. |
| `ERROR` | API Route Handler unhandled exceptions, Supabase storage 502 failures. | Sentry Error Tracking | Immediate Slack alert to `#eng-oncall`. |
| `CRITICAL` | Row-Level Security violation attempts, database pool exhaustion, JWT key compromise. | PagerDuty Incident Dispatch | Instant automated phone call & SMS page to DevOps lead. |
