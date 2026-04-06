import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';
import themeReducer from './slices/themeSlice';
import stepsReducer from './slices/stepsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    theme: themeReducer,
    steps: stepsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;