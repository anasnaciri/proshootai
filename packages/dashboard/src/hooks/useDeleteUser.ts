import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    mutationKey: ['deleteUser'],
    onMutate: async (user) => {
      await queryClient.cancelQueries({
        queryKey: ['products'], // you should cancel all
      });

      console.log({ user });
    },
    onError: (error, variables, context) => {
      // An error happened!
      console.log({ error, variables, context });
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({
        queryKey: ['products', 'generations', 'designProjects'],
      }); // you should invalidate all
    },
  });
}

const deleteUser = () => {
  return api.delete({
    url: `/user}`,
  });
};
