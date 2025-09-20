import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function useGenerations() {
  return useQuery({
    queryKey: ['generations'],
    queryFn: () => api.get({ url: '/generations' }),
  });
}
