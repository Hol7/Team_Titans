import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS, QUERY_KEYS } from '@/config/constants';
import { User } from '@/types';

export const useMe = () => {
  return useQuery({
    queryKey: QUERY_KEYS.AUTH.ME,
    queryFn: async () => {
      const response = await apiClient.get<User>(API_ENDPOINTS.USERS.ME);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};