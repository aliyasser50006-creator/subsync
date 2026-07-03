import { AlertCircle, Video, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface SourceVideoCardProps {
  title: string;
  titleError: string | null;
  videoUrl: string;
  videoUrlError: string | null;
  onTitleChange: (value: string) => void;
  onVideoUrlChange: (value: string) => void;
}

export function SourceVideoCard({
  title,
  titleError,
  videoUrl,
  videoUrlError,
  onTitleChange,
  onVideoUrlChange,
}: SourceVideoCardProps) {
  const isValidUrl = videoUrl.trim() !== '' && !videoUrlError;

  return (
    <Card className="surface-panel transition-all duration-200 hover:border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5 text-lg font-semibold">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-xs">
            <Video className="h-4 w-4" />
          </div>
          Source Video
        </CardTitle>
        <CardDescription>Add a descriptive title and paste a supported video URL.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="videoTitle" className="text-sm font-medium">Video Title</Label>
          <Input
            id="videoTitle"
            type="text"
            placeholder="e.g. Product Demo — Keynote 2026"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            aria-invalid={!!titleError}
            className={cn(
              "h-9 transition-all",
              titleError ? "border-destructive focus-visible:ring-destructive/30" : "focus-visible:border-primary"
            )}
          />
          {titleError && (
            <p className="flex items-center gap-1.5 text-xs font-medium text-destructive animate-fade-in">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {titleError}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="videoUrl" className="text-sm font-medium">Video URL</Label>
          <div className="relative">
            <Input
              id="videoUrl"
              type="url"
              placeholder="https://youtube.com/watch?v=... or direct .mp4 link"
              value={videoUrl}
              onChange={(e) => onVideoUrlChange(e.target.value)}
              aria-invalid={!!videoUrlError}
              className={cn(
                "h-9 pr-10 transition-all font-mono text-xs",
                videoUrlError ? "border-destructive focus-visible:ring-destructive/30" : "focus-visible:border-primary"
              )}
            />
            {isValidUrl && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-success animate-scale-in">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            )}
          </div>
          {videoUrlError ? (
            <p className="flex items-center gap-1.5 text-xs font-medium text-destructive animate-fade-in">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {videoUrlError}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Supports YouTube, Vimeo, and direct media files (.mp4, .webm, .m3u8).
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
