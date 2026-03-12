import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// formato dos dados que esse slice vai guardar
interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  email: string | null;
  isLoading: boolean;
}

// valores iniciais quando o app abre
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
    // chamado quando o login é bem sucedido
    loginSuccess: (state, action: PayloadAction<{ userId: string; email: string }>) => {
      state.isAuthenticated = true;
      state.userId = action.payload.userId;
      state.email = action.payload.email;
    },
    // chamado quando o usuario faz logout
    logout: (state) => {
      state.isAuthenticated = false;
      state.userId = null;
      state.email = null;
    },
    // chamado enquanto verifica se o usuario ja tem sessao ativa
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { loginSuccess, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;