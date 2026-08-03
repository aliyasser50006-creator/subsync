import { PageLoading, PageHeaderSkeleton, ToolbarSkeleton, VideoPlayerSkeleton, ListItemSkeleton } from '@/components/skeletons';

export default function MyVideosLoading() {
  return (
    <PageLoading>
      <PageHeaderSkeleton hasEyebrow hasDescription />
      <ToolbarSkeleton />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_460px]">
        <div className="xl:sticky xl:top-6">
          <VideoPlayerSkeleton className="h-[420px] rounded-xl overflow-hidden shadow-panel" />
        </div>
        
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ListItemSkeleton key={i} />
          ))}
        </div>
      </div>
    </PageLoading>
  );
}
