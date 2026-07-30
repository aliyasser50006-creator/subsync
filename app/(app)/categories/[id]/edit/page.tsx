import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { CategoryForm } from '@/components/categories/category-form';
import { Category } from '@/lib/types/database';

export const metadata: Metadata = {
  title: 'Edit Category – SubSync AI',
  description: 'Edit an existing category.',
};

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: category, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !category) notFound();

  return (
    <div className="app-page">
      <header className="mb-8">
        <div className="eyebrow">Content organization</div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Edit Category</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
          Update the details of &ldquo;{(category as Category).name}&rdquo;.
        </p>
      </header>
      <CategoryForm category={category as Category} />
    </div>
  );
}
