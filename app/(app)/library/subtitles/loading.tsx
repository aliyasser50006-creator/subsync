import { PageLoading, PageHeaderSkeleton, ToolbarSkeleton } from '@/components/skeletons';
import { Skeleton } from '@/components/ui/skeleton';

export default function SubtitlesLibraryLoading() {
  return (
    <PageLoading className="space-y-6">
      <PageHeaderSkeleton hasEyebrow={false} hasDescription={true} />
      <ToolbarSkeleton />

      {/* Content Skeleton (Grid View Default) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="surface-panel p-5 flex flex-col h-[180px] shadow-soft">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <Skeleton className="mt-0.5 h-4 w-4 rounded" />
                <Skeleton className="h-10 w-10 rounded-lg" />
              </div>
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
            <div className="mt-4 flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
              <div className="mt-4 space-y-1.5">
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageLoading>
  );
}
