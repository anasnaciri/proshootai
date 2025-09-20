import useGenerations from '../../../hooks/useGenerations';
import GenerationImage from './GenerationImage';
import { useParams } from 'react-router';

type Generation = {};
const GenerationsGrid = () => {
  const { id: projectId } = useParams<{ id: string }>();

  console.log(useParams());
  console.log(projectId);
  const { isPending, isError, data, error } = useGenerations(
    projectId as string,
  );

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error?.message}</span>;
  }

  if (data?.result?.length === 0 || !data?.result) {
    return (
      <span className="text-gray-600">
        Looking a bit empty here! Add some images to get started. 🖼️
      </span>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2  ">
      {data?.result?.map((generation: Generation, index: number) => (
        <GenerationImage generation={generation} key={index} />
      ))}
    </div>
  );
};

export default GenerationsGrid;
