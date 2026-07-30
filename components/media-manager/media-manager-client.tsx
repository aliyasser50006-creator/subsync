'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { JobWithMetadata, Category, Actor } from '@/lib/types/database';
import { deleteJob, retryJob } from '@/lib/actions/jobs';
import { downloadVideo } from '@/lib/utils/download';
import { MediaManagerToolbar, ViewMode, SortOption, StatusFilter } from './media-manager-toolbar';
import { MediaGridCard } from './media-grid-card';
import { MediaListCard } from './media-list-card';
import { MediaTable } from './media-table';
import { MediaManagerEmpty } from './media-empty-state';
import { LibraryPagination } from '@/components/library/library-pagination';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MediaManagerClientProps {
  jobs: JobWithMetadata[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  initialAvailableCount: number;
  initialUnavailableCount: number;
  searchQuery: string;
  statusFilter: string;
  sortBy: string;
  categoryId: string;
  actorId: string;
  categories: Category[];
  actors: Actor[];
}

export function MediaManagerClient({
  jobs,
  currentPage,
  pageSize,
  totalCount,
  totalPages,
  initialAvailableCount,
  initialUnavailableCount,
  searchQuery,
  statusFilter,
  sortBy,
  categoryId,
  actorId,
  categories,
  actors,
}: MediaManagerClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Local sync state for toolbar items
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>(statusFilter as StatusFilter);
  const [selectedSort, setSelectedSort] = useState<SortOption>(sortBy as SortOption);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryId);
  const [selectedActor, setSelectedActor] = useState<string>(actorId);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // UI State - Selections
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Mutations State
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState<string | null>(null);

  useEffect(() => setSearchTerm(searchQuery), [searchQuery]);
  useEffect(() => setSelectedStatus(statusFilter as StatusFilter), [statusFilter]);
  useEffect(() => setSelectedSort(sortBy as SortOption), [sortBy]);
  useEffect(() => setSelectedCategory(categoryId), [categoryId]);
  useEffect(() => setSelectedActor(actorId), [actorId]);

  // Load preferences for view mode
  useEffect(() => {
    const savedView = localStorage.getItem('subsync_view_mode') as ViewMode;
    if (savedView) setViewMode(savedView);
  }, []);

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('subsync_view_mode', mode);
  };

  const buildHref = ({
    page = currentPage,
    q = searchTerm,
    status = selectedStatus,
    sort = selectedSort,
    category = selectedCategory,
    actor = selectedActor,
    view = viewMode,
  }: {
    page?: number;
    q?: string;
    status?: string;
    sort?: string;
    category?: string;
    actor?: string;
    view?: string;
  } = {}) => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    if (q.trim()) params.set('q', q.trim());
    if (status !== 'all') params.set('status', status);
    if (sort !== 'newest') params.set('sort', sort);
    if (category && category !== 'all') params.set('category', category);
    if (actor && actor !== 'all') params.set('actor', actor);
    if (view === 'list') params.set('view', 'list');
    return `/media-manager?${params.toString()}`;
  };

  const navigate = (state: {
    page?: number;
    q?: string;
    status?: string;
    sort?: string;
    category?: string;
    actor?: string;
    view?: string;
  }) => {
    startTransition(() => {
      router.push(buildHref(state), { scroll: false });
    });
  };

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm.trim() !== searchQuery) {
        navigate({ page: 1, q: searchTerm.trim() });
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm, searchQuery]);

  const handleStatusChange = (val: StatusFilter) => {
    setSelectedStatus(val);
    navigate({ page: 1, status: val });
  };

  const handleSortChange = (val: SortOption) => {
    setSelectedSort(val);
    navigate({ page: 1, sort: val });
  };

  const handleCategoryChange = (val: string) => {
    setSelectedCategory(val);
    navigate({ page: 1, category: val });
  };

  const handleActorChange = (val: string) => {
    setSelectedActor(val);
    navigate({ page: 1, actor: val });
  };

  const handleClearFilters = () => {
    setSelectedStatus('all');
    setSelectedCategory('all');
    setSelectedActor('all');
    setSearchTerm('');
    navigate({ page: 1, q: '', status: 'all', category: 'all', actor: 'all' });
  };

  // Selection Logic
  const handleSelectToggle = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(jobs.map((j) => j.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  // Mutations
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;

    setIsDeleting(id);
    toast.loading('Deleting video...', { id: 'delete' });

    try {
      const res = await deleteJob(id);
      if (res?.error) {
        toast.error(res.error, { id: 'delete' });
      } else {
        toast.success('Video deleted successfully', { id: 'delete' });
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        router.refresh();
      }
    } catch {
      toast.error('Failed to delete video', { id: 'delete' });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.size} selected video(s)?`)) return;

    toast.loading(`Deleting ${selectedIds.size} video(s)...`, { id: 'bulk-delete' });
    let count = 0;
    for (const id of Array.from(selectedIds)) {
      const res = await deleteJob(id);
      if (!res?.error) count++;
    }

    toast.success(`Successfully deleted ${count} video(s)`, { id: 'bulk-delete' });
    setSelectedIds(new Set());
    router.refresh();
  };

  const handleRetry = async (id: string) => {
    setIsRetrying(id);
    toast.loading('Restarting video processing...', { id: 'retry' });

    try {
      const res = await retryJob(id);
      if (res?.error) {
        toast.error(res.error, { id: 'retry' });
      } else {
        toast.success('Video processing restarted!', { id: 'retry' });
        router.refresh();
      }
    } catch {
      toast.error('Failed to retry processing', { id: 'retry' });
    } finally {
      setIsRetrying(null);
    }
  };

  const handleDownload = useCallback(async (job: JobWithMetadata) => {
    if (!job.output_video) {
      toast.error('No processed video output available yet.');
      return;
    }
    try {
      toast.loading('Starting download...', { id: 'download' });
      await downloadVideo(job.output_video, job.title || 'video');
      toast.success('Download started!', { id: 'download' });
    } catch {
      toast.error('Download failed.', { id: 'download' });
    }
  }, []);

  const handleOpenOutput = useCallback((job: JobWithMetadata) => {
    if (job.output_video) {
      window.open(job.output_video, '_blank');
    } else {
      toast.error('No output video is available yet.');
    }
  }, []);

  const handlePlay = useCallback((job: JobWithMetadata) => {
    if (job.video_url) {
      window.open(job.video_url, '_blank');
    }
  }, []);

  const hasActiveFilters = selectedStatus !== 'all' || selectedCategory !== 'all' || selectedActor !== 'all';

  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)] pb-24 max-w-7xl mx-auto w-full">
      <MediaManagerToolbar
        searchQuery={searchTerm}
        onSearchChange={setSearchTerm}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        sort={selectedSort}
        onSortChange={handleSortChange}
        statusFilter={selectedStatus}
        onStatusFilterChange={handleStatusChange}
        selectedCategoryId={selectedCategory}
        onCategoryFilterChange={handleCategoryChange}
        selectedActorId={selectedActor}
        onActorFilterChange={handleActorChange}
        categories={categories}
        actors={actors}
      />

      <div className={cn('w-full flex-1 flex flex-col', isPending && 'opacity-60 transition-opacity duration-200')}>
        {jobs.length === 0 ? (
          <MediaManagerEmpty
            searchQuery={searchTerm}
            hasFilters={hasActiveFilters}
            onClearFilters={handleClearFilters}
          />
        ) : (
          <div className="w-full flex-1 flex flex-col justify-between">
            <div>
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {jobs.map((job) => (
                    <MediaGridCard
                      key={job.id}
                      job={job}
                      allCategories={categories}
                      allActors={actors}
                      isSelected={selectedIds.has(job.id)}
                      onSelectToggle={(c) => handleSelectToggle(job.id, c)}
                      onInspect={() => router.push(`/media-manager/${job.id}`)}
                      onEdit={() => window.open(`/media-manager/${job.id}/edit`, '_blank')}
                      onPlay={() => handlePlay(job)}
                      onDelete={() => handleDelete(job.id)}
                      onDownload={() => handleDownload(job)}
                      onRetry={() => handleRetry(job.id)}
                      onOpenOutput={() => handleOpenOutput(job)}
                      isDeleting={isDeleting === job.id}
                      isRetrying={isRetrying === job.id}
                    />
                  ))}
                </div>
              )}

              {viewMode === 'list' && (
                <div className="flex flex-col gap-4">
                  {jobs.map((job) => (
                    <MediaListCard
                      key={job.id}
                      job={job}
                      allCategories={categories}
                      allActors={actors}
                      isSelected={selectedIds.has(job.id)}
                      onSelectToggle={(c) => handleSelectToggle(job.id, c)}
                      onInspect={() => router.push(`/media-manager/${job.id}`)}
                      onEdit={() => window.open(`/media-manager/${job.id}/edit`, '_blank')}
                      onPlay={() => handlePlay(job)}
                      onDelete={() => handleDelete(job.id)}
                      onDownload={() => handleDownload(job)}
                      onRetry={() => handleRetry(job.id)}
                      onOpenOutput={() => handleOpenOutput(job)}
                      isDeleting={isDeleting === job.id}
                      isRetrying={isRetrying === job.id}
                    />
                  ))}
                </div>
              )}

              {viewMode === 'table' && (
                <MediaTable
                  jobs={jobs}
                  selectedIds={selectedIds}
                  onSelectToggle={handleSelectToggle}
                  onSelectAll={handleSelectAll}
                  onInspect={(job) => router.push(`/media-manager/${job.id}`)}
                  onEdit={(job) => window.open(`/media-manager/${job.id}/edit`, '_blank')}
                  onPlay={handlePlay}
                  onDelete={handleDelete}
                  onDownload={handleDownload}
                  onRetry={handleRetry}
                  onOpenOutput={handleOpenOutput}
                  isDeleting={isDeleting}
                  isRetrying={isRetrying}
                />
              )}
            </div>

            {/* Pagination Component - Reusing LibraryPagination */}
            <LibraryPagination
              currentPage={currentPage}
              totalPages={totalPages}
              getPageHref={(page) => buildHref({ page })}
              onPageChange={(page) => navigate({ page })}
              disabled={isPending}
            />
          </div>
        )}
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-popover border border-border shadow-xl rounded-full px-6 py-3 flex items-center gap-6 z-50 animate-in slide-in-from-bottom-5">
          <span className="text-sm font-semibold whitespace-nowrap">
            {selectedIds.size} item{selectedIds.size !== 1 ? 's' : ''} selected
          </span>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setSelectedIds(new Set())}>
              Deselect All
            </Button>
            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
              Delete Selected
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
