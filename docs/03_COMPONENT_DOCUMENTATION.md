# SubSync AI — Complete Component Documentation

**Document Classification:** Official Engineering Specification (Volume 3 of 13)  
**Author:** Principal Software Architect & UI Framework Engineer  
**Version:** 4.0.0-ENTERPRISE  

---

## 1. Atomic UI Component Inventory (`components/ui/*`)

### 1.1 `Button` (`components/ui/button.tsx`)
- **Purpose:** Accessible interactive trigger enforcing WAI-ARIA keyboard focusability and Radix slot polymorphism.
- **Props Schema:** `variant` (`default`, `destructive`, `outline`, `secondary`, `ghost`, `link`), `size` (`default`, `sm`, `lg`, `icon`), `asChild` (boolean).
- **Performance & Rendering:** Memoized via standard class variance authority (`cva`) evaluation. Zero external network dependencies.
- **Accessibility:** Enforces `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`.

### 1.2 `Card` (`components/ui/card.tsx`)
- **Purpose:** Structured container establishing visual elevation and glassmorphic surface consistency.
- **Children Structure:** `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.
- **Design Tokens:** `rounded-lg border bg-card text-card-foreground shadow-sm`.

---

## 2. Studio Feature Modules (`components/dashboard/*`)

### 2.1 `SourceVideoCard` (`components/dashboard/SourceVideoCard.tsx`)
- **Purpose:** Collects and validates remote media metadata before conversion.
- **Props:** `title: string`, `setTitle: (s: string) => void`, `videoUrl: string`, `setVideoUrl: (s: string) => void`.
- **Internal State & Hooks:** Evaluates URL protocol validity on blur via regular expression heuristics.

### 2.2 `SubtitleUploadCard` (`components/dashboard/SubtitleUploadCard.tsx`)
- **Purpose:** Drag-and-drop file ingestion zone converting local files into binary or text payloads.
- **Props:** `file: File | null`, `onFileUpload: (f: File) => void`, `onRemoveFile: () => void`.
- **Helper Integration:** Utilizes `formatBytes` utility to convert raw byte counts into human-readable strings (`KB`, `MB`).

---

## 3. Subtitle DAW Workstation Components (`components/subtitles/editor/*`)

### 3.1 `EditableCue` Row Component
- **Purpose:** High-density table row rendering individual subtitle timecodes and text captions.
- **Props:** `index: number`, `cue: SubtitleCue`, `onChange: (updated: SubtitleCue) => void`, `onDelete: () => void`.
- **Re-render Triggers:** Updates whenever parent cues array mutates or active selection cursor shifts.
- **Refactoring Opportunity:** For lists exceeding 500 cues, wrap rows inside `@tanstack/react-virtual` to prevent React tree layout thrashing.
