import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Resolves image URLs from the database.
 * If a path starts with /src/assets/, it redirects to /assets/ 
 * (serving from the public folder).
 */
export function resolveImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  if (url.startsWith('/src/assets/')) {
    return url.replace('/src/assets/', '/assets/');
  }
  // Handle relative paths without leading slash
  if (url.startsWith('src/assets/')) {
    return '/' + url.replace('src/assets/', 'assets/');
  }
  return url;
}
