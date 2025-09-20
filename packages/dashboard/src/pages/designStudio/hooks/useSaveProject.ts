import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function useSaveProject({ id }: { id: string | undefined }) {
  return useMutation({
    mutationFn: saveProject,
    mutationKey: ['saveProject', id],
  });
}

const saveProject = ({
  id,
  canvas,
  preview,
}: {
  id: string;
  canvas?: string;
  preview?: string;
}) => {
  return api.put({
    url: `/projects/design/${id}`,
    data: { canvas, preview },
  });
};
