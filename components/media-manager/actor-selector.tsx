'use client';

import { useState } from 'react';
import { Check, ChevronsUpDown, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Actor } from '@/lib/types/database';
import { ActorForm } from '@/components/actors/actor-form';
import { getInitials } from '@/lib/utils/format';

interface ActorSelectorProps {
  actors: Actor[];
  selectedActorIds: string[];
  onChange: (actorIds: string[]) => void;
}

export function ActorSelector({ actors, selectedActorIds, onChange }: ActorSelectorProps) {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const selectedActors = actors.filter((a) => selectedActorIds.includes(a.id));

  const toggleActor = (actorId: string) => {
    if (selectedActorIds.includes(actorId)) {
      onChange(selectedActorIds.filter((id) => id !== actorId));
    } else {
      onChange([...selectedActorIds, actorId]);
    }
  };

  const removeActor = (actorId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedActorIds.filter((id) => id !== actorId));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedActors.map((actor) => (
          <div
            key={actor.id}
            className="flex items-center gap-1.5 rounded-full border border-border/60 bg-surface-hover/50 pl-1 pr-2 py-1 text-xs font-semibold shadow-xs"
          >
            <Avatar className="h-5 w-5 border border-border/40">
              <AvatarImage src={actor.image_url || undefined} alt={actor.name} className="object-cover" />
              <AvatarFallback className="text-[8px] bg-primary/10 text-primary">{getInitials(actor.name)}</AvatarFallback>
            </Avatar>
            <span>{actor.name}</span>
            <button
              type="button"
              onClick={(e) => removeActor(actor.id, e)}
              className="ml-0.5 rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-9 bg-background text-muted-foreground"
          >
            {selectedActors.length === 0 ? "Select actors..." : `${selectedActors.length} selected`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search actors..." />
            <CommandList>
              <CommandEmpty>No actors found.</CommandEmpty>
              <CommandGroup>
                {actors.map((actor) => (
                  <CommandItem
                    key={actor.id}
                    value={actor.name}
                    onSelect={() => toggleActor(actor.id)}
                    className="flex items-center gap-2 py-1.5"
                  >
                    <Check
                      className={cn(
                        "h-4 w-4 text-primary shrink-0",
                        selectedActorIds.includes(actor.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <Avatar className="h-6 w-6 shrink-0 border border-border/40">
                      <AvatarImage src={actor.image_url || undefined} alt={actor.name} className="object-cover" />
                      <AvatarFallback className="text-[9px] bg-primary/10 text-primary">{getInitials(actor.name)}</AvatarFallback>
                    </Avatar>
                    <span className="flex-1 truncate text-sm">{actor.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              
              <div className="p-1 border-t border-border/40 mt-1">
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-xs h-8 text-primary font-semibold hover:text-primary hover:bg-primary/10"
                    >
                      <Plus className="mr-2 h-3.5 w-3.5" />
                      Add New Actor
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-xl">
                    <DialogHeader>
                      <DialogTitle>Add Actor</DialogTitle>
                    </DialogHeader>
                    <div className="max-h-[70vh] overflow-y-auto px-1 py-2">
                      <ActorForm />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
