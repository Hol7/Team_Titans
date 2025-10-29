import { z } from 'zod';

export const createTeamSchema = z.object({
  name: z
    .string()
    .min(1, 'Le nom est requis')
    .min(3, 'Le nom doit contenir au moins 3 caractères'),
  description: z
    .string()
    .min(1, 'La description est requise')
    .min(10, 'La description doit contenir au moins 10 caractères'),
  managerId: z
    .string()
    .min(1, 'Le manager est requis'),
  members: z
    .array(z.string())
    .optional()
    .default([]),
});

export const updateTeamSchema = z.object({
  name: z
    .string()
    .min(3, 'Le nom doit contenir au moins 3 caractères')
    .optional(),
  description: z
    .string()
    .min(10, 'La description doit contenir au moins 10 caractères')
    .optional(),
  managerId: z
    .string()
    .optional(),
  members: z
    .array(z.string())
    .optional(),
});

export type CreateTeamFormValues = z.infer<typeof createTeamSchema>;
export type UpdateTeamFormValues = z.infer<typeof updateTeamSchema>;