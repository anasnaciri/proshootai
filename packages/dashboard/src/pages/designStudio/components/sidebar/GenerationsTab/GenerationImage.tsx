import { useCanvasContext } from '@/pages/designStudio/context/CanvasContext';
import { addImage } from '../../../lib/canvas';

const GenerationImage = ({ generation }: { generation: any }) => {
  const { fabricRef } = useCanvasContext();
  const BUCKET = import.meta.env.VITE_BUCKET;
  const REGION = import.meta.env.VITE_AWS_REGION;
  const imageURL = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${generation?.image}`;
  return (
    <div
      className={`w-full rounded-lg overflow-hidden border border-zinc-500 hover:border-primary-600`}
    >
      <button
        className="relative w-full h-full pt-[100%]"
        onClick={() => {
          addImage({
            canvas: fabricRef,
            url: imageURL,
            keepDetails: true,
          });
        }}
      >
        <img
          src={imageURL}
          alt={`${generation.name}`}
          className="absolute inset-0 w-full h-full object-cover"
          draggable="false"
        />
      </button>
    </div>
  );
};

export default GenerationImage;
