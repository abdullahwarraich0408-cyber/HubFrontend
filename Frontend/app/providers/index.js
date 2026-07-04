"use client";

import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { store } from "../store";
import { hydrateAuth } from "../store/authSlice";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import { AuthModalProvider } from "@/features/auth/context/AuthModalContext";

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

  return children;
}

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AuthModalProvider>
            <AuthHydrator>{children}</AuthHydrator>
          </AuthModalProvider>
        </AuthProvider>
        <Toaster position="top-right" richColors />
      </QueryClientProvider>
    </Provider>
  );
}
