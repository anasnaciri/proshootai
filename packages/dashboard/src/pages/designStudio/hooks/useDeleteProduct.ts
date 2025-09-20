import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import splitId from '../../../utils/formatting/splitId';

export default function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    mutationKey: ['deleteProduct'],
    onMutate: async (newProduct) => {
      await queryClient.cancelQueries({
        queryKey: ['products'],
      });

      console.log({ newProduct });

      const previousProducts = queryClient.getQueryData(['products']);

      queryClient.setQueryData(
        ['products'],
        (old: { result: { SK: string; productName: string }[] }) => {
          return {
            result: [...old.result].filter(
              (p) => splitId(p.SK) !== newProduct.id,
            ),
          };
        },
      );

      return { previousProducts };
    },
    onError: (error, variables, context) => {
      // An error happened!
      console.log({ error, variables, context });
      console.log(
        `rolling back optimistic update with id ${context?.previousProducts}`,
      );
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

const deleteProduct = ({ id }: { id: string }) => {
  console.log({ id });
  return api.delete({
    url: `/products/${id}`,
  });
};
