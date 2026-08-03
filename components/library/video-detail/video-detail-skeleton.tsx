import { VideoPlayerSkeleton, MetadataSkeleton } from '@/components/skeletons';
import { Skeleton } from '@/components/ui/skeleton';

export function VideoDetailSkeleton() {
  return (
    <div className="w-full bg-background min-h-screen animate-fade-in pb-24">
      {/* 1. Immersive Hero */}
      <VideoPlayerSkeleton />

      {/* Main Content Canvas */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pt-10 lg:pt-14">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Main Narrative Column (70%) */}
          <div className="flex-1 lg:w-2/3 min-w-0">
            {/* Title & Context */}
            <div className="mb-10 space-y-4">
              <Skeleton className="h-14 w-3/4 max-w-2xl" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-20" />
              </div>
              <div className="flex flex-wrap gap-3 mt-4">
                <Skeleton className="h-10 w-32 rounded-full" />
                <Skeleton className="h-10 w-24 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            </div>

            {/* Synopsis */}
            <div className="mb-14 space-y-2 max-w-3xl">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-5/6" />
              <Skeleton className="h-5 w-4/5" />
            </div>

            {/* Cast Carousel */}
            <div className="mb-14">
              <Skeleton className="h-7 w-24 mb-6" />
              <div className="flex gap-4 sm:gap-6 overflow-hidden">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center w-28 sm:w-32 shrink-0">
                    <Skeleton variant="circular" className="w-28 h-28 sm:w-32 sm:h-32 mb-4" />
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                ))}
              </div>
            </div>

            {/* Subtitle Panel */}
            <div className="mb-14 max-w-3xl">
              <Skeleton className="h-7 w-32 mb-6" />
              <Skeleton className="h-[400px] w-full rounded-xl" />
            </div>
          </div>

          {/* Technical Ledger (30%) */}
          <div className="w-full lg:w-1/3 lg:max-w-sm space-y-10">
            <MetadataSkeleton title="About This Title" rowCount={3} />
            <div className="pt-6 border-t border-border/40">
              <MetadataSkeleton title="Playback Settings" rowCount={3} />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
