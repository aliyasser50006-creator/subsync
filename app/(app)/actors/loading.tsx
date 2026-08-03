import { PageLoading, PageHeaderSkeleton, ToolbarSkeleton, ActorCardSkeleton, PaginationSkeleton } from '@/components/skeletons';

export default function ActorsLoading() {
  return (
    <PageLoading className="pb-24">
      <PageHeaderSkeleton hasEyebrow hasDescription hasActions />
      <ToolbarSkeleton />
      
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 15 }).map((_, i) => (
          <ActorCardSkeleton key={i} />
        ))}
      </div>
      
      <PaginationSkeleton />
    </PageLoading>
  );
}
