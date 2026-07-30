'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { JobWithMetadata, Category, Actor } from '@/lib/types/database';
import { updateJob } from '@/lib/actions/jobs';
import { updateJobMetadata } from '@/lib/actions/metadata';
import VideoPlayer from '@/components/VideoPlayer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';
import { CategorySelector } from './category-selector';
import { ActorSelector } from './actor-selector';
import { Badge } from '@/components/ui/badge';

interface MediaEditClientProps {
  job: JobWithMetadata;
  categories: Category[];
  actors: Actor[];
}

export function MediaEditClient({ job, categories, actors }: MediaEditClientProps) {
  const router = useRouter();
  
  const [savedJob, setSavedJob] = useState({
    title: job.title || '',
    description: job.description || '',
    videoUrl: job.video_url || '',
    imgUrl: job.img_url || '',
    categoryIds: job.categories?.map(c => c.id) || [],
    actorIds: job.actors?.map(a => a.id) || [],
  });

  const [title, setTitle] = useState(job.title || '');
  const [description, setDescription] = useState(job.description || '');
  const [videoUrl, setVideoUrl] = useState(job.video_url || '');
  const [imgUrl, setImgUrl] = useState(job.img_url || '');
  const [categoryIds, setCategoryIds] = useState<string[]>(job.categories?.map(c => c.id) || []);
  const [actorIds, setActorIds] = useState<string[]>(job.actors?.map(a => a.id) || []);
  const [isSaving, setIsSaving] = useState(false);
  
  // Track Dirty State
  const [isDirty, setIsDirty] = useState(false);

  // Video Preview State
  const [previewMode, setPreviewMode] = useState<'original' | 'output'>('original');

  useEffect(() => {
    const isChanged = 
      title !== savedJob.title ||
      description !== savedJob.description ||
      videoUrl !== savedJob.videoUrl ||
      imgUrl !== savedJob.imgUrl ||
      JSON.stringify([...categoryIds].sort()) !== JSON.stringify([...savedJob.categoryIds].sort()) ||
      JSON.stringify([...actorIds].sort()) !== JSON.stringify([...savedJob.actorIds].sort());
    
    setIsDirty(isChanged);
  }, [title, description, videoUrl, imgUrl, categoryIds, actorIds, savedJob]);

  // Prompt before leaving if dirty
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSave = async () => {
    if (!title.trim()) return toast.error('Title is required');
    if (!videoUrl.trim()) return toast.error('Video URL is required');
    if (!validateUrl(videoUrl)) return toast.error('Must be a valid video URL');
    if (imgUrl.trim() && !validateUrl(imgUrl)) return toast.error('Must be a valid poster URL');

    setIsSaving(true);
    
    try {
      const updateJobResult = await updateJob(job.id, title, videoUrl, imgUrl);
      if (updateJobResult.error) throw new Error(updateJobResult.error);

      const metadataResult = await updateJobMetadata(job.id, description, categoryIds, actorIds);
      if (metadataResult.error) throw new Error(metadataResult.error);
      
      setSavedJob({
        title,
        description,
        videoUrl,
        imgUrl,
        categoryIds,
        actorIds,
      });

      toast.success('Changes saved successfully.');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (isDirty && !window.confirm('You have unsaved changes. Are you sure you want to discard them?')) {
      return;
    }
    router.push('/media-manager');
  };

  return (
    <div className="flex flex-col min-h-screen pb-24 max-w-7xl mx-auto w-full pt-8 px-4">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={handleCancel}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Media</h1>
            <p className="text-muted-foreground mt-1">Manage metadata and settings for this video.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleCancel} disabled={isSaving}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving || !isDirty}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column - Video Player */}
        <div className="lg:col-span-7 flex flex-col gap-4 sticky top-6">
          <div className="aspect-video w-full rounded-xl overflow-hidden bg-black/90 border border-border/40 shadow-sm relative">
            <VideoPlayer 
              src={previewMode === 'original' ? videoUrl : (job.output_video || videoUrl)}
              posterUrl={imgUrl || undefined}
            />
          </div>
          
          {job.output_video && (
            <div className="flex items-center justify-center p-2 bg-surface border border-border/40 rounded-lg shadow-sm">
              <div className="flex bg-muted/50 p-1 rounded-md">
                <button
                  onClick={() => setPreviewMode('original')}
                  className={`px-4 py-1.5 text-sm font-medium rounded-sm transition-colors ${previewMode === 'original' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Original Video
                </button>
                <button
                  onClick={() => setPreviewMode('output')}
                  className={`px-4 py-1.5 text-sm font-medium rounded-sm transition-colors ${previewMode === 'output' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Processed Output
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Form */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          
          <div className="surface-panel p-6 rounded-xl border border-border/40 shadow-sm space-y-6">
            <h3 className="text-lg font-semibold border-b border-border/40 pb-2">General</h3>
            
            <div className="space-y-3">
              <Label>Title *</Label>
              <Input 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                placeholder="Video title" 
                className="bg-background"
              />
            </div>
            
            <div className="space-y-3">
              <Label>Description</Label>
              <Textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                placeholder="Video description"
                className="resize-none h-32 bg-background"
              />
            </div>
          </div>

          <div className="surface-panel p-6 rounded-xl border border-border/40 shadow-sm space-y-6">
            <h3 className="text-lg font-semibold border-b border-border/40 pb-2">Organization</h3>
            
            <div className="space-y-3">
              <Label>Categories</Label>
              <CategorySelector
                categories={categories}
                selectedCategoryIds={categoryIds}
                onChange={setCategoryIds}
              />
            </div>
            
            <div className="space-y-3">
              <Label>Actors</Label>
              <ActorSelector
                actors={actors}
                selectedActorIds={actorIds}
                onChange={setActorIds}
              />
            </div>
          </div>

          <div className="surface-panel p-6 rounded-xl border border-border/40 shadow-sm space-y-6">
            <h3 className="text-lg font-semibold border-b border-border/40 pb-2">Media</h3>
            
            <div className="space-y-3">
              <Label>Video URL *</Label>
              <Input 
                value={videoUrl} 
                onChange={e => setVideoUrl(e.target.value)} 
                placeholder="https://..." 
                className="bg-background"
              />
            </div>
            
            <div className="space-y-3">
              <Label>Poster URL</Label>
              <Input 
                value={imgUrl} 
                onChange={e => setImgUrl(e.target.value)} 
                placeholder="https://..." 
                className="bg-background"
              />
            </div>

            {job.output_video && (
              <div className="space-y-3">
                <Label>Output Video URL (Read-only)</Label>
                <Input 
                  value={job.output_video}
                  readOnly
                  className="bg-muted text-muted-foreground"
                />
              </div>
            )}
          </div>

          <div className="surface-panel p-6 rounded-xl border border-border/40 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold border-b border-border/40 pb-2">Processing Info</h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground">Status</p>
                <Badge variant={
                  job.status === 'done' ? 'success' : 
                  job.status === 'failed' ? 'destructive' : 
                  job.status === 'processing' ? 'default' : 
                  'secondary'
                } className="capitalize">
                  {job.status === 'ready' ? 'Published' : job.status}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Processed Output</p>
                <p className="font-medium">{job.output_video ? 'Yes' : 'No'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Created At</p>
                <p className="font-medium">{new Date(job.created_at).toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Last Updated</p>
                <p className="font-medium">{new Date(job.updated_at).toLocaleString()}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
