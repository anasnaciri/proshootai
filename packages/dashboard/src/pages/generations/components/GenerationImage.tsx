const GenerationImage = ({ generation }: { generation: any }) => {
  const BUCKET = import.meta.env.VITE_BUCKET;
  const REGION = import.meta.env.VITE_AWS_REGION;
  const imageURL = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${generation?.image}`;

  return (
    <div
      className={`w-full rounded-lg overflow-hidden border border-zinc-500 hover:border-primary-600`}
    >
      <div className="relative w-full h-full pt-[100%]">
        <img
          src={imageURL}
          alt={`${generation.name}`}
          className="absolute inset-0 w-full h-full object-cover"
          draggable="false"
        />
      </div>
    </div>
  );
};

export default GenerationImage;
