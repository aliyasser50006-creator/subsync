import { PageLoading, PageHeaderSkeleton, FormSkeleton, VideoPlayerSkeleton } from '@/components/skeletons';

export default function MediaEditLoading() {
  return (
    <PageLoading className="app-page">
      <PageHeaderSkeleton hasEyebrow hasDescription hasActions />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_460px]">
        <div className="space-y-6">
          <FormSkeleton fieldsCount={4} className="shadow-soft" />
          <FormSkeleton fieldsCount={2} className="shadow-soft" />
        </div>
        <div className="space-y-6">
          <VideoPlayerSkeleton className="h-[260px] rounded-xl shadow-soft overflow-hidden" />
          <FormSkeleton fieldsCount={3} className="shadow-soft" />
        </div>
      </div>
    </PageLoading>
  );
}
