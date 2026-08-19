"use client";

import { Warning, Prohibit } from "@phosphor-icons/react";

export function VendorStatusBanner({ profile }) {
  const alerts = profile?.compliance_alerts || [];
  if (!alerts.length) return null;
  const suspended = String(profile?.lifecycle_status || "").toUpperCase() === "SUSPENDED";

  return (
    <div
      className={`rounded-[14px] border px-4 py-3 flex items-start gap-3 ${
        suspended ? "bg-red-50 border-red-200 text-red-800" : "bg-amber-50 border-amber-200 text-amber-800"
      }`}
    >
      {suspended ? <Prohibit size={18} className="mt-0.5" /> : <Warning size={18} className="mt-0.5" />}
      <div className="text-sm">
        {alerts.map((alert) => (
          <p key={alert}>{alert}</p>
        ))}
      </div>
    </div>
  );
}
