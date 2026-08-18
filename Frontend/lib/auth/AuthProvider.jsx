"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "@/lib/api/index";
import {
  clearAuthStorage,
  clearLegacyTokenStorage,
  consumePendingAuthAction,
  getDeviceId,
  getPendingAuthAction,
  persistUser,
  setMemoryAccessToken,
  setPendingAuthAction,
} from "@/lib/auth/tokenStore";
import {
  isTestAuthEnabled,
  isDevTestOtp,
  isDevTestPhone,
} from "@/lib/auth/firebaseErrors";
import { normalizePhoneNumber } from "@/lib/auth/phoneUtils";
import {
  isFirebaseConfigured,
  sendWebPhoneOtp,
  signInWithGooglePopup,
  signInWithApplePopup,
  getGoogleRedirectIdToken,
  signInWithFirebaseCustomToken,
  verifyWebPhoneOtp,
} from "@/lib/firebase";

const AuthContext = createContext(null);

async function exchangeFirebaseToken(idToken) {
  // Send the Firebase ID token to the backend to receive JWT tokens
  return authApi.phoneLogin({ idToken, deviceId: getDeviceId(), platform: "web" });
}

function mapSession(data) {
  const tokens = data.tokens ?? {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  };
  return { user: data.user, tokens, firebaseCustomToken: data.firebaseCustomToken ?? null };
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
    clearLegacyTokenStorage();
    persistUser(sessionUser);
    setUser(sessionUser);
    setIsAuthenticated(Boolean(sessionUser));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("auth-updated"));
    }
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      const data = await authApi.refresh({
        deviceId: getDeviceId(),
        platform: "web",
      });
      const { user: refreshedUser, tokens } = mapSession(data);
      applySession(refreshedUser, tokens);
    } catch {
      clearAuthStorage();
      setUser(null);
      setIsAuthenticated(false);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth-updated"));
      }
    }
  }, [applySession]);

  useEffect(() => {
    let active = true;

    async function bootstrapSession() {
      try {
        await refreshSession();
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    bootstrapSession();
    return () => {
      active = false;
    };
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

  useEffect(() => {
    let active = true;

    async function finishGoogleRedirect() {
      try {
        const idToken = await getGoogleRedirectIdToken();
        if (!idToken || !active) return;
        await completeFirebaseLogin(idToken);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("auth-updated"));
        }
      } catch {
        // No Google redirect in progress.
      }
    }

    finishGoogleRedirect();
    return () => {
      active = false;
    };
  }, [completeFirebaseLogin]);

  const startPhoneLogin = useCallback(async (phone) => {
    const normalized = phone.replace(/[\s-]/g, "");
    if (isTestAuthEnabled() && isDevTestPhone(normalized)) {
      return { dev: true, phone: normalizePhoneNumber(normalized) || normalized };
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
        const { user: sessionUser, tokens, firebaseCustomToken } = mapSession(data);
        applySession(sessionUser, tokens);
        // Hydrate Firebase auth so any Firebase-based guard doesn't see currentUser===null
        // and redirect back to login (the loop bug).
        if (firebaseCustomToken) {
          try {
            await signInWithFirebaseCustomToken(firebaseCustomToken);
          } catch (e) {
            // Non-fatal — JWT session is already set; log for debugging only
            console.warn("[auth] signInWithCustomToken failed (non-fatal):", e?.message);
          }
        }
        return sessionUser;
      }
      const idToken = await verifyWebPhoneOtp(confirmation, code);
      return completeFirebaseLogin(idToken);
    },
    [applySession, completeFirebaseLogin]
  );

  const loginWithGoogle = useCallback(async () => {
    const idToken = await signInWithGooglePopup();
    if (!idToken) return null;
    return completeFirebaseLogin(idToken);
  }, [completeFirebaseLogin]);

  const loginWithApple = useCallback(async () => {
    const idToken = await signInWithApplePopup();
    if (!idToken) return null;
    return completeFirebaseLogin(idToken);
  }, [completeFirebaseLogin]);

  const updateProfile = useCallback(async (payload) => {
    const data = await authApi.updateProfile(payload);
    const sessionUser = data.user;
    if (!sessionUser) throw new Error("Invalid profile response");
    persistUser(sessionUser);
    setUser(sessionUser);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("auth-updated"));
    }
    return sessionUser;
  }, []);

  const loginWithEmail = useCallback(
    async (email, password) => {
      const data = await authApi.login({
        email,
        password,
        deviceId: getDeviceId(),
        platform: "web",
      });
      const { user: sessionUser, tokens } = mapSession(data);
      applySession(sessionUser, tokens);
      return sessionUser;
    },
    [applySession]
  );

  const registerWithEmail = useCallback(
    async ({ name, email, password, phone }) => {
      const data = await authApi.register({
        name,
        email,
        password,
        ...(phone ? { phone } : {}),
        deviceId: getDeviceId(),
        platform: "web",
      });
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
      loginWithApple,
      loginWithEmail,
      registerWithEmail,
      updateProfile,
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
      loginWithApple,
      loginWithEmail,
      registerWithEmail,
      updateProfile,
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
