import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS, QUERY_KEYS } from '@/config/constants';
import { Clock, CreateClockDto, ClockSummary } from '@/types';

// Get user clocks
export const useUserClocks = (userId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.CLOCKS.USER(userId),
    queryFn: async () => {
      const response = await apiClient.get<ClockSummary[]>(
        API_ENDPOINTS.CLOCKS.USER_CLOCKS(userId)
      );
      return response.data;
    },
    enabled: !!userId,
  });
};

// Create clock (punch in/out)
export const useCreateClock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateClockDto) => {
      const response = await apiClient.post<Clock>(API_ENDPOINTS.CLOCKS.CREATE, data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['clocks'] });
      const message = data.type === 'in' ? 'Arrivée enregistrée' : 'Départ enregistré';
      toast.success(message);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de l\'enregistrement';
      toast.error(message);
    },
  });
};