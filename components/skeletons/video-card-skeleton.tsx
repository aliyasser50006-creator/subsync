import { Skeleton } from '@/components/ui/skeleton';

export function VideoCardSkeleton() {
  return (
    <div className="group relative flex w-full flex-col overflow-hidden rounded-xl border border-border/60 bg-card text-left shadow-xs h-full">
      {/* Thumbnail area */}
      <div className="relative aspect-video w-full overflow-hidden">
        <Skeleton variant="rectangular" className="h-full w-full" />
        
        {/* Overlay badges */}
        <div className="absolute left-2.5 right-2.5 top-2.5 flex items-start justify-between gap-2">
          <Skeleton className="h-4 w-16 rounded-full" />
          <Skeleton className="h-4 w-10 rounded-full" />
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Title */}
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between pt-2 border-t border-border/40">
          <div className="flex items-center gap-1.5 w-full">
            <Skeleton variant="circular" className="h-3 w-3 shrink-0" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-10 ml-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
