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
  setLoggingOut,
  setMemoryAccessToken,
  setPendingAuthAction,
} from "@/lib/auth/tokenStore";
import {
  isTestAuthEnabled,
  isDevTestOtp,
  isDevTestPhone,
} from "@/lib/auth/testAuth";
import { normalizePhoneNumber } from "@/lib/auth/phoneUtils";
import { signInWithGoogleCode } from "@/lib/googleAuth";

const AuthContext = createContext(null);

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

  const startPhoneLogin = useCallback(async (phone) => {
    const normalized = phone.replace(/[\s-]/g, "");
    if (isTestAuthEnabled() && isDevTestPhone(normalized)) {
      return { dev: true, phone: normalizePhoneNumber(normalized) || normalized };
    }
    throw new Error("Phone OTP is not available in this build.");
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
      throw new Error("Phone OTP is not available in this build.");
    },
    [applySession]
  );

  const loginWithGoogle = useCallback(async () => {
    const code = await signInWithGoogleCode();
    const data = await authApi.googleLogin({
      code,
      deviceId: getDeviceId(),
      platform: "web",
    });
    const { user: sessionUser, tokens } = mapSession(data);
    if (!tokens?.accessToken) {
      throw new Error("Invalid Google authentication response");
    }
    applySession(sessionUser, tokens);
    return sessionUser;
  }, [applySession]);

  const loginWithApple = useCallback(async () => {
    throw new Error("Apple sign-in is not available.");
  }, []);

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

  const initiateRegistration = useCallback(
    async ({ name, email, password, phone }) => {
      const data = await authApi.initiateRegister({
        name,
        email,
        password,
        ...(phone ? { phone } : {}),
        deviceId: getDeviceId(),
        platform: "web",
      });
      return data;
    },
    []
  );

  const verifyRegistrationOtp = useCallback(
    async ({ email, otp }) => {
      const data = await authApi.verifyRegisterOtp({
        email,
        otp,
        deviceId: getDeviceId(),
        platform: "web",
      });
      const { user: sessionUser, tokens } = mapSession(data);
      applySession(sessionUser, tokens);
      return sessionUser;
    },
    [applySession]
  );

  const resendRegistrationOtp = useCallback(async (email) => {
    return authApi.resendRegisterOtp(email);
  }, []);

  const registerWithEmail = useCallback(
    async ({ name, email, password, phone, otp }) => {
      if (otp) {
        return verifyRegistrationOtp({ email, otp });
      }
      return initiateRegistration({ name, email, password, phone });
    },
    [initiateRegistration, verifyRegistrationOtp]
  );

  const logout = useCallback(async (redirectUrl = "/") => {
    setLoggingOut(true);
    try {
      await authApi.logout();
    } catch {
      // ignore
    }
    clearAuthStorage();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("auth-updated"));
      window.dispatchEvent(new Event("cart-updated"));
      if (redirectUrl) {
        window.location.href = redirectUrl;
        return;
      }
    }
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const logoutAllDevices = useCallback(async (redirectUrl = "/") => {
    setLoggingOut(true);
    try {
      await authApi.logoutAll();
    } catch {
      // ignore
    }
    clearAuthStorage();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("auth-updated"));
      window.dispatchEvent(new Event("cart-updated"));
      if (redirectUrl) {
        window.location.href = redirectUrl;
        return;
      }
    }
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
      initiateRegistration,
      verifyRegistrationOtp,
      resendRegistrationOtp,
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
      initiateRegistration,
      verifyRegistrationOtp,
      resendRegistrationOtp,
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
