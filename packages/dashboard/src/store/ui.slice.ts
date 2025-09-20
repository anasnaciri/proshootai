import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isUserMenuOpen: boolean;
  mode: string;
}

const initialState: UIState = {
  isUserMenuOpen: false,
  mode: 'light',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<string>) => {
      state.mode = action.payload;
    },
    toggleUserMenu: (state) => {
      state.isUserMenuOpen = !state.isUserMenuOpen;
    },
  },
});

export const { setMode, toggleUserMenu } = uiSlice.actions;

export default uiSlice.reducer;
