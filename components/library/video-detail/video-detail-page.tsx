'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Play, Info, Download, Settings, ChevronRight } from 'lucide-react';

import { JobWithMetadata, SubtitleSettings } from '@/lib/types/database';
import { LibraryVideo } from '@/lib/data/library';
import { VideoPlayerSection } from './video-player-section';
import { SubtitlePanel } from './subtitle-panel';
import { VideoDetailActions } from './video-detail-actions';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LibraryGrid } from '../library-grid';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

interface VideoDetailPageProps {
  job: JobWithMetadata;
  relatedVideos?: LibraryVideo[];
  returnTo: string;
  breadcrumbSource?: string;
}

const DEFAULT_SUBTITLE_SETTINGS: SubtitleSettings = {
  fontSize: 30,
  fontColor: '#FFFFFF',
  position: 'bottom',
  alignment: 'center',
  background: false,
  outlineColor: '#000000',
  outlineWidth: 0,
};

function getFileName(url: string) {
  try {
    const segment = new URL(url).pathname.split('/').filter(Boolean).pop();
    return segment ? decodeURIComponent(segment) : 'Remote video';
  } catch {
    return 'Remote video';
  }
}

export function VideoDetailPage({ job, relatedVideos = [], returnTo, breadcrumbSource = 'Media Library' }: VideoDetailPageProps) {
  const router = useRouter();
  const mergedSettings = { ...DEFAULT_SUBTITLE_SETTINGS, ...(job.subtitle_settings || {}) };
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  const [subtitleDelaySeconds, setSubtitleDelaySeconds] = useState(0);
  const [subtitleFontSize, setSubtitleFontSize] = useState(mergedSettings.fontSize || 30);
  const [activeSettings, setActiveSettings] = useState<SubtitleSettings>(mergedSettings);
  const playerSectionRef = useRef<HTMLDivElement>(null);
  
  const subtitleUrl = job.subtitle_file
    ? job.subtitle_file.startsWith('http')
      ? job.subtitle_file
      : `/api/subtitles/content?path=${encodeURIComponent(job.subtitle_file)}`
    : null;
    
  const title = job.title || 'Untitled Studio Project';
  const uploadYear = new Date(job.created_at).getFullYear();
  const uploadDate = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(job.created_at));

  const handleFontSizeChange = (fontSize: number) => {
    setSubtitleFontSize(fontSize);
    setActiveSettings((settings) => ({ ...settings, fontSize }));
  };

  const handleSeekTo = (seconds: number) => {
    window.dispatchEvent(new CustomEvent('subsync:seek', { detail: { seconds } }));
    const videoElement = document.getElementsByTagName('video')[0];
    if (videoElement) {
      videoElement.currentTime = seconds;
      videoElement.play().catch(() => {});
    }
    playerSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const returnToLibrary = () => {
    router.replace(returnTo, { scroll: false });
  };

  const formatCategories = () => {
    if (!job.categories || job.categories.length === 0) return 'Uncategorized';
    return job.categories.map(c => c.name).join(' • ');
  };

  return (
    <div className="w-full bg-background min-h-screen animate-fade-in pb-24">
      {/* 1. The Immersive Hero (Full-Bleed Video) */}
      <div className="w-full bg-black relative" ref={playerSectionRef}>
        <div className="absolute top-4 left-4 z-50 flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={returnToLibrary}
            className="text-white/70 hover:text-white hover:bg-black/40 backdrop-blur-md rounded-full h-10 px-4 flex items-center"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            <span className="hidden sm:inline-block max-w-[150px] truncate">{breadcrumbSource}</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </div>
        
        <div className="w-full max-w-[1920px] mx-auto aspect-video">
          <VideoPlayerSection
            videoId={job.id}
            videoUrl={job.video_url}
            posterUrl={job.img_url}
            subtitleUrl={subtitleUrl}
            subtitleSettings={activeSettings}
            subtitleDelaySeconds={subtitleDelaySeconds}
            subtitlesEnabled={subtitlesEnabled}
          />
        </div>
      </div>

      {/* Main Content Canvas */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pt-10 lg:pt-14">
        
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Main Narrative Column (70%) */}
          <div className="flex-1 lg:w-2/3 min-w-0">
            
            {/* 2. Title & Context Layer */}
            <div className="mb-10">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-4 leading-tight">
                {title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm sm:text-base font-medium text-muted-foreground mb-8">
                <span className="text-foreground/80">{uploadYear}</span>
                <span>•</span>
                <span>{formatCategories()}</span>
                <span>•</span>
                <span className="capitalize">{job.status}</span>
                {job.output_video && (
                  <>
                    <span>•</span>
                    <span className="text-success flex items-center"><Play className="w-3.5 h-3.5 mr-1 inline" fill="currentColor" /> Output Ready</span>
                  </>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <VideoDetailActions
                  videoId={job.id}
                  title={title}
                  hasSubtitles={Boolean(job.subtitle_file)}
                  returnTo={returnTo}
                />
              </div>
            </div>

            {/* 3. The Synopsis */}
            <div className="mb-14 max-w-3xl">
              {job.description ? (
                <p className="text-base sm:text-lg leading-relaxed text-foreground/80">
                  {job.description}
                </p>
              ) : (
                <p className="text-base sm:text-lg italic text-muted-foreground">
                  No synopsis available.
                </p>
              )}
            </div>

            {/* 4. The Cast Carousel */}
            {job.actors && job.actors.length > 0 && (
              <div className="mb-14">
                <h3 className="text-xl font-bold tracking-tight mb-6">Cast</h3>
                <div className="flex overflow-x-auto pb-6 -mx-6 px-6 sm:-mx-10 sm:px-10 lg:-mx-12 lg:px-12 snap-x scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  <div className="flex gap-4 sm:gap-6 min-w-max">
                    {job.actors.map((actor) => (
                      <Link 
                        key={actor.id} 
                        href={`/actors/${actor.id}?from=video&videoId=${job.id}`}
                        className="flex flex-col items-center w-28 sm:w-32 snap-start group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl p-1"
                      >
                        <Avatar className="w-28 h-28 sm:w-32 sm:h-32 mb-4 border border-white/10 shadow-lg group-hover:scale-105 transition-transform duration-300 ease-out">
                          <AvatarImage src={actor.image_url || undefined} alt={actor.name} className="object-cover" />
                          <AvatarFallback className="bg-primary/5 text-primary text-2xl font-light">
                            {actor.name.substring(0, 1).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-semibold text-center leading-tight group-hover:text-primary transition-colors">{actor.name}</span>
                        {actor.nationality && (
                          <span className="text-xs text-muted-foreground text-center mt-1">{actor.nationality}</span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Subtitle Script/Panel */}
            {subtitleUrl && (
              <div className="mb-14 max-w-3xl">
                <h3 className="text-xl font-bold tracking-tight mb-6">Transcript</h3>
                <div className="rounded-xl overflow-hidden border border-border/40">
                   <SubtitlePanel subtitleUrl={subtitleUrl} onSeekTo={handleSeekTo} />
                </div>
              </div>
            )}

          </div>

          {/* 5. The Technical Ledger (30%) */}
          <div className="w-full lg:w-1/3 lg:max-w-sm space-y-10">
            
            <div className="space-y-6">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">About This Title</h4>
              
              <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                <div className="text-muted-foreground">Original File</div>
                <div className="font-medium truncate text-right" title={getFileName(job.video_url)}>{getFileName(job.video_url)}</div>
                
                <div className="text-muted-foreground">Added On</div>
                <div className="font-medium text-right">{uploadDate}</div>
                
                <div className="text-muted-foreground">Subtitles</div>
                <div className="font-medium text-right">{job.subtitle_file ? 'Available' : 'None'}</div>
              </div>
            </div>

            {subtitleUrl && (
              <div className="space-y-6 pt-6 border-t border-border/40">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Playback Settings</h4>
                  <Settings className="w-4 h-4 text-muted-foreground" />
                </div>
                
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Enable Subtitles</span>
                    <Switch checked={subtitlesEnabled} onCheckedChange={setSubtitlesEnabled} />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Sync Delay</span>
                      <span className="text-xs font-mono bg-muted/50 px-2 py-1 rounded text-muted-foreground">{subtitleDelaySeconds > 0 ? '+' : ''}{subtitleDelaySeconds}s</span>
                    </div>
                    <Slider
                      value={[subtitleDelaySeconds]}
                      min={-10}
                      max={10}
                      step={0.1}
                      onValueChange={([val]) => setSubtitleDelaySeconds(val)}
                      className="py-2"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Text Size</span>
                      <span className="text-xs font-mono bg-muted/50 px-2 py-1 rounded text-muted-foreground">{subtitleFontSize}px</span>
                    </div>
                    <Slider
                      value={[subtitleFontSize]}
                      min={12}
                      max={72}
                      step={2}
                      onValueChange={([val]) => handleFontSizeChange(val)}
                      className="py-2"
                    />
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>

        {/* 6. Infinite Discovery (More Like This) */}
        {relatedVideos && relatedVideos.length > 0 && (
          <div className="mt-20 pt-10 border-t border-border/20">
            <h2 className="text-2xl font-bold tracking-tight mb-8">More Like This</h2>
            <LibraryGrid 
              videos={relatedVideos} 
              viewMode="grid"
              isSearchingOrFiltering={false}
              onClearFilters={() => {}}
              onOpenVideo={() => true}
            />
          </div>
        )}

      </div>
    </div>
  );
}
