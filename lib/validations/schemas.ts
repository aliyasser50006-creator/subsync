import { z } from 'zod';

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required.')
    .max(100, 'Category name must be under 100 characters.'),
  description: z
    .string()
    .max(500, 'Description must be under 500 characters.')
    .optional()
    .or(z.literal('')),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, 'Color must be a valid hex code (e.g. #6366f1).')
    .default('#6366f1'),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

export const actorSchema = z.object({
  name: z
    .string()
    .min(1, 'Actor name is required.')
    .max(200, 'Actor name must be under 200 characters.'),
  image_url: z
    .string()
    .url('Must be a valid URL.')
    .optional()
    .or(z.literal('')),
  biography: z
    .string()
    .max(5000, 'Biography must be under 5000 characters.')
    .optional()
    .or(z.literal('')),
  birth_date: z
    .string()
    .optional()
    .or(z.literal('')),
  nationality: z
    .string()
    .max(100, 'Nationality must be under 100 characters.')
    .optional()
    .or(z.literal('')),
});

export type ActorFormValues = z.infer<typeof actorSchema>;
