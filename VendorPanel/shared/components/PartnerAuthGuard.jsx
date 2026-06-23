"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isPartnerAuthenticated } from "@/lib/partnerAuth";
import { partnerRoutes } from "@/lib/constants/partnerRoutes";

const LOGIN_PATHS = {
  vendor: partnerRoutes.vendor.login,
  doctor: partnerRoutes.doctor?.login,
  lab: partnerRoutes.lab?.login,
};

export function PartnerAuthGuard({ role, children }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
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
