import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  email: string | null;
  userId: string | null;
  token: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  email: null,
  userId: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ email: string; userId: string; token: string }>
    ) => {
      state.isAuthenticated = true;
      state.email = action?.payload?.email;
      state.userId = action?.payload?.userId;
      state.token = action?.payload?.token;
      localStorage.setItem("authToken", action?.payload?.token);
      localStorage.setItem("userEmail", action?.payload?.email);
      localStorage.setItem("userId", action?.payload?.userId);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.email = null;
      state.userId = null;
      state.token = null;
      localStorage.removeItem("authToken");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userId");
    },
    restoreAuth: (state) => {
      const token = localStorage.getItem("authToken");
      const email = localStorage.getItem("userEmail");
      const userId = localStorage.getItem("userId");
      if (token && email && userId) {
        state.isAuthenticated = true;
        state.email = email;
        state.userId = userId;
        state.token = token;
      }
    },
  },
});

export const { login, logout, restoreAuth } = authSlice.actions;
export default authSlice.reducer;
