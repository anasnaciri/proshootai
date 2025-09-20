import DesignStudioProjects from '@/components/common/DesignStudioProjects';
import RecentProjects from '@/components/common/RecentProjects';
import { Clock, Shapes } from 'lucide-react';
//import { Clock, Image, Shapes, Shirt, Video, Youtube } from 'lucide-react';
//import ImagesGrid from '../home/components/ImagesGrid';

const Projects = () => {
  return (
    <div className="w-full h-full flex flex-col p-10 gap-8 bg-dark-primary text-white overflow-scroll">
      <div>Projects</div>
      <section>
        <div className="flex gap-2 items-center mb-6">
          <Clock />
          <h1 className="text-xl font-semibold">Recent</h1>
        </div>
        <RecentProjects />
      </section>
      <section>
        <div className="flex gap-2 items-center mb-6">
          <Shapes />
          <h1 className="text-xl font-semibold">Design Studio</h1>
        </div>
        <DesignStudioProjects />
      </section>

      {/* <section>
        <div className="flex gap-2 items-center mb-6">
          <Shirt />
          <h1 className="text-xl font-semibold">Fashion Studio</h1>
        </div>
        <RecentProjects />
      </section>

      <section>
        <div className="flex gap-2 items-center mb-6">
          <Video />
          <h1 className="text-xl font-semibold">Video Studio</h1>
        </div>
        <RecentProjects />
      </section>

      <section>
        <div className="flex gap-2 items-center mb-6">
          <Youtube />
          <h1 className="text-xl font-semibold">Youtube Thmbnail</h1>
        </div>
        <RecentProjects />
      </section>

      <section>
        <div className="flex gap-2 items-center mb-6">
          <Image />

          <h1 className="text-xl font-semibold">Images</h1>
        </div>
        <ImagesGrid />
      </section> */}
    </div>
  );
};

//<div>images : click to edit (upscale, removebg, erase object etc..)</div>

export default Projects;
