# SubSync AI — Feature Flags & Progressive Rollout Catalog

**Document Classification:** Official Engineering Specification (Volume 23 of 34)  
**Author:** Architecture Review Board & DevOps Lead  
**Version:** 5.0.0-ENTERPRISE  

---

## 1. Feature Flag Governance & Progressive Rollout Strategy

To mitigate production deployment risk, complex features are gated behind runtime environment configuration flags or feature gating systems (e.g., LaunchDarkly or Supabase remote config).

---

## 2. Active Feature Flag Matrix

| Flag Key | Default State | Target Environment | Gated Feature Description | Rollout Strategy & Fallback |
| :--- | :--- | :--- | :--- | :--- |
| `ENABLE_WEB_WORKER_CONVERSION` | `false` | Staging / Prod | Offloads `.srt` parsing to `subtitle-worker.js`. | Rollout to 10% of users. Fallback: Synchronous main-thread conversion. |
| `ENABLE_VIRTUALIZED_DAW_TABLE` | `false` | Staging / Prod | Activates `@tanstack/react-virtual` inside DAW editor. | Enabled for large workspaces. Fallback: Direct React DOM row rendering. |
| `ENABLE_AI_WHISPER_TRANSCRIPT` | `false` | Internal Beta | Displays "Auto-Transcribe with AI" button on `/dashboard`. | Hidden from general availability until backend GPU workers scale. |
