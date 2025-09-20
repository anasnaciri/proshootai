import { Canvas, FabricObject } from 'fabric';
import React from 'react';

declare module 'fabric' {
  interface FabricImage {
    keepDetails?: boolean;
    id?: string;
    // Add any other custom properties you need
  }
}

export interface CanvasState {
  canvas: Canvas | null | undefined;
  dimensions: {
    width: number;
    height: number;
  };
}

export interface CanvasProps {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
}

export interface addImageProps {
  canvas: React.MutableRefObject<Canvas | null>;
  url: string;
  keepDetails: boolean;
}

export interface sidebarTab {
  tab: string;
}

export interface CanvasContextType {
  fabricRef: React.MutableRefObject<Canvas | null>;
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  contextMenu: {
    visible: boolean;
    x: number;
    y: number;
  };
  setContextMenu: React.Dispatch<
    React.SetStateAction<{ visible: boolean; x: number; y: number }>
  >;
  clonedObject: FabricObject | null;
  setClonedObject: React.Dispatch<React.SetStateAction<FabricObject | null>>;
  isInputFocused: boolean;
  setIsInputFocused: React.Dispatch<React.SetStateAction<boolean>>;
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  rectRef: RefObject<FabricObject<
    Partial<FabricObjectProps>,
    SerializedObjectProps,
    ObjectEvents
  > | null>;
}

export interface UploadContextType {
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
  selectedImage: File | null;
  setSelectedImage: React.Dispatch<React.SetStateAction<File | null>>;
  previewUrl: string;
  setPreviewUrl: React.Dispatch<React.SetStateAction<string>>;
  productName: string;
  setProductName: React.Dispatch<React.SetStateAction<string>>;
  isDialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  error: string;
  handleFile: (file: File | undefined) => void;
  action: 'add' | 'edit' | 'delete' | null;
  setAction: React.Dispatch<
    React.SetStateAction<'add' | 'edit' | 'delete' | null>
  >;
  id: string;
  setId: React.Dispatch<React.SetStateAction<string>>;
}

export interface Product {
  PK: string;
  SK: string;
  name: string;
  image: File | string;
  isUploading?: boolean;
  isUpdating?: boolean;
}

export interface Image {
  id: string;
  dirty: boolean;
  left: number;
  top: number;
  scaleX: number;
  scaleY: number;
  angle: number;
  flipX: boolean;
  flipY: boolean;
  opacity: number;
  src: string;
  keepDetails: boolean;
}
