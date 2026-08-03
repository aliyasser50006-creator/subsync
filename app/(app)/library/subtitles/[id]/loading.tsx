import { Skeleton } from '@/components/ui/skeleton';

export default function EditorLoading() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-background">
      <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3 bg-card">
        <Skeleton variant="circular" className="h-8 w-8" />
        <Skeleton className="h-6 w-48" />
        <div className="ml-auto flex gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 p-4 bg-muted/10">
          <Skeleton variant="rectangular" className="h-full w-full rounded-lg shadow-inner" />
        </div>
        <div className="w-[440px] border-l border-border/60 p-4 space-y-3 bg-card overflow-y-auto">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl shadow-xs" />
          ))}
        </div>
      </div>
    </div>
  );
}
