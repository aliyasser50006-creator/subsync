'use client';

import { AlertCircle, Download, Eye, Loader2, Pencil, Play, PlayCircle, RotateCcw, Subtitles, Trash2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { JobWithMetadata, Category, Actor } from '@/lib/types/database';
import { VideoThumbnail } from '@/components/videos/video-thumbnail';
import { cn } from '@/lib/utils';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils/format';
import { CategorySelector } from './category-selector';
import { ActorSelector } from './actor-selector';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import Link from 'next/link';

interface MediaListItemProps {
  job: JobWithMetadata;
  isSelected: boolean;
  isEditing: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  isRetrying: boolean;
  allCategories: Category[];
  allActors: Actor[];
  onSelect: () => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onDelete: () => void;
  onDownload: () => void;
  onRetry: () => void;
  onOpenOutput: () => void;
  
  editTitle: string;
  onEditTitleChange: (v: string) => void;
  editTitleError: string | null;
  
  editDescription: string;
  onEditDescriptionChange: (v: string) => void;
  
  editVideoUrl: string;
  onEditVideoUrlChange: (v: string) => void;
  editVideoUrlError: string | null;
  
  editImgUrl: string;
  onEditImgUrlChange: (v: string) => void;
  editImgUrlError: string | null;
  
  editCategoryIds: string[];
  onEditCategoryIdsChange: (v: string[]) => void;
  
  editActorIds: string[];
  onEditActorIdsChange: (v: string[]) => void;
}

function getStatusColor(status: JobWithMetadata['status']): string {
  switch (status) {
    case 'done': case 'ready': return 'border-success/30 bg-success/15 text-success font-semibold';
    case 'processing': case 'pending': return 'border-primary/30 bg-primary/15 text-primary font-semibold animate-pulse';
    case 'failed': return 'border-destructive/30 bg-destructive/15 text-destructive font-semibold';
    default: return 'border-border bg-muted text-muted-foreground font-semibold';
  }
}

function getStatusIcon(status: JobWithMetadata['status']) {
  if (status === 'processing') return <Loader2 className="mr-1 h-3 w-3 animate-spin" />;
  if (status === 'failed') return <AlertCircle className="mr-1 h-3 w-3" />;
  if (status === 'ready' || status === 'done') return <CheckCircle2 className="mr-1 h-3 w-3" />;
  return <PlayCircle className="mr-1 h-3 w-3" />;
}

function getHostname(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return 'Media Stream'; }
}

function getDisplayTitle(job: JobWithMetadata): string {
  const title = job.title?.trim();
  if (title) return title;
  const fileName = job.subtitle_file.split('/').pop() || 'Untitled Video';
  return fileName.replace(/\.[^/.]+$/, '');
}

function formatDate(value?: string): string {
  if (!value) return 'Unknown date';
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
}

