import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface PaginationSkeletonProps {
  className?: string;
}

export function PaginationSkeleton({ className }: PaginationSkeletonProps) {
  return (
    <div className={cn("mt-10 flex items-center justify-between border-t border-border/40 pt-6", className)}>
      <Skeleton className="h-9 w-[100px] rounded-md" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-[120px]" />
      </div>
      <Skeleton className="h-9 w-[80px] rounded-md" />
    </div>
  );
}
