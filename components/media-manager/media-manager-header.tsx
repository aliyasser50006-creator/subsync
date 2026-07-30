import { Button } from '@/components/ui/button';
import { Plus, Download } from 'lucide-react';
import Link from 'next/link';

export function MediaManagerHeader() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-border/40">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Media Manager</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage all your videos, actors, categories, and metadata.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" disabled className="hidden sm:flex shadow-sm">
          <Download className="h-4 w-4 mr-2" /> Import Media
        </Button>
        <Link href="/create" passHref legacyBehavior>
          <Button className="font-semibold shadow-sm">
            <Plus className="h-4 w-4 mr-2" /> Add Video
          </Button>
        </Link>
      </div>
    </div>
  );
}
