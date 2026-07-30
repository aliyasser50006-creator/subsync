'use client';

import Link from 'next/link';
import { ChevronLeft, Calendar, Download, PlayCircle, Loader2, AlertCircle, CheckCircle2, Film, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { JobWithMetadata } from '@/lib/types/database';
import VideoPlayer from '@/components/VideoPlayer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils/format';
import { downloadVideo } from '@/lib/utils/download';
import { toast } from 'sonner';

interface MediaDetailClientProps {
  job: JobWithMetadata;
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
  if (status === 'processing' || status === 'pending') return <Loader2 className="mr-1 h-3 w-3 animate-spin" />;
  if (status === 'failed') return <AlertCircle className="mr-1 h-3 w-3" />;
  if (status === 'ready' || status === 'done') return <CheckCircle2 className="mr-1 h-3 w-3" />;
  return <PlayCircle className="mr-1 h-3 w-3" />;
}

function formatDate(value?: string): string {
  if (!value) return 'Unknown date';
  return new Intl.DateTimeFormat(undefined, { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value));
}

function getDisplayTitle(job: JobWithMetadata): string {
  const title = job.title?.trim();
  if (title) return title;
  const fileName = job.subtitle_file.split('/').pop() || 'Untitled Video';
  return fileName.replace(/\.[^/.]+$/, '');
}

export function MediaDetailClient({ job }: MediaDetailClientProps) {
  const handleDownload = async () => {
    if (!job.output_video) return;
    try {
      toast.loading('Starting download...', { id: 'download' });
      await downloadVideo(job.output_video, job.title || 'video');
      toast.success('Download started!', { id: 'download' });
    } catch (err) {
      toast.error('Download failed.', { id: 'download' });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/media-manager">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full shrink-0">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-foreground truncate">{getDisplayTitle(job)}</h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
            <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{formatDate(job.created_at)}</span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground/50 shrink-0" />
            <Badge variant="outline" className={`${getStatusColor(job.status)} capitalize px-2.5 py-0.5 text-xs`}>
              {getStatusIcon(job.status)} {job.status}
            </Badge>
          </div>
        </div>
        <Link href={`/media-manager/${job.id}/edit`}>
          <Button variant="outline" size="sm" className="hidden sm:flex font-semibold shadow-xs">
            <Edit className="mr-1.5 h-3.5 w-3.5" /> Edit Metadata
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-border/60 shadow-elevated bg-black">
            <VideoPlayer src={job.output_video || job.video_url} posterUrl={job.img_url} />
          </div>

          <div className="surface-panel p-6 border border-border/60 shadow-soft">
            <h2 className="text-lg font-bold text-foreground mb-4">Description</h2>
            {job.description ? (
              <p className="text-muted-foreground whitespace-pre-line leading-relaxed text-sm">
                {job.description}
              </p>
            ) : (
              <p className="text-muted-foreground/50 italic text-sm">No description provided.</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="surface-panel p-6 border border-border/60 shadow-soft">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <Film className="h-4 w-4 text-primary" /> Categories
            </h3>
            {job.categories && job.categories.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {job.categories.map((cat) => (
                  <Link key={cat.id} href={`/categories/${cat.id}`}>
                    <Badge variant="secondary" className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 text-xs font-semibold hover:bg-muted-foreground/20 transition-colors cursor-pointer">
                      <div className="h-2 w-2 rounded-full shadow-xs" style={{ backgroundColor: cat.color }} />
                      {cat.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground/50 italic text-xs">No categories assigned.</p>
            )}
          </div>

          <div className="surface-panel p-6 border border-border/60 shadow-soft">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">Actors</h3>
            {job.actors && job.actors.length > 0 ? (
              <div className="space-y-3">
                {job.actors.map((actor) => (
                  <Link key={actor.id} href={`/actors/${actor.id}`}>
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-hover/50 transition-colors border border-transparent hover:border-border/60 cursor-pointer">
                      <Avatar className="h-10 w-10 border border-border/40 shadow-xs shrink-0">
                        <AvatarImage src={actor.image_url || undefined} alt={actor.name} className="object-cover" />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                          {getInitials(actor.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-foreground truncate">{actor.name}</p>
                        {actor.nationality && <p className="text-xs text-muted-foreground truncate">{actor.nationality}</p>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground/50 italic text-xs">No actors assigned.</p>
            )}
          </div>

          {(job.status === 'done' || job.status === 'ready') && job.output_video && (
            <div className="surface-panel p-6 border border-border/60 shadow-soft bg-primary/5 border-primary/20">
              <h3 className="text-sm font-bold text-foreground mb-3">Output Available</h3>
              <p className="text-xs text-muted-foreground mb-4">Your video has been successfully processed and is ready for download.</p>
              <div className="flex flex-col gap-2">
                <Button onClick={handleDownload} className="w-full font-semibold shadow-xs">
                  <Download className="mr-2 h-4 w-4" /> Download Subbed Video
                </Button>
                <Button variant="outline" onClick={() => window.open(job.output_video as string, '_blank')} className="w-full font-semibold">
                  Open in New Tab
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
