'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { ROUTES, VISIT_REASONS } from '@/config/constants';
import { VisitorNav } from '@/components/features/visitor/VisitorNav';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-500/10 p-4">
      <VisitorNav />
      <div className="w-full max-w-2xl animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-success rounded-2xl mb-4 shadow-md">
            <Icon icon="mdi:login" className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pointage Visiteur - Arrivée
          </h1>
          <p className="text-gray-600">
            Veuillez remplir les informations ci-dessous
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name Input */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                Nom complet <span className="text-error">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Icon icon="mdi:account" className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                    errors.fullName ? 'border-error' : 'border-gray-200 focus:border-primary-500'
                  }`}
                  placeholder="Entrez votre nom complet"
                />
              </div>
              {errors.fullName && (
                <p className="mt-2 text-sm text-error flex items-center gap-1">
                  <Icon icon="mdi:alert-circle" className="w-4 h-4" />
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
                  <Icon icon="mdi:clipboard-text" className="w-5 h-5 text-gray-400" />
                </div>
                <select
                  id="visitReason"
                  value={visitReason}
                  onChange={(e) => setVisitReason(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all appearance-none bg-white ${
                    errors.visitReason ? 'border-error' : 'border-gray-200 focus:border-primary-500'
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
                  <Icon icon="mdi:chevron-down" className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              {errors.visitReason && (
                <p className="mt-2 text-sm text-error flex items-center gap-1">
                  <Icon icon="mdi:alert-circle" className="w-4 h-4" />
                  {errors.visitReason}
                </p>
              )}
            </div>

            {/* Other Reason Input (conditional) */}
            {visitReason === 'other' && (
              <div className="animate-slide-in">
                <label htmlFor="otherReason" className="block text-sm font-semibold text-gray-700 mb-2">
                  Précisez la raison <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon icon="mdi:pencil" className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="otherReason"
                    value={otherReason}
                    onChange={(e) => setOtherReason(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                      errors.otherReason ? 'border-error' : 'border-gray-200 focus:border-primary-500'
                    }`}
                    placeholder="Décrivez la raison de votre visite"
                  />
                </div>
                {errors.otherReason && (
                  <p className="mt-2 text-sm text-error flex items-center gap-1">
                    <Icon icon="mdi:alert-circle" className="w-4 h-4" />
                    {errors.otherReason}
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 bg-success hover:bg-success/90 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <Icon icon="mdi:check-circle" className="w-6 h-6" />
              Valider l'arrivée
            </button>
          </form>
        </div>

        {/* Return Button */}
        <button
          onClick={handleReturn}
          className="w-full py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Icon icon="mdi:arrow-left" className="w-5 h-5" />
          Retour
        </button>
      </div>

      {/* Number Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-slide-in">
            {/* Success Icon */}
            <div className="flex items-center justify-center w-20 h-20 bg-success/10 rounded-full mx-auto mb-6">
              <Icon icon="mdi:check-circle" className="w-12 h-12 text-success" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
              Arrivée enregistrée !
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Veuillez noter votre numéro de visite
            </p>

            {/* Generated Number Display */}
            <div className="bg-gradient-to-br from-primary-50 to-accent-500/10 rounded-xl p-8 mb-6 border-2 border-primary-200">
              <p className="text-sm font-medium text-gray-600 text-center mb-2">
                Votre numéro de visite
              </p>
              <p className="text-6xl font-bold text-primary-500 text-center tracking-wider">
                {generatedNumber}
              </p>
            </div>

            {/* Important Notice */}
            <div className="bg-warning/10 border-2 border-warning/30 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <Icon icon="mdi:alert" className="w-6 h-6 text-warning flex-shrink-0 mt-0.5" />
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

            {/* Close Button */}
            <button
              onClick={handleClosePopup}
              className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              J'ai noté mon numéro
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
