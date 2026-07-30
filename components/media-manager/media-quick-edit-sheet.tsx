import { JobWithMetadata, Category, Actor } from '@/lib/types/database';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { CategorySelector } from './category-selector';
import { ActorSelector } from './actor-selector';
import { memo, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface MediaQuickEditSheetProps {
  job: JobWithMetadata | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  allCategories: Category[];
  allActors: Actor[];
  onSave: (jobId: string, updates: any) => Promise<void>;
}

export const MediaQuickEditSheet = memo(function MediaQuickEditSheet({
  job,
  isOpen,
  onOpenChange,
  allCategories,
  allActors,
  onSave
}: MediaQuickEditSheetProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [actorIds, setActorIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (job && isOpen) {
      setTitle(job.title || '');
      setDescription(job.description || '');
      setVideoUrl(job.video_url || '');
      setImgUrl(job.img_url || '');
      setCategoryIds(job.categories?.map(c => c.id) || []);
      setActorIds(job.actors?.map(a => a.id) || []);
    }
  }, [job, isOpen]);

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSave = async () => {
    if (!job) return;

    if (!title.trim()) return toast.error('Title is required');
    if (!videoUrl.trim()) return toast.error('Video URL is required');
    if (!validateUrl(videoUrl)) return toast.error('Must be a valid video URL');
    if (imgUrl.trim() && !validateUrl(imgUrl)) return toast.error('Must be a valid poster URL');

    setIsSaving(true);
    await onSave(job.id, {
      title,
      description,
      videoUrl,
      imgUrl,
      categoryIds,
      actorIds
    });
    setIsSaving(false);
  };

  if (!job) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(val) => !isSaving && onOpenChange(val)}>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl overflow-y-auto flex flex-col p-0">
        <div className="p-6 pb-2 border-b border-border/40 shrink-0">
          <SheetTitle className="text-xl">Quick Edit</SheetTitle>
          <SheetDescription>Update media metadata instantly.</SheetDescription>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-2">
            <Label>Title *</Label>
            <Input 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="Project title..." 
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Short description..." 
              className="resize-none h-24"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Categories</Label>
              <div className="p-1 border rounded-md min-h-[40px]">
                <CategorySelector 
                  categories={allCategories} 
                  selectedCategoryIds={categoryIds} 
                  onChange={setCategoryIds} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Actors</Label>
              <div className="p-1 border rounded-md min-h-[40px]">
                <ActorSelector 
                  actors={allActors} 
                  selectedActorIds={actorIds} 
                  onChange={setActorIds} 
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border/40">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Source URLs</h4>
            <div className="space-y-2">
              <Label>Video Source URL *</Label>
              <Input 
                value={videoUrl} 
                onChange={e => setVideoUrl(e.target.value)} 
                placeholder="https://..." 
              />
            </div>

            <div className="space-y-2">
              <Label>Poster Image URL</Label>
              <Input 
                value={imgUrl} 
                onChange={e => setImgUrl(e.target.value)} 
                placeholder="https://..." 
              />
            </div>
          </div>
        </div>

        <div className="p-6 bg-muted/30 border-t border-border/40 shrink-0 flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
});
