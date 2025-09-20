import { useState } from 'react';
import { Product } from '@/pages/designStudio/types';
import { useCanvasContext } from '../../../context/CanvasContext';
import { addImage } from '../../../lib/canvas';
import { Edit, Trash2 } from 'lucide-react';
import { useUploadContext } from '@/pages/designStudio/context/UploadsContext';
import splitId from '@/utils/formatting/splitId';

const ProductImage = ({ product }: { product: Product }) => {
  const { fabricRef } = useCanvasContext();
  const { setDialogOpen, setPreviewUrl, setAction, setProductName, setId } =
    useUploadContext();
  const [showMore, setShowMore] = useState(false);

  const BUCKET = import.meta.env.VITE_BUCKET;
  const REGION = import.meta.env.VITE_AWS_REGION;
  const imageURL = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${product?.image}`;

  const handleEdit = () => {
    setProductName(product.name);
    setId(splitId(product.SK));
    setAction('edit');
    setDialogOpen(true);
    setPreviewUrl(imageURL);
  };

  const handleDelete = () => {
    setId(splitId(product.SK));
    setAction('delete');
    setDialogOpen(true);
    setPreviewUrl(imageURL);
  };

  return (
    <div
      className={`relative w-full rounded-lg overflow-hidden border border-zinc-500 hover:border-primary-600 ${product.isUploading || product.isUpdating ? 'animate-pulse' : ''}`}
      onMouseEnter={() => setShowMore(true)}
      onMouseLeave={() => {
        setShowMore(false);
      }}
    >
      <button
        className="relative w-full h-full pt-[100%]"
        onClick={() => {
          addImage({
            canvas: fabricRef,
            url: !product.isUploading ? imageURL : (product.image as string),
            keepDetails: true,
          });
        }}
      >
        <img
          src={!product.isUploading ? imageURL : (product.image as string)}
          alt={`${product.name}`}
          className="absolute inset-0 w-full h-full object-cover"
          draggable="false"
        />
      </button>
      <div
        className={`${showMore ? 'opacity-100' : 'opacity-0'} absolute bottom-0 left-0 right-0 h-6 bg-zinc-600/65 backdrop-blur-sm  p-1 transition-all duration-300`}
      >
        <div className="w-full flex justify-end items-center gap-2 ">
          <button className="hover:text-primary-300" onClick={handleEdit}>
            <Edit size={16} />
          </button>
          <button className="hover:text-red-600" onClick={handleDelete}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductImage;
