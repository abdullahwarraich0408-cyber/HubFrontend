import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi, usersApi } from "@/lib/api/index";

const STORAGE_KEY = "pharmahub_user";

function loadStoredUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persistUser(user) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function persistTokens(tokens) {
  if (typeof window === "undefined" || !tokens) return;
  if (tokens.accessToken) {
    localStorage.setItem("token", tokens.accessToken);
  }
  if (tokens.refreshToken) {
    localStorage.setItem("refreshToken", tokens.refreshToken);
  }
}

function clearAuthStorage() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
}

function hasAuthSession() {
  if (typeof window === "undefined") return false;
  const token = localStorage.getItem("token");
  const user = loadStoredUser();
  return Boolean(user || (token && token !== "cookie-auth-active"));
}

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await authApi.login({ email, password });
      persistTokens(data.tokens);
      persistUser(data.user);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth-updated"));
      }
      return data.user;
    } catch (error) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async ({ name, email, password, phone }, { rejectWithValue }) => {
    try {
      const payload = { name, email, password };
      if (phone) payload.phone = phone;
      const data = await authApi.register(payload);
      persistTokens(data.tokens);
      persistUser(data.user);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth-updated"));
      }
      return data.user;
    } catch (error) {
      return rejectWithValue(error.message || "Registration failed");
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await authApi.logout();
  } catch (error) {
    clearAuthStorage();
    return rejectWithValue(error.message || "Logout failed");
  }

  clearAuthStorage();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("auth-updated"));
  }
  return null;
});

export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const data = await usersApi.getProfile();
      persistUser(data.user);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth-updated"));
      }
      return data.user;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to load profile");
    }
  }
);

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
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      });
  },
});

export const { hydrateAuth, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
