import { PageLoading, GridSkeleton } from '@/components/skeletons';
import { Skeleton } from '@/components/ui/skeleton';

export default function CategoryDetailLoading() {
  return (
    <PageLoading className="pb-24">
      {/* Category Header Skeleton */}
      <div className="mb-12 border-b border-border/40 pb-10">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-16 w-16 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-5 w-40" />
          </div>
        </div>
        <Skeleton className="h-6 w-[600px] max-w-full" />
      </div>

      {/* Videos Grid Skeleton */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-[200px] rounded-md" />
        </div>
        
        <GridSkeleton count={8} viewMode="grid" />
      </div>
    </PageLoading>
  );
}
