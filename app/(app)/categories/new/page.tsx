import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { CategoryForm } from '@/components/categories/category-form';

export const metadata: Metadata = {
  title: 'New Category – SubSync AI',
  description: 'Create a new video category.',
};

export default async function NewCategoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return (
    <div className="app-page">
      <header className="mb-8">
        <div className="eyebrow">Content organization</div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">New Category</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
          Create a new category to organize your video content.
        </p>
      </header>
      <CategoryForm />
    </div>
  );
}
