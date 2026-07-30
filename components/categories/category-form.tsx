'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { createCategory, updateCategory } from '@/lib/actions/categories';
import { categorySchema, type CategoryFormValues } from '@/lib/validations/schemas';
import { Category } from '@/lib/types/database';

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e',
  '#14b8a6', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6',
  '#a855f7', '#d946ef', '#ec4899', '#f43f5e',
];

interface CategoryFormProps {
  category?: Category;
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const isEditing = !!category;

  const [name, setName] = useState(category?.name || '');
  const [description, setDescription] = useState(category?.description || '');
  const [color, setColor] = useState(category?.color || '#6366f1');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof CategoryFormValues, string>>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const parsed = categorySchema.safeParse({ name, description, color });
    if (!parsed.success) {
      const fieldErrors: typeof errors = {};
      parsed.error.errors.forEach((err) => {
        const field = err.path[0] as keyof CategoryFormValues;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSaving(true);

    const result = isEditing
      ? await updateCategory(category.id, parsed.data.name, parsed.data.description || null, parsed.data.color)
      : await createCategory(parsed.data.name, parsed.data.description || null, parsed.data.color);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(isEditing ? 'Category updated.' : 'Category created.');
      router.push('/categories');
      router.refresh();
    }

    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="surface-panel p-6 border border-border/60 shadow-soft max-w-2xl space-y-6">
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Category Name *</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Action, Comedy, Drama..."
          className="h-10 bg-background"
        />
        {errors.name && <p className="text-xs text-destructive font-medium">{errors.name}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Description</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe this category..."
          rows={3}
          className="bg-background resize-none"
        />
        {errors.description && <p className="text-xs text-destructive font-medium">{errors.description}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Color</label>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`h-8 w-8 rounded-full transition-all duration-150 ring-2 ${
                color === c ? 'ring-foreground scale-110 shadow-md' : 'ring-transparent hover:ring-border'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className="h-8 w-8 rounded-full ring-2 ring-border" style={{ backgroundColor: color }} />
          <Input
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="#6366f1"
            className="h-8 w-32 bg-background font-mono text-xs"
          />
        </div>
        {errors.color && <p className="text-xs text-destructive font-medium">{errors.color}</p>}
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-border/30">
        <Button type="submit" disabled={saving} className="font-semibold shadow-xs">
          {saving && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
          {isEditing ? 'Save Changes' : 'Create Category'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={saving}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
