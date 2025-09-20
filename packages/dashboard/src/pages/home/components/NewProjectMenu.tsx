import useAddDesignProject from '@/hooks/useAddDesignProject';
import { Shapes, Shirt, Video, Youtube } from 'lucide-react';

const NewProjectMenu = () => {
  const addDesignProjectMutation = useAddDesignProject();
  const createDesignProject = () => {
    addDesignProjectMutation.mutate();
  };
  return (
    <div className="w-full p-5 flex gap-20 justify-center items-start bg-dark-secondary flex-wrap my-4 rounded-2xl">
      <button
        className="flex flex-col justify-center items-center text-center gap-1 rounded-full "
        onClick={createDesignProject}
        disabled={addDesignProjectMutation.isPending}
      >
        <div className="bg-dark-primary p-3 rounded-full ">
          <Shapes />
        </div>
        <p className="text-sm ">Design Studio</p>
      </button>

      <button className="flex flex-col justify-center items-center text-center gap-1 rounded-full opacity-50 cursor-not-allowed">
        <div className="bg-dark-primary p-3 rounded-full ">
          <Shirt />
        </div>
        <p className="text-sm">fashion Studio</p>
        <p className="text-xs text-zinc-400">coming soon</p>
      </button>

      <button className="flex flex-col justify-center items-center text-center gap-1 rounded-full opacity-50 cursor-not-allowed">
        <div className="bg-dark-primary p-3 rounded-full ">
          <Video />
        </div>
        <p className="text-sm">Video project</p>
        <p className="text-xs text-zinc-400">coming soon</p>
      </button>

      <button className="flex flex-col justify-center items-center text-center gap-1 rounded-full opacity-50 cursor-not-allowed">
        <div className="bg-dark-primary p-3 rounded-full ">
          <Youtube />
        </div>
        <p className="text-sm">Youtube Thumbnail</p>
        <p className="text-xs text-zinc-400">coming soon</p>
      </button>
    </div>
  );
};

export default NewProjectMenu;
