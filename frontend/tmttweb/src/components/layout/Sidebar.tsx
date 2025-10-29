'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils/cn';
import { useAuthStore } from '@/lib/stores/authStore';
import { ROUTES } from '@/config/constants';

interface NavItem {
  label: string;
  icon: string;
  href: string;
  managerOnly?: boolean;
}

const navItems: NavItem[] = [
  {
    label: 'Tableau de bord',
    icon: 'mdi:view-dashboard-outline',
    href: ROUTES.DASHBOARD.HOME,
  },
  {
    label: 'Pointage',
    icon: 'mdi:clock-check-outline',
    href: ROUTES.DASHBOARD.CLOCK,
  },
  {
    label: 'Utilisateurs',
    icon: 'mdi:account-group-outline',
    href: ROUTES.MANAGER.USERS,
    managerOnly: true,
  },
  {
    label: 'Équipes',
    icon: 'mdi:account-multiple-outline',
    href: ROUTES.MANAGER.TEAMS,
    managerOnly: true,
  },
  {
    label: 'Rapports',
    icon: 'mdi:chart-line',
    href: ROUTES.MANAGER.REPORTS,
    managerOnly: true,
  },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isManager = useAuthStore((state) => state.isManager);

  const filteredItems = navItems.filter(
    (item) => !item.managerOnly || isManager
  );

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-73px)] sticky top-[73px]">
      <nav className="p-4 space-y-1">
        {filteredItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200',
                isActive
                  ? 'bg-primary-50 text-primary-600 font-medium shadow-sm'
                  : 'text-gray-700 hover:bg-gray-50'
              )}
            >
              <Icon icon={item.icon} className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};