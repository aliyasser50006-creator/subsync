# SubSync AI — Architecture Decision Records (ADRs)

**Document Classification:** Official Engineering Specification (Volume 32 of 34)  
**Author:** Architecture Review Board  
**Version:** 5.0.0-ENTERPRISE  

---

## 1. ADR-001: Next.js 14 App Router Framework Adoption
- **Status:** Approved & Implemented.
- **Context:** SubSync AI requires rapid initial page loads combined with secure server-side API execution.
- **Decision:** Adopt Next.js 14 App Router utilizing React Server Components for shell rendering and Client Components for interactive DAW editing.
- **Consequences:** Eliminates client-side routing waterfall delays while maintaining strict server-client boundary separation.

## 2. ADR-002: Supabase GoTrue & Row-Level Security (RLS)
- **Status:** Approved & Implemented.
- **Context:** Multi-tenant SaaS architectures require ironclad data boundary enforcement.
- **Decision:** Utilize Supabase PostgreSQL with database-level Row-Level Security (`auth.uid() = user_id`) rather than application-only permission filtering.
- **Consequences:** Protects database rows even if backend API handlers suffer logic bugs or unauthorized query bypasses.
