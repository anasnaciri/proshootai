import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import splitId from '@/utils/formatting/splitId';

export default function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProduct,
    mutationKey: ['updateProject'],
    onMutate: async (newDesignProject) => {
      await queryClient.cancelQueries({
        queryKey: ['recentProjects'],
      });

      const previousDesignProjects = queryClient.getQueryData([
        'recentProjects',
      ]);

      console.log({ newDesignProject, previousDesignProjects });

      queryClient.setQueryData(
        ['recentProjects'],
        (old: { result: { SK: string; title: string }[] }) => {
          console.log({ old });
          return {
            result: [...old.result].map((p) => {
              return splitId(p.SK) === newDesignProject.id
                ? { ...p, title: newDesignProject.title, isUpdating: true }
                : p;
            }),
          };
        },
      );

      return { previousDesignProjects };
    },
    onError: (error, variables, context) => {
      // An error happened!
      console.log({ error, variables, context });
      console.log(
        `rolling back optimistic update with id ${context?.previousDesignProjects}`,
      );
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({
        queryKey: ['recentProjects'],
      });
    },
  });
}

const updateProduct = ({ id, title }: { id: string; title?: string }) => {
  return api.put({
    url: `/projects/design/${id}`,
    data: { title },
  });
};
