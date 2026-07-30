import { JobWithMetadata, Category, Actor } from '@/lib/types/database';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Play, Loader2, AlertCircle } from 'lucide-react';
import { MediaActionMenu } from './media-action-menu';
import { format } from 'date-fns';
import { memo } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MediaTableProps {
  jobs: JobWithMetadata[];
  selectedIds: Set<string>;
  onSelectToggle: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onInspect: (job: JobWithMetadata) => void;
  onEdit: (job: JobWithMetadata) => void;
  onPlay: (job: JobWithMetadata) => void;
  onDelete: (id: string) => void;
  onDownload: (job: JobWithMetadata) => void;
  onRetry: (id: string) => void;
  onOpenOutput: (job: JobWithMetadata) => void;
  isDeleting: string | null;
  isRetrying: string | null;
}

export const MediaTable = memo(function MediaTable({
  jobs,
  selectedIds,
  onSelectToggle,
  onSelectAll,
  onInspect,
  onEdit,
  onPlay,
  onDelete,
  onDownload,
  onRetry,
  onOpenOutput,
  isDeleting,
  isRetrying
}: MediaTableProps) {
  const allSelected = jobs.length > 0 && selectedIds.size === jobs.length;
  
  return (
    <div className="rounded-xl border border-border/50 bg-surface shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[40px] px-4">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-border text-primary cursor-pointer"
                checked={allSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
              />
            </TableHead>
            <TableHead className="w-[80px]">Poster</TableHead>
            <TableHead className="min-w-[200px]">Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Categories</TableHead>
            <TableHead>Actors</TableHead>
            <TableHead className="hidden md:table-cell">Created</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map(job => {
            const isSelected = selectedIds.has(job.id);
            const isProcessed = job.status === 'ready' || job.status === 'done';
            const isProcessing = job.status === 'pending' || job.status === 'processing';
            const isFailed = job.status === 'failed';
            const title = job.title || job.subtitle_file.split('/').pop() || 'Untitled Project';

            return (
              <TableRow 
                key={job.id} 
                className={`group hover:bg-muted/30 transition-colors cursor-pointer ${isSelected ? 'bg-primary/5' : ''}`}
                onClick={() => onEdit(job)}
              >
                <TableCell className="px-4" onClick={(e) => e.stopPropagation()}>
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-border text-primary cursor-pointer"
                    checked={isSelected}
                    onChange={(e) => onSelectToggle(job.id, e.target.checked)}
                  />
                </TableCell>
                <TableCell>
                  <div className="relative w-14 h-10 bg-muted rounded-md overflow-hidden shrink-0 border border-border/50">
                    {job.img_url ? (
                      <img src={job.img_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <Play className="w-4 h-4 opacity-30" />
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm line-clamp-1 title-text">{title}</span>
                    <span className="text-[11px] text-muted-foreground line-clamp-1">{job.description || 'No description'}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {isProcessing ? (
                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Processing
                    </Badge>
                  ) : isFailed ? (
                    <Badge variant="destructive" className="bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20">
                      <AlertCircle className="w-3 h-3 mr-1" /> Failed
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-success/10 text-success hover:bg-success/20 border-success/20">
                      Ready
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {job.categories && job.categories.length > 0 ? (
                      job.categories.slice(0, 2).map(c => (
                        <Badge key={c.id} variant="secondary" className="text-[10px] px-1.5 py-0 rounded-sm">
                          {c.name}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-[11px] text-muted-foreground">-</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {job.actors && job.actors.length > 0 ? (
                    <div className="flex -space-x-2">
                      <TooltipProvider delayDuration={200}>
                        {job.actors.slice(0, 3).map(a => (
                          <Tooltip key={a.id}>
                            <TooltipTrigger asChild>
                              <Avatar className="w-6 h-6 border-2 border-background shadow-sm hover:z-10 transition-transform">
                                <AvatarImage src={a.image_url || undefined} alt={a.name} className="object-cover" />
                                <AvatarFallback className="text-[9px] bg-primary/10 text-primary">{a.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="text-xs">
                              {a.name}
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </TooltipProvider>
                    </div>
                  ) : (
                    <span className="text-[11px] text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                  {format(new Date(job.created_at), 'MMM d, yyyy')}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <MediaActionMenu 
                    job={job}
                    onInspect={() => onInspect(job)}
                    onEdit={() => onEdit(job)}
                    onDelete={() => onDelete(job.id)}
                    onDownload={() => onDownload(job)}
                    onRetry={() => onRetry(job.id)}
                    onOpenOutput={() => onOpenOutput(job)}
                    isDeleting={isDeleting === job.id}
                    isRetrying={isRetrying === job.id}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
});
