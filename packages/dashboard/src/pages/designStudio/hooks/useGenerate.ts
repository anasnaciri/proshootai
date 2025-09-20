import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function useGenerate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generate,
    mutationKey: ['generate'],
    onMutate: async (_newProduct) => {
      await queryClient.cancelQueries({ queryKey: ['generations'] });
    },
    onError: (error, variables, context) => {
      // An error happened!
      console.log({ error, variables, context });
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({ queryKey: ['generations'] });
    },
  });
}

const generate = ({
  image,
  mask,
  prompt,
  style = 'https://miro.medium.com/v2/resize:fit:1024/1*rnsrSpcyKn90fM_Mjtx3dA.png',
  project = 'default',
}: {
  image: string;
  mask: string;
  prompt: string;
  style?: string;
  project?: string;
}) => {
  const data = {
    image,
    mask,
    prompt,
    style,
    project,
  };

  return api.post({
    url: '/generations',
    data: data,
  });
};
