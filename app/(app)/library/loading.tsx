import { PageLoading, PageHeaderSkeleton, ToolbarSkeleton, GridSkeleton } from '@/components/skeletons';

export default function LibraryLoading() {
  return (
    <PageLoading className="pb-24">
      <PageHeaderSkeleton hasEyebrow hasDescription hasBadges hasActions />
      <ToolbarSkeleton />
      <GridSkeleton count={12} viewMode="grid" />
    </PageLoading>
  );
}
