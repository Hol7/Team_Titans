import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS, QUERY_KEYS } from '@/config/constants';
import { User, CreateUserDto, UpdateUserDto } from '@/types';

// Get all users
export const useUsers = () => {
  return useQuery({
    queryKey: QUERY_KEYS.USERS.LIST,
    queryFn: async () => {
      const response = await apiClient.get<User[]>(API_ENDPOINTS.USERS.LIST);
      return response.data;
    },
  });
};

// Get single user
export const useUser = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.USERS.DETAIL(id),
    queryFn: async () => {
      const response = await apiClient.get<User>(API_ENDPOINTS.USERS.UPDATE(id));
      return response.data;
    },
    enabled: !!id,
  });
};

// Create user
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUserDto) => {
      const response = await apiClient.post<User>(API_ENDPOINTS.USERS.CREATE, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.LIST });
      toast.success('Utilisateur créé avec succès');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la création';
      toast.error(message);
    },
  });
};

// Update user
export const useUpdateUser = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateUserDto) => {
      const response = await apiClient.put<User>(API_ENDPOINTS.USERS.UPDATE(id), data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.LIST });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.DETAIL(id) });
      toast.success('Utilisateur modifié avec succès');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la modification';
      toast.error(message);
    },
  });
};

// Delete user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(API_ENDPOINTS.USERS.DELETE(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.LIST });
      toast.success('Utilisateur supprimé avec succès');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la suppression';
      toast.error(message);
    },
  });
};

// Update my profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateUserDto) => {
      const response = await apiClient.put<User>(API_ENDPOINTS.USERS.ME, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.ME });
      toast.success('Profil modifié avec succès');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la modification';
      toast.error(message);
    },
  });
};

// Delete my account
export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: async () => {
      await apiClient.delete(API_ENDPOINTS.USERS.ME);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la suppression';
      toast.error(message);
    },
  });
};