# SubSync AI — Component Dependency Graph & Module Directed Acyclic Graph (DAG)

**Document Classification:** Official Engineering Specification (Volume 15 of 34)  
**Author:** Architecture Review Board & Principal Systems Architect  
**Version:** 5.0.0-ENTERPRISE  

---

## 1. Architectural Significance of Dependency Graphs

Understanding the exact Directed Acyclic Graph (DAG) of React Server Components, Client Components, and Atomic Primitives is critical for optimizing bundle trees and preventing circular dependency cycles during code splitting.

---

## 2. Global Component Directed Acyclic Graph

```mermaid
graph TD
    subgraph Root Layout Layer
        RootLayout["app/layout.tsx (Server Component)"] --> ThemeProvider["next-themes ThemeProvider"]
        RootLayout --> AuthProvider["lib/contexts/auth-context.tsx (Client Provider)"]
        RootLayout --> Toaster["sonner Toaster Primitive"]
    end

    subgraph Authenticated Workspace Shell
        AppLayout["app/(app)/layout.tsx"] --> ProtectedRoute["components/protected-route.tsx"]
        ProtectedRoute --> AppSidebar["components/app-sidebar.tsx"]
        ProtectedRoute --> MobileNav["components/mobile-nav.tsx"]
    end

    subgraph Feature Modules
        DashboardClient["app/dashboard/page.tsx"] --> SourceVideoCard["components/dashboard/SourceVideoCard.tsx"]
        DashboardClient --> SubtitleUploadCard["components/dashboard/SubtitleUploadCard.tsx"]
        DashboardClient --> StylingCard["components/dashboard/StylingCard.tsx"]
        DashboardClient --> LivePreviewCard["components/dashboard/LivePreviewCard.tsx"]

        EditorPage["app/library/subtitles/[id]/page.tsx"] --> EditableCue["components/subtitles/editor/EditableCue.tsx"]
        EditorPage --> GradeBar["components/subtitles/editor/GradeBar.tsx"]
    end

    subgraph Atomic UI Layer (components/ui/*)
        SourceVideoCard --> Input["ui/input.tsx"]
        SourceVideoCard --> Card["ui/card.tsx"]
        SubtitleUploadCard --> Button["ui/button.tsx"]
        LivePreviewCard --> Badge["ui/badge.tsx"]
    end
```

---

## 3. Undocumented Dependency Analysis & Remediation
- **Identified Risk:** `DashboardClient` imports multiple heavy chart and drag-and-drop subcomponents synchronously.
- **Recommended Implementation:** Convert `LivePreviewCard` and `StylingCard` into dynamic imports using Next.js `dynamic(() => import(...), { ssr: false })` to reduce initial main-thread script execution time.
