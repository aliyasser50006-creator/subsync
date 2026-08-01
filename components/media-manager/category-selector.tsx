'use client';

import { useState } from 'react';
import { Check, ChevronsUpDown, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Category } from '@/lib/types/database';
import { CategoryForm } from '@/components/categories/category-form';

interface CategorySelectorProps {
  categories: Category[];
  selectedCategoryIds: string[];
  onChange: (categoryIds: string[]) => void;
}

export function CategorySelector({ categories, selectedCategoryIds, onChange }: CategorySelectorProps) {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const selectedCategories = categories.filter((c) => selectedCategoryIds.includes(c.id));

  const toggleCategory = (categoryId: string) => {
    if (selectedCategoryIds.includes(categoryId)) {
      onChange(selectedCategoryIds.filter((id) => id !== categoryId));
    } else {
      onChange([...selectedCategoryIds, categoryId]);
    }
  };

  const removeCategory = (categoryId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedCategoryIds.filter((id) => id !== categoryId));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5 mb-2">
        {selectedCategories.map((cat) => (
          <Badge
            key={cat.id}
            variant="secondary"
            className="flex items-center gap-1.5 pl-1.5 pr-1 py-0.5 text-xs font-semibold shadow-xs"
          >
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />
            {cat.name}
            <button
              type="button"
              onClick={(e) => removeCategory(cat.id, e)}
              className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20 focus:bg-muted-foreground/20 focus:outline-none"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
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
            {selectedCategories.length === 0 ? "Select categories..." : `${selectedCategories.length} selected`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search categories..." />
            <CommandList>
              <CommandEmpty>No categories found.</CommandEmpty>
              <CommandGroup>
                {categories.map((category) => (
                  <CommandItem
                    key={category.id}
                    value={category.name.toLowerCase()}
                    onSelect={() => toggleCategory(category.id)}
                    className="flex items-center gap-2"
                  >
                    <Check
                      className={cn(
                        "h-4 w-4 text-primary",
                        selectedCategoryIds.includes(category.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: category.color }} />
                    <span className="flex-1 truncate">{category.name}</span>
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
                      Create New Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-xl">
                    <DialogHeader>
                      <DialogTitle>Create Category</DialogTitle>
                    </DialogHeader>
                    <div className="max-h-[70vh] overflow-y-auto px-1 py-2">
                      <CategoryForm />
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
