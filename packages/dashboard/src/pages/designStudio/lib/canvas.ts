import {
  Canvas,
  Rect,
  FabricImage,
  TPointerEventInfo,
  Point,
  ActiveSelection,
  FabricObject,
  FabricObjectProps,
  SerializedObjectProps,
  ObjectEvents,
  filters,
} from 'fabric';
import { RefObject } from 'react';
import { addImageProps, CanvasContextType, Image } from '../types';
import { ulid } from 'ulid';
import { colors } from '@/config/constants';

export const initializeCanvas = ({
  fabricRef,
  canvasRef,
  rectRef,
}: {
  fabricRef: RefObject<Canvas | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  rectRef: RefObject<FabricObject | null>;
}) => {
  const canvasElement = document.getElementById('canvasWrapper');
  console.log({ canvasElement });
  console.log({
    width: canvasElement?.clientWidth,
    height: canvasElement?.clientHeight,
  });

  const canvas = new Canvas(canvasRef.current as HTMLCanvasElement, {
    width: canvasElement?.clientWidth,
    height: canvasElement?.clientHeight,
    preserveObjectStacking: true,
    stopContextMenu: true,
    fireMiddleClick: true,
    fireRightClick: true,
    selectionColor: colors.primary[100] + '44',
    selectionBorderColor: colors.primary[300],
  });

  const rect = new Rect({
    originX: 'center',
    originY: 'center',
    fill: '#ffffff00',
    stroke: colors.primary[300],
    strokeWidth: 4,
    width: 1024,
    height: 1024,
    absolutePositioned: true,
    strokeUniform: true,
    selectable: false,
    hasControls: false,
    evented: false,

    //excludeFromExport: true,
  });

  rectRef.current = rect;

  canvas.add(rect);
  canvas.viewportCenterObject(rect);

  canvas.setZoom(0.3);
  canvas.backgroundColor = '#898989';
  keepRectOnTop(canvas);
  canvas.renderAll();

  fabricRef.current = canvas;

  return canvas;
};

export const loadContent = ({
  projectData,
  canvas,
}: {
  projectData: any;
  canvas: Canvas | null;
}) => {
  if (!canvas) return;
  if (!projectData) return;
  const loadPromises = projectData?.map((imgObj: Image) => {
    console.log({ imgObj: imgObj.keepDetails });
    return new Promise<void>((resolve, reject) => {
      FabricImage.fromURL(imgObj.src, {
        crossOrigin: 'anonymous',
      })
        .then((img: FabricImage) => {
          img.set({
            dirty: true,
            left: imgObj.left,
            top: imgObj.top,
            scaleX: imgObj.scaleX,
            scaleY: imgObj.scaleY,
            angle: imgObj.angle,
            flipX: imgObj.flipX,
            flipY: imgObj.flipY,
            opacity: imgObj.opacity,
            crossOrigin: 'anonymous',
            keepDetails: imgObj.keepDetails,
            borderColor: colors.primary[200],
            cornerStyle: 'circle',
            cornerStrokeColor: colors.primary[200],
          });

          canvas.add(img);
          resolve();
        })
        .catch(reject);
    });
  });

  // Wait for all images to load
  Promise.all(loadPromises);
  keepRectOnTop(canvas);
  canvas.renderAll();
};

export const handleResize = ({ canvas }: { canvas: Canvas | null }) => {
  const canvasElement = document.getElementById('canvasWrapper');
  if (!canvasElement) return;
  if (!canvas) return;
  canvas.setDimensions({
    width: canvasElement.clientWidth,
    height: canvasElement.clientHeight,
  });
};

export const addImage = async ({ canvas, url, keepDetails }: addImageProps) => {
  if (canvas.current) {
    try {
      try {
        new URL(url);
      } catch (e) {
        console.error('Invalid URL format:', e);
        return;
      }
      const preCheck = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
      });
      console.log('Image fetch response:', {
        status: preCheck.status,
        headers: Object.fromEntries(preCheck.headers),
        url,
      });

      const img = await FabricImage.fromURL(url, {
        crossOrigin: 'anonymous',
      });
      const width = img.get('width');

      img.set({
        dirty: true,
        scaleX: 512 / width,
        scaleY: 512 / width,
        left: 80 * Math.random() * Math.random() * 35,
        top: 80 * Math.random() * Math.random() * 35,
        id: ulid(),
        keepDetails: keepDetails,
        borderColor: colors.primary[200],
        cornerStyle: 'circle',
        cornerStrokeColor: colors.primary[200],
      });

      canvas.current?.add(img);
      keepRectOnTop(canvas.current);
    } catch (err) {
      console.error(err);
    }
  }
};

// export const addImage = ({ canvas, url, keepDetails }: addImageProps) => {
//   if (canvas.current) {
//     return new Promise((resolve, reject) => {
//       FabricImage.fromURL(
//         url,
//         function (img) {
//           if (!img.width || !img.height) {
//             reject(new Error('Failed to load image'));
//             return;
//           }

//           const width = img.get('width');

//           img.set({
//             dirty: true,
//             scaleX: 512 / width,
//             scaleY: 512 / width,
//             left: 80 * Math.random() * Math.random() * 35,
//             top: 80 * Math.random() * Math.random() * 35,
//             id: ulid(),
//             keepDetails: keepDetails,
//             borderColor: colors.primary[200],
//             cornerStyle: 'circle',
//             cornerStrokeColor: colors.primary[200],
//           });

//           canvas.current?.add(img);
//           keepRectOnTop(canvas.current);
//           resolve(img);
//         },
//         {
//           crossOrigin: 'anonymous',
//           // Add error handling for image loading
//           onerror: (err) => {
//             console.error('Error loading image:', err);
//             reject(err);
//           },
//         },
//       );
//     });
//   }
//   return Promise.reject(new Error('Canvas not initialized'));
// };

export const deleteHandler = function ({ canvas }: { canvas: Canvas | null }) {
  if (canvas?.getActiveObjects()) {
    const activeObjects = canvas.getActiveObjects();
    activeObjects.forEach((obj) => {
      canvas.remove(obj);
    });
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  }
};

export const handleClick = async ({
  opt,
  canvas,
  setContextMenu,
}: {
  opt: TPointerEventInfo<MouseEvent>;
  canvas: Canvas | null;
  setContextMenu: CanvasContextType['setContextMenu'];
}) => {
  if (!canvas) return;
  if (opt.e.button === 2) {
    opt.e.preventDefault();
    if (opt.target && canvas) {
      // If clicked on an object, select it
      canvas.setActiveObject(opt.target);
      canvas.requestRenderAll();
    } else {
      // If clicked on empty canvas, clear selection
      canvas?.discardActiveObject();
      canvas?.requestRenderAll();
    }
    setContextMenu({ visible: true, x: opt.e.pageX, y: opt.e.pageY });
  } else {
    setContextMenu((prev) => {
      return { ...prev, visible: false };
    });

    const target = opt.target;

    if (opt.e.altKey && target) {
      opt.e.preventDefault();
      const clonedObj = await target.clone();

      canvas.discardActiveObject();
      clonedObj.set({
        left: target.left,
        top: target.top,
        evented: true,
        borderColor: colors.primary[200],
        cornerStyle: 'circle',
        cornerStrokeColor: colors.primary[200],
        keepDetails: (target as FabricImage).keepDetails,
      });

      canvas.add(clonedObj);
      canvas.setActiveObject(clonedObj);
      canvas._setupCurrentTransform(opt.e, clonedObj, true);
    }
  }
};

const keepRectOnTop = (canvas: Canvas) => {
  const objects = canvas.getObjects();
  const outlineRect = objects.find(
    (obj) => obj instanceof Rect && obj.excludeFromExport,
  );
  if (outlineRect) {
    canvas.bringObjectToFront(outlineRect);
  }
};

export const handleCopy = async ({
  canvas,
  setClonedObject,
}: {
  canvas: Canvas | null;
  setClonedObject: React.Dispatch<React.SetStateAction<FabricObject | null>>;
}) => {
  const object = await canvas?.getActiveObject()?.clone();

  if (object) {
    setClonedObject(object);
  } else {
    setClonedObject(null);
  }
};

export const handlePaste = async ({
  canvas,
  clonedObject,
}: {
  canvas: Canvas | null;
  clonedObject: FabricObject | null;
}) => {
  if (!clonedObject) return;

  // Clone the object
  const clonedObj = await clonedObject.clone();
  canvas?.discardActiveObject();

  if (clonedObj instanceof ActiveSelection) {
    // Handle ActiveSelection
    clonedObj.canvas = canvas as Canvas;
    clonedObj.set({
      left: (clonedObj.left || 0) + 40,
      top: (clonedObj.top || 0) + 40,
      evented: true,
      borderColor: colors.primary[200],
      cornerStyle: 'circle',
      cornerStrokeColor: colors.primary[200],
    });

    clonedObj.forEachObject((obj) => {
      canvas?.add(obj);
    });
    clonedObj.setCoords();
  } else {
    // Handle single object
    clonedObj.set({
      left: (clonedObj.left || 0) + 40,
      top: (clonedObj.top || 0) + 40,
      evented: true,
      borderColor: colors.primary[200],
      cornerStyle: 'circle',
      cornerStrokeColor: colors.primary[200],
    });
    canvas?.add(clonedObj);
  }

  keepRectOnTop(canvas as Canvas);
  canvas?.setActiveObject(clonedObj);
  canvas?.requestRenderAll();
};

export const handleBringForward = ({ canvas }: { canvas: Canvas | null }) => {
  if (!canvas) return;

  const selectedObjects = canvas.getActiveObjects();
  if (!selectedObjects.length) return;

  if (selectedObjects.length > 1) {
    const sortedObjects = [...selectedObjects].sort((a, b) => {
      return canvas.getObjects().indexOf(b) - canvas.getObjects().indexOf(a);
    });

    canvas.discardActiveObject();

    sortedObjects.forEach((obj) => {
      canvas.bringObjectForward(obj);
    });

    // Reselect the objects
    const selection = new ActiveSelection(sortedObjects, {
      canvas: canvas,
    });
    canvas.setActiveObject(selection);
  } else {
    // For single object
    canvas.bringObjectForward(selectedObjects[0]);
  }

  keepRectOnTop(canvas);
  canvas.requestRenderAll();
};

export const handleSendBackward = ({ canvas }: { canvas: Canvas | null }) => {
  if (!canvas) return;

  const selectedObjects = canvas.getActiveObjects();
  if (!selectedObjects.length) return;

  if (selectedObjects.length > 1) {
    const sortedObjects = [...selectedObjects].sort((a, b) => {
      return canvas.getObjects().indexOf(a) - canvas.getObjects().indexOf(b);
    });

    canvas.discardActiveObject();

    sortedObjects.forEach((obj) => {
      canvas.sendObjectBackwards(obj);
    });

    const selection = new ActiveSelection(sortedObjects, {
      canvas: canvas,
    });
    canvas.setActiveObject(selection);
  } else {
    canvas.sendObjectBackwards(selectedObjects[0]);
  }

  canvas.requestRenderAll();
};

export const handleBringToFront = ({ canvas }: { canvas: Canvas | null }) => {
  if (!canvas) return;

  const selectedObjects = canvas.getActiveObjects();
  if (!selectedObjects.length) return;

  if (selectedObjects.length > 1) {
    const sortedObjects = [...selectedObjects].sort((a, b) => {
      return canvas.getObjects().indexOf(b) - canvas.getObjects().indexOf(a);
    });

    canvas.discardActiveObject();

    // sortedObjects.forEach((obj) => {
    //   canvas.bringObjectToFront(obj);
    // });

    selectedObjects.forEach((obj) => {
      canvas.bringObjectToFront(obj);
    });

    const selection = new ActiveSelection(sortedObjects, {
      canvas: canvas,
    });
    canvas.setActiveObject(selection);
  } else {
    canvas.bringObjectToFront(selectedObjects[0]);
  }

  keepRectOnTop(canvas);
  canvas.requestRenderAll();
};

