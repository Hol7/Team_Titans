import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility pour combiner des classes Tailwind CSS
 * Évite les conflits entre classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}