import { Button } from '@/components/ui/button';
import { JobWithMetadata } from '@/lib/types/database';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Trash2, Download, RefreshCw, ExternalLink, Eye } from 'lucide-react';
import { memo } from 'react';

interface MediaActionMenuProps {
  job: JobWithMetadata;
  onInspect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDownload: () => void;
  onRetry: () => void;
  onOpenOutput: () => void;
  isDeleting: boolean;
  isRetrying: boolean;
}

export const MediaActionMenu = memo(function MediaActionMenu({
  job,
  onInspect,
  onEdit,
  onDelete,
  onDownload,
  onRetry,
  onOpenOutput,
  isDeleting,
  isRetrying
}: MediaActionMenuProps) {
  const isProcessed = job.status === 'ready' || job.status === 'done';
  const isFailed = job.status === 'failed';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-background/80">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 shadow-lg rounded-xl">
        <DropdownMenuItem onClick={onInspect} className="cursor-pointer font-medium">
          <Eye className="w-4 h-4 mr-2 text-muted-foreground" /> Inspect Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
          <Edit className="w-4 h-4 mr-2 text-muted-foreground" /> Edit
        </DropdownMenuItem>
        
        {isProcessed && job.output_video && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onOpenOutput} className="cursor-pointer">
              <ExternalLink className="w-4 h-4 mr-2 text-muted-foreground" /> Open Output Video
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDownload} className="cursor-pointer">
              <Download className="w-4 h-4 mr-2 text-muted-foreground" /> Download
            </DropdownMenuItem>
          </>
        )}

        {(isFailed || isProcessed) && (
          <DropdownMenuItem onClick={onRetry} disabled={isRetrying} className="cursor-pointer">
            <RefreshCw className={`w-4 h-4 mr-2 text-muted-foreground ${isRetrying ? 'animate-spin' : ''}`} /> 
            {isRetrying ? 'Restarting...' : 'Retry Job'}
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={onDelete} disabled={isDeleting} className="cursor-pointer text-destructive focus:bg-destructive focus:text-destructive-foreground">
          <Trash2 className="w-4 h-4 mr-2" /> 
          {isDeleting ? 'Deleting...' : 'Delete Project'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
