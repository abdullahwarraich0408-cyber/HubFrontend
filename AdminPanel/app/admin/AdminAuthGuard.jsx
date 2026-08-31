"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/lib/hooks/useApi";
import { CircleNotch, ShieldCheck, ArrowRight } from "@phosphor-icons/react";
import AdminSessionTimeoutModal from "./AdminSessionTimeoutModal";
import { getAdminSession, subscribeToSessionEvents, clearAdminSession } from "@/lib/auth/adminSession";

export default function AdminAuthGuard({ children }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(() => {
    if (typeof window === "undefined") return false;
    const session = getAdminSession();
    return Boolean(session?.token && session?.user?.role === "admin");
  });

  const { data: profile, isLoading, isError, error } = useUserProfile({
    retry: 1,
    enabled: isAuthorized,
  });

  useEffect(() => {
    setMounted(true);
    const session = getAdminSession();
    if (!session.token) {
      window.location.replace("/portal-access?expired=true&reason=no_session");
      return;
    }

    if (session.user?.role === "admin") {
      setIsAuthorized(true);
    } else {
      clearAdminSession(false);
      window.location.replace("/portal-access?expired=true&reason=unauthorized");
    }
  }, []);

  // Cross-tab sync
  useEffect(() => {
    const unsubscribe = subscribeToSessionEvents((event) => {
      if (event?.type === "LOGOUT") {
        window.location.replace("/portal-access?expired=true&reason=logged_out");
      }
    });
    return () => unsubscribe();
  }, []);

  // Backend verification result check
  useEffect(() => {
    if (mounted && !isLoading) {
      if (profile && profile.role !== "admin") {
        clearAdminSession(false);
        window.location.replace("/portal-access?expired=true&reason=unauthorized");
      }
    }
  }, [mounted, isLoading, profile]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#082B3F] text-white p-6 font-[var(--font-plus-jakarta-sans)]">
        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6 shadow-inner border border-white/10">
          <CircleNotch size={36} className="text-[#0FA7E3] animate-spin" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Verifying Administrator Access...</h2>
        <p className="text-xs text-white/60 mt-1 max-w-sm text-center">
          Checking your security session and administrator privileges.
        </p>
        <button
          type="button"
          onClick={() => {
            window.location.replace("/portal-access?expired=true&reason=manual");
          }}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold transition-all text-white"
        >
          <span>Go to Admin Login</span>
          <ArrowRight size={14} />
        </button>
      </div>
    );
  }

  return (
    <>
      <AdminSessionTimeoutModal />
      {children}
    </>
  );
}

