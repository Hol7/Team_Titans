'use client';

import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { ROUTES } from '@/config/constants';

export default function RoleSelectionPage() {
  const router = useRouter();

  const handleVisitorClick = () => {
    router.push(ROUTES.VISITOR.CLOCK_IN);
  };

  const handleEmployerClick = () => {
    router.push(ROUTES.AUTH.LOGIN);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-500/10 p-4">
      <div className="w-full max-w-6xl animate-fade-in">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-500 rounded-2xl mb-6 shadow-md">
            <Icon icon="mdi:clock-time-four-outline" className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Choisissez votre profil
          </h1>
          <p className="text-lg text-gray-600">
            Sélectionnez le type d'accès qui vous correspond
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Visitor Card */}
          <button
            onClick={handleVisitorClick}
            className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-transparent hover:border-primary-500"
          >
            <div className="text-center">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-accent-500 to-primary-500 rounded-2xl mb-6 shadow-md group-hover:shadow-lg transition-shadow">
                <Icon icon="mdi:account-badge" className="w-14 h-14 text-white" />
              </div>

              {/* Title */}
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Visiteur
              </h2>

              {/* Description */}
              <p className="text-gray-600 mb-6 text-base leading-relaxed">
                Vous êtes en visite ? Enregistrez votre arrivée et votre départ en quelques étapes simples.
              </p>

              {/* Features */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-left">
                  <div className="flex items-center justify-center w-6 h-6 bg-success/20 rounded-full flex-shrink-0">
                    <Icon icon="mdi:check" className="w-4 h-4 text-success" />
                  </div>
                  <span className="text-sm text-gray-700">Pointage rapide et simple</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <div className="flex items-center justify-center w-6 h-6 bg-success/20 rounded-full flex-shrink-0">
                    <Icon icon="mdi:check" className="w-4 h-4 text-success" />
                  </div>
                  <span className="text-sm text-gray-700">Numéro de visite sécurisé</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <div className="flex items-center justify-center w-6 h-6 bg-success/20 rounded-full flex-shrink-0">
                    <Icon icon="mdi:check" className="w-4 h-4 text-success" />
                  </div>
                  <span className="text-sm text-gray-700">Aucune authentification requise</span>
                </div>
              </div>

              {/* Button */}
              <div className="inline-flex items-center gap-2 text-primary-500 font-semibold group-hover:gap-3 transition-all">
                Continuer comme visiteur
                <Icon icon="mdi:arrow-right" className="w-5 h-5" />
              </div>
            </div>
          </button>

          {/* Employer Card */}
          <button
            onClick={handleEmployerClick}
            className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-transparent hover:border-primary-500"
          >
            <div className="text-center">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl mb-6 shadow-md group-hover:shadow-lg transition-shadow">
                <Icon icon="mdi:briefcase-account" className="w-14 h-14 text-white" />
              </div>

              {/* Title */}
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Personnel
              </h2>

              {/* Description */}
              <p className="text-gray-600 mb-6 text-base leading-relaxed">
                Vous faites partie de l'équipe ? Connectez-vous pour accéder à votre espace personnel.
              </p>

              {/* Features */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-left">
                  <div className="flex items-center justify-center w-6 h-6 bg-success/20 rounded-full flex-shrink-0">
                    <Icon icon="mdi:check" className="w-4 h-4 text-success" />
                  </div>
                  <span className="text-sm text-gray-700">Gestion de vos horaires</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <div className="flex items-center justify-center w-6 h-6 bg-success/20 rounded-full flex-shrink-0">
                    <Icon icon="mdi:check" className="w-4 h-4 text-success" />
                  </div>
                  <span className="text-sm text-gray-700">Tableau de bord personnalisé</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <div className="flex items-center justify-center w-6 h-6 bg-success/20 rounded-full flex-shrink-0">
                    <Icon icon="mdi:check" className="w-4 h-4 text-success" />
                  </div>
                  <span className="text-sm text-gray-700">Rapports et statistiques</span>
                </div>
              </div>

              {/* Button */}
              <div className="inline-flex items-center gap-2 text-primary-500 font-semibold group-hover:gap-3 transition-all">
                Se connecter
                <Icon icon="mdi:arrow-right" className="w-5 h-5" />
              </div>
            </div>
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-12">
          © 2025 TMTT. Tous droits réservés.
        </p>
      </div>
    </div>
  );
}
