import { Skeleton } from '@/components/ui/skeleton';

export function ListItemSkeleton() {
  return (
    <div className="group relative flex w-full flex-col sm:flex-row overflow-hidden rounded-xl border border-border/60 bg-card shadow-xs">
      {/* Thumbnail */}
      <div className="relative aspect-video w-full sm:w-48 sm:shrink-0 bg-muted/30">
        <Skeleton variant="rectangular" className="h-full w-full" />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        {/* Badges */}
        <div className="mb-2.5 flex flex-wrap items-center gap-2">
          <Skeleton className="h-4 w-16 rounded-full" />
          <Skeleton className="h-4 w-10 rounded-full" />
        </div>

        {/* Title */}
        <div className="mb-4 space-y-1.5">
          <Skeleton className="h-4 w-full max-w-sm" />
          <Skeleton className="h-4 w-2/3 max-w-xs" />
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between border-t border-border/40 pt-3">
          <div className="flex items-center gap-4">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
