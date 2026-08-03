import { PageLoading, PageHeaderSkeleton, FormSkeleton } from '@/components/skeletons';

export default function SettingsLoading() {
  return (
    <PageLoading className="app-page-narrow">
      <PageHeaderSkeleton hasEyebrow hasDescription />

      <div className="space-y-6">
        <FormSkeleton fieldsCount={2} />
        <FormSkeleton fieldsCount={3} />
        <FormSkeleton fieldsCount={1} />
      </div>
    </PageLoading>
  );
}
