import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function useRecentProjects() {
  const query: UseQueryResult<{ result: Project[] }> = useQuery({
    queryKey: ['recentProjects'],
    queryFn: () => api.get({ url: '/projects/design/recent' }),
  });
  return query;
}
