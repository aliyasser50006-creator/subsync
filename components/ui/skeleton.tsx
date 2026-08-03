import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const skeletonVariants = cva(
  'relative overflow-hidden bg-[var(--skeleton-base)] before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer-slide_1.8s_ease-in-out_infinite] before:bg-gradient-to-r before:from-transparent before:via-[var(--skeleton-shimmer)] before:to-transparent motion-reduce:before:animate-none',
  {
    variants: {
      variant: {
        default: 'rounded-md',
        circular: 'rounded-full',
        rectangular: 'rounded-none',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

function Skeleton({ className, variant, ...props }: SkeletonProps) {
  return (
    <div className={cn(skeletonVariants({ variant }), className)} {...props} />
  );
}

export { Skeleton, skeletonVariants };
