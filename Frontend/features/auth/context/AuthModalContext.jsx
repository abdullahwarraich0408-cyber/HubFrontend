"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { EmailSignInModal } from "@/features/auth/components/EmailSignInModal";
import { AUTH_SIGN_IN_EVENT } from "@/lib/authModalEvents";
import { isLoggingOut } from "@/lib/auth/tokenStore";

const AuthModalContext = createContext(null);

export function AuthModalProvider({ children }) {
  const pathname = usePathname();
  const [signInOpen, setSignInOpen] = useState(false);
  const [redirectTo, setRedirectTo] = useState("/");
  const [expired, setExpired] = useState(false);

  const openSignIn = useCallback(({ redirect = "/", expired: sessionExpired = false } = {}) => {
    if (isLoggingOut()) return;
    setRedirectTo(redirect);
    setExpired(sessionExpired);
    setSignInOpen(true);
  }, []);

  const closeSignIn = useCallback(() => {
    setSignInOpen(false);
    setExpired(false);
  }, []);

  useEffect(() => {
    closeSignIn();
  }, [pathname, closeSignIn]);

  useEffect(() => {
    const handleOpenSignIn = (event) => {
      if (isLoggingOut()) return;
      const { redirect = "/", expired: sessionExpired = false } = event.detail || {};
      openSignIn({ redirect, expired: sessionExpired });
    };

    window.addEventListener(AUTH_SIGN_IN_EVENT, handleOpenSignIn);
    return () => window.removeEventListener(AUTH_SIGN_IN_EVENT, handleOpenSignIn);
  }, [openSignIn]);

  const handleSuccess = () => {
    closeSignIn();
    if (redirectTo && redirectTo !== "/" && typeof window !== "undefined") {
      window.location.href = redirectTo;
    }
  };

  return (
    <AuthModalContext.Provider value={{ openSignIn, closeSignIn, signInOpen }}>
      {children}
      <EmailSignInModal
        open={signInOpen}
        onClose={closeSignIn}
        onSuccess={handleSuccess}
        redirectTo={redirectTo}
      />
      {expired && signInOpen ? (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[140] text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 shadow">
          Session expired — sign in again to continue.
        </div>
      ) : null}
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
