'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { ROUTES, VISIT_REASONS } from '@/config/constants';
import { VisitorNav } from '@/components/features/visitor/VisitorNav';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { Button } from '@/components/ui/moving-border';
import { motion } from 'framer-motion';
import { LampContainer } from '@/components/ui/lamp';

export default function VisitorClockInPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [visitReason, setVisitReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [generatedNumber] = useState('12'); // Temporary hardcoded number
  const [errors, setErrors] = useState<{ fullName?: string; visitReason?: string; otherReason?: string }>({});

  const validateForm = () => {
    const newErrors: { fullName?: string; visitReason?: string; otherReason?: string } = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Le nom complet est requis';
    }

    if (!visitReason) {
      newErrors.visitReason = 'Veuillez sélectionner une raison de visite';
    }

    if (visitReason === 'other' && !otherReason.trim()) {
      newErrors.otherReason = 'Veuillez préciser la raison de votre visite';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // TODO: Make API request here
      // For now, just show the popup with the generated number
      setShowPopup(true);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleReturn = () => {
    router.push(ROUTES.ROLE_SELECTION);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <VisitorNav />
      
      {/* Left Side - Lamp Background (50%) - Hidden on mobile */}
      <div className="hidden md:block md:w-1/2 relative overflow-hidden">
        <LampContainer>
          <div className="h-full flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-success to-accent-cyan rounded-full mb-8">
                <Icon icon="solar:login-3-bold-duotone" className="w-20 h-20 text-white" />
              </div>
              <h2 className="text-5xl font-bold text-white mb-4">
                Bienvenue
              </h2>
              <p className="text-xl text-primary-100">
                Enregistrez votre arrivée
              </p>
            </motion.div>
          </div>
        </LampContainer>
      </div>

      {/* Right Side - Form (50% on desktop, 100% on mobile) */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Pointage Visiteur
              </h1>
              <p className="text-gray-600">
                Veuillez remplir les informations ci-dessous
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name Input */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom complet <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Icon icon="solar:user-bold" className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-cyan transition-all ${
                        errors.fullName ? 'border-error' : 'border-gray-300 focus:border-accent-cyan'
                      }`}
                      placeholder="Entrez votre nom complet"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="mt-2 text-sm text-error flex items-center gap-1">
                      <Icon icon="solar:danger-circle-bold" className="w-4 h-4" />
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Visit Reason Select */}
                <div>
                  <label htmlFor="visitReason" className="block text-sm font-semibold text-gray-700 mb-2">
                    Raison de la visite <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Icon icon="solar:clipboard-text-bold" className="w-5 h-5 text-gray-400" />
                    </div>
                    <select
                      id="visitReason"
                      value={visitReason}
                      onChange={(e) => setVisitReason(e.target.value)}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent-cyan transition-all appearance-none ${
                        errors.visitReason ? 'border-error' : 'border-gray-300 focus:border-accent-cyan'
                      }`}
                    >
                      <option value="">Sélectionnez une raison</option>
                      {VISIT_REASONS.map((reason) => (
                        <option key={reason.value} value={reason.value}>
                          {reason.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <Icon icon="solar:alt-arrow-down-bold" className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  {errors.visitReason && (
                    <p className="mt-2 text-sm text-error flex items-center gap-1">
                      <Icon icon="solar:danger-circle-bold" className="w-4 h-4" />
                      {errors.visitReason}
                    </p>
                  )}
                </div>

                {/* Other Reason Input (conditional) */}
                {visitReason === 'other' && (
                  <div>
                    <label htmlFor="otherReason" className="block text-sm font-semibold text-gray-700 mb-2">
                      Précisez la raison <span className="text-error">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Icon icon="solar:pen-bold" className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="otherReason"
                        value={otherReason}
                        onChange={(e) => setOtherReason(e.target.value)}
                        className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-cyan transition-all ${
                          errors.otherReason ? 'border-error' : 'border-gray-300 focus:border-accent-cyan'
                        }`}
                        placeholder="Décrivez la raison de votre visite"
                      />
                    </div>
                    {errors.otherReason && (
                      <p className="mt-2 text-sm text-error flex items-center gap-1">
                        <Icon icon="solar:danger-circle-bold" className="w-4 h-4" />
                        {errors.otherReason}
                      </p>
                    )}
                  </div>
                )}

                {/* Submit Button */}
                <div>
                  <button
                    // borderRadius="0.75rem"
                    // as="button"
                    type="submit"
                    className="w-full py-3 bg-emerald-800 cursor-pointer hover:bg-gray-300 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <span className="flex items-center justify-center gap-2 py-1">
                      <Icon icon="solar:check-circle-bold" className="w-5 h-5" />
                      Valider l'arrivée
                    </span>
                  </button>
                </div>
              </form>

              {/* Return Button */}
              <div className="mt-6">
                <button
                  onClick={handleReturn}
                  className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Icon icon="solar:arrow-left-bold" className="w-5 h-5" />
                  Retour
                </button>
              </div>
          </motion.div>
        </div>
  

      {/* Number Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            {/* Close Button */}
            <button
              onClick={handleClosePopup}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Icon icon="solar:close-circle-bold" className="w-8 h-8" />
            </button>

            {/* Success Icon */}
            <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-success to-accent-cyan rounded-full mx-auto mb-6">
              <Icon icon="solar:check-circle-bold" className="w-12 h-12 text-white" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
              Arrivée enregistrée !
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Veuillez noter votre numéro de visite
            </p>

            {/* Generated Number Display */}
            <div className="bg-gradient-to-br from-success/10 to-accent-cyan/10 rounded-xl p-8 mb-6 border-2 border-success/30">
              <p className="text-sm font-medium text-gray-600 text-center mb-2">
                Votre numéro de visite
              </p>
              <p className="text-6xl font-bold text-success text-center tracking-wider">
                {generatedNumber}
              </p>
            </div>

            {/* Important Notice */}
            <div className="bg-warning/10 border-2 border-warning/30 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <Icon icon="solar:danger-triangle-bold" className="w-6 h-6 text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">
                    Important
                  </p>
                  <p className="text-sm text-gray-700">
                    Conservez ce numéro précieusement. Vous en aurez besoin pour enregistrer votre départ.
                  </p>
                </div>
              </div>
            </div>

            {/* Confirm Button */}
            <div>
              <button
                // borderRadius="0.75rem"
                onClick={handleClosePopup}
                className="w-full py-3 bg-emerald-800 cursor-pointer hover:bg-gray-300 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <span className="py-1">J'ai noté mon numéro</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
