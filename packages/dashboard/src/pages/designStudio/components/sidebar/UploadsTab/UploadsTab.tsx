import React, { useRef, ChangeEvent } from 'react';
import { ArrowUpToLine } from 'lucide-react';
import ProductsGrid from './ProductsGrid';
import { useUploadContext } from '../../../context/UploadsContext';
import { useMutationState } from '@tanstack/react-query';

const UploadsTab: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { handleFile, error } = useUploadContext();

  const handleImageSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    handleFile(file);
    event.target.value = '';
  };

  const handleUploadClick = (): void => {
    fileInputRef.current?.click();
  };

  const mutationState = useMutationState({
    filters: { mutationKey: ['addProduct'], status: 'pending' },
  });

  const isAnyMutationPending = mutationState.length > 0;

  return (
    <div className="flex flex-col p-3 gap-2 h-100 overflow-scroll flex-1">
      <h1>Add Products</h1>
      <h2>Products</h2>

      <input
        type="file"
        ref={fileInputRef}
        id="imageInput"
        onChange={handleImageSelect}
        accept="image/*"
        className="hidden"
      />

      <button
        onClick={handleUploadClick}
        disabled={isAnyMutationPending}
        className={`p-2 flex items-center justify-center gap-1 text-sm rounded-lg mb-4 border border-primary-600 hover:border-primary-700 hover:text-primary-50 hover:shadow-soft-accent  disabled:cursor-not-allowed ${isAnyMutationPending ? 'animate-pulse' : ''}`}
        type="button"
      >
        <ArrowUpToLine size={14} />
        <p>{isAnyMutationPending ? 'Uploading...' : 'Upload product image'}</p>
      </button>

      {error && (
        <div className="p-4 mb-4 text-sm text-red-800 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      <ProductsGrid />
    </div>
  );
};

export default UploadsTab;
