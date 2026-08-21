"use client";

import { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { store } from "../store";
import { hydrateAuth, fetchProfile } from "../store/authSlice";
import { NotificationBannerHost } from "@/shared/notifications/NotificationBannerHost";
import { EnableNotificationsPrompt } from "@/shared/notifications/EnableNotificationsPrompt";

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
    const user =
      localStorage.getItem("medzoos_user") ||
      localStorage.getItem("sehat1_user") ||
      localStorage.getItem("pharmahub_user");
    if (token && !user) {
      dispatch(fetchProfile());
    }
  }, [dispatch, initialized]);

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

function NotificationChrome() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return (
    <>
      <NotificationBannerHost />
      <EnableNotificationsPrompt enabled={Boolean(isAuthenticated)} />
    </>
  );
}

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthHydrator>{children}</AuthHydrator>
        <NotificationChrome />
        <Toaster position="top-right" richColors />
      </QueryClientProvider>
    </Provider>
  );
}
