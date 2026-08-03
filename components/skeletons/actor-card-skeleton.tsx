import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ActorCardSkeletonProps {
  className?: string;
}

export function ActorCardSkeleton({ className }: ActorCardSkeletonProps) {
  return (
    <div className={cn("surface-panel flex flex-col items-center p-6 text-center shadow-soft relative overflow-hidden", className)}>
      <Skeleton variant="circular" className="h-24 w-24 mb-4 ring-4 ring-background shadow-md" />
      <Skeleton className="h-5 w-32 mb-2" />
      <div className="flex items-center justify-center gap-2 mt-1">
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-6 w-24 rounded-full mt-4" />
      <div className="absolute top-3 right-3 flex gap-2">
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </div>
  );
}
