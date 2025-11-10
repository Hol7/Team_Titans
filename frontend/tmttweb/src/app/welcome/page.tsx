"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { ROUTES, STORAGE_KEYS } from "@/config/constants";
import { motion } from "framer-motion";
import { LampContainer } from "@/components/ui/lamp";
import { Button } from "@/components/ui/moving-border";

export default function WelcomePage() {
  const router = useRouter();

  const handleStart = () => {
    // Mark that user has seen the welcome page
    localStorage.setItem(STORAGE_KEYS.FIRST_VISIT, "false");
    router.push(ROUTES.ROLE_SELECTION);
  };

  return (
    <LampContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-5xl mx-auto px-4"
      >
        {/* Main Content */}
        <div className="text-center mb-16">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-accent-purple to-accent-pink rounded-3xl mb-8 shadow-2xl shadow-accent-purple/30"
          >
            <Icon
              icon="solar:clock-circle-bold-duotone"
              className="w-14 h-14 text-white"
            />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight"
          >
            Bienvenue sur{" "}
            <span className="bg-gradient-to-r from-accent-purple via-accent-pink to-accent-cyan bg-clip-text text-gray">
              TMTT
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-primary-100 max-w-3xl mx-auto text-white font-light leading-relaxed"
          >
            Time Management Team Titans - Votre solution complète pour la
            gestion du temps et des présences
          </motion.p>
        </div>

        {/* Features Grid */}
        {/* <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-brand-white rounded-2xl p-8 border-2 border-accent-purple/30 hover:border-accent-purple transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-accent-purple/20">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-purple to-accent-pink rounded-xl mb-6 shadow-lg">
                <Icon icon="solar:clock-circle-bold" className="w-9 h-9 text-brand-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-purple mb-3">
                Pointage Simple
              </h3>
              <p className="text-gray-600 text-base leading-relaxed">
                Enregistrez vos arrivées et départs en quelques clics
              </p>
            </div>

            <div className="bg-brand-white rounded-2xl p-8 border-2 border-accent-cyan/30 hover:border-accent-cyan transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-accent-cyan/20">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-blue to-accent-cyan rounded-xl mb-6 shadow-lg">
                <Icon icon="solar:users-group-two-rounded-bold" className="w-9 h-9 text-brand-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-purple mb-3">
                Gestion d'Équipe
              </h3>
              <p className="text-gray-600 text-base leading-relaxed">
                Gérez vos équipes et suivez les performances en temps réel
              </p>
            </div>

            <div className="bg-brand-white rounded-2xl p-8 border-2 border-accent-pink/30 hover:border-accent-pink transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-accent-pink/20">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-pink to-accent-purple rounded-xl mb-6 shadow-lg">
                <Icon icon="solar:chart-2-bold" className="w-9 h-9 text-brand-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-purple mb-3">
                Rapports & KPI
              </h3>
              <p className="text-gray-600 text-base leading-relaxed">
                Visualisez des rapports détaillés et des indicateurs de performance
              </p>
            </div>
          </motion.div> */}

        {/* Key Benefits */}
        {/* <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="bg-brand-white rounded-3xl p-10 border-2 border-accent-purple/30 mb-16">
            <h2 className="text-3xl font-bold text-brand-purple mb-8 text-center">
              Pourquoi choisir TMTT ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-success to-accent-cyan rounded-full flex-shrink-0 mt-1 shadow-lg">
                  <Icon icon="solar:check-circle-bold" className="w-5 h-5 text-brand-white" />
                </div>
                <div>
                  <h4 className="font-bold text-brand-purple mb-1 text-lg">Interface intuitive</h4>
                  <p className="text-base text-gray-600 leading-relaxed">Facile à utiliser pour tous les utilisateurs</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-success to-accent-cyan rounded-full flex-shrink-0 mt-1 shadow-lg">
                  <Icon icon="solar:check-circle-bold" className="w-5 h-5 text-brand-white" />
                </div>
                <div>
                  <h4 className="font-bold text-brand-purple mb-1 text-lg">Sécurisé et fiable</h4>
                  <p className="text-base text-gray-600 leading-relaxed">Vos données sont protégées et sécurisées</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-success to-accent-cyan rounded-full flex-shrink-0 mt-1 shadow-lg">
                  <Icon icon="solar:check-circle-bold" className="w-5 h-5 text-brand-white" />
                </div>
                <div>
                  <h4 className="font-bold text-brand-purple mb-1 text-lg">Accès visiteurs</h4>
                  <p className="text-base text-gray-600 leading-relaxed">Système de pointage simplifié pour les visiteurs</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-success to-accent-cyan rounded-full flex-shrink-0 mt-1 shadow-lg">
                  <Icon icon="solar:check-circle-bold" className="w-5 h-5 text-brand-white" />
                </div>
                <div>
                  <h4 className="font-bold text-brand-purple mb-1 text-lg">Rapports détaillés</h4>
                  <p className="text-base text-gray-600 leading-relaxed">Analyses et statistiques complètes</p>
                </div>
              </div>
            </div>
          </motion.div> */}

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center"
        >
          <Button
            borderRadius="1.75rem"
            onClick={handleStart}
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-accent-purple via-accent-pink to-accent-cyan text-white text-lg font-bold rounded-2xl shadow-2xl shadow-accent-purple/50 hover:shadow-accent-purple/70 hover:scale-105 transition-all duration-300 border-2 border-white/20"
          >
            <Icon icon="solar:play-circle-bold" className="w-6 h-6" />
            Commencer
            <Icon icon="solar:arrow-right-bold" className="w-6 h-6" />
          </Button>
        </motion.div>

        {/* Footer */}
        {/* <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="text-center text-sm text-slate-300 mt-12">
            © 2025 TMTT - Time Management Team Titans. Tous droits réservés.
          </motion.p> */}
      </motion.div>
    </LampContainer>
  );
}
