import { VideoCardSkeleton } from './video-card-skeleton';
import { ListItemSkeleton } from './list-item-skeleton';
import { cn } from '@/lib/utils';

interface GridSkeletonProps {
  count?: number;
  viewMode?: 'grid' | 'list';
  className?: string;
}

export function GridSkeleton({ count = 12, viewMode = 'grid', className }: GridSkeletonProps) {
  if (viewMode === 'list') {
    return (
      <div className={cn("space-y-3", className)}>
        {Array.from({ length: count }).map((_, i) => (
          <ListItemSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <VideoCardSkeleton key={i} />
      ))}
    </div>
  );
}
