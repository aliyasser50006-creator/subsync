# SubSync AI — Event & Analytics Tracking Catalog

**Document Classification:** Official Engineering Specification (Volume 21 of 34)  
**Author:** Architecture Review Board & Principal Product Manager  
**Version:** 5.0.0-ENTERPRISE  

---

## 1. Analytics Event Taxonomy & Schema Definitions

| Event Name | Trigger Location | Description | Payload Properties | Strategic Business Value |
| :--- | :--- | :--- | :--- | :--- |
| `user_registered` | `/register` | Fired when a new user completes account onboarding. | `{ user_id, timestamp, signup_method }` | Evaluates top-of-funnel customer acquisition conversion rates. |
| `job_created` | `/dashboard` | Fired when a conversion job successfully inserts into the database. | `{ job_id, user_id, video_url_domain, subtitle_file_size_bytes }` | Measures core platform ingestion velocity and cloud workload volume. |
| `conversion_completed` | Server Worker | Fired when SRT to WebVTT conversion completes without error. | `{ job_id, processing_time_ms, line_count }` | Benchmarks caption conversion speed and algorithm efficiency. |
| `daw_editor_opened` | `/library/subtitles/[id]`| Fired when an editor opens the interactive DAW studio. | `{ subtitle_id, line_count, initial_grade }` | Identifies active usage rates of high-end quality inspection tools. |
| `subtitle_exported` | DAW Top Bar | Fired when an editor downloads the final WebVTT asset file. | `{ subtitle_id, export_format, final_grade }` | Measures end-to-end task completion and user workflow success. |
