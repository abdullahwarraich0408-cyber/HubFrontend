import { createSlice } from "@reduxjs/toolkit";
import { hasAuthSession, loadStoredUser } from "@/lib/auth/tokenStore";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    initialized: false,
  },
  reducers: {
    hydrateAuth(state) {
      const user = loadStoredUser();
      state.user = user;
      state.isAuthenticated = hasAuthSession();
      state.initialized = true;
    },
    setAuthState(state, action) {
      const user = action.payload ?? loadStoredUser();
      state.user = user;
      state.isAuthenticated = Boolean(user);
      state.loading = false;
      state.initialized = true;
      state.error = null;
    },
    clearAuthState(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.initialized = true;
      state.error = null;
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
});

export const { hydrateAuth, setAuthState, clearAuthState, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
