import { useRef } from 'react';
import { useCanvasContext } from '../context/CanvasContext';

const DesignCanvas = () => {
  const { canvasRef } = useCanvasContext();

  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <canvas id="canvas" ref={canvasRef} />
    </div>
  );
};

export default DesignCanvas;
