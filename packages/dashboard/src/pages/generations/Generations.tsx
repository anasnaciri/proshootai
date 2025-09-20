import GenerationsGrid from './components/GenerationsGrid';

const Generations = () => {
  return (
    <div className="w-full h-full flex flex-col p-10 gap-8 bg-dark-primary text-white overflow-scroll">
      <GenerationsGrid />
    </div>
  );
};

export default Generations;
