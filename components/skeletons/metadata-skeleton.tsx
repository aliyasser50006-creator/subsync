import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface MetadataSkeletonProps {
  title?: string;
  rowCount?: number;
  className?: string;
}

export function MetadataSkeleton({ title, rowCount = 4, className }: MetadataSkeletonProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {title ? (
        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</h4>
      ) : (
        <Skeleton className="h-4 w-32" />
      )}
      
      <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
        {Array.from({ length: rowCount }).map((_, i) => (
          <div key={i} className="contents">
            <Skeleton className="h-4 w-20 opacity-60" />
            <div className="flex justify-end">
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
