import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { getJobWithMetadata } from '@/lib/actions/metadata';
import { getCategories } from '@/lib/actions/categories';
import { getActors } from '@/lib/actions/actors';
import { MediaEditClient } from '@/components/media-manager/media-edit-client';

export const metadata: Metadata = {
  title: 'Edit Video – SubSync AI',
  description: 'Edit video details and metadata.',
};

export default async function MediaEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const result = await getJobWithMetadata(id);
  
  if (result.error || !result.data) {
    notFound();
  }

  // Fetch categories and actors to populate form selects
  const [categoriesResult, actorsResult] = await Promise.all([
    getCategories(),
    getActors()
  ]);

  return (
    <div className="app-page max-w-7xl mx-auto w-full">
      <MediaEditClient 
        job={result.data} 
        categories={categoriesResult.data || []}
        actors={actorsResult.data || []}
      />
    </div>
  );
}
