import useUpdateProduct from '@/pages/designStudio/hooks/useUpdateProduct';
import { useUploadContext } from '../../../context/UploadsContext';
import useUploadProduct from '../../../hooks/useUploadProduct';
import { TriangleAlert } from 'lucide-react';
import useDeleteProduct from '@/pages/designStudio/hooks/useDeleteProduct';

const UploadDialog = () => {
  const {
    isDialogOpen,
    setDialogOpen,
    previewUrl,
    setSelectedImage,
    selectedImage,
    productName,
    setProductName,
    action,
    id,
  } = useUploadContext();

  const uploadProduct = useUploadProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const handleClose = () => {
    setDialogOpen(false);
    setSelectedImage(null);
    setProductName('');
  };

  const handleAction = () => {
    if (action === 'add') {
      uploadProduct.mutate({
        image: selectedImage as File,
        productName,
      });
    } else if (action === 'edit') {
      updateProduct.mutate({
        productName,
        id,
      });
    } else if (action === 'delete') {
      deleteProduct.mutate({ id });
    }
    setProductName('');
    setDialogOpen(false);
  };

  return (
    <div
      className={`${isDialogOpen ? 'fixed' : 'hidden'} w-screen h-screen flex items-center justify-center bg-black/35 backdrop-blur-sm z-50 text-white`}
    >
      <div className=" md:w-1/2 flex flex-col gap-3 rounded-xl bg-zinc-800 p-4 border border-zinc-500">
        <div className="h-96 w-full flex items-center justify-center border border-zinc-500/50">
          <img
            src={previewUrl}
            draggable="false"
            className="h-96 object-contain"
            alt="preview"
          />
        </div>
        {action === 'delete' ? (
          <div className="flex gap-2 text-red-500 items-center">
            <TriangleAlert className="" />

            <p>Do you want to permanetly delete this image?</p>
          </div>
        ) : (
          <div>
            <label htmlFor="productNameInput">Product name:</label>
            <input
              type="text"
              id="productNameInput"
              placeholder="name your product"
              className="bg-transparent focus: outline-none border border-zinc-500 p-2 w-full rounded-lg mb-4"
              onChange={(e) => setProductName(e.target.value)}
              value={productName}
            />
          </div>
        )}
        <div className="flex w-full gap-2 justify-end ">
          <button onClick={handleAction}>{action}</button>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 bg-red-500 border border-red-200 "
          >
            close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadDialog;
