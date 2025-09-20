import { useCanvasContext } from '../../context/CanvasContext';
import { addImage } from '../../lib/canvas';

const PropsTab = () => {
  const images = [
    'https://png.pngtree.com/png-vector/20240905/ourmid/pngtree-flower-vase-png-image_13759950.png',
    'https://images.unsplash.com/photo-1651302974008-fb6112faf32c?q=80&w=3388&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://flair.ai/cdn-cgi/imagedelivery/i1XPW6iC_chU01_6tBPo8Q/4409ed74-750c-48b8-1dfa-80ddb2d0d600/public',
    'https://flair.ai/cdn-cgi/imagedelivery/i1XPW6iC_chU01_6tBPo8Q/bdd09388-9cba-46da-d174-e14ba6c15900/128',
    'https://flair.ai/cdn-cgi/imagedelivery/i1XPW6iC_chU01_6tBPo8Q/2013338d-d32f-4e53-eda5-30c3a68a0e00/128',
    'https://flair.ai/cdn-cgi/imagedelivery/i1XPW6iC_chU01_6tBPo8Q/699c0c63-2bc4-4942-b2a7-be21a243da00/128',
    'https://proshootai-anasnaciri-uploads-bcoxxbcm.s3.eu-west-2.amazonaws.com//9602d234-60c1-70b2-23b6-1c820528bc93/image.webp',
  ];

  const { fabricRef } = useCanvasContext();

  return (
    <div className="flex flex-col p-3 gap-2 h-100 overflow-scroll flex-1">
      <h2>Elements</h2>
      <h3>My Elements</h3>
      <div className="grid grid-cols-4 gap-1 ">
        {images.map((product: string, index: number) => (
          <button
            key={index}
            className="relative w-full pt-[100%] rounded-lg overflow-hidden border border-zinc-500 hover:border-primary-600"
            onClick={() =>
              addImage({ canvas: fabricRef, url: product, keepDetails: false })
            }
          >
            <img
              src={product}
              alt={`${product}`}
              className="absolute inset-0 w-full h-full object-cover"
              draggable="false"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default PropsTab;
