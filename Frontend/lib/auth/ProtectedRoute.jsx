"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useAuthModal } from "@/features/auth/context/AuthModalContext";

export function ProtectedRoute({ children, redirectTo, fallback = null }) {
  const { isAuthenticated, isLoading } = useAuth();
  const { openSignIn } = useAuthModal();
  const router = useRouter();

  useEffect(() => {
    if (isLoading || isAuthenticated) return;
    if (redirectTo) {
      openSignIn({ redirect: redirectTo });
    }
  }, [isLoading, isAuthenticated, redirectTo, openSignIn]);

  if (isLoading) return fallback;
  if (!isAuthenticated) return fallback;
  return children;
}

export function GuestRoute({ children }) {
  return children;
}
