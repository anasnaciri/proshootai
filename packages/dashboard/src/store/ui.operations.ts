export const canvasOperations = {
  clearCanvas: (context, width, height) => {
    if (context) {
      context.clearRect(0, 0, width, height);
    }
  },

  exportCanvas: (canvasRef) => {
    if (canvasRef) {
      return canvasRef.toDataURL('image/png');
    }
    return null;
  },

  setCanvasBackground: (context, width, height, color = 'white') => {
    if (context) {
      context.fillStyle = color;
      context.fillRect(0, 0, width, height);
    }
  },

  // Add more canvas operations as needed
  saveCanvasState: (context) => {
    if (context) {
      context.save();
    }
  },

  restoreCanvasState: (context) => {
    if (context) {
      context.restore();
    }
  },
};
