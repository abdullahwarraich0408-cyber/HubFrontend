"use client";

import { useAuth } from "@/lib/auth/AuthProvider";
import { HomePage } from "@/features/home/pages/HomePage";
import { LandingPage } from "@/features/landing/pages/LandingPage";

/**
 * / — guests see marketing landing (pre-login);
 * authenticated users see the patient home dashboard.
 */
export function HomeGate() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-[14px] text-[#627D98]">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  return <HomePage />;
}
