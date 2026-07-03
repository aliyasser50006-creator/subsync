# SubSync AI — Technical Debt Register & Refactoring Roadmap

**Document Classification:** Official Engineering Specification (Volume 31 of 34)  
**Author:** Architecture Review Board & Principal Software Architect  
**Version:** 5.0.0-ENTERPRISE  

---

## 1. Technical Debt Inventory & Paydown Strategy

| Debt ID | Architectural Module | Description of Technical Debt | Architectural Impact | Paydown Priority | Recommended Refactoring Strategy |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **DEBT-01** | REST API Handlers (`/api/jobs/*`) | Duplicated bearer token extraction and Supabase client instantiation code across route handlers. | Violates DRY principle; increases maintenance overhead if auth logic changes. | **High** | Create centralized higher-order API wrapper (`withAuthHandler`) handling session verification. |
| **DEBT-02** | DAW Editor Studio | Unvirtualized table rendering in `SubtitleEditorPage` renders all cue rows directly into DOM. | Slows down React reconciliation on large files (>1,000 cues). | **High** | Wrap cue table rows inside `@tanstack/react-virtual` to virtualize DOM rendering. |
