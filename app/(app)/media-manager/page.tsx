import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { MediaManagerClient } from '@/components/media-manager/media-manager-client';
import { redirect } from 'next/navigation';
import { getAllCategories } from '@/lib/actions/categories';
import { getAllActors } from '@/lib/actions/actors';
import { Button } from '@/components/ui/button';
import { Plus, Download } from 'lucide-react';
import Link from 'next/link';
import { getMediaManagerPageData } from '@/lib/data/media-manager';
import { parseLibraryPage } from '@/lib/data/library';

export const metadata: Metadata = {
  title: 'Media Manager – SubSync AI',
  description: 'Manage, organize, and edit your video projects.',
};

interface PageProps {
  searchParams: {
    page?: string;
    q?: string;
    status?: string;
    sort?: string;
    category?: string;
    actor?: string;
    view?: string;
  };
}

export default async function MediaManagerPage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const page = parseLibraryPage(searchParams.page);
  const searchQuery = searchParams.q || '';
  const statusFilter = searchParams.status || 'all';
  const sort = searchParams.sort || 'newest';
  const categoryId = searchParams.category || 'all';
  const actorId = searchParams.actor || 'all';

  const [pageData, categoriesResult, actorsResult] = await Promise.all([
    getMediaManagerPageData({
      userId: user.id,
      page,
      searchQuery,
      statusFilter,
      sort,
      categoryId,
      actorId,
    }),
    getAllCategories(),
    getAllActors(),
  ]);

  if (page > pageData.totalPages) {
    const params = new URLSearchParams();
    params.set('page', String(pageData.totalPages));
    if (searchQuery) params.set('q', searchQuery);
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (sort !== 'newest') params.set('sort', sort);
    if (categoryId !== 'all') params.set('category', categoryId);
    if (actorId !== 'all') params.set('actor', actorId);
    redirect(`/media-manager?${params.toString()}`);
  }

  return (
    <div className="app-page">
      <header className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between border-b border-border/40 pb-6">
        <div>
          <div className="eyebrow">Video content</div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Media Manager</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Review, edit, categorize, retry, download, and delete every video project in your workspace.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" disabled className="hidden sm:flex shadow-sm">
            <Download className="h-4 w-4 mr-2" /> Import Media
          </Button>
          <Link href="/create">
            <Button className="font-semibold shadow-sm">
              <Plus className="h-4 w-4 mr-2" /> Add Video
            </Button>
          </Link>
        </div>
      </header>

      <MediaManagerClient 
        jobs={pageData.jobs}
        currentPage={pageData.page}
        pageSize={pageData.pageSize}
        totalCount={pageData.totalCount}
        totalPages={pageData.totalPages}
        initialAvailableCount={pageData.availableCount}
        initialUnavailableCount={pageData.unavailableCount}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        sortBy={sort}
        categoryId={categoryId}
        actorId={actorId}
        categories={categoriesResult.data || []}
        actors={actorsResult.data || []}
      />
    </div>
  );
}
