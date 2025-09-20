import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function useProjects() {
  const query: UseQueryResult<{ result: Project[] }> = useQuery({
    queryKey: ['designProjects'],
    queryFn: () => api.get({ url: '/projects/design' }),
  });
  return query;
}
