import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  email: string | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  userId: null,
  email: null,
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ userId: string; email: string }>) => {
      state.isAuthenticated = true;
      state.userId = action.payload.userId;
      state.email = action.payload.email;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userId = null;
      state.email = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { loginSuccess, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;