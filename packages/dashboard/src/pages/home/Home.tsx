import RecentProjects from '@/components/common/RecentProjects';
import NewProjectMenu from './components/NewProjectMenu';
//import ImagesGrid from './components/ImagesGrid';
import { Clock, Plus, Image } from 'lucide-react';
import H1 from '@/components/common/Typography/H1';
const Home = () => {
  return (
    <div className="w-full h-full flex flex-col p-10 gap-8 bg-dark-primary text-white overflow-scroll">
      <section>
        <div className="flex gap-2 items-center mb-2">
          <Plus />
          <H1 content="Start new"></H1>
        </div>
        <NewProjectMenu />
      </section>

      <section>
        <div className="flex gap-2 items-center mb-6">
          <Clock />
          <H1 content="Recent"></H1>
        </div>
        <RecentProjects />
      </section>

      {/* <section>
        <div className="flex gap-2 items-center mb-6">
          <Image />

          <H1 content="Images"></H1>
        </div>
        <ImagesGrid />
      </section> */}
    </div>
  );
};

export default Home;
