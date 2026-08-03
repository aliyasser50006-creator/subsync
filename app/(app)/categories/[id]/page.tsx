import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { getCategoryById } from '@/lib/actions/categories';
import { CategoryDetailClient } from '@/components/categories/category-detail-client';

export const metadata: Metadata = {
  title: 'Category Details – SubSync AI',
  description: 'View category details and associated videos.',
};

export default async function CategoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const result = await getCategoryById(id);
  if (result.error || !result.data) notFound();

  return (
    <div className="app-page">
      <CategoryDetailClient category={result.data} jobs={result.data.jobs} />
    </div>
  );
}
