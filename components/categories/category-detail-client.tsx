'use client';

import Link from 'next/link';
import { Pencil, Video, Play, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CategoryWithCount, Job } from '@/lib/types/database';
import { VideoThumbnail } from '@/components/videos/video-thumbnail';

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
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
}

interface CategoryDetailClientProps {
  category: CategoryWithCount;
  jobs: Job[];
}

export function CategoryDetailClient({ category, jobs }: CategoryDetailClientProps) {
  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="eyebrow">Category details</div>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-5 w-5 rounded-full ring-2 ring-background shadow-xs" style={{ backgroundColor: category.color }} />
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{category.name}</h1>
          </div>
          {category.description && (
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">{category.description}</p>
          )}
        </div>
        <Link href={`/categories/${category.id}/edit`}>
          <Button variant="outline" size="sm" className="font-semibold">
            <Pencil className="mr-1.5 h-4 w-4" />
            Edit Category
          </Button>
        </Link>
      </header>

      <div className="surface-panel p-4 border border-border/60 shadow-soft">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Video className="h-4 w-4 text-primary" />
          <span>{category.video_count} video{category.video_count !== 1 ? 's' : ''} in this category</span>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="surface-panel py-16 px-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-muted/60 text-muted-foreground">
            <Video className="h-7 w-7" />
          </div>
          <p className="mt-4 text-base font-bold text-foreground">No videos yet</p>
          <p className="mt-1 text-xs text-muted-foreground">Assign videos to this category from the Media Manager.</p>
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
                <Link href={`/library/video/${job.id}?from=category&categoryId=${category.id}`}>
                  <Button size="sm" variant="secondary" className="w-full h-8 text-xs font-semibold mt-2">
                    <Play className="mr-1.5 h-3.5 w-3.5 fill-current" />
                    Open Video
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
