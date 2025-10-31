import { z } from 'zod';

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'L\'username est requis'),
  password: z
    .string()
    .min(1, 'Le mot de passe est requis')
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;