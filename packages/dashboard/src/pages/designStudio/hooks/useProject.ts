// import { useQuery } from '@tanstack/react-query';
// import { api } from '@/lib/api';

// export default function useProject({ id }: { id: string | undefined }) {
//   return useQuery({
//     queryKey: ['designProjects', id],
//     queryFn: () => api.get({ url: `/projects/design/${id}` }),
//     refetchOnWindowFocus: false,
//     staleTime: 0,
//   });
// }

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface ProjectData {
  // Add your project type definition here
  result: {
    canvas: string;
    id: string;
    preview: string;
  };
}

interface ProjectHookResult {
  data: ProjectData | null;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
}

export default function useProject({
  id,
}: {
  id: string | undefined;
}): ProjectHookResult {
  const [data, setData] = useState<ProjectData | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setData(null);
      return;
    }

    let isMounted = true;

    const fetchProject = async () => {
      setIsPending(true);
      setIsError(false);
      setError(null);

      try {
        const response = await api.get({ url: `/projects/design/${id}` });

        if (isMounted) {
          setData(response);
          setIsPending(false);
        }
      } catch (err) {
        if (isMounted) {
          setIsError(true);
          setError(err instanceof Error ? err : new Error('An error occurred'));
          setData(null);
          setIsPending(false);
        }
      }
    };

    fetchProject();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { data, isPending, isError, error };
}
