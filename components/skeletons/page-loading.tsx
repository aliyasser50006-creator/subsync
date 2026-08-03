import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface PageLoadingProps {
  children?: React.ReactNode;
  className?: string;
  showSpinner?: boolean;
}

export function PageLoading({ children, className, showSpinner = false }: PageLoadingProps) {
  return (
    <div className={cn("app-page animate-fade-in", className)}>
      {children}
      {showSpinner && (
        <div className="flex h-[400px] w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary opacity-50" />
        </div>
      )}
    </div>
  );
}
