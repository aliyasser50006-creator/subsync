import { redirect } from 'next/navigation';
import { LibraryClient } from '@/components/library/library-client';
import { LibraryHeader } from '@/components/library/library-header';
import {
  LibrarySearchParams,
  getLibraryPageData,
  parseLibraryPage,
  parseLibraryQuery,
  parseLibrarySort,
  parseLibraryStatus,
  parseLibraryCategory,
} from '@/lib/data/library';
import { createClient } from '@/lib/supabase/server';
import { getAllCategories } from '@/lib/actions/categories';

function buildCanonicalUrl({ searchQuery, page, status, sort, categoryId }: {
  searchQuery?: string; page: number; status: string; sort: string; categoryId?: string;
}) {
  const params = new URLSearchParams();
  if (searchQuery) params.set('q', searchQuery);
  params.set('page', String(page));
  if (status !== 'all') params.set('status', status);
  if (sort !== 'newest') params.set('sort', sort);
  if (categoryId) params.set('category', categoryId);
  return `${searchQuery ? '/library/search' : '/library'}?${params.toString()}`;
}

export async function LibraryRoutePage({ searchParams, isSearchPage = false }: {
  searchParams: LibrarySearchParams; isSearchPage?: boolean;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const page = parseLibraryPage(searchParams.page);
  const status = parseLibraryStatus(searchParams.status);
  const sort = parseLibrarySort(searchParams.sort);
  const categoryId = parseLibraryCategory(searchParams.category);
  const searchQuery = isSearchPage ? parseLibraryQuery(searchParams.q) : undefined;
  
  if (isSearchPage && !searchQuery) {
    redirect(buildCanonicalUrl({ page: 1, status, sort, categoryId }));
  }

  const [data, categoriesResult] = await Promise.all([
    getLibraryPageData({ userId: user.id, page, searchQuery, status, sort, categoryId }),
    getAllCategories()
  ]);

  if (page > data.totalPages) {
    redirect(buildCanonicalUrl({ searchQuery, page: data.totalPages, status, sort, categoryId }));
  }

  return (
    <div className="app-page pb-24">
      <LibraryHeader {...data.stats} />
      <LibraryClient
        videos={data.videos}
        currentPage={data.page}
        pageSize={data.pageSize}
        totalCount={data.totalCount}
        totalPages={data.totalPages}
        searchQuery={searchQuery || ''}
        statusFilter={data.status}
        sortBy={data.sort}
        categoryId={data.categoryId}
        categories={categoriesResult.data || []}
        routePath={isSearchPage ? '/library/search' : '/library'}
      />
    </div>
  );
}
