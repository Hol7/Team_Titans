import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import apiClient from '@/lib/api/client';
import { useAuthStore } from '@/lib/stores/authStore';
import { API_ENDPOINTS, ROUTES } from '@/config/constants';
import { LoginDto, AuthResponse } from '@/types';

export const useLogin = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (credentials: LoginDto) => {
      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );
      return response.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.success('Connexion réussie');
      router.push(ROUTES.DASHBOARD.HOME);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        'Erreur lors de la connexion. Vérifiez vos identifiants.';
      toast.error(message);
    },
  });
};