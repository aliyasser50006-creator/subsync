import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface FormSkeletonProps {
  fieldsCount?: number;
  className?: string;
}

export function FormSkeleton({ fieldsCount = 3, className }: FormSkeletonProps) {
  return (
    <div className={cn("surface-panel p-6 space-y-6", className)}>
      <div className="space-y-2 mb-8">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      
      {Array.from({ length: fieldsCount }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-3 w-4/5 max-w-[400px]" />
        </div>
      ))}
      
      <div className="pt-6 border-t border-border/40 flex justify-end">
        <Skeleton className="h-10 w-[120px] rounded-md" />
      </div>
    </div>
  );
}
