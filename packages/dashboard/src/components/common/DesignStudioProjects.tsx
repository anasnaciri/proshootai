import ProjectCard from './ProjectCard';
import ProjectCardSkeleton from './ProjectSkeleton';
import useDesignProjects from '@/hooks/useDesignProjects';

const RecentProjects = () => {
  const { isPending, isError, data } = useDesignProjects();
  const placeHolderitems = [1, 2, 3, 4];
  if (isPending) {
    return (
      <div className="grid md:grid-cols-4 gap-4 ">
        {placeHolderitems.map((_item, index) => (
          <ProjectCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="grid md:grid-cols-4 gap-4 ">
        {placeHolderitems.map((_item, index) => (
          <ProjectCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-4 gap-4 ">
      {data.result.map((project: Project) => (
        <ProjectCard key={project.SK} project={project} />
      ))}
    </div>
  );
};

export default RecentProjects;
