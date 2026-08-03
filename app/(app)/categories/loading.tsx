import { PageLoading, PageHeaderSkeleton, ToolbarSkeleton, CategoryCardSkeleton, PaginationSkeleton } from '@/components/skeletons';

export default function CategoriesLoading() {
  return (
    <PageLoading className="pb-24">
      <PageHeaderSkeleton hasEyebrow hasDescription hasActions />
      <ToolbarSkeleton />
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <CategoryCardSkeleton key={i} />
        ))}
      </div>
      
      <PaginationSkeleton />
    </PageLoading>
  );
}
