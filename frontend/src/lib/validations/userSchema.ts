import { z } from 'zod';

const Role = ["employee", "manager"] as const;

export const createUserSchema = z.object({
  firstName: z
    .string()
    .min(1, 'Le prénom est requis')
    .min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z
    .string()
    .min(1, 'Le nom est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Email invalide'),
  phone: z
    .string()
    .min(1, 'Le téléphone est requis')
    .regex(/^[0-9+\s-()]+$/, 'Numéro de téléphone invalide'),
  password: z
    .string()
    .min(1, 'Le mot de passe est requis')
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  role: z.enum(Role, {
    required_error: 'Le rôle est requis',
  }),
  teamId: z.string().optional(),
});

export const updateUserSchema = z.object({
  firstName: z
    .string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .optional(),
  lastName: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .optional(),
  email: z
    .string()
    .email('Email invalide')
    .optional(),
  phone: z
    .string()
    .regex(/^[0-9+\s-()]+$/, 'Numéro de téléphone invalide')
    .optional(),
});

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, 'Le prénom est requis')
    .min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z
    .string()
    .min(1, 'Le nom est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Email invalide'),
  phone: z
    .string()
    .min(1, 'Le téléphone est requis')
    .regex(/^[0-9+\s-()]+$/, 'Numéro de téléphone invalide'),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;