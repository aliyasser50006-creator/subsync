import { PageLoading, MetadataSkeleton, VideoPlayerSkeleton } from '@/components/skeletons';
import { Skeleton } from '@/components/ui/skeleton';

export default function MediaDetailLoading() {
  return (
    <PageLoading className="app-page">
      <div className="mb-6 flex items-center gap-4">
        <Skeleton className="h-10 w-24 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-[400px] max-w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-32" />
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-10 w-24 rounded-md" />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
        <div className="space-y-6">
          <VideoPlayerSkeleton className="h-[400px] rounded-xl shadow-panel overflow-hidden" />
          <div className="surface-panel p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="surface-panel p-6">
            <MetadataSkeleton title="Media Information" rowCount={5} />
          </div>
          <div className="surface-panel p-6">
            <MetadataSkeleton title="Processing Info" rowCount={4} />
          </div>
        </div>
      </div>
    </PageLoading>
  );
}
