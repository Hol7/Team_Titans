'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { ROUTES, STORAGE_KEYS } from '@/config/constants';

export default function HomePage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if this is the first visit
    const hasVisited = localStorage.getItem(STORAGE_KEYS.FIRST_VISIT);

    if (hasVisited === null || hasVisited === 'true') {
      // First time visitor - show welcome page
      localStorage.setItem(STORAGE_KEYS.FIRST_VISIT, 'true');
      router.push(ROUTES.WELCOME);
    } else if (isAuthenticated) {
      // Authenticated user - go to dashboard
      router.push(ROUTES.DASHBOARD.HOME);
    } else {
      // Returning visitor, not authenticated - show role selection
      router.push(ROUTES.ROLE_SELECTION);
    }

    setIsLoading(false);
  }, [isAuthenticated, router]);

  if (!isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500 mx-auto mb-4" />
        <p className="text-gray-600">Chargement...</p>
      </div>
    </div>
  );
}