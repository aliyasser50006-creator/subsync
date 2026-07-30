'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Search, Loader2, FolderOpen, Pencil, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { getCategories, deleteCategory } from '@/lib/actions/categories';
import { CategoryWithCount } from '@/lib/types/database';

const ITEMS_PER_PAGE = 12;

export function CategoriesClient() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    const result = await getCategories(debouncedSearch, page, ITEMS_PER_PAGE);
    if (result.data) {
      setCategories(result.data);
      setTotalCount(result.count || 0);
    }
    setLoading(false);
  }, [debouncedSearch, page]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    const result = await deleteCategory(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Category deleted.');
      fetchCategories();
    }
    setDeleting(null);
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <div className="surface-panel p-4 border border-border/60 shadow-soft">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories..."
              className="pl-9 h-9 bg-background"
            />
          </div>
          <Link href="/categories/new">
            <Button size="sm" className="h-9 font-semibold shadow-xs">
              <Plus className="mr-1.5 h-4 w-4" />
              New Category
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="surface-panel flex flex-col items-center justify-center p-16 text-muted-foreground">
          <Loader2 className="h-7 w-7 animate-spin text-primary mb-3" />
          <p className="text-sm font-semibold text-foreground">Loading categories...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="surface-panel py-16 px-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <FolderOpen className="h-7 w-7" />
          </div>
          <p className="mt-4 text-base font-bold text-foreground">
            {debouncedSearch ? `No categories match "${debouncedSearch}"` : 'No categories yet'}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {debouncedSearch ? 'Try a different search term.' : 'Create your first category to organize your videos.'}
          </p>
          {!debouncedSearch && (
            <Link href="/categories/new">
              <Button size="sm" className="mt-5 font-semibold">
                <Plus className="mr-1.5 h-4 w-4" />
                Create Category
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="group rounded-2xl border border-border/60 bg-card/80 p-5 shadow-soft transition-all duration-200 hover:border-border hover:bg-card hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="h-3.5 w-3.5 rounded-full shrink-0 ring-2 ring-background shadow-xs"
                        style={{ backgroundColor: cat.color }}
                      />
                      <h3 className="truncate text-sm font-bold text-foreground">{cat.name}</h3>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-2 min-h-[32px]">
                      {cat.description || 'No description'}
                    </p>
                  </div>
                  <Badge variant="secondary" className="shrink-0 text-xs font-bold tabular-nums">
                    {cat.video_count} video{cat.video_count !== 1 ? 's' : ''}
                  </Badge>
                </div>

                <div className="mt-4 flex items-center gap-2 pt-3 border-t border-border/30">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 px-2.5 text-xs font-semibold"
                    onClick={() => router.push(`/categories/${cat.id}`)}
                  >
                    <Eye className="mr-1.5 h-3.5 w-3.5" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                    onClick={() => router.push(`/categories/${cat.id}/edit`)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={deleting === cat.id}
                        className="h-8 w-8 p-0 text-destructive hover:bg-destructive/15 hover:text-destructive border-destructive/30"
                      >
                        {deleting === cat.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete category?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete &ldquo;{cat.name}&rdquo;? This will remove the category from all associated videos.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(cat.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                Previous
              </Button>
              <span className="text-xs text-muted-foreground font-medium tabular-nums">
                Page {page} of {totalPages}
              </span>
              <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
