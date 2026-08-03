import { GridSkeleton } from '@/components/skeletons';

interface LibrarySkeletonProps {
  viewMode: 'grid' | 'list';
  count?: number;
}

export function LibrarySkeleton({ viewMode, count = 12 }: LibrarySkeletonProps) {
  return <GridSkeleton count={count} viewMode={viewMode} />;
}
