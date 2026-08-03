import { PageLoading, GridSkeleton } from '@/components/skeletons';
import { Skeleton } from '@/components/ui/skeleton';

export default function ActorProfileLoading() {
  return (
    <PageLoading className="pb-24">
      {/* Hero Skeleton */}
      <div className="relative mb-12 flex flex-col items-center pt-24 pb-12 sm:pt-32 sm:pb-16 text-center">
        <Skeleton className="absolute inset-0 w-full h-[240px] opacity-20" />
        <Skeleton variant="circular" className="h-32 w-32 sm:h-40 sm:w-40 z-10 mb-6 ring-8 ring-background shadow-xl" />
        <Skeleton className="h-10 w-64 mb-3 z-10" />
        <div className="flex gap-2 z-10 mb-6">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <Skeleton className="h-10 w-32 rounded-md z-10" />
      </div>

      {/* Filmography Skeleton */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        
        <GridSkeleton count={8} viewMode="grid" />
      </div>
    </PageLoading>
  );
}
