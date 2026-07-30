import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { CategoriesClient } from '@/components/categories/categories-client';

export const metadata: Metadata = {
  title: 'Categories – SubSync AI',
  description: 'Manage video categories. Create, edit, and organize your content.',
};

export default async function CategoriesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="app-page">
      <header className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="eyebrow">Content organization</div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Categories</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Create and manage categories to organize your video content.
          </p>
        </div>
      </header>

      <CategoriesClient />
    </div>
  );
}
