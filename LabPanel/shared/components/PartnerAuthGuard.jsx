"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const LOGIN_PATHS = {
  lab: "/lab",
  doctor: "/lab",
};

export function PartnerAuthGuard({ role = "lab", children }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("partnerToken") : null;
    const storedRole = typeof window !== "undefined" ? localStorage.getItem("partnerRole") : null;
    const authed = Boolean(token && (storedRole === "lab" || storedRole === "doctor"));

    if (!authed) {
      router.replace(LOGIN_PATHS[role] || "/lab");
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
