import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function useElements() {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => api.get({ url: '/elements' }),
  });
}
