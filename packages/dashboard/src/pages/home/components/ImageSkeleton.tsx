const ImageSkeleton = () => {
  return (
    <div className="relative  border border-zinc-700 rounded-2xl shadow-sm bg-dark-primary overflow-hidden animate-pulse">
      {/* Base skeleton structure */}
      <div className="relative ">
        {/* Image placeholder */}
        <div className="w-full h-40 bg-dark-secondary  shimmer-wrapper">
          <div className="absolute inset-0 shimmer" />
        </div>
      </div>
    </div>
  );
};

export default ImageSkeleton;
