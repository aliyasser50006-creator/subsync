import { PageLoading, PageHeaderSkeleton, StatCardSkeleton } from '@/components/skeletons';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLoading() {
  return (
    <PageLoading>
      <PageHeaderSkeleton hasBadges />

      <div className="mb-6 grid gap-3 md:grid-cols-3">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(400px,1fr)_minmax(500px,1.4fr)] mt-6">
        <div className="space-y-6">
          <Skeleton className="h-[250px] w-full rounded-xl shadow-soft" />
          <Skeleton className="h-[200px] w-full rounded-xl shadow-soft" />
          <Skeleton className="h-[400px] w-full rounded-xl shadow-soft" />
          <Skeleton className="h-14 w-full rounded-md shadow-soft" />
        </div>
        <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
          <Skeleton className="h-[450px] w-full rounded-xl shadow-soft" />
          <Skeleton className="h-[200px] w-full rounded-xl shadow-soft" />
        </aside>
      </div>
    </PageLoading>
  );
}