export function MediaListItem({
  job, isSelected, isEditing, isSaving, isDeleting, isRetrying,
  allCategories, allActors,
  onSelect, onStartEdit, onCancelEdit, onSaveEdit, onDelete, onDownload, onRetry, onOpenOutput,
  editTitle, onEditTitleChange, editTitleError,
  editDescription, onEditDescriptionChange,
  editVideoUrl, onEditVideoUrlChange, editVideoUrlError,
  editImgUrl, onEditImgUrlChange, editImgUrlError,
  editCategoryIds, onEditCategoryIdsChange,
  editActorIds, onEditActorIdsChange,
}: MediaListItemProps) {
  
  return (
    <div
      className={cn(
        'rounded-2xl border transition-all duration-200 overflow-hidden bg-card/80 p-4 shadow-soft hover:shadow-md',
        isSelected
          ? 'border-primary/60 bg-primary/5 shadow-glow ring-1 ring-primary/40'
          : 'border-border/60 hover:border-border hover:bg-card'
      )}
    >
      {isEditing ? (
        <div className="space-y-4 p-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Title *</label>
                <Input value={editTitle} onChange={(e) => onEditTitleChange(e.target.value)} placeholder="Project title..." className="h-9 bg-background" />
                {editTitleError && <p className="text-xs text-destructive font-medium">{editTitleError}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Video URL *</label>
                <Input value={editVideoUrl} onChange={(e) => onEditVideoUrlChange(e.target.value)} placeholder="https://..." className="h-9 bg-background font-mono text-xs" />
                {editVideoUrlError && <p className="text-xs text-destructive font-medium">{editVideoUrlError}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center justify-between">
                  <span>Poster URL</span><span className="text-[10px] font-normal text-muted-foreground/70">(Optional)</span>
                </label>
                <Input value={editImgUrl} onChange={(e) => onEditImgUrlChange(e.target.value)} placeholder="https://..." className="h-9 bg-background font-mono text-xs" />
                {editImgUrlError && <p className="text-xs text-destructive font-medium">{editImgUrlError}</p>}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Description</label>
                <Textarea value={editDescription} onChange={(e) => onEditDescriptionChange(e.target.value)} placeholder="Brief description..." rows={2} className="bg-background resize-none min-h-[68px]" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Categories</label>
                <CategorySelector categories={allCategories} selectedCategoryIds={editCategoryIds} onChange={onEditCategoryIdsChange} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Actors</label>
                <ActorSelector actors={allActors} selectedActorIds={editActorIds} onChange={onEditActorIdsChange} />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2.5 pt-4 border-t border-border/40">
            <Button size="sm" variant="outline" onClick={onCancelEdit} disabled={isSaving} className="h-8 text-xs font-semibold">Cancel</Button>
            <Button size="sm" onClick={onSaveEdit} disabled={isSaving || !!editTitleError || !!editVideoUrlError || !!editImgUrlError} className="h-8 text-xs font-semibold shadow-xs">
              {isSaving && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-[160px_minmax(0,1fr)] items-start">
          <button
            type="button"
            onClick={onSelect}
            className="group relative aspect-video overflow-hidden rounded-xl bg-muted text-left border border-border/40 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={`Play ${getDisplayTitle(job)}`}
          >
            <VideoThumbnail title={getDisplayTitle(job)} url={job.video_url} imgUrl={job.img_url} className="transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow transform scale-90 group-hover:scale-100 transition-transform">
              <Play fill="currentColor" className="h-4 w-4 ml-0.5" />
            </div>
          </button>

          <div className="min-w-0 flex flex-col h-full space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link href={`/media-manager/${job.id}`}>
                  <h4 className="truncate text-base font-bold text-foreground cursor-pointer hover:text-primary transition-colors" title={getDisplayTitle(job)}>
                    {getDisplayTitle(job)}
                  </h4>
                </Link>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="truncate text-xs text-muted-foreground font-mono">{getHostname(job.video_url)}</p>
                  <span className="h-1 w-1 rounded-full bg-muted-foreground/50 shrink-0" />
                  <span className="text-xs text-muted-foreground">{formatDate(job.created_at)}</span>
                </div>
              </div>
              <Badge variant="outline" className={cn(getStatusColor(job.status), 'capitalize px-2.5 py-0.5 text-xs shrink-0')}>
                {getStatusIcon(job.status)}
                {job.status}
              </Badge>
            </div>

            {job.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{job.description}</p>
            )}

            <div className="flex flex-wrap gap-2 pt-1">
              {job.categories?.map((cat) => (
                <Link key={cat.id} href={`/categories/${cat.id}`}>
                  <Badge variant="secondary" className="flex items-center gap-1.5 pl-1.5 pr-2 py-0.5 text-[10px] font-semibold hover:bg-muted-foreground/20 transition-colors cursor-pointer">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />
                    {cat.name}
                  </Badge>
                </Link>
              ))}
              {job.actors?.map((actor) => (
                <Link key={actor.id} href={`/actors/${actor.id}`}>
                  <div className="flex items-center gap-1.5 rounded-full border border-border/60 bg-surface-hover/50 pl-1 pr-2 py-0.5 text-[10px] font-semibold hover:bg-muted-foreground/20 transition-colors cursor-pointer">
                    <Avatar className="h-4 w-4 border border-border/40">
                      <AvatarImage src={actor.image_url || undefined} alt={actor.name} className="object-cover" />
                      <AvatarFallback className="text-[7px] bg-primary/10 text-primary">{getInitials(actor.name)}</AvatarFallback>
                    </Avatar>
                    <span>{actor.name}</span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="flex-1" />

            <div className="flex items-center justify-between pt-2 border-t border-border/30 mt-2">
              <span className={cn('text-xs font-mono', job.subtitle_file ? 'text-primary font-semibold font-sans' : 'text-muted-foreground')}>
                {job.subtitle_file ? '✓ Subtitle Track Ready' : 'No Subtitle Track'}
              </span>

              <div className="flex items-center gap-1.5">
                <Button size="sm" variant={isSelected ? 'default' : 'secondary'} onClick={onSelect} className="h-8 px-3 text-xs font-semibold shadow-xs">
                  <Play className="mr-1.5 h-3.5 w-3.5 fill-current" /> Play
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={onStartEdit}>
                      <Pencil className="mr-2 h-4 w-4" /> Edit Metadata
                    </DropdownMenuItem>
                    <Link href={`/media-manager/${job.id}`}>
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" /> View Details
                      </DropdownMenuItem>
                    </Link>
                    
                    {(job.status === 'done' || job.status === 'ready') && job.output_video && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={onOpenOutput}>
                          <Eye className="mr-2 h-4 w-4" /> Open Output
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={onDownload}>
                          <Download className="mr-2 h-4 w-4" /> Download Video
                        </DropdownMenuItem>
                      </>
                    )}

                    {job.status === 'failed' && (
                      <DropdownMenuItem onClick={onRetry} disabled={isRetrying} className="text-warning focus:text-warning">
                        <RotateCcw className="mr-2 h-4 w-4" /> Retry Processing
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator />
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Project
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete project?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete &ldquo;{getDisplayTitle(job)}&rdquo;? This permanently erases the database record and subtitle track.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Permanently Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
