'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import { ROUTES } from '@/config/constants';

export function VisitorNav() {
  const router = useRouter();
  const pathname = usePathname();

  const isClockIn = pathname === ROUTES.VISITOR.CLOCK_IN;
  const isClockOut = pathname === ROUTES.VISITOR.CLOCK_OUT;

  return (
    <div className="fixed top-4 right-4 z-40">
      <div className="bg-white rounded-xl shadow-lg p-2 flex gap-2">
        <button
          onClick={() => router.push(ROUTES.VISITOR.CLOCK_IN)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            isClockIn
              ? 'bg-success text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Icon icon="mdi:login" className="w-5 h-5" />
          <span className="hidden sm:inline">Arrivée</span>
        </button>
        <button
          onClick={() => router.push(ROUTES.VISITOR.CLOCK_OUT)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            isClockOut
              ? 'bg-error text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Icon icon="mdi:logout" className="w-5 h-5" />
          <span className="hidden sm:inline">Départ</span>
        </button>
      </div>
    </div>
  );
}
