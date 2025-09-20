import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function useGenerations(projectId: string) {
  return useQuery({
    queryKey: ['generations'],
    queryFn: () => api.get({ url: `/generations/projects/${projectId}` }),
  });
}
