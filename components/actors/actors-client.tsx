'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Search, Loader2, Users, Pencil, Trash2, Eye, Globe } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { getActors, deleteActor } from '@/lib/actions/actors';
import { ActorWithCount } from '@/lib/types/database';

const ITEMS_PER_PAGE = 12;

function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export function ActorsClient() {
  const router = useRouter();
  const [actors, setActors] = useState<ActorWithCount[]>([]);
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

  const fetchActors = useCallback(async () => {
    setLoading(true);
    const result = await getActors(debouncedSearch, page, ITEMS_PER_PAGE);
    if (result.data) {
      setActors(result.data);
      setTotalCount(result.count || 0);
    }
    setLoading(false);
  }, [debouncedSearch, page]);

  useEffect(() => {
    fetchActors();
  }, [fetchActors]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handleDelete = async (id: string, name: string) => {
    setDeleting(id);
    const result = await deleteActor(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`${name} deleted.`);
      fetchActors();
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
              placeholder="Search actors..."
              className="pl-9 h-9 bg-background"
            />
          </div>
          <Link href="/actors/new">
            <Button size="sm" className="h-9 font-semibold shadow-xs">
              <Plus className="mr-1.5 h-4 w-4" />
              New Actor
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="surface-panel flex flex-col items-center p-6 text-center shadow-soft relative overflow-hidden animate-pulse">
              <div className="h-24 w-24 mb-4 rounded-full bg-muted/60" />
              <div className="h-5 w-32 bg-muted/60 rounded mb-2" />
              <div className="h-4 w-20 bg-muted/60 rounded" />
              <div className="h-6 w-24 bg-muted/60 rounded-full mt-4" />
            </div>
          ))}
        </div>
      ) : actors.length === 0 ? (
        <div className="surface-panel py-16 px-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Users className="h-7 w-7" />
          </div>
          <p className="mt-4 text-base font-bold text-foreground">
            {debouncedSearch ? `No actors match "${debouncedSearch}"` : 'No actors yet'}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {debouncedSearch ? 'Try a different search term.' : 'Add your first actor to link them to videos.'}
          </p>
          {!debouncedSearch && (
            <Link href="/actors/new">
              <Button size="sm" className="mt-5 font-semibold">
                <Plus className="mr-1.5 h-4 w-4" />
                Add Actor
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {actors.map((actor) => (
              <div
                key={actor.id}
                className="group rounded-2xl border border-border/60 bg-card/80 p-5 shadow-soft transition-all duration-200 hover:border-border hover:bg-card hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <Avatar className="h-14 w-14 shrink-0 ring-2 ring-border">
                    <AvatarImage src={actor.image_url || undefined} alt={actor.name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                      {getInitials(actor.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-bold text-foreground">{actor.name}</h3>
                    {actor.nationality && (
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                        <Globe className="h-3 w-3" />
                        {actor.nationality}
                      </p>
                    )}
                    <Badge variant="secondary" className="mt-2 text-xs font-bold tabular-nums">
                      {actor.video_count} video{actor.video_count !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 pt-3 border-t border-border/30">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 px-2.5 text-xs font-semibold"
                    onClick={() => router.push(`/actors/${actor.id}`)}
                  >
                    <Eye className="mr-1.5 h-3.5 w-3.5" />
                    Profile
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                    onClick={() => router.push(`/actors/${actor.id}/edit`)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={deleting === actor.id}
                        className="h-8 w-8 p-0 text-destructive hover:bg-destructive/15 hover:text-destructive border-destructive/30"
                      >
                        {deleting === actor.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete actor?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete &ldquo;{actor.name}&rdquo;? This will remove the actor from all associated videos.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(actor.id, actor.name)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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
