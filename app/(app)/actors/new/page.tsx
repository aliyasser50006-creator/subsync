import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ActorForm } from '@/components/actors/actor-form';

export const metadata: Metadata = {
  title: 'New Actor – SubSync AI',
  description: 'Add a new actor profile.',
};

export default async function NewActorPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return (
    <div className="app-page">
      <header className="mb-8">
        <div className="eyebrow">Talent management</div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">New Actor</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
          Create a new actor profile to link with your video content.
        </p>
      </header>
      <ActorForm />
    </div>
  );
}
