"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "@/lib/api/index";
import {
  clearAuthStorage,
  consumePendingAuthAction,
  getDeviceId,
  getPendingAuthAction,
  hasAuthSession,
  loadStoredUser,
  persistUser,
  setMemoryAccessToken,
  setPendingAuthAction,
} from "@/lib/auth/tokenStore";
import {
  isDevAuthEnabled,
  isDevTestOtp,
  isDevTestPhone,
} from "@/lib/auth/firebaseErrors";
import {
  isFirebaseConfigured,
  sendWebPhoneOtp,
  signInWithGooglePopup,
  verifyWebPhoneOtp,
} from "@/lib/firebase";

const AuthContext = createContext(null);

async function exchangeFirebaseToken(idToken) {
  return authApi.firebaseLogin({
    idToken,
    deviceId: getDeviceId(),
    platform: "web",
  });
}

function mapSession(data) {
  const tokens = data.tokens ?? {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  };
  return { user: data.user, tokens };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingAction, setPendingActionState] = useState(getPendingAuthAction());

  const applySession = useCallback((sessionUser, tokens) => {
    if (tokens?.accessToken) {
      setMemoryAccessToken(tokens.accessToken);
    }
    persistUser(sessionUser);
    setUser(sessionUser);
    setIsAuthenticated(Boolean(sessionUser));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("auth-updated"));
    }
  }, []);

  const refreshSession = useCallback(async () => {
    const storedUser = loadStoredUser();
    const authed = hasAuthSession();

    if (authed) {
      try {
        const data = await authApi.refresh({
          deviceId: getDeviceId(),
          platform: "web",
        });
        const { user: refreshedUser, tokens } = mapSession(data);
        applySession(refreshedUser ?? storedUser, tokens);
        return;
      } catch {
        clearAuthStorage();
        setUser(null);
        setIsAuthenticated(false);
        return;
      }
    }

    setUser(storedUser);
    setIsAuthenticated(authed && Boolean(storedUser));
  }, [applySession]);

  useEffect(() => {
    refreshSession().finally(() => setIsLoading(false));
  }, [refreshSession]);

  const completeFirebaseLogin = useCallback(
    async (idToken) => {
      const data = await exchangeFirebaseToken(idToken);
      const { user: sessionUser, tokens } = mapSession(data);
      if (!tokens?.accessToken) throw new Error("Invalid authentication response");
      applySession(sessionUser, tokens);
      return sessionUser;
    },
    [applySession]
  );

  const startPhoneLogin = useCallback(async (phone) => {
    if (isDevAuthEnabled() && isDevTestPhone(phone)) {
      return { dev: true, phone: phone.replace(/[\s-]/g, "") };
    }
    if (!isFirebaseConfigured()) {
      throw new Error("Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* env vars.");
    }
    return sendWebPhoneOtp(phone);
  }, []);

  const completePhoneLogin = useCallback(
    async (confirmation, code) => {
      if (confirmation?.dev) {
        if (!isDevTestOtp(code)) {
          throw new Error("Invalid OTP. Use 123456 for dev test login.");
        }
        const data = await authApi.devLogin({
          phone: confirmation.phone,
          code: code.trim(),
          deviceId: getDeviceId(),
          platform: "web",
        });
        const { user: sessionUser, tokens } = mapSession(data);
        applySession(sessionUser, tokens);
        return sessionUser;
      }
      const idToken = await verifyWebPhoneOtp(confirmation, code);
      return completeFirebaseLogin(idToken);
    },
    [applySession, completeFirebaseLogin]
  );

  const loginWithGoogle = useCallback(async () => {
    const idToken = await signInWithGooglePopup();
    return completeFirebaseLogin(idToken);
  }, [completeFirebaseLogin]);

  const loginWithEmail = useCallback(
    async (email, password) => {
      const data = await authApi.login({ email, password });
      const { user: sessionUser, tokens } = mapSession(data);
      applySession(sessionUser, tokens);
      return sessionUser;
    },
    [applySession]
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore
    }
    clearAuthStorage();
    setUser(null);
    setIsAuthenticated(false);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("auth-updated"));
    }
  }, []);

  const logoutAllDevices = useCallback(async () => {
    try {
      await authApi.logoutAll();
    } catch {
      // ignore
    }
    clearAuthStorage();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const requireAuth = useCallback(
    (action) => {
      if (isAuthenticated) return true;
      setPendingAuthAction(action);
      setPendingActionState(action);
      return false;
    },
    [isAuthenticated]
  );

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      pendingAction,
      startPhoneLogin,
      completePhoneLogin,
      loginWithGoogle,
      loginWithEmail,
      logout,
      logoutAllDevices,
      requireAuth,
      consumePendingAction: () => {
        const action = consumePendingAuthAction();
        setPendingActionState(null);
        return action;
      },
      refreshSession,
    }),
    [
      user,
      isAuthenticated,
      isLoading,
      pendingAction,
      startPhoneLogin,
      completePhoneLogin,
      loginWithGoogle,
      loginWithEmail,
      logout,
      logoutAllDevices,
      requireAuth,
      refreshSession,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
