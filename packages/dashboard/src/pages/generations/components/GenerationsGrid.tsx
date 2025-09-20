import useGenerations from '@/hooks/useGenerations';
import GenerationImage from './GenerationImage';

type Generation = {};
const GenerationsGrid = () => {
  const { isPending, isError, data, error } = useGenerations();

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error?.message}</span>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2  ">
      {data?.result?.map((generation: Generation, index: number) => (
        <GenerationImage generation={generation} key={index} />
      ))}
    </div>
  );
};

export default GenerationsGrid;
