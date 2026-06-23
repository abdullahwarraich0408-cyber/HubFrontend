"use client";

import { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { store } from "../store";
import { hydrateAuth, fetchProfile } from "../store/authSlice";

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
  const initialized = useSelector((state) => state.auth.initialized);

  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!initialized || typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    const user = localStorage.getItem("pharmahub_user");
    if (token && !user) {
      dispatch(fetchProfile());
    }
  }, [dispatch, initialized]);

  return children;
}

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthHydrator>{children}</AuthHydrator>
        <Toaster position="top-right" richColors />
      </QueryClientProvider>
    </Provider>
  );
}
