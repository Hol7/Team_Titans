'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { Button } from '@/components/ui/button/Button';
import { useAuthStore } from '@/lib/stores/authStore';
import { ROUTES } from '@/config/constants';

export const Navbar = () => {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    clearAuth();
    router.push(ROUTES.AUTH.LOGIN);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo et titre */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-500 rounded-lg">
              <Icon icon="mdi:clock-time-four-outline" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Time Management</h1>
              <p className="text-xs text-gray-500">Gestion du temps</p>
            </div>
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-center w-9 h-9 bg-primary-100 text-primary-600 rounded-full font-medium">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">{user ? (user.role === 'luffy' ? 'Luffy' : user.role === 'gca' ? 'GCA' : 'Pirates') : ''}</p>
              </div>
              <Icon 
                icon="mdi:chevron-down" 
                className={`w-5 h-5 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown menu */}
            {showUserMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-fade-in">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      router.push(ROUTES.DASHBOARD.PROFILE);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                  >
                    <Icon icon="mdi:account-outline" className="w-5 h-5" />
                    Mon profil
                  </button>
                  <hr className="my-2 border-gray-100" />
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-error hover:bg-red-50 flex items-center gap-3"
                  >
                    <Icon icon="mdi:logout" className="w-5 h-5" />
                    Déconnexion
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};