import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { ActorForm } from '@/components/actors/actor-form';
import { Actor } from '@/lib/types/database';

export const metadata: Metadata = {
  title: 'Edit Actor – SubSync AI',
  description: 'Edit an existing actor profile.',
};

export default async function EditActorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: actor, error } = await supabase
    .from('actors')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !actor) notFound();

  return (
    <div className="app-page">
      <header className="mb-8">
        <div className="eyebrow">Talent management</div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Edit Actor</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
          Update the profile details of &ldquo;{(actor as Actor).name}&rdquo;.
        </p>
      </header>
      <ActorForm actor={actor as Actor} />
    </div>
  );
}
