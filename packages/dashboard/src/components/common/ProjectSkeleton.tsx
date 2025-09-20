const ProjectCardSkeleton = () => {
  return (
    <div className="relative  border border-zinc-700 rounded-2xl shadow-sm bg-dark-primary overflow-hidden animate-pulse">
      {/* Base skeleton structure */}
      <div className="relative ">
        {/* Image placeholder */}
        <div className="w-full h-48 bg-dark-secondary  shimmer-wrapper">
          <div className="absolute inset-0 shimmer" />
        </div>

        <div className="p-4 space-y-4">
          {/* Title placeholder */}
          <div className="h-6 bg-dark-secondary rounded-lg shimmer-wrapper">
            <div className="absolute inset-0 shimmer" />
          </div>

          {/* Date placeholder */}
          <div className="h-4 bg-dark-secondary rounded-lg shimmer-wrapper w-1/3">
            <div className="absolute inset-0 shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCardSkeleton;
