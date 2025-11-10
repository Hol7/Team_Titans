'use client';

import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { ROUTES } from '@/config/constants';
import { motion } from 'framer-motion';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { LampContainer } from '@/components/ui/lamp';
import { Button } from '@/components/ui/moving-border';

export default function RoleSelectionPage() {
  const router = useRouter();

  const handleVisitorClick = () => {
    router.push(ROUTES.VISITOR.CLOCK_IN);
  };

  const handleEmployerClick = () => {
    router.push(ROUTES.AUTH.LOGIN);
  };

  return (
    <AuroraBackground>
    <div className="min-h-screen bg-gray relative overflow-hidden">
      {/* Animated Background Gradient */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-brand-purple via-primary-700 to-primary-900" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-accent-purple/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-accent-cyan/20 via-transparent to-transparent" />
       */}
      

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-16">
            {/* <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-accent-purple to-accent-pink rounded-3xl mb-8 shadow-2xl shadow-accent-purple/30">
              <Icon icon="solar:user-id-bold-duotone" className="w-14 h-14 " />
            </div> */}

            <h1 className="text-5xl md:text-6xl font-bold text-blue mb-4 tracking-tight">
              Choisissez votre <span className="bg-gradient-to-r from-accent-purple via-accent-pink to-accent-cyan bg-clip-text ">profil</span>
            </h1>
            <p className="text-xl text-primary-100 font-light">
              Sélectionnez le type d'accès qui vous correspond
            </p>
          </motion.div>

          {/* Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Visitor Card */}
            <motion.button
              onClick={handleVisitorClick}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="group text-white relative bg-zinc-900 backdrop-blur-md rounded-3xl p-10 border-2 border-white/20 hover:bg-white/15 hover:text-black hover:border-accent-cyan/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-accent-cyan/30 cursor-pointer"
            >
              <div className="flex flex-col items-center text-center">
                {/* Icon */}
                <div className="inline-flex items-center  justify-center w-28 h-28 bg-gradient-to-br from-accent-cyan to-accent-blue rounded-3xl mb-8  shadow-accent-cyan/30 group-hover:scale-110 transition-transform duration-300">
                  <Icon icon="solar:user-check-rounded-bold-duotone" className="w-16 h-16 " />
                </div>

                {/* Title */}
                <h2 className="text-4xl font-bold text-white mb-5 group-hover:text-black transition-colors duration-300">
                  Visiteur
                </h2>

                {/* Description */}
                <p className="mb-8 text-lg leading-relaxed ">
                  Vous êtes en visite ? Enregistrez votre arrivée et votre départ en quelques étapes simples.
                </p>

                {/* Features */}
                {/* <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-success to-accent-cyan rounded-full flex-shrink-0 shadow-lg">
                      <Icon icon="solar:check-circle-bold" className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-base text-white font-medium">Pointage rapide et simple</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-success to-accent-cyan rounded-full flex-shrink-0 shadow-lg">
                      <Icon icon="solar:check-circle-bold" className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-base text-white font-medium">Numéro de visite sécurisé</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-success to-accent-cyan rounded-full flex-shrink-0 shadow-lg">
                      <Icon icon="solar:check-circle-bold" className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-base text-white font-medium">Aucune authentification requise</span>
                  </div>
                </div> */}

                {/* Button */}
                <div className="inline-flex items-center gap-3 text-accent-cyan font-bold text-lg group-hover:gap-4 transition-all">
                  Continuer comme visiteur
                  <Icon icon="solar:arrow-right-bold" className="w-6 h-6" />
                </div>
              </div>
            </motion.button>

            {/* Employer Card */}
        
            <motion.button
              onClick={handleEmployerClick}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="group relative bg-white/10 backdrop-blur-md rounded-3xl p-10 border-2 border-white/20 hover:bg-white/15 hover:border-accent-purple/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-accent-purple/30 cursor-pointer"
            >
              <div className="flex flex-col items-center text-center">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-accent-purple to-accent-pink rounded-3xl mb-8  shadow-accent-purple/30 group-hover:scale-110 transition-transform duration-300">
                  <Icon icon="solar:case-round-bold-duotone" className="w-16 h-16 text-black" />
                </div>

                {/* Title */}
                <h2 className="text-4xl font-bold text-black mb-5 group-hover:text-accent-purple transition-colors duration-300">
                  Personnel
                </h2>

                {/* Description */}
                <p className="text-primary-100 mb-8 text-lg leading-relaxed">
                  Vous faites partie de l'équipe ? Connectez-vous pour accéder à votre espace personnel.
                </p>

                {/* Features */}
                {/* <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-success to-accent-cyan rounded-full flex-shrink-0 shadow-lg">
                      <Icon icon="solar:check-circle-bold" className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-base text-white font-medium">Gestion de vos horaires</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-success to-accent-cyan rounded-full flex-shrink-0 shadow-lg">
                      <Icon icon="solar:check-circle-bold" className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-base text-white font-medium">Tableau de bord personnalisé</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-success to-accent-cyan rounded-full flex-shrink-0 shadow-lg">
                      <Icon icon="solar:check-circle-bold" className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-base text-white font-medium">Rapports et statistiques</span>
                  </div>
                </div> */}

                {/* Button */}
                <div className="inline-flex items-center gap-3 text-accent-purple font-bold text-lg group-hover:gap-4 transition-all">
                  Se connecter
                  <Icon icon="solar:arrow-right-bold" className="w-6 h-6" />
                </div>
              </div>
            </motion.button>
     
          </div>

          {/* Footer */}
          {/* <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center text-sm text-primary-200 mt-16">
            © 2025 TMTT. Tous droits réservés.
          </motion.p> */}
        </motion.div>
      </div>
    </div>
     </AuroraBackground>
  );
}
