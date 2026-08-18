"use client";

import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { store } from "../store";
import { hydrateAuth } from "../store/authSlice";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import { AuthModalProvider } from "@/features/auth/context/AuthModalContext";

import { PrescriptionModalProvider } from "@/features/prescription/context/PrescriptionModalContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});

function AuthHydrator({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  useEffect(() => {
    const syncAuth = () => dispatch(hydrateAuth());
    window.addEventListener("auth-updated", syncAuth);
    return () => window.removeEventListener("auth-updated", syncAuth);
  }, [dispatch]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleFocus = (e) => {
      const el = e.target;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT")) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 300);
      }
    };
    document.addEventListener("focusin", handleFocus, { passive: true });
    return () => document.removeEventListener("focusin", handleFocus);
  }, []);

  return children;
}

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AuthModalProvider>
            <PrescriptionModalProvider>
              <AuthHydrator>{children}</AuthHydrator>
              <div
                id="recaptcha-container"
                className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0"
                aria-hidden="true"
              />
            </PrescriptionModalProvider>
          </AuthModalProvider>
        </AuthProvider>
        <Toaster position="top-right" richColors />
      </QueryClientProvider>
    </Provider>
  );
}
