import ImageSkeleton from './ImageSkeleton';

const ImagesGrid = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-col-3 md:grid-cols-4 lg:grid-cols-6 gap-4 ">
      <ImageSkeleton />
      <ImageSkeleton />
      <ImageSkeleton />
      <ImageSkeleton />
    </div>
  );
};

export default ImagesGrid;
