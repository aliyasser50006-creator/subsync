'use client';

import { MouseEvent, memo } from 'react';
import { AlertTriangle, CheckCircle2, Clock, Loader2, Play, Subtitles } from 'lucide-react';
import { BrowseVideo } from '@/lib/types/video-browser';
import { Job } from '@/lib/types/database';
import { VideoThumbnail } from '@/components/videos/video-thumbnail';
import { Badge } from '@/components/ui/badge';
import { buildLibraryVideoUrl } from '@/lib/utils/library-video-route';

interface LibraryCardProps {
  video: BrowseVideo & { status?: Job['status'] };
  onBeforeOpen: () => boolean;
}

function getStatusBadge(status?: Job['status']) {
  switch (status) {
    case 'done':
    case 'ready':
      return <Badge variant="outline" className="border-success/30 bg-success/15 text-success text-[10px] px-2 py-0.5 font-semibold backdrop-blur-md shadow-xs"><CheckCircle2 className="mr-1 h-3 w-3 shrink-0" /> Ready</Badge>;
    case 'processing':
    case 'pending':
      return <Badge variant="outline" className="border-primary/30 bg-primary/15 text-primary text-[10px] px-2 py-0.5 font-semibold backdrop-blur-md animate-pulse shadow-xs"><Loader2 className="mr-1 h-3 w-3 shrink-0 animate-spin" /> Processing</Badge>;
    case 'failed':
      return <Badge variant="outline" className="border-destructive/30 bg-destructive/15 text-destructive text-[10px] px-2 py-0.5 font-semibold backdrop-blur-md shadow-xs"><AlertTriangle className="mr-1 h-3 w-3 shrink-0" /> Failed</Badge>;
    default:
      return null;
  }
}

export const LibraryCard = memo(function LibraryCard({ video, onBeforeOpen }: LibraryCardProps) {
  const detailsUrl = buildLibraryVideoUrl(video.id) || '#';
  const formattedDate = video.created_at
    ? new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(video.created_at))
    : 'Unknown date';
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!onBeforeOpen()) event.preventDefault();
  };

  return (
    <a
      href={detailsUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="group relative flex w-full flex-col overflow-hidden rounded-xl border border-border bg-card text-left interactive-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm"
      aria-label={`Open details for ${video.name} in a new tab`}
    >
      <div className="relative aspect-video w-full overflow-hidden border-b border-border/40 bg-slate-950">
        <VideoThumbnail title={video.name} url={video.video_url} iconClassName="h-8 w-8" className="transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <div className="flex h-12 w-12 scale-90 items-center justify-center rounded-full bg-primary pl-1 shadow-md transition-transform duration-200 group-hover:scale-100">
            <Play fill="currentColor" className="h-5 w-5 text-primary-foreground" />
          </div>
        </div>
        <div className="pointer-events-none absolute left-2.5 right-2.5 top-2.5 flex items-start justify-between">
          {getStatusBadge(video.status)}
          {video.subtitle_file && <Badge variant="secondary" className="border border-border/40 bg-background/85 px-2 py-0.5 text-[10px] font-semibold text-foreground backdrop-blur-md shadow-xs"><Subtitles className="mr-1 h-3 w-3 text-primary" /> CC</Badge>}
        </div>
      </div>
      <div className="flex flex-1 flex-col bg-card/50 p-4">
        <h3 className="min-h-[40px] line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary" title={video.name}>{video.name}</h3>
        <div className="mt-auto flex items-center justify-between border-t border-border/30 pt-3 font-mono text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-muted-foreground/70" /><span className="truncate">{formattedDate}</span></div>
          <span className="text-[10px] font-semibold uppercase text-primary opacity-0 transition-opacity group-hover:opacity-100">Details →</span>
        </div>
      </div>
    </a>
  );
});
