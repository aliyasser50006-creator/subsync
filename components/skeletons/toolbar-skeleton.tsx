import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ToolbarSkeletonProps {
  className?: string;
}

export function ToolbarSkeleton({ className }: ToolbarSkeletonProps) {
  return (
    <div className={cn("surface-panel p-4 mb-6 shadow-soft", className)}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <Skeleton className="h-9 flex-1 min-w-[200px]" />
          <Skeleton className="h-9 w-[140px]" />
          <Skeleton className="h-9 w-[160px]" />
          <Skeleton className="h-9 w-[80px]" />
        </div>
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/40">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>
    </div>
  );
}
