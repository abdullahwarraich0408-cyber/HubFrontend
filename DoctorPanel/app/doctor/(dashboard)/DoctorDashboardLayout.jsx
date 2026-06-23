"use client";

import { PartnerAuthGuard } from "@/shared/components/PartnerAuthGuard";
import { DoctorSidebar } from "@/shared/layout/DoctorSidebar";

export function DoctorDashboardLayout({ children }) {
  return (
    <PartnerAuthGuard role="doctor">
      <div className="flex min-h-screen bg-surface-subtle">
        <DoctorSidebar />
        <div className="flex-1 transition-all duration-250 ease-in-out ml-[72px] md:ml-[260px]">
          <main className="min-h-full p-6 md:p-8">{children}</main>
        </div>
      </div>
    </PartnerAuthGuard>
  );
}
