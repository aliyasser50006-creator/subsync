import { Button } from '@/components/ui/button';
import { Film, Search, Tag, Users, Plus } from 'lucide-react';
import Link from 'next/link';

interface MediaManagerEmptyProps {
  searchQuery: string;
  hasFilters: boolean;
  onClearFilters: () => void;
}

export function MediaManagerEmpty({ searchQuery, hasFilters, onClearFilters }: MediaManagerEmptyProps) {
  
  if (searchQuery) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-16 surface-panel border border-border/40 shadow-sm rounded-xl text-center min-h-[400px]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
          <Search className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-foreground">No results found</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
          We couldn't find anything matching "{searchQuery}". Try adjusting your search term or clearing filters.
        </p>
        <Button variant="outline" className="mt-6" onClick={onClearFilters}>
          Clear Search & Filters
        </Button>
      </div>
    );
  }

  if (hasFilters) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-16 surface-panel border border-border/40 shadow-sm rounded-xl text-center min-h-[400px]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4">
          <FilterIcon className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-foreground">No matches for filters</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
          None of your videos match the current category, actor, or status filters.
        </p>
        <Button variant="outline" className="mt-6" onClick={onClearFilters}>
          Clear All Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-16 surface-panel border border-border/40 shadow-sm rounded-xl text-center min-h-[500px]">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary mb-6 shadow-sm border border-primary/20">
        <Film className="h-10 w-10" />
      </div>
      <h3 className="text-2xl font-bold text-foreground tracking-tight">Your library is empty</h3>
      <p className="mt-2 text-base text-muted-foreground max-w-md mx-auto">
        Start building your media library by adding your first video. SubSync AI will automatically process subtitles and prepare your content.
      </p>
      <Link href="/create" passHref legacyBehavior>
        <Button size="lg" className="mt-8 font-semibold shadow-md hover:-translate-y-0.5 transition-transform">
          <Plus className="mr-2 h-5 w-5" /> Add Your First Video
        </Button>
      </Link>
    </div>
  );
}

function FilterIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}
