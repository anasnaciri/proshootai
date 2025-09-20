import H1 from '@/components/common/Typography/H1';
import GenerationsGrid from './GenerationsGrid';

const GenerationsTab = () => {
  return (
    <div className="flex flex-col p-3 gap-2 h-100 overflow-scroll flex-1 w-full">
      <H1 content="Generations"></H1>

      <GenerationsGrid />
    </div>
  );
};

export default GenerationsTab;
