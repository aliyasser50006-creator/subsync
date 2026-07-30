import { JobWithMetadata, Category, Actor } from '@/lib/types/database';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Play, Loader2, AlertCircle, Clock, Eye } from 'lucide-react';
import { MediaActionMenu } from './media-action-menu';
import { formatDistanceToNow } from 'date-fns';
import { memo } from 'react';

interface MediaListCardProps {
  job: JobWithMetadata;
  allCategories: Category[];
  allActors: Actor[];
  isSelected: boolean;
  onSelectToggle: (checked: boolean) => void;
  onInspect: () => void;
  onEdit: () => void;
  onPlay: () => void;
  onDelete: () => void;
  onDownload: () => void;
  onRetry: () => void;
  onOpenOutput: () => void;
  isDeleting: boolean;
  isRetrying: boolean;
}

export const MediaListCard = memo(function MediaListCard({
  job,
  allCategories,
  allActors,
  isSelected,
  onSelectToggle,
  onInspect,
  onEdit,
  onPlay,
  onDelete,
  onDownload,
  onRetry,
  onOpenOutput,
  isDeleting,
  isRetrying
}: MediaListCardProps) {
  const isProcessed = job.status === 'ready' || job.status === 'done';
  const isProcessing = job.status === 'pending' || job.status === 'processing';
  const isFailed = job.status === 'failed';

  const defaultThumb = '/placeholder-video.jpg';
  const thumbUrl = job.img_url || defaultThumb;
  const title = job.title || job.subtitle_file.split('/').pop() || 'Untitled Project';

  return (
    <Card 
      onClick={onEdit}
      className={`group flex flex-row overflow-hidden h-[120px] shadow-sm hover:shadow-md transition-all duration-300 border-border/40 cursor-pointer ${isSelected ? 'ring-2 ring-primary border-primary/50 bg-primary/5' : 'bg-surface'}`}
    >
      
      {/* Thumbnail Area (Left) */}
      <div className="relative w-[200px] h-full bg-muted shrink-0 overflow-hidden">
        {job.img_url ? (
          <img src={job.img_url} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted/80 text-muted-foreground transition-transform duration-500 group-hover:scale-105">
            <Play className="w-8 h-8 opacity-20" />
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Selection Checkbox */}
        <div 
          className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          <input 
            type="checkbox" 
            className="w-4 h-4 rounded border-white/40 bg-black/40 text-primary cursor-pointer"
            checked={isSelected}
            onChange={(e) => onSelectToggle(e.target.checked)}
          />
        </div>

      </div>

      {/* Metadata Area (Right) */}
      <div className="p-4 flex flex-col flex-1 min-w-0">
        <div className="flex justify-between items-start gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-base leading-tight line-clamp-1 title-text" title={title} onDoubleClick={onInspect}>
              {title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
              {job.description || 'No description provided.'}
            </p>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            {isProcessing ? (
              <Badge variant="secondary" className="bg-primary/10 text-primary hidden sm:inline-flex">
                <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Processing
              </Badge>
            ) : isFailed ? (
              <Badge variant="destructive" className="bg-destructive/10 text-destructive hidden sm:inline-flex">
                <AlertCircle className="w-3 h-3 mr-1" /> Failed
              </Badge>
            ) : (
               <Badge variant="secondary" className="bg-success/10 text-success hidden sm:inline-flex">
                 Ready
               </Badge>
            )}

            <div onClick={(e) => e.stopPropagation()}>
              <MediaActionMenu 
                job={job}
                onInspect={onInspect}
                onEdit={onEdit}
                onDelete={onDelete}
                onDownload={onDownload}
                onRetry={onRetry}
                onOpenOutput={onOpenOutput}
                isDeleting={isDeleting}
                isRetrying={isRetrying}
              />
            </div>
          </div>
        </div>
        
        {/* Bottom Row */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-center gap-2">
            <div className="text-xs text-muted-foreground flex items-center gap-1 bg-muted px-1.5 py-0.5 rounded-sm">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(new Date(job.created_at))} ago
            </div>

            <div className="hidden sm:flex items-center gap-1 border-l border-border/40 pl-2 ml-1">
              {job.categories && job.categories.length > 0 ? (
                job.categories.slice(0, 2).map(c => (
                  <Badge key={c.id} variant="secondary" className="text-[10px] px-1.5 py-0 rounded-sm bg-muted whitespace-nowrap">
                    {c.name}
                  </Badge>
                ))
              ) : null}
            </div>
          </div>

          {job.actors && job.actors.length > 0 && (
            <div className="flex -space-x-2 shrink-0">
              <TooltipProvider delayDuration={200}>
                {job.actors.slice(0, 4).map(a => (
                  <Tooltip key={a.id}>
                    <TooltipTrigger asChild>
                      <Avatar className="w-6 h-6 border-2 border-background shadow-sm hover:z-10 transition-transform hover:scale-110">
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
          )}
        </div>
      </div>
    </Card>
  );
});
