import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function useUploadProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProduct,
    mutationKey: ['addProduct'],
    onMutate: async (newProduct) => {
      await queryClient.cancelQueries({ queryKey: ['products'] });

      const previousProducts = queryClient.getQueryData(['products']);

      const imgUrl = URL.createObjectURL(newProduct.image);

      const newProductObject = {
        image: imgUrl,
        productName: newProduct.productName,
        isUploading: true,
      };

      queryClient.setQueryData(
        ['products'],
        (old: { result: { image: File; productName: string }[] }) => {
          return { result: [...old.result, newProductObject] };
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

const addProduct = ({
  image,
  productName,
}: {
  image: File;
  productName: string;
}) => {
  const formData = new FormData();
  formData.append('image', image);
  formData.append('productName', productName);

  return api.post({
    url: '/products',
    data: formData,
    config: {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  });
};
