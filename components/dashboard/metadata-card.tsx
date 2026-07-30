import { Film, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { CategorySelector } from '@/components/media-manager/category-selector';
import { ActorSelector } from '@/components/media-manager/actor-selector';
import { Category, Actor } from '@/lib/types/database';

interface MetadataCardProps {
  description: string;
  onDescriptionChange: (val: string) => void;
  categoryIds: string[];
  onCategoryIdsChange: (val: string[]) => void;
  actorIds: string[];
  onActorIdsChange: (val: string[]) => void;
  categories: Category[];
  actors: Actor[];
}

export function MetadataCard({
  description, onDescriptionChange,
  categoryIds, onCategoryIdsChange,
  actorIds, onActorIdsChange,
  categories, actors
}: MetadataCardProps) {
  return (
    <Card className="surface-panel overflow-hidden border-border/40 shadow-soft animate-fade-up">
      <CardHeader className="bg-muted/30 border-b border-border/40 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Info className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base font-bold">Metadata</CardTitle>
            <CardDescription className="text-xs">Optional details to organize your project.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Description</label>
          <Textarea 
            value={description} 
            onChange={(e) => onDescriptionChange(e.target.value)} 
            placeholder="Briefly describe this video project..." 
            rows={3} 
            className="bg-background resize-none min-h-[80px]" 
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Categories</label>
            <CategorySelector categories={categories} selectedCategoryIds={categoryIds} onChange={onCategoryIdsChange} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Actors</label>
            <ActorSelector actors={actors} selectedActorIds={actorIds} onChange={onActorIdsChange} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
