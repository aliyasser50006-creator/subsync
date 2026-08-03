import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { MediaDetailClient } from '@/components/media-manager/media-detail-client';
import { getJobWithMetadata } from '@/lib/actions/metadata';

export const metadata: Metadata = {
  title: 'Video Details – SubSync AI',
  description: 'View video details and metadata.',
};

export default async function MediaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const result = await getJobWithMetadata(id);
  
  if (result.error || !result.data) {
    notFound();
  }

  return (
    <div className="app-page">
      <MediaDetailClient job={result.data} />
    </div>
  );
}
