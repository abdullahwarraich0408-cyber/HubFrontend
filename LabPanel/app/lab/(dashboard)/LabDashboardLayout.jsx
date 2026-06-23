"use client";

import { useEffect } from "react";
import { PartnerAuthGuard } from "@/shared/components/PartnerAuthGuard";
import { LabSidebar } from "@/shared/layout/LabSidebar";
import { setPartnerSession } from "@/lib/partnerAuth";

function ImpersonationHydrator({ children }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    if (!accessToken) return;

    setPartnerSession({
      tokens: {
        accessToken,
        refreshToken: params.get("refreshToken") || undefined,
      },
      role: params.get("role") || "lab",
      partner: params.get("partner") ? JSON.parse(params.get("partner")) : undefined,
    });
    window.history.replaceState({}, "", window.location.pathname);
  }, []);

  return children;
}

export function LabDashboardLayout({ children }) {
  return (
    <ImpersonationHydrator>
      <PartnerAuthGuard role="lab">
        <div className="flex min-h-screen bg-surface-subtle">
          <LabSidebar />
          <div className="flex-1 transition-all duration-250 ease-in-out ml-[72px] md:ml-[260px]">
            <main className="min-h-full p-6 md:p-8">{children}</main>
          </div>
        </div>
      </PartnerAuthGuard>
    </ImpersonationHydrator>
  );
}
