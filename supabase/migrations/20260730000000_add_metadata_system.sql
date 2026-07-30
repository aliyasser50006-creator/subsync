-- =============================================================
-- Migration: Video Metadata Management System
-- Adds description to jobs, creates categories, actors,
-- and many-to-many junction tables with RLS and indexes.
-- =============================================================

-- 1. Add description column to jobs
alter table public.jobs
add column if not exists description text;

-- 2. Categories table
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  color text not null default '#6366f1',
  created_at timestamptz not null default now(),
  constraint categories_name_unique unique (name)
);

create index if not exists categories_name_idx on public.categories (name);

alter table public.categories enable row level security;

create policy "Authenticated users can read categories"
  on public.categories for select
  to authenticated
  using (true);

create policy "Authenticated users can insert categories"
  on public.categories for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update categories"
  on public.categories for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can delete categories"
  on public.categories for delete
  to authenticated
  using (true);

-- 3. Actors table
create table if not exists public.actors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image_url text,
  biography text,
  birth_date date,
  nationality text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists actors_name_idx on public.actors (name);

alter table public.actors enable row level security;

create policy "Authenticated users can read actors"
  on public.actors for select
  to authenticated
  using (true);

create policy "Authenticated users can insert actors"
  on public.actors for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update actors"
  on public.actors for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can delete actors"
  on public.actors for delete
  to authenticated
  using (true);

-- Auto-update updated_at on actors
create or replace function public.set_actors_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists actors_set_updated_at on public.actors;

create trigger actors_set_updated_at
before update on public.actors
for each row
execute function public.set_actors_updated_at();

-- 4. Junction table: job_categories
create table if not exists public.job_categories (
  job_id uuid not null references public.jobs (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete cascade,
  primary key (job_id, category_id)
);

create index if not exists job_categories_job_id_idx on public.job_categories (job_id);
create index if not exists job_categories_category_id_idx on public.job_categories (category_id);

alter table public.job_categories enable row level security;

create policy "Authenticated users can read job_categories"
  on public.job_categories for select
  to authenticated
  using (true);

create policy "Authenticated users can insert job_categories"
  on public.job_categories for insert
  to authenticated
  with check (true);

create policy "Authenticated users can delete job_categories"
  on public.job_categories for delete
  to authenticated
  using (true);

-- 5. Junction table: job_actors
create table if not exists public.job_actors (
  job_id uuid not null references public.jobs (id) on delete cascade,
  actor_id uuid not null references public.actors (id) on delete cascade,
  primary key (job_id, actor_id)
);

create index if not exists job_actors_job_id_idx on public.job_actors (job_id);
create index if not exists job_actors_actor_id_idx on public.job_actors (actor_id);

alter table public.job_actors enable row level security;

create policy "Authenticated users can read job_actors"
  on public.job_actors for select
  to authenticated
  using (true);

create policy "Authenticated users can insert job_actors"
  on public.job_actors for insert
  to authenticated
  with check (true);

create policy "Authenticated users can delete job_actors"
  on public.job_actors for delete
  to authenticated
  using (true);
