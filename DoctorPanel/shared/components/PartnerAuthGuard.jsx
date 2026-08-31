"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isPartnerAuthenticated, setPartnerSession } from "@/lib/partnerAuth";
import { partnerRoutes } from "@/lib/constants/partnerRoutes";

const LOGIN_PATHS = {
  vendor: partnerRoutes.vendor?.login,
  doctor: partnerRoutes.doctor.login,
  lab: partnerRoutes.lab?.login,
};

export function PartnerAuthGuard({ role, children }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const accessToken = params.get("accessToken");
      if (accessToken) {
        setPartnerSession({
          tokens: {
            accessToken,
            refreshToken: params.get("refreshToken") || undefined,
          },
          role: params.get("role") || role || "doctor",
          partner: params.get("partner") ? JSON.parse(params.get("partner")) : undefined,
        });
        window.history.replaceState({}, "", window.location.pathname);
      }
    }

    if (!isPartnerAuthenticated(role)) {
      router.replace(LOGIN_PATHS[role] || "/");
      return;
    }
    setReady(true);
  }, [role, router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-subtle">
        <div className="text-[14px] text-neutral-500 font-medium">Loading portal...</div>
      </div>
    );
  }

  return children;
}
