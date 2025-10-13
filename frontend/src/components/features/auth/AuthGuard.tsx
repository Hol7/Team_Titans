'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { ROUTES } from '@/config/constants';

interface AuthGuardProps {
  children: React.ReactNode;
  requireManager?: boolean;
}

export const AuthGuard = ({ children, requireManager = false }: AuthGuardProps) => {
  const router = useRouter();
  const { isAuthenticated, isManager } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(ROUTES.AUTH.LOGIN);
      return;
    }

    if (requireManager && !isManager) {
      router.push(ROUTES.DASHBOARD.HOME);
    }
  }, [isAuthenticated, isManager, requireManager, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    );
  }

  if (requireManager && !isManager) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h2>
          <p className="text-gray-600">Vous n'avez pas les permissions nécessaires.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};