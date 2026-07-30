import { JobWithMetadata, Category, Actor } from '@/lib/types/database';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Play, Eye, Edit2, Loader2, AlertCircle, Clock } from 'lucide-react';
import { MediaActionMenu } from './media-action-menu';
import { formatDistanceToNow } from 'date-fns';
import { memo } from 'react';

interface MediaGridCardProps {
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

export const MediaGridCard = memo(function MediaGridCard({
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
}: MediaGridCardProps) {
  const isProcessed = job.status === 'ready' || job.status === 'done';
  const isProcessing = job.status === 'pending' || job.status === 'processing';
  const isFailed = job.status === 'failed';

  const defaultThumb = '/placeholder-video.jpg'; // We can use a generic div if no thumb
  const thumbUrl = job.img_url || defaultThumb;
  
  const title = job.title || job.subtitle_file.split('/').pop() || 'Untitled Project';

  return (
    <Card 
      onClick={onEdit}
      className={`group flex flex-col overflow-hidden h-[340px] shadow-sm hover:shadow-md transition-all duration-300 border-border/40 cursor-pointer ${isSelected ? 'ring-2 ring-primary border-primary/50' : ''}`}
    >
      {/* Thumbnail Area */}
      <div className="relative h-44 w-full bg-muted shrink-0 overflow-hidden">
        {job.img_url ? (
          <img src={job.img_url} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted/80 text-muted-foreground transition-transform duration-500 group-hover:scale-105">
            <Play className="w-12 h-12 opacity-20" />
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 opacity-60 group-hover:opacity-80 transition-opacity" />

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

        {/* Status Badge */}
        <div className="absolute top-2 right-2 z-10">
          {isProcessing ? (
            <Badge variant="secondary" className="bg-primary/90 text-primary-foreground border-none">
              <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Processing
            </Badge>
          ) : isFailed ? (
            <Badge variant="destructive" className="bg-destructive/90 border-none">
              <AlertCircle className="w-3 h-3 mr-1" /> Failed
            </Badge>
          ) : (
             <Badge variant="secondary" className="bg-black/60 text-white backdrop-blur-md border-white/10 hover:bg-black/60 font-medium">
               Ready
             </Badge>
          )}
        </div>


        
        {/* Duration / Date */}
        <div className="absolute bottom-2 right-2 text-[10px] font-medium text-white/90 bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-md z-10 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
        </div>
      </div>

      {/* Metadata Area */}
      <CardContent className="p-4 flex flex-col flex-1 relative">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold leading-tight line-clamp-2 title-text flex-1" title={title}>
            {title}
          </h3>
          <div className="shrink-0 -mr-2 -mt-1" onClick={(e) => e.stopPropagation()}>
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
        
        <p className="text-xs text-muted-foreground line-clamp-2 mt-1 mb-3 flex-1">
          {job.description || 'No description provided.'}
        </p>

        {/* Categories & Actors row */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/40">
          <div className="flex items-center gap-1 flex-wrap overflow-hidden h-[22px]">
            {job.categories && job.categories.length > 0 ? (
              job.categories.slice(0, 2).map(c => (
                <Badge key={c.id} variant="secondary" className="text-[10px] px-1.5 py-0 rounded-sm bg-muted whitespace-nowrap">
                  {c.name}
                </Badge>
              ))
            ) : (
              <span className="text-[10px] text-muted-foreground">Uncategorized</span>
            )}
            {job.categories && job.categories.length > 2 && (
              <span className="text-[10px] text-muted-foreground">+{job.categories.length - 2}</span>
            )}
          </div>

          {job.actors && job.actors.length > 0 && (
            <div className="flex -space-x-2 shrink-0">
              <TooltipProvider delayDuration={200}>
                {job.actors.slice(0, 3).map(a => (
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
      </CardContent>
    </Card>
  );
});
