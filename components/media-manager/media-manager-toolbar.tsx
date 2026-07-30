import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, LayoutGrid, List, TableProperties, X, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Category, Actor } from '@/lib/types/database';
import { memo } from 'react';
import { Badge } from '@/components/ui/badge';

export type ViewMode = 'grid' | 'list' | 'table';
export type SortOption = 'newest' | 'oldest' | 'alphabetical';
export type StatusFilter = 'all' | 'processed' | 'unprocessed';

interface MediaManagerToolbarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (status: StatusFilter) => void;
  selectedCategoryId: string | 'all';
  onCategoryFilterChange: (id: string | 'all') => void;
  selectedActorId: string | 'all';
  onActorFilterChange: (id: string | 'all') => void;
  categories: Category[];
  actors: Actor[];
}

export const MediaManagerToolbar = memo(function MediaManagerToolbar({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  sort,
  onSortChange,
  statusFilter,
  onStatusFilterChange,
  selectedCategoryId,
  onCategoryFilterChange,
  selectedActorId,
  onActorFilterChange,
  categories,
  actors,
}: MediaManagerToolbarProps) {
  const hasActiveFilters = statusFilter !== 'all' || selectedCategoryId !== 'all' || selectedActorId !== 'all';
  
  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || 'Category';
  const getActorName = (id: string) => actors.find(a => a.id === id)?.name || 'Actor';

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2 border-b border-border/40">
        
        {/* Left Side: Search & Filters */}
        <div className="flex flex-1 w-full md:w-auto items-center gap-2">
          <div className="relative flex-1 md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search videos, actors, categories..."
              className="pl-9 h-10 w-full bg-surface shadow-sm"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => onSearchChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <Select value={statusFilter} onValueChange={(v: StatusFilter) => onStatusFilterChange(v)}>
            <SelectTrigger className="w-[130px] h-10 hidden sm:flex shadow-sm">
              <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Media</SelectItem>
              <SelectItem value="processed">Processed</SelectItem>
              <SelectItem value="unprocessed">Unprocessed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedCategoryId} onValueChange={onCategoryFilterChange}>
            <SelectTrigger className="w-[140px] h-10 hidden md:flex shadow-sm">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Right Side: View Options & Sort */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Select value={sort} onValueChange={(v: SortOption) => onSortChange(v)}>
            <SelectTrigger className="w-[140px] h-10 shadow-sm shrink-0">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center bg-muted p-1 rounded-lg shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-md ${viewMode === 'grid' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => onViewModeChange('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-md hidden sm:flex ${viewMode === 'list' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => onViewModeChange('list')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-md hidden lg:flex ${viewMode === 'table' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => onViewModeChange('table')}
            >
              <TableProperties className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 px-1">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-1">Active Filters:</span>
          {statusFilter !== 'all' && (
            <Badge variant="secondary" className="pl-3 pr-1 py-1 h-7 rounded-full capitalize">
              {statusFilter}
              <button onClick={() => onStatusFilterChange('all')} className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {selectedCategoryId !== 'all' && (
            <Badge variant="secondary" className="pl-3 pr-1 py-1 h-7 rounded-full">
              Category: {getCategoryName(selectedCategoryId)}
              <button onClick={() => onCategoryFilterChange('all')} className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {selectedActorId !== 'all' && (
            <Badge variant="secondary" className="pl-3 pr-1 py-1 h-7 rounded-full">
              Actor: {getActorName(selectedActorId)}
              <button onClick={() => onActorFilterChange('all')} className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => {
            onStatusFilterChange('all');
            onCategoryFilterChange('all');
            onActorFilterChange('all');
          }}>
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
});
