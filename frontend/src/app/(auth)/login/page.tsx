'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { LoginForm } from '@/components/features/auth/LoginForm';
import { Card, CardContent } from '@/components/ui/card/Card';
import { useAuthStore } from '@/lib/stores/authStore';
import { ROUTES } from '@/config/constants';

export default function LoginPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.push(ROUTES.DASHBOARD.HOME);
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-500/10 p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-2xl mb-4 shadow-sm">
            <Icon icon="mdi:clock-time-four-outline" className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            TMTT
          </h1>
          <p className="text-gray-600">
            Connectez-vous pour gérer vos horaires
          </p>
        </div>

        {/* Formulaire de connexion */}
        <Card className="animate-slide-in">
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          © 2025 TMTT. Tous droits réservés.
        </p>
      </div>
    </div>
  );
}