import {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
  useRef,
  useEffect,
} from 'react';
import {
  Canvas,
  FabricObject,
  TPointerEventInfo,
  Point,
  FabricImage,
} from 'fabric';
import { CanvasContextType } from '../types';
import {
  //handleCanvasZoom,
  handleClick,
  handleResize,
  initializeCanvas,
  loadContent,
} from '../lib/canvas';
import { debounce } from '@/utils/debounce';
import { useParams } from 'react-router';
import useSaveProject from '../hooks/useSaveProject';
import useProject from '../hooks/useProject';
import LoadingScreen from '../components/LoadingScreen';

// Constants
const SAVE_INTERVAL = 600 * 1000;
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

interface SaveState {
  saving: boolean;
  lastSaved: Date | null;
  error: Error | null;
  retryCount: number;
}

const CanvasContext = createContext<CanvasContextType | null>(null);

export const CanvasProvider = ({ children }: PropsWithChildren) => {
  //Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<Canvas | null>(null);
  const rectRef = useRef<FabricObject>(null);

  //State
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [_saveState, setSaveState] = useState<SaveState>({
    saving: false,
    lastSaved: null,
    error: null,
    retryCount: 0,
  });
  const [contextMenu, setContextMenu] = useState<
    CanvasContextType['contextMenu']
  >({ visible: false, x: 0, y: 0 });
  const [clonedObject, setClonedObject] = useState<FabricObject | null>(null);

  //hooks
  const { id } = useParams();
  const { mutate: saveProjectMutation } = useSaveProject({ id });
  const { data: projectData, isPending } = useProject({ id });

  const takeScreenshot = ({ canvas }: { canvas: Canvas | null }) => {
    if (!canvas) return;
    const zoom = canvas.getZoom();

    const transform = canvas.viewportTransform;
    const coords = {
      x: transform[4], // translateX
      y: transform[5], // translateY
    };

    // Get canvas data URL with scaling
    const screenshot = canvas.toDataURL({
      format: 'jpeg',
      quality: 0.8,
      top: coords.y,
      left: coords.x,
      multiplier: 1 / zoom,
    });

    return screenshot;
  };

  function getCanvasImages({ canvas }: { canvas: Canvas | null }) {
    if (!canvas) return;
    const images: FabricImage[] = canvas
      .getObjects()
      .filter((obj) => obj.type === 'image') as FabricImage[];

    return images.map((img: FabricImage) => ({
      src: img.getSrc(),
      left: img.left,
      top: img.top,
      scaleX: img.scaleX,
      scaleY: img.scaleY,
      angle: img.angle,
      flipX: img.flipX,
      flipY: img.flipY,
      opacity: img.opacity,
      keepDetails: img.keepDetails,
      id: img.id,
    }));
  }

  const saveCanvas = async (
    attempt = 1,
    canvasObjects:
      | {
          src: string;
          left: number;
          top: number;
          scaleX: number;
          scaleY: number;
          angle: number;
          flipX: boolean;
          flipY: boolean;
          opacity: number;
          keepDetails: boolean | undefined;
          id: string | undefined;
        }[]
      | undefined,
    preview: string | undefined,
  ) => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    try {
      saveProjectMutation({
        id: id as string,
        canvas: JSON.stringify(canvasObjects),
        preview,
      });

      setHasUnsavedChanges(false);

      setSaveState({
        saving: false,
        lastSaved: new Date(),
        error: null,
        retryCount: 0,
      });
    } catch (error) {
      if (attempt < MAX_RETRIES) {
        setSaveState((prev) => ({
          ...prev,
          saving: true,
          error: error as Error,
          retryCount: attempt,
        }));

        // Exponential backoff
        const delay = RETRY_DELAY * Math.pow(2, attempt - 1);

        setTimeout(() => {
          saveCanvas(attempt + 1, canvasObjects, preview);
        }, delay);
      } else {
        setHasUnsavedChanges(true);
        setSaveState({
          saving: false,
          lastSaved: null,
          error: error as Error,
          retryCount: attempt,
        });
      }
    }
  };

  useEffect(() => {
    const canvas = initializeCanvas({
      canvasRef,
      fabricRef,
      rectRef,
    });

    console.log({ canvas });

    // canvas.on('mouse:wheel', (opt) => {
    //   handleCanvasZoom({ canvas, options: opt });
    // });

    let lastPosX = 0;
    let lastPosY = 0;
    let isZooming = false;
    let minZoom = 0.14;
    let maxZoom = 4;

    // Combined handler for both zoom and pan
    // const handleWheel = (e: WheelEvent) => {
    //   e.preventDefault();
    //   const delta = e.deltaY;

    //   if (e.ctrlKey || e.metaKey) {
    //     // Handle zooming
    //     const pointer = canvas.getViewportPoint({
    //       clientX: e.clientX,
    //       clientY: e.clientY,
    //     } as PointerEvent);

    //     const zoomFactor = delta > 0 ? 0.95 : 1.05;
    //     const newZoom = canvas.getZoom() * zoomFactor;

    //     // Apply zoom limits
    //     if (newZoom >= minZoom && newZoom <= maxZoom) {
    //       canvas.zoomToPoint(pointer, newZoom);
    //     }
    //   } else {
    //     // Handle panning
    //     const vpt = canvas.viewportTransform;
    //     if (!vpt) return;

    //     vpt[4] -= e.deltaX;
    //     vpt[5] -= delta;

    //     canvas.requestRenderAll();
    //   }
    // };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const ZOOM_SPEED = 0.05;
      const ZOOM_IN_FACTOR = 1 + ZOOM_SPEED;
      const ZOOM_OUT_FACTOR = 1 - ZOOM_SPEED;

      if (e.ctrlKey || e.metaKey) {
        const pointer = canvas.getViewportPoint({
          clientX: e.clientX,
          clientY: e.clientY,
        } as PointerEvent);

        const zoomFactor = e.deltaY > 0 ? ZOOM_OUT_FACTOR : ZOOM_IN_FACTOR;
        const newZoom = canvas.getZoom() * zoomFactor;

        if (newZoom >= minZoom && newZoom <= maxZoom) {
          canvas.zoomToPoint(pointer, newZoom);
        }
      } else {
        const PAN_SPEED = 1.0;

        // Use relative pan instead of directly modifying viewport transform
        canvas.relativePan({
          x: -e.deltaX * PAN_SPEED,
          y: -e.deltaY * PAN_SPEED,
        } as Point);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        isZooming = true;

        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        lastPosX = Math.abs(touch1.clientX - touch2.clientX);
        lastPosY = Math.abs(touch1.clientY - touch2.clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && isZooming) {
        e.preventDefault();

        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentPosX = Math.abs(touch1.clientX - touch2.clientX);
        const currentPosY = Math.abs(touch1.clientY - touch2.clientY);

        const deltaX = currentPosX - lastPosX;
        const deltaY = currentPosY - lastPosY;
        const delta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;

        const centerX = (touch1.clientX + touch2.clientX) / 2;
        const centerY = (touch1.clientY + touch2.clientY) / 2;

        const pointer = canvas.getViewportPoint({
          clientX: centerX,
          clientY: centerY,
        } as PointerEvent);

        const zoomFactor = delta > 0 ? 1.2 : 0.98;
        const newZoom = canvas.getZoom() * zoomFactor;

        // Apply zoom limits
        if (newZoom >= minZoom && newZoom <= maxZoom) {
        }
        canvas.zoomToPoint(pointer, newZoom);

        lastPosX = currentPosX;
        lastPosY = currentPosY;
      }
    };

    const handleTouchEnd = () => {
      isZooming = false;
    };

    // Add event listeners
    canvas.wrapperEl.addEventListener('wheel', handleWheel, { passive: false });
    canvas.wrapperEl.addEventListener('touchstart', handleTouchStart, {
      passive: false,
    });
    canvas.wrapperEl.addEventListener('touchmove', handleTouchMove, {
      passive: false,
    });
    canvas.wrapperEl.addEventListener('touchend', handleTouchEnd);

    canvas.on('mouse:down', (opt: TPointerEventInfo<MouseEvent>) => {
      if (!canvas) return;
      handleClick({ opt, canvas: fabricRef.current, setContextMenu });
    });

    window.addEventListener('resize', () => {
      handleResize({
        canvas: fabricRef.current,
      });
    });

    return () => {
      window.removeEventListener('resize', () =>
        handleResize({ canvas: null }),
      );
      canvas.wrapperEl.removeEventListener('wheel', handleWheel);
      canvas.wrapperEl.removeEventListener('touchstart', handleTouchStart);
      canvas.wrapperEl.removeEventListener('touchmove', handleTouchMove);
      canvas.wrapperEl.removeEventListener('touchend', handleTouchEnd);
      canvas.off('mouse:down', (opt: TPointerEventInfo<MouseEvent>) => {
        if (!canvas) return;
        handleClick({ opt, canvas: fabricRef.current, setContextMenu });
      });

      canvas.dispose();
    };
  }, [isPending]);

  useEffect(() => {
    if (!projectData) return;

    loadContent({
      canvas: fabricRef.current,
      projectData: JSON.parse(projectData.result.canvas),
    });
  }, [projectData]);

  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const canvasObjects = getCanvasImages({ canvas });
    const preview = takeScreenshot({ canvas });

    const saveInterval = setInterval(() => {
      if (!hasUnsavedChanges) return;
      try {
        saveCanvas(1, canvasObjects, preview);
      } catch (err) {
        setHasUnsavedChanges(true);
      }
    }, SAVE_INTERVAL);

    const debounceSave = debounce(
      () => {
        setSaveState((prev) => ({
          ...prev,
          saving: true,
          retryCount: 0,
        }));
        saveCanvas(1, canvasObjects, preview);
      },
      3000,
      false,
    );

    const handleCanvasModification = () => {
      debounceSave();
      if (!hasUnsavedChanges) setHasUnsavedChanges(true);
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
        saveCanvas(1, canvasObjects, preview);
        return '';
      }
    };

    const attachListeners = () => {
      canvas.on('object:modified', handleCanvasModification);
      canvas.on('object:added', handleCanvasModification);
      canvas.on('object:removed', handleCanvasModification);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    const removeListeners = () => {
      canvas.off('object:modified', handleCanvasModification);
      canvas.off('object:added', handleCanvasModification);
      canvas.off('object:removed', handleCanvasModification);
    };

    attachListeners();

    return () => {
      removeListeners();
      clearInterval(saveInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (hasUnsavedChanges) {
        const canvas = fabricRef.current;
        if (!canvas) return;
        const canvasObjects = getCanvasImages({ canvas });
        const preview = takeScreenshot({ canvas });
        saveCanvas(1, canvasObjects, preview);
      }
    };
  }, [fabricRef.current, hasUnsavedChanges]);

  if (isPending) {
    return <LoadingScreen />;
  }

  return (
    <CanvasContext.Provider
      value={{
        canvasRef,
        fabricRef,
        contextMenu,
        setContextMenu,
        clonedObject,
        setClonedObject,
        isInputFocused,
        setIsInputFocused,
        prompt,
        setPrompt,
        rectRef,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvasContext = () => {
  const context = useContext(CanvasContext);

  if (!context) {
    throw new Error('useCanvasContext must be used within a CanvasProvider');
  }

  return context;
};
