# SubSync AI — Database Migration History & Schema Changelog

**Document Classification:** Official Engineering Specification (Volume 17 of 34)  
**Author:** Architecture Review Board & Database Architect  
**Version:** 5.0.0-ENTERPRISE  

---

## 1. Schema Migration Governance

All database mutations occur through versioned SQL migration scripts executed via the Supabase CLI (`supabase db push`). Manual table mutations via console interfaces are strictly forbidden in production.

---

## 2. Complete Migration History Matrix

| Migration Script Version | Timestamp | Target Tables | Summary of Schema Changes | Rollback Strategy |
| :--- | :--- | :--- | :--- | :--- |
| `20240101000000_init_schema.sql` | 2024-01-01 | `jobs`, `subtitles` | Initial table creation, UUID primary keys, and foreign key references to `auth.users`. | `DROP TABLE IF EXISTS jobs, subtitles CASCADE;` |
| `20240215000000_enable_rls.sql` | 2024-02-15 | `jobs`, `subtitles` | Enforced Row-Level Security (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`) and tenant isolation policies. | Drop individual SQL policies on target tables. |
| `20240310000000_add_settings_jsonb.sql`| 2024-03-10 | `jobs` | Added `subtitle_settings JSONB DEFAULT '{}'::jsonb` column for custom typography styling. | `ALTER TABLE jobs DROP COLUMN subtitle_settings;` |
| `20240401000000_storage_buckets.sql` | 2024-04-01 | `storage.buckets` | Initialized private `subtitles` storage bucket and configured folder-level access policies. | `DELETE FROM storage.buckets WHERE id = 'subtitles';` |

---

## 3. Recommended Migration Improvements
- **Automated Rollback Scripts:** Ensure every forward migration script pairs with an explicit `_down.sql` rollback script integrated into CI/CD deployment verification checks.
