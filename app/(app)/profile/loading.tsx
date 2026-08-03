import { PageLoading, PageHeaderSkeleton, StatCardSkeleton } from '@/components/skeletons';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfileLoading() {
  return (
    <PageLoading className="app-page-narrow space-y-8">
      <PageHeaderSkeleton hasEyebrow hasDescription />

      {/* Main Profile Identity Banner */}
      <div className="surface-panel p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center justify-between">
          <div className="flex items-center gap-5">
            <Skeleton variant="circular" className="h-20 w-20 shrink-0" />
            <div className="min-w-0 space-y-3">
              <div className="flex items-center gap-2.5">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-10 w-[160px] rounded-md shrink-0" />
        </div>
      </div>

      {/* Metrics & Preferences 3-column Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* Workspace Permission Level */}
      <div className="surface-panel p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-border/40 pb-4">
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-7 w-32 rounded-full" />
        </div>
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    </PageLoading>
  );
}
