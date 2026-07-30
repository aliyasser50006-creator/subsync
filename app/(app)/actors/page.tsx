import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ActorsClient } from '@/components/actors/actors-client';

export const metadata: Metadata = {
  title: 'Actors – SubSync AI',
  description: 'Manage actors and their profiles.',
};

export default async function ActorsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return (
    <div className="app-page">
      <header className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="eyebrow">Talent management</div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Actors</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Manage actor profiles and link them to your video content.
          </p>
        </div>
      </header>
      <ActorsClient />
    </div>
  );
}
