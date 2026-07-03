# SubSync AI — UI State Catalog & Visual Heuristics

**Document Classification:** Official Engineering Specification (Volume 19 of 34)  
**Author:** Architecture Review Board & Principal UI/UX Lead  
**Version:** 5.0.0-ENTERPRISE  

---

## 1. Complete UI State Matrix Across Core Screens

| State Classification | Screen Area / Route | Trigger / Heuristic | UI Presentation & Visual Tokens | User Recovery / Action Trigger |
| :--- | :--- | :--- | :--- | :--- |
| **Loading State** | Root Interceptor (`/`) | Resolving Supabase JWT access token on initial application load. | Full-screen flex container rendering spinning `Loader2` SVG icon (`h-8 w-8 text-primary animate-spin`). | Automatic redirect once session resolves. |
| **Skeleton State** | Library Grid (`/library`) | Initial TanStack Query network fetch before video list hydration. | 8 cards rendered with CSS pulse animations (`animate-pulse bg-muted rounded-xl h-64`). | Automatic replacement upon JSON response. |
| **Empty State** | Studio Ingestion (`/dashboard`)| No `.srt` subtitle file currently attached to upload drop zone. | Glassmorphic card displaying dashed border with centered `UploadCloud` icon. | Click drop zone or drag-and-drop local file. |
| **Uploading State** | Studio Ingestion (`/dashboard`)| Active file transmission and `.srt` to WebVTT conversion in progress. | Primary action button disabled; progress bar animates from 0% to 100%. | Wait for automatic toast confirmation. |
| **Error State** | Authentication (`/login`) | Invalid email/password credentials returned by Supabase server. | Inline alert box (`bg-destructive/10 border border-destructive/20 text-destructive`). | Re-type credentials and click Sign In. |
| **Offline State** | Global Workspace | Browser network connectivity drops during active workstation editing. | Sticky top warning banner (`bg-amber-500/10 text-amber-500 border-amber-500/20`). | Reconnect network; auto-save retry triggers. |
