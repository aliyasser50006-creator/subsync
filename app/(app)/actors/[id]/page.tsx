import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { getActorById } from '@/lib/actions/actors';
import { ActorProfileClient } from '@/components/actors/actor-profile-client';

export const metadata: Metadata = {
  title: 'Actor Profile – SubSync AI',
  description: 'View actor profile and associated videos.',
};

export default async function ActorProfilePage({ 
  params,
  searchParams
}: { 
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string; videoId?: string }>;
}) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const result = await getActorById(id);
  if (result.error || !result.data) notFound();

  let returnTo = '/actors';
  let breadcrumbSource = 'Actors';

  if (resolvedSearchParams.from === 'video' && resolvedSearchParams.videoId) {
    returnTo = `/library/video/${resolvedSearchParams.videoId}`;
    const { data: jobData } = await supabase.from('jobs').select('title').eq('id', resolvedSearchParams.videoId).single();
    if (jobData) breadcrumbSource = jobData.title || 'Video Details';
  }

  return (
    <div className="app-page">
      <ActorProfileClient actor={result.data} jobs={result.data.jobs} returnTo={returnTo} breadcrumbSource={breadcrumbSource} />
    </div>
  );
}
