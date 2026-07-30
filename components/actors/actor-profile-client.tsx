'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Video, Play, Globe, Calendar, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ActorWithCount, Job } from '@/lib/types/database';
import { VideoThumbnail } from '@/components/videos/video-thumbnail';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils/format';

function getStatusColor(status: Job['status']): string {
  switch (status) {
    case 'done': case 'ready': return 'border-success/30 bg-success/15 text-success font-semibold';
    case 'processing': case 'pending': return 'border-primary/30 bg-primary/15 text-primary font-semibold';
    case 'failed': return 'border-destructive/30 bg-destructive/15 text-destructive font-semibold';
    default: return 'border-border bg-muted text-muted-foreground font-semibold';
  }
}

function formatDate(value?: string): string {
  if (!value) return 'Unknown';
  return new Intl.DateTimeFormat(undefined, { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(value));
}

interface ActorProfileClientProps {
  actor: ActorWithCount;
  jobs: Job[];
  returnTo?: string;
  breadcrumbSource?: string;
}

export function ActorProfileClient({ actor, jobs, returnTo, breadcrumbSource }: ActorProfileClientProps) {
  const router = useRouter();
  
  return (
    <div className="space-y-8">
      {returnTo && (
        <div className="mb-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => router.replace(returnTo, { scroll: false })}
            className="-ml-3 h-8 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            <span className="hidden sm:inline-block max-w-[250px] truncate">{breadcrumbSource || 'Back'}</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </div>
      )}
      <div className="relative surface-panel border border-border/60 shadow-soft overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-background" />
        <div className="px-6 pb-6 relative">
          <div className="flex flex-col sm:flex-row gap-6 -mt-12 items-start sm:items-end mb-6">
            <Avatar className="h-32 w-32 shrink-0 ring-4 ring-background shadow-elevated">
              <AvatarImage src={actor.image_url || undefined} alt={actor.name} className="object-cover" />
              <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
                {getInitials(actor.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2 mb-1">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">{actor.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-medium">
                {actor.nationality && (
                  <span className="flex items-center gap-1.5"><Globe className="h-4 w-4" />{actor.nationality}</span>
                )}
                {actor.birth_date && (
                  <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />Born {formatDate(actor.birth_date)}</span>
                )}
                <span className="flex items-center gap-1.5 text-primary"><Video className="h-4 w-4" />{actor.video_count} Movies</span>
              </div>
            </div>
            <Link href={`/actors/${actor.id}/edit`} className="sm:mb-1">
              <Button variant="outline" size="sm" className="font-semibold shadow-xs">
                <Pencil className="mr-1.5 h-4 w-4" /> Edit Profile
              </Button>
            </Link>
          </div>
          
          {actor.biography && (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
                {actor.biography}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Video className="h-5 w-5 text-primary" /> Filmography
        </h2>

        {jobs.length === 0 ? (
          <div className="surface-panel py-16 px-6 text-center border border-border/60">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-muted/60 text-muted-foreground">
              <Video className="h-7 w-7" />
            </div>
            <p className="mt-4 text-base font-bold text-foreground">No movies yet</p>
            <p className="mt-1 text-xs text-muted-foreground">Link videos to this actor from the Media Manager.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <div key={job.id} className="group rounded-2xl border border-border/60 bg-card/80 shadow-soft overflow-hidden transition-all duration-200 hover:border-border hover:shadow-md">
                <div className="relative aspect-video bg-muted">
                  <VideoThumbnail title={job.title || 'Untitled'} url={job.video_url} imgUrl={job.img_url} className="transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-foreground truncate">{job.title || 'Untitled'}</h3>
                    <Badge variant="outline" className={`${getStatusColor(job.status)} capitalize px-2 py-0.5 text-[10px] shrink-0`}>
                      {job.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{formatDate(job.created_at)}</p>
                  <Link href={`/library/video/${job.id}?from=actor&actorId=${actor.id}`}>
                    <Button size="sm" variant="secondary" className="w-full h-8 text-xs font-semibold mt-2">
                      <Play className="mr-1.5 h-3.5 w-3.5 fill-current" /> Open Video
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
