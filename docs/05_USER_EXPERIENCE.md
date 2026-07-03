# SubSync AI — User Experience Documentation & Workflow Audit

**Document Classification:** Official Engineering Specification (Volume 5 of 13)  
**Author:** Principal UX Designer & Product Research Lead  
**Version:** 4.0.0-ENTERPRISE  

---

## 1. End-to-End User Journey Maps

```mermaid
journey
    title Subtitle Studio Ingestion & Verification Journey
    section Account Setup
      Visit Landing Page: 5: Visitor
      Complete Registration: 4: Visitor
      Confirm Email Verification: 3: User
    section Studio Ingestion
      Enter Video URL: 5: Editor
      Attach .SRT File: 5: Editor
      Trigger Live Conversion: 4: Editor
    section Quality Assurance
      Inspect Cues in DAW Studio: 5: Editor
      Resolve Reading Speed Flags: 4: Editor
      Export Final WebVTT: 5: Editor
```

---

## 2. UX Pain Points & Actionable Blueprints

1. **Tablet Sidebar Collapse Friction:** On viewports between `768px` and `1024px`, the primary vertical rail (`AppSidebar`) hides completely (`hidden lg:block`). This forces editors to repeatedly open the mobile drawer to switch between the Library and Studio.
   - *Redesign Blueprint:* Implement a slim, icons-only collapsed rail view (`w-16`) on tablet devices.
2. **Keyboard Shortcut Discoverability:** Editors frequently rely on hotkeys (`Ctrl+Z`, `Ctrl+Enter`), yet discoverability is restricted to static subheaders.
   - *Redesign Blueprint:* Integrate dynamic `<Tooltip>` wrappers around interactive studio triggers.
