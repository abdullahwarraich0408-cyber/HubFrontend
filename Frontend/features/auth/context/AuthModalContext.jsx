"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { SignInModal } from "@/features/auth/components/SignInModal";
import { AUTH_SIGN_IN_EVENT } from "@/lib/authModalEvents";

const AuthModalContext = createContext(null);

export function AuthModalProvider({ children }) {
  const [signInOpen, setSignInOpen] = useState(false);
  const [redirectTo, setRedirectTo] = useState("/");
  const [expired, setExpired] = useState(false);

  const openSignIn = useCallback(({ redirect = "/", expired: sessionExpired = false } = {}) => {
    setRedirectTo(redirect);
    setExpired(sessionExpired);
    setSignInOpen(true);
  }, []);

  const closeSignIn = useCallback(() => {
    setSignInOpen(false);
    setExpired(false);
  }, []);

  useEffect(() => {
    const handleOpenSignIn = (event) => {
      const { redirect = "/", expired: sessionExpired = false } = event.detail || {};
      openSignIn({ redirect, expired: sessionExpired });
    };

    window.addEventListener(AUTH_SIGN_IN_EVENT, handleOpenSignIn);
    return () => window.removeEventListener(AUTH_SIGN_IN_EVENT, handleOpenSignIn);
  }, [openSignIn]);

  return (
    <AuthModalContext.Provider value={{ openSignIn, closeSignIn, signInOpen }}>
      {children}
      <SignInModal
        open={signInOpen}
        onClose={closeSignIn}
        redirectTo={redirectTo}
        expired={expired}
      />
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within AuthModalProvider");
  }
  return context;
}
