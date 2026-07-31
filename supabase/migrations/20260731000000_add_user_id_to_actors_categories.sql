-- 1. Clear existing data to allow NOT NULL constraint (safe for development)
DELETE FROM public.job_actors;
DELETE FROM public.job_categories;
DELETE FROM public.actors;
DELETE FROM public.categories;

-- 2. Add user_id to actors
ALTER TABLE public.actors
ADD COLUMN user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS actors_user_id_idx ON public.actors (user_id);

-- 3. Add user_id to categories
ALTER TABLE public.categories
ADD COLUMN user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS categories_user_id_idx ON public.categories (user_id);

-- 4. Update category unique constraint
ALTER TABLE public.categories DROP CONSTRAINT IF EXISTS categories_name_unique;
DROP INDEX IF EXISTS categories_name_idx;
CREATE UNIQUE INDEX categories_user_id_name_idx ON public.categories (user_id, name);
ALTER TABLE public.categories ADD CONSTRAINT categories_user_id_name_unique UNIQUE USING INDEX categories_user_id_name_idx;

-- 5. Update RLS policies for actors
DROP POLICY IF EXISTS "Authenticated users can read actors" ON public.actors;
DROP POLICY IF EXISTS "Authenticated users can insert actors" ON public.actors;
DROP POLICY IF EXISTS "Authenticated users can update actors" ON public.actors;
DROP POLICY IF EXISTS "Authenticated users can delete actors" ON public.actors;

CREATE POLICY "Users can view own actors"
  ON public.actors FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own actors"
  ON public.actors FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own actors"
  ON public.actors FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own actors"
  ON public.actors FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 6. Update RLS policies for categories
DROP POLICY IF EXISTS "Authenticated users can read categories" ON public.categories;
DROP POLICY IF EXISTS "Authenticated users can insert categories" ON public.categories;
DROP POLICY IF EXISTS "Authenticated users can update categories" ON public.categories;
DROP POLICY IF EXISTS "Authenticated users can delete categories" ON public.categories;

CREATE POLICY "Users can view own categories"
  ON public.categories FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own categories"
  ON public.categories FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories"
  ON public.categories FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories"
  ON public.categories FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
