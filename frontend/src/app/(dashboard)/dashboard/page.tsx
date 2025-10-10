'use client';

import { Icon } from '@iconify/react';
import { Card, CardHeader, CardContent } from '@/components/ui/card/Card';
import { useAuthStore } from '@/lib/stores/authStore';
import { useMe } from '@/lib/hooks/auth/useMe';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function DashboardPage() {
  const { user, isManager } = useAuthStore();
//   const { data: userData } = useMe();

  const currentDate = format(new Date(), 'EEEE d MMMM yyyy', { locale: fr });

  const stats = [
    {
      label: 'Heures cette semaine',
      value: '38.5h',
      icon: 'mdi:clock-outline',
      color: 'bg-primary-500',
      change: '+5.2%',
      changeType: 'positive' as const,
    },
    {
      label: 'Pointages ce mois',
      value: '22',
      icon: 'mdi:calendar-check',
      color: 'bg-success',
      change: '+12',
      changeType: 'positive' as const,
    },
    {
      label: 'Moyenne journalière',
      value: '7.7h',
      icon: 'mdi:chart-timeline-variant',
      color: 'bg-accent-500',
      change: '+0.3h',
      changeType: 'positive' as const,
    },
    {
      label: 'Jours travaillés',
      value: '20',
      icon: 'mdi:briefcase-outline',
      color: 'bg-warning',
      change: '100%',
      changeType: 'neutral' as const,
    },
  ];

  const recentActivity = [
    { type: 'in', time: '08:30', date: 'Aujourd\'hui' },
    { type: 'out', time: '17:45', date: 'Hier' },
    { type: 'in', time: '08:15', date: 'Hier' },
    { type: 'out', time: '18:00', date: 'Avant-hier' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tableau de bord
        </h1>
        <p className="text-gray-600 capitalize">{currentDate}</p>
      </div>

      {/* Message de bienvenue */}
      <Card className="bg-gradient-to-r from-primary-500 to-primary-600 border-0 text-white">
        <CardContent className="py-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl">
              <Icon icon="mdi:hand-wave" className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">
                Bienvenue, {user?.firstName} !
              </h2>
              <p className="text-primary-50">
                {isManager 
                  ? 'Gérez votre équipe et suivez les performances' 
                  : 'Gérez votre temps de travail efficacement'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} hover className="animate-slide-in" style={{ animationDelay: `${index * 50}ms` }}>
            <CardContent>
              <div className="flex items-start justify-between mb-4">
                <div className={`flex items-center justify-center w-12 h-12 ${stat.color} rounded-xl`}>
                  <Icon icon={stat.icon} className="w-6 h-6 text-white" />
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  stat.changeType === 'positive' 
                    ? 'bg-success/10 text-success' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activité récente */}
        <Card>
          <CardHeader 
            title="Activité récente"
            subtitle="Vos derniers pointages"
          />
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    activity.type === 'in' 
                      ? 'bg-success/10 text-success' 
                      : 'bg-primary-50 text-primary-500'
                  }`}>
                    <Icon 
                      icon={activity.type === 'in' ? 'mdi:login' : 'mdi:logout'} 
                      className="w-5 h-5" 
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.type === 'in' ? 'Arrivée' : 'Départ'}
                    </p>
                    <p className="text-xs text-gray-500">{activity.date}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {activity.time}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions rapides */}
        <Card>
          <CardHeader 
            title="Actions rapides"
            subtitle="Accès direct aux fonctionnalités"
          />
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all group">
                <div className="flex items-center justify-center w-12 h-12 bg-success/10 group-hover:bg-success text-success group-hover:text-white rounded-xl transition-colors">
                  <Icon icon="mdi:clock-in" className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary-600">
                  Pointer l'arrivée
                </span>
              </button>

              <button className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all group">
                <div className="flex items-center justify-center w-12 h-12 bg-error/10 group-hover:bg-error text-error group-hover:text-white rounded-xl transition-colors">
                  <Icon icon="mdi:clock-out" className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary-600">
                  Pointer le départ
                </span>
              </button>

              <button className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all group">
                <div className="flex items-center justify-center w-12 h-12 bg-primary-50 group-hover:bg-primary-500 text-primary-500 group-hover:text-white rounded-xl transition-colors">
                  <Icon icon="mdi:account-outline" className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary-600">
                  Mon profil
                </span>
              </button>

              <button className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all group">
                <div className="flex items-center justify-center w-12 h-12 bg-info/10 group-hover:bg-info text-info group-hover:text-white rounded-xl transition-colors">
                  <Icon icon="mdi:chart-bar" className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary-600">
                  Mes heures
                </span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informations du compte */}
      {true && (
        <Card>
          <CardHeader 
            title="Informations du compte"
            subtitle="Vos données personnelles"
          />
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Nom complet
                  </label>
                  <p className="text-base font-medium text-gray-900 mt-1">
                    {/* {userData.firstName} {userData.lastName} */}
                    userData.firstName  userData.lastName
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Email
                  </label>
                  <p className="text-base font-medium text-gray-900 mt-1">
                    userData.email
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Téléphone
                  </label>
                  <p className="text-base font-medium text-gray-900 mt-1">
                    userData.phone
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Rôle
                  </label>
                  <p className="text-base font-medium text-gray-900 mt-1 capitalize">
                    {/* {userData.role === 'manager' ? 'Manager' : 'Employé'} */}
                    userData.role 
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}