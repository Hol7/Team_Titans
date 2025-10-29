import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS, QUERY_KEYS } from '@/config/constants';
import { Team, CreateTeamDto, UpdateTeamDto } from '@/types';

// Get all teams
export const useTeams = () => {
  return useQuery({
    queryKey: QUERY_KEYS.TEAMS.LIST,
    queryFn: async () => {
      const response = await apiClient.get<Team[]>(API_ENDPOINTS.TEAMS.LIST);
      return response.data;
    },
  });
};

// Get single team
export const useTeam = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.TEAMS.DETAIL(id),
    queryFn: async () => {
      const response = await apiClient.get<Team>(API_ENDPOINTS.TEAMS.DETAIL(id));
      return response.data;
    },
    enabled: !!id,
  });
};

// Create team
export const useCreateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTeamDto) => {
      const response = await apiClient.post<Team>(API_ENDPOINTS.TEAMS.CREATE, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TEAMS.LIST });
      toast.success('Équipe créée avec succès');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la création';
      toast.error(message);
    },
  });
};

// Update team
export const useUpdateTeam = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateTeamDto) => {
      const response = await apiClient.put<Team>(API_ENDPOINTS.TEAMS.UPDATE(id), data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TEAMS.LIST });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TEAMS.DETAIL(id) });
      toast.success('Équipe modifiée avec succès');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la modification';
      toast.error(message);
    },
  });
};

// Delete team
export const useDeleteTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(API_ENDPOINTS.TEAMS.DELETE(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TEAMS.LIST });
      toast.success('Équipe supprimée avec succès');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la suppression';
      toast.error(message);
    },
  });
};