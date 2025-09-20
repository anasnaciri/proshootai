import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CanvasState } from '../types';

const initialState: CanvasState = {
  canvas: null,
  dimensions: {
    width: 0,
    height: 0,
  },
};

export const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    setDimensions: (
      state,
      action: PayloadAction<{ width: number; height: number }>,
    ) => {
      state.dimensions = action.payload;
    },
  },
});

export const { setDimensions } = canvasSlice.actions;

// Selectors
// export const selectCanvas = (state: canvasState) => state.canvasRef;
// export const selectFabric = (state: canvasState) => state.fabricRef;

export default canvasSlice.reducer;
