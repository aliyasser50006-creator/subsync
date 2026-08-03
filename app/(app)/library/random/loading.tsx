import { PageLoading, PageHeaderSkeleton, GridSkeleton, ToolbarSkeleton } from '@/components/skeletons';

export default function RandomLoading() {
  return (
    <PageLoading className="pb-24">
      <PageHeaderSkeleton hasEyebrow={false} hasDescription hasActions />
      <ToolbarSkeleton />
      <GridSkeleton count={12} viewMode="grid" />
    </PageLoading>
  );
}
