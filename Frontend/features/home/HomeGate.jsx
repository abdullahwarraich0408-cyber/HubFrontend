"use client";

import { useAuth } from "@/lib/auth/AuthProvider";
import { LandingPage } from "@/features/landing";
import { HomePage } from "@/features/home/pages/HomePage";

export function HomeGate() {
  const { isAuthenticated, isLoading } = useAuth();

  // Guests (and auth still loading) see the marketing landing.
  if (isLoading || !isAuthenticated) {
    return <LandingPage />;
  }

  return <HomePage />;
}