export const handleSendToBack = ({ canvas }: { canvas: Canvas | null }) => {
  if (!canvas) return;

  const selectedObjects = canvas.getActiveObjects();
  if (!selectedObjects.length) return;

  if (selectedObjects.length > 1) {
    const sortedObjects = [...selectedObjects].sort((a, b) => {
      return canvas.getObjects().indexOf(b) - canvas.getObjects().indexOf(a);
    });

    canvas.discardActiveObject();

    selectedObjects.forEach((obj) => {
      canvas.sendObjectToBack(obj);
    });

    const selection = new ActiveSelection(sortedObjects, {
      canvas: canvas,
    });
    canvas.setActiveObject(selection);
  } else {
    canvas.sendObjectToBack(selectedObjects[0]);
  }

  keepRectOnTop(canvas);
  canvas.requestRenderAll();
};

export const handleCanvasZoom = ({
  options,
  canvas,
}: {
  options: TPointerEventInfo<WheelEvent>;
  canvas: Canvas;
}) => {
  const delta = options.e.deltaY;
  let zoom = canvas.getZoom();

  zoom *= 0.996 ** delta;
  zoom = Math.min(Math.max(zoom, 0.1), 2);

  canvas.zoomToPoint(
    { x: options.e.offsetX, y: options.e.offsetY } as Point,
    zoom,
  );

  options.e.preventDefault();
  options.e.stopPropagation();
};

export const exportImage = async ({
  fabricRef,
  rectRef,
}: {
  fabricRef: RefObject<Canvas | null>;
  rectRef: RefObject<FabricObject<
    Partial<FabricObjectProps>,
    SerializedObjectProps,
    ObjectEvents
  > | null>;
}): Promise<{ url: string; maskUrl: string } | undefined> => {
  const canvas = fabricRef.current;
  const rect = rectRef.current;

  if (!canvas || !rect) return;

  // Store original properties
  const originalStrokeWidth = rect.strokeWidth;
  const originalBgColor = canvas.backgroundColor;

  // Calculate the actual coordinates in canvas space
  const zoom = canvas.getZoom();
  const vpt = canvas.viewportTransform;

  if (!vpt) return;

  // Get actual position considering viewport transform
  const point = rect.getPointByOrigin('left', 'top');
  const transformedPoint = point.transform(vpt);

  const width = rect.getScaledWidth() - 4;
  const height = rect.getScaledHeight() - 4;

  // Hide rectangle stroke for export
  rect.set({ strokeWidth: 0 });
  canvas.renderAll();

  // Export original image
  const url = canvas.toDataURL({
    format: 'png',
    left: transformedPoint.x,
    top: transformedPoint.y,
    width: width * zoom,
    height: height * zoom,
    multiplier: 1 / zoom, // Maintain original resolution
  });

  // Create mask version
  canvas.set({ backgroundColor: 'black' });

  // Apply brightness filter to all images
  const images = canvas
    .getObjects()
    .filter((obj): obj is FabricImage => obj instanceof FabricImage);

  images.forEach((obj) => {
    const filter = new filters.Brightness({
      brightness: obj.keepDetails ? 1 : -1,
    });
    obj.filters.push(filter);
    obj.applyFilters();
  });

  canvas.renderAll();

  // Export mask version
  const maskUrl = canvas.toDataURL({
    format: 'png',
    left: transformedPoint.x,
    top: transformedPoint.y,
    width: width * zoom,
    height: height * zoom,
    multiplier: 1 / zoom,
  });

  // Restore original state
  images.forEach((obj) => {
    obj.filters = [];
    obj.applyFilters();
  });

  rect.set({ strokeWidth: originalStrokeWidth });
  canvas.set({ backgroundColor: originalBgColor });
  canvas.renderAll();

  //console.log(url, maskUrl);

  return { url, maskUrl };
};
