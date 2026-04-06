import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  mode: 'light' | 'dark' | 'auto';
  current: 'light' | 'dark';
}

const initialState: ThemeState = {
  mode: 'auto',
  current: 'dark',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setCurrentTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.current = action.payload;
    },
    setThemeMode: (state, action: PayloadAction<'light' | 'dark' | 'auto'>) => {
      state.mode = action.payload;
    },
  },
});

export const { setCurrentTheme, setThemeMode } = themeSlice.actions;
export default themeSlice.reducer;