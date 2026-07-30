'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils/format';

import { createActor, updateActor } from '@/lib/actions/actors';
import { actorSchema, type ActorFormValues } from '@/lib/validations/schemas';
import { Actor } from '@/lib/types/database';

interface ActorFormProps {
  actor?: Actor;
}

export function ActorForm({ actor }: ActorFormProps) {
  const router = useRouter();
  const isEditing = !!actor;

  const [name, setName] = useState(actor?.name || '');
  const [imageUrl, setImageUrl] = useState(actor?.image_url || '');
  const [biography, setBiography] = useState(actor?.biography || '');
  const [birthDate, setBirthDate] = useState(actor?.birth_date || '');
  const [nationality, setNationality] = useState(actor?.nationality || '');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ActorFormValues, string>>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const parsed = actorSchema.safeParse({
      name,
      image_url: imageUrl,
      biography,
      birth_date: birthDate,
      nationality,
    });

    if (!parsed.success) {
      const fieldErrors: typeof errors = {};
      parsed.error.errors.forEach((err) => {
        const field = err.path[0] as keyof ActorFormValues;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSaving(true);

    const result = isEditing
      ? await updateActor(
          actor.id,
          parsed.data.name,
          parsed.data.image_url || null,
          parsed.data.biography || null,
          parsed.data.birth_date || null,
          parsed.data.nationality || null
        )
      : await createActor(
          parsed.data.name,
          parsed.data.image_url || null,
          parsed.data.biography || null,
          parsed.data.birth_date || null,
          parsed.data.nationality || null
        );

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(isEditing ? 'Actor updated.' : 'Actor added.');
      router.push('/actors');
      router.refresh();
    }

    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="surface-panel p-6 border border-border/60 shadow-soft max-w-2xl space-y-6">
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex flex-col items-center gap-3 shrink-0">
          <Avatar className="h-24 w-24 ring-4 ring-background shadow-soft">
            <AvatarImage src={imageUrl || undefined} alt={name || 'Actor'} className="object-cover" />
            <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
              {name ? getInitials(name) : '?'}
            </AvatarFallback>
          </Avatar>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Image Preview</span>
        </div>

        <div className="flex-1 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Actor Name *</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="h-10 bg-background"
            />
            {errors.name && <p className="text-xs text-destructive font-medium">{errors.name}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Image URL</label>
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="h-10 bg-background font-mono text-sm"
            />
            {errors.image_url && <p className="text-xs text-destructive font-medium">{errors.image_url}</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Nationality</label>
          <Input
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            placeholder="e.g. American, British..."
            className="h-10 bg-background"
          />
          {errors.nationality && <p className="text-xs text-destructive font-medium">{errors.nationality}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Birth Date</label>
          <Input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="h-10 bg-background"
          />
          {errors.birth_date && <p className="text-xs text-destructive font-medium">{errors.birth_date}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Biography</label>
        <Textarea
          value={biography}
          onChange={(e) => setBiography(e.target.value)}
          placeholder="Brief biography..."
          rows={6}
          className="bg-background resize-y min-h-[120px]"
        />
        {errors.biography && <p className="text-xs text-destructive font-medium">{errors.biography}</p>}
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-border/30">
        <Button type="submit" disabled={saving} className="font-semibold shadow-xs">
          {saving && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
          {isEditing ? 'Save Changes' : 'Add Actor'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={saving}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
