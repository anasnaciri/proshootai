import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import splitId from '../../../utils/formatting/splitId';

export default function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProduct,
    mutationKey: ['updateProduct'],
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
            result: [...old.result].map((p) => {
              return splitId(p.SK) === newProduct.id
                ? { ...p, name: newProduct.productName, isUpdating: true }
                : p;
            }),
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

const updateProduct = ({
  id,
  productName,
}: {
  id: string;
  productName: string;
}) => {
  console.log({ id, productName });
  return api.put({
    url: `/products/${id}`,
    data: { name: productName },
  });
};
