import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useNavigate } from 'react-router';
import splitId from '@/utils/formatting/splitId';

export default function useAddDesignProject() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addDesignProject,
    mutationKey: ['addDesignProject'],
    onError: (error, variables, context) => {
      // An error happened!
      console.log({ error, variables, context });
    },
    onSuccess: async (result, _variables, _context) => {
      console.log({ result });
      const newProjectPath = `studios/design-studio/${splitId(result.result.SK)}`;
      navigate(newProjectPath);
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({
        queryKey: ['projects', 'recentProjects'],
      });
    },
  });
}

const addDesignProject = () => {
  return api.post({
    url: '/projects/design',
    data: {},
  });
};
