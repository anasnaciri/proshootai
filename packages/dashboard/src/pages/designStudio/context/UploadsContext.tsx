import { createContext, PropsWithChildren, useContext, useState } from 'react';

import { UploadContextType } from '../types';

const UploadContext = createContext<UploadContextType | null>(null);

export const UploadProvider = ({ children }: PropsWithChildren) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [productName, setProductName] = useState('');
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [action, setAction] = useState<'add' | 'edit' | 'delete' | null>(null);
  const [id, setId] = useState<string>('');


  const validateFile = (file: File | undefined): boolean => {
    if (!file) return false;

    if (file.size > 25 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      return false;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return false;
    }

    return true;
  };

  const handleFile = (file: File | undefined) => {
    setAction('add');
    if (validateFile(file)) {
      setSelectedImage(file as File);
      setPreviewUrl(URL.createObjectURL(file as File));
      setError('');
      setDialogOpen(true);
    }
  };

  return (
    <UploadContext.Provider
      value={{
        isDragging,
        setIsDragging,
        selectedImage,
        setSelectedImage,
        previewUrl,
        setPreviewUrl,
        productName,
        setProductName,
        isDialogOpen,
        setDialogOpen,
        error,
        handleFile,
        action,
        setAction,
        id,
        setId,
      }}
    >
      {children}
    </UploadContext.Provider>
  );
};

export const useUploadContext = () => {
  const context = useContext(UploadContext);

  if (!context) {
    throw new Error('useUploadContext must be used within a UploadProvider');
  }

  return context;
};
