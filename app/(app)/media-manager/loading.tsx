import { PageLoading, PageHeaderSkeleton, ToolbarSkeleton, ListItemSkeleton, PaginationSkeleton } from '@/components/skeletons';
import { Skeleton } from '@/components/ui/skeleton';

export default function MediaManagerLoading() {
  return (
    <PageLoading className="pb-24">
      <PageHeaderSkeleton hasEyebrow hasDescription hasActions />
      
      <div className="mb-6 grid gap-3 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[90px] rounded-xl shadow-soft" />
        ))}
      </div>

      <ToolbarSkeleton />
      
      <div className="space-y-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <ListItemSkeleton key={i} />
        ))}
      </div>
      
      <PaginationSkeleton />
    </PageLoading>
  );
}
