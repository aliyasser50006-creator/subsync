# SubSync AI — Complete API Sequence Catalog

**Document Classification:** Official Engineering Specification (Volume 16 of 34)  
**Author:** Architecture Review Board & Principal Backend Lead  
**Version:** 5.0.0-ENTERPRISE  

---

## 1. Sequence Catalog Scope & Protocol Standards

This sequence catalog documents all synchronous and asynchronous HTTP/WebSocket handshakes executed between browser clients, Next.js API Route Handlers, and Supabase cloud infrastructure.

---

## 2. Sequence 1: Job Creation & Cloud Blob Attachment

```mermaid
sequenceDiagram
    autonumber
    actor Client as Browser Client Shell
    participant API as Next.js API (/api/jobs/create)
    participant Auth as Supabase Auth GoTrue
    participant Storage as Supabase Object Storage
    participant DB as Supabase PostgreSQL Database

    Client->>Storage: POST /storage/v1/object/subtitles/{user_id}/{filename}.vtt
    Storage-->>Client: 200 OK (Returns Object Path)
    Client->>API: POST /api/jobs/create (Authorization: Bearer <JWT>, Payload JSON)
    API->>Auth: supabase.auth.getUser(token)
    Auth-->>API: User UUID & Role Identity
    API->>DB: INSERT INTO jobs (user_id, title, video_url, subtitle_file)
    DB-->>API: 201 Created (Return Inserted Job Record)
    API-->>Client: HTTP 200 OK (Job Object JSON)
```

---

## 3. Sequence 2: Realtime WebSocket State Synchronization

```mermaid
sequenceDiagram
    autonumber
    actor Client as Studio LivePreviewCard
    participant WS as Supabase Realtime WebSocket
    participant DB as Supabase PostgreSQL (jobs table)

    Client->>WS: Subscribe to channel ('postgres_changes:table=jobs')
    WS-->>Client: Subscription Acknowledged (SUBSCRIBED)
    Note over DB: Background Worker updates job status to 'completed'
    DB->>WS: Broadcast Row UPDATE Event
    WS->>Client: Push WebSocket Payload JSON
    Client->>Client: React Query Cache Invalidation & UI Badge Update
```
