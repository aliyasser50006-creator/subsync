import { JobWithMetadata, Category, Actor } from '@/lib/types/database';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Edit2, Download, Trash2, ExternalLink, Play } from 'lucide-react';
import { memo } from 'react';

interface MediaDetailSheetProps {
  job: JobWithMetadata | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
  onPlay: () => void;
  onDelete: () => void;
  onDownload: () => void;
  onOpenOutput: () => void;
}

export const MediaDetailSheet = memo(function MediaDetailSheet({
  job,
  isOpen,
  onOpenChange,
  onEdit,
  onPlay,
  onDelete,
  onDownload,
  onOpenOutput
}: MediaDetailSheetProps) {
  if (!job) return null;

  const title = job.title || job.subtitle_file.split('/').pop() || 'Untitled Project';
  const isProcessed = job.status === 'ready' || job.status === 'done';

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl overflow-y-auto p-0 flex flex-col">
        {/* Poster Header Area */}
        <div className="relative w-full aspect-video bg-black shrink-0 group">
          {job.img_url ? (
            <img src={job.img_url} alt={title} className="w-full h-full object-cover opacity-80" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted/20">
              <span className="text-muted-foreground">No Poster</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-90" />
          
          {isProcessed && (
            <button 
              onClick={onPlay}
              className="absolute inset-0 m-auto w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg z-10"
            >
              <Play className="w-6 h-6 fill-current ml-1" />
            </button>
          )}

          <div className="absolute bottom-4 left-6 right-6">
            <Badge className="mb-2 bg-primary/20 text-primary border-primary/30 pointer-events-none">
              {job.status.toUpperCase()}
            </Badge>
            <SheetTitle className="text-2xl font-bold text-foreground line-clamp-2">{title}</SheetTitle>
          </div>
        </div>

        <div className="flex-1 p-6 pt-2">
          <Tabs defaultValue="overview" className="w-full h-full flex flex-col">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-6 overflow-x-auto">
              <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2">Overview</TabsTrigger>
              <TabsTrigger value="metadata" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2">Metadata</TabsTrigger>
              <TabsTrigger value="history" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2">History</TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-y-auto pb-8">
              <TabsContent value="overview" className="mt-0 space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Description</h4>
                  <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                    {job.description || 'No description provided for this video.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.categories && job.categories.length > 0 ? (
                        job.categories.map(c => (
                          <Badge key={c.id} variant="secondary">{c.name}</Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">None assigned</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Actors</h4>
                    <div className="flex flex-col gap-3">
                      {job.actors && job.actors.length > 0 ? (
                        job.actors.map(a => (
                          <div key={a.id} className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={a.image_url || undefined} className="object-cover" />
                              <AvatarFallback>{a.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{a.name}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">None assigned</span>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="metadata" className="mt-0 space-y-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Source Video</h4>
                    <p className="text-sm text-foreground break-all bg-muted p-2 rounded-md font-mono">{job.video_url}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Subtitle File</h4>
                    <p className="text-sm text-foreground break-all bg-muted p-2 rounded-md font-mono">{job.subtitle_file}</p>
                  </div>
                  {job.output_video && (
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Output Video</h4>
                      <p className="text-sm text-foreground break-all bg-muted p-2 rounded-md font-mono">{job.output_video}</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="history" className="mt-0 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-border/40">
                    <span className="text-sm text-muted-foreground">Job ID</span>
                    <span className="text-sm font-mono">{job.id}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/40">
                    <span className="text-sm text-muted-foreground">Created At</span>
                    <span className="text-sm font-medium">{format(new Date(job.created_at), 'PPP pp')}</span>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Action Footer */}
        <div className="p-4 bg-muted/30 border-t border-border/40 flex items-center justify-between gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit2 className="w-4 h-4 mr-2" /> Edit Details
          </Button>
          
          <div className="flex items-center gap-2">
            {isProcessed && job.output_video && (
              <>
                <Button variant="ghost" size="sm" onClick={onOpenOutput} title="Open in browser">
                  <ExternalLink className="w-4 h-4" />
                </Button>
                <Button variant="default" size="sm" onClick={onDownload}>
                  <Download className="w-4 h-4 mr-2" /> Download
                </Button>
              </>
            )}
            <Button variant="destructive" size="sm" onClick={onDelete}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
});
