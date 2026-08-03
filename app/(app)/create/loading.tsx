import { PageLoading, PageHeaderSkeleton, FormSkeleton } from '@/components/skeletons';

export default function CreateLoading() {
  return (
    <PageLoading className="app-page-narrow">
      <PageHeaderSkeleton hasEyebrow hasDescription />
      
      <div className="space-y-6 mt-8">
        <FormSkeleton fieldsCount={4} className="shadow-soft" />
      </div>
    </PageLoading>
  );
}
