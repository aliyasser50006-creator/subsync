import { PageLoading, StatCardSkeleton } from '@/components/skeletons';
import { Skeleton } from '@/components/ui/skeleton';

export default function AppLoading() {
  return (
    <PageLoading>
      <div className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <Skeleton className="h-[400px] rounded-xl shadow-soft" />
          <div className="space-y-4">
            <Skeleton className="h-[200px] rounded-xl shadow-soft" />
            <Skeleton className="h-[184px] rounded-xl shadow-soft" />
          </div>
        </div>
      </div>
    </PageLoading>
  );
}
