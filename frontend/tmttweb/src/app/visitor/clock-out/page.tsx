'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { ROUTES } from '@/config/constants';
import { VisitorNav } from '@/components/features/visitor/VisitorNav';

export default function VisitorClockOutPage() {
  const router = useRouter();
  const [visitNumber, setVisitNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!visitNumber.trim()) {
      setError('Veuillez entrer votre numéro de visite');
      return;
    }

    if (!/^\d{1,2}$/.test(visitNumber)) {
      setError('Le numéro doit contenir 1 ou 2 chiffres');
      return;
    }

    setIsLoading(true);

    // TODO: Make API request to validate and clock out
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push(ROUTES.ROLE_SELECTION);
      }, 2000);
    }, 1000);
  };

  const handleReturn = () => {
    router.push(ROUTES.ROLE_SELECTION);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-500/10 p-4">
      <VisitorNav />
      <div className="w-full max-w-2xl animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-error rounded-2xl mb-4 shadow-md">
            <Icon icon="mdi:logout" className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pointage Visiteur - Départ
          </h1>
          <p className="text-gray-600">
            Entrez votre numéro de visite pour enregistrer votre départ
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Visit Number Input */}
            <div>
              <label htmlFor="visitNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                Numéro de visite <span className="text-error">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Icon icon="mdi:numeric" className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="visitNumber"
                  value={visitNumber}
                  onChange={(e) => setVisitNumber(e.target.value)}
                  maxLength={2}
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-center text-2xl font-bold tracking-wider ${
                    error ? 'border-error' : 'border-gray-200 focus:border-primary-500'
                  }`}
                  placeholder="00"
                  disabled={isLoading || showSuccess}
                />
              </div>
              {error && (
                <p className="mt-2 text-sm text-error flex items-center gap-1">
                  <Icon icon="mdi:alert-circle" className="w-4 h-4" />
                  {error}
                </p>
              )}
              <p className="mt-2 text-sm text-gray-500 flex items-center gap-1">
                <Icon icon="mdi:information" className="w-4 h-4" />
                Entrez le numéro qui vous a été fourni lors de votre arrivée
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || showSuccess}
              className="w-full py-4 bg-error hover:bg-error/90 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                  Validation en cours...
                </>
              ) : showSuccess ? (
                <>
                  <Icon icon="mdi:check-circle" className="w-6 h-6" />
                  Départ enregistré !
                </>
              ) : (
                <>
                  <Icon icon="mdi:logout-variant" className="w-6 h-6" />
                  Valider le départ
                </>
              )}
            </button>
          </form>

          {/* Success Message */}
          {showSuccess && (
            <div className="mt-6 bg-success/10 border-2 border-success/30 rounded-xl p-4 animate-slide-in">
              <div className="flex items-start gap-3">
                <Icon icon="mdi:check-circle" className="w-6 h-6 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">
                    Départ enregistré avec succès
                  </p>
                  <p className="text-sm text-gray-700">
                    Merci de votre visite. Vous allez être redirigé...
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Return Button */}
        <button
          onClick={handleReturn}
          disabled={isLoading || showSuccess}
          className="w-full py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon icon="mdi:arrow-left" className="w-5 h-5" />
          Retour
        </button>

        {/* Help Section */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-start gap-3">
            <Icon icon="mdi:help-circle" className="w-6 h-6 text-primary-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Vous avez perdu votre numéro ?
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Veuillez contacter l'accueil pour obtenir de l'aide. Ayez votre nom complet à disposition.
              </p>
              <div className="flex items-center gap-2 text-sm text-primary-500 font-medium">
                <Icon icon="mdi:phone" className="w-4 h-4" />
                Contacter l'accueil
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
