'use client';

import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { ROUTES, STORAGE_KEYS } from '@/config/constants';

export default function WelcomePage() {
  const router = useRouter();

  const handleStart = () => {
    // Mark that user has seen the welcome page
    localStorage.setItem(STORAGE_KEYS.FIRST_VISIT, 'false');
    router.push(ROUTES.ROLE_SELECTION);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-500/10 p-4">
      <div className="w-full max-w-4xl animate-fade-in">
        {/* Logo and Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-primary-500 rounded-3xl mb-6 shadow-lg">
            <Icon icon="mdi:clock-time-four-outline" className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Bienvenue sur TMTT
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Time Management Team Titans - Votre solution complète pour la gestion du temps et des présences
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-center w-14 h-14 bg-primary-100 rounded-xl mb-4">
              <Icon icon="mdi:account-clock" className="w-8 h-8 text-primary-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Pointage Simple
            </h3>
            <p className="text-gray-600 text-sm">
              Enregistrez vos arrivées et départs en quelques clics
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-center w-14 h-14 bg-success/10 rounded-xl mb-4">
              <Icon icon="mdi:account-group" className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Gestion d'Équipe
            </h3>
            <p className="text-gray-600 text-sm">
              Gérez vos équipes et suivez les performances en temps réel
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-center w-14 h-14 bg-accent-500/10 rounded-xl mb-4">
              <Icon icon="mdi:chart-line" className="w-8 h-8 text-accent-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Rapports & KPI
            </h3>
            <p className="text-gray-600 text-sm">
              Visualisez des rapports détaillés et des indicateurs de performance
            </p>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="bg-white rounded-2xl p-8 shadow-md mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Pourquoi choisir TMTT ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-6 h-6 bg-success/20 rounded-full flex-shrink-0 mt-1">
                <Icon icon="mdi:check" className="w-4 h-4 text-success" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Interface intuitive</h4>
                <p className="text-sm text-gray-600">Facile à utiliser pour tous les utilisateurs</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-6 h-6 bg-success/20 rounded-full flex-shrink-0 mt-1">
                <Icon icon="mdi:check" className="w-4 h-4 text-success" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Sécurisé et fiable</h4>
                <p className="text-sm text-gray-600">Vos données sont protégées et sécurisées</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-6 h-6 bg-success/20 rounded-full flex-shrink-0 mt-1">
                <Icon icon="mdi:check" className="w-4 h-4 text-success" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Accès visiteurs</h4>
                <p className="text-sm text-gray-600">Système de pointage simplifié pour les visiteurs</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-6 h-6 bg-success/20 rounded-full flex-shrink-0 mt-1">
                <Icon icon="mdi:check" className="w-4 h-4 text-success" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Rapports détaillés</h4>
                <p className="text-sm text-gray-600">Analyses et statistiques complètes</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={handleStart}
            className="inline-flex items-center gap-3 px-12 py-4 bg-primary-500 hover:bg-primary-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            Commencer
            <Icon icon="mdi:arrow-right" className="w-6 h-6" />
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-8">
          © 2025 TMTT - Time Management Team Titans. Tous droits réservés.
        </p>
      </div>
    </div>
  );
}
