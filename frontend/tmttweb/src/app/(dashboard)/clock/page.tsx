'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardHeader, CardContent } from '@/components/ui/card/Card';
import { Button } from '@/components/ui/button/Button';
import { Badge } from '@/components/ui/badge/Badge';
import { useAuthStore } from '@/lib/stores/authStore';
import { useCreateClock, useUserClocks } from '@/lib/hooks/clock';

export default function ClockPage() {
  const { user } = useAuthStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const createClockMutation = useCreateClock();
  const { data: clocks, isLoading } = useUserClocks(user?.id || '');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleClockIn = () => {
    createClockMutation.mutate({ type: 'in' });
  };

  const handleClockOut = () => {
    createClockMutation.mutate({ type: 'out' });
  };

  const todayClock = clocks?.[0];
  const hasClockIn = todayClock?.clockIn;
  const hasClockOut = todayClock?.clockOut;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pointage</h1>
        <p className="text-gray-600">Enregistrez vos heures d'arrivée et de départ</p>
      </div>

      {/* Horloge en temps réel */}
      <Card className="bg-gradient-to-br from-primary-500 to-primary-600 text-white border-0">
        <CardContent className="py-8">
          <div className="text-center">
            <div className="mb-4">
              <Icon icon="mdi:clock-outline" className="w-20 h-20 mx-auto opacity-80" />
            </div>
            <div className="text-6xl font-bold mb-2">
              {format(currentTime, 'HH:mm:ss')}
            </div>
            <div className="text-xl text-primary-100 capitalize">
              {format(currentTime, 'EEEE d MMMM yyyy', { locale: fr })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Boutons de pointage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card hover>
          <CardContent className="text-center py-8">
            <div className="flex items-center justify-center w-20 h-20 bg-success/10 rounded-full mx-auto mb-4">
              <Icon icon="mdi:clock-in" className="w-10 h-10 text-success" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Pointer l'arrivée
            </h3>
            {hasClockIn && (
              <div className="mb-4">
                <Badge variant="success" size="lg">
                  <Icon icon="mdi:check-circle" className="w-4 h-4 mr-1" />
                  Pointé à {todayClock.clockIn}
                </Badge>
              </div>
            )}
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleClockIn}
              disabled={hasClockIn || createClockMutation.isPending}
              isLoading={createClockMutation.isPending}
              leftIcon={<Icon icon="mdi:login" className="w-5 h-5" />}
            >
              {hasClockIn ? 'Déjà pointé' : 'Pointer'}
            </Button>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="text-center py-8">
            <div className="flex items-center justify-center w-20 h-20 bg-error/10 rounded-full mx-auto mb-4">
              <Icon icon="mdi:clock-out" className="w-10 h-10 text-error" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Pointer le départ
            </h3>
            {hasClockOut && (
              <div className="mb-4">
                <Badge variant="error" size="lg">
                  <Icon icon="mdi:check-circle" className="w-4 h-4 mr-1" />
                  Pointé à {todayClock.clockOut}
                </Badge>
              </div>
            )}
            <Button
              variant="danger"
              size="lg"
              fullWidth
              onClick={handleClockOut}
              disabled={!hasClockIn || hasClockOut || createClockMutation.isPending}
              isLoading={createClockMutation.isPending}
              leftIcon={<Icon icon="mdi:logout" className="w-5 h-5" />}
            >
              {!hasClockIn ? 'Pointer l\'arrivée d\'abord' : hasClockOut ? 'Déjà pointé' : 'Pointer'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Résumé du jour */}
      {todayClock && (
        <Card>
          <CardHeader title="Résumé d'aujourd'hui" />
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-success/10 rounded-lg">
                  <Icon icon="mdi:clock-in" className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Arrivée</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {todayClock.clockIn || '-'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-error/10 rounded-lg">
                  <Icon icon="mdi:clock-out" className="w-6 h-6 text-error" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Départ</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {todayClock.clockOut || '-'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-primary-50 rounded-lg">
                  <Icon icon="mdi:timer" className="w-6 h-6 text-primary-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {todayClock.totalHours ? `${todayClock.totalHours}h` : '-'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Historique récent */}
      <Card>
        <CardHeader
          title="Historique récent"
          subtitle="Vos derniers pointages"
        />
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto" />
            </div>
          ) : clocks && clocks.length > 0 ? (
            <div className="space-y-3">
              {clocks.slice(0, 7).map((clock, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Icon icon="mdi:calendar" className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{clock.date}</p>
                      <p className="text-xs text-gray-500">
                        {clock.clockIn || '-'} → {clock.clockOut || '-'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={clock.totalHours >= 8 ? 'success' : 'warning'}>
                      {clock.totalHours}h
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Icon icon="mdi:clock-outline" className="w-16 h-16 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Aucun pointage enregistré</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}