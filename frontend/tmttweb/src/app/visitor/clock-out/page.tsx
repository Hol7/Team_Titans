'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { ROUTES } from '@/config/constants';
import { VisitorNav } from '@/components/features/visitor/VisitorNav';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { Button } from '@/components/ui/moving-border';
import { motion } from 'framer-motion';
import { LampContainer } from '@/components/ui/lamp';

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
    <div className="min-h-screen flex flex-col md:flex-row">
      <VisitorNav />
      
      {/* Left Side - Form (50% on desktop, 100% on mobile) */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Pointage Visiteur - Départ
              </h1>
              <p className="text-gray-600">
                Entrez votre numéro de visite
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Visit Number Input */}
                <div>
                  <label htmlFor="visitNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                    Numéro de visite <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Icon icon="solar:hashtag-bold" className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="visitNumber"
                      value={visitNumber}
                      onChange={(e) => setVisitNumber(e.target.value)}
                      maxLength={2}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-pink transition-all text-center text-2xl font-bold tracking-wider ${
                        error ? 'border-error' : 'border-gray-300 focus:border-accent-pink'
                      }`}
                      placeholder="00"
                      disabled={isLoading || showSuccess}
                    />
                  </div>
                  {error && (
                    <p className="mt-2 text-sm text-error flex items-center gap-1">
                      <Icon icon="solar:danger-circle-bold" className="w-4 h-4" />
                      {error}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-gray-500 flex items-center gap-1">
                    <Icon icon="solar:info-circle-bold" className="w-4 h-4" />
                    Entrez le numéro qui vous a été fourni lors de votre arrivée
                  </p>
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    // borderRadius="0.75rem"
                    // as="button"
                    type="submit"
                    disabled={isLoading || showSuccess}
                    className="w-full py-3 bg-emerald-800 cursor-pointer hover:bg-gray-300 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2 py-1">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900" />
                        Validation...
                      </span>
                    ) : showSuccess ? (
                      <span className="flex items-center justify-center gap-2 py-1">
                        <Icon icon="solar:check-circle-bold" className="w-5 h-5" />
                        Départ enregistré !
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2 py-1">
                        <Icon icon="solar:logout-2-bold" className="w-5 h-5" />
                        Valider le départ
                      </span>
                    )}
                  </button>
                </div>
              </form>

              {/* Success Message */}
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 bg-success/10 border-2 border-success/30 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Icon icon="solar:check-circle-bold" className="w-6 h-6 text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">
                        Départ enregistré avec succès
                      </p>
                      <p className="text-sm text-gray-700">
                        Merci de votre visite. Vous allez être redirigé...
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Return Button */}
              <div className="mt-6">
                <button
                  onClick={handleReturn}
                  disabled={isLoading || showSuccess}
                  className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Icon icon="solar:arrow-left-bold" className="w-5 h-5" />
                  Retour
                </button>
              </div>

              {/* Help Section */}
              <div className="mt-8 bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                <div className="flex items-start gap-3">
                  <Icon icon="solar:question-circle-bold" className="w-6 h-6 text-accent-cyan flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">
                      Vous avez perdu votre numéro ?
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Veuillez contacter l'accueil pour obtenir de l'aide. Ayez votre nom complet à disposition.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-accent-cyan font-medium">
                      <Icon icon="solar:phone-bold" className="w-4 h-4" />
                      Contacter l'accueil
                    </div>
                  </div>
                </div>
              </div>
          </motion.div>
        </div>
      {/* Right Side - Lamp Background (50%) - Hidden on mobile */}
      <div className="hidden md:block md:w-1/2 relative overflow-hidden">
        <LampContainer>
          <div className="h-full flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-error to-accent-pink rounded-full mb-8">
                <Icon icon="solar:logout-3-bold-duotone" className="w-20 h-20 text-white" />
              </div>
              <h2 className="text-5xl font-bold text-white mb-4">
                Au revoir
              </h2>
              <p className="text-xl text-primary-100">
                Enregistrez votre départ
              </p>
            </motion.div>
          </div>
        </LampContainer>
      </div>


     
    
    </div>
  );
}
