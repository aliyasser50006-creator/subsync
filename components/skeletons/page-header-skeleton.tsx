import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface PageHeaderSkeletonProps {
  hasEyebrow?: boolean;
  hasDescription?: boolean;
  hasActions?: boolean;
  hasBadges?: boolean;
  className?: string;
}

export function PageHeaderSkeleton({
  hasEyebrow = true,
  hasDescription = true,
  hasActions = false,
  hasBadges = false,
  className,
}: PageHeaderSkeletonProps) {
  return (
    <header className={cn("mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between", className)}>
      <div className="space-y-3">
        {hasEyebrow && <Skeleton className="h-4 w-32 rounded-full" />}
        <Skeleton className="h-10 w-[250px] sm:w-[400px]" />
        {hasDescription && <Skeleton className="h-5 w-[300px] sm:w-[500px]" />}
      </div>
      {(hasActions || hasBadges) && (
        <div className="flex flex-wrap items-center gap-3">
          {hasBadges && (
            <>
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </>
          )}
          {hasActions && (
            <>
              <Skeleton className="h-10 w-[120px] rounded-md hidden sm:block" />
              <Skeleton className="h-10 w-[140px] rounded-md" />
            </>
          )}
        </div>
      )}
    </header>
  );
}
