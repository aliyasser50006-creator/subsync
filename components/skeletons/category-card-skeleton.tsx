import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface CategoryCardSkeletonProps {
  className?: string;
}

export function CategoryCardSkeleton({ className }: CategoryCardSkeletonProps) {
  return (
    <div className={cn("surface-panel p-5 shadow-soft hover-lift relative overflow-hidden flex flex-col h-full", className)}>
      <div className="flex items-center gap-3 mb-3">
        <Skeleton variant="circular" className="h-3 w-3 shrink-0" />
        <Skeleton className="h-5 w-32" />
        <div className="ml-auto flex gap-1">
          <Skeleton className="h-7 w-7 rounded-md" />
        </div>
      </div>
      <div className="space-y-1.5 mb-5 flex-grow">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      <div className="flex items-center gap-2 mt-auto">
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </div>
  );
}
