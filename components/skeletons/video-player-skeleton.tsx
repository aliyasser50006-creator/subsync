import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface VideoPlayerSkeletonProps {
  className?: string;
}

export function VideoPlayerSkeleton({ className }: VideoPlayerSkeletonProps) {
  return (
    <div className={cn("w-full bg-black relative", className)}>
      <div className="w-full max-w-[1920px] mx-auto aspect-video relative flex items-center justify-center bg-muted/20">
        {/* Big play button skeleton */}
        <Skeleton variant="circular" className="h-20 w-20 opacity-30" />
        
        {/* Bottom controls skeleton */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <Skeleton className="h-1.5 w-full bg-white/20 mb-4" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-6 rounded-sm bg-white/20" />
              <Skeleton className="h-6 w-6 rounded-sm bg-white/20" />
              <Skeleton className="h-4 w-16 bg-white/20" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-6 rounded-sm bg-white/20" />
              <Skeleton className="h-6 w-6 rounded-sm bg-white/20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
