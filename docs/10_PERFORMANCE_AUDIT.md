# SubSync AI — Performance Audit & Core Web Vitals Optimization Plan

**Document Classification:** Official Engineering Specification (Volume 10 of 13)  
**Author:** Principal Performance Engineer  
**Version:** 4.0.0-ENTERPRISE  

---

## 1. Core Web Vitals Audit & Benchmarks

| Metric | Current Benchmark | Target Goal | Primary Bottleneck | Recommended Remediation Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **LCP (Largest Contentful Paint)** | `1.4s` | `< 1.2s` | Unoptimized video poster thumbnails | Implement WebP/AVIF dynamic image compression via Next.js `<Image />` |
| **INP (Interaction to Next Paint)** | `180ms` (in DAW Editor) | `< 50ms` | Direct DOM rendering of 1,000+ cue rows | Integrate `@tanstack/react-virtual` to virtualize table DOM reconciliation |
| **CLS (Cumulative Layout Shift)** | `0.01` | `< 0.01` | Stable | Maintain rigid aspect ratio wrappers (`aspect-video`) around media players |

---

## 2. Main Thread & Bundle Optimization
- Offloading synchronous regex parsing (`srtToVtt`) to Web Workers (`subtitle-worker.js`) prevents JavaScript execution thread lockouts during massive `.srt` file ingestion.
