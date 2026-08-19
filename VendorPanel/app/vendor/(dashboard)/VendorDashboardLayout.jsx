"use client";

import { PartnerAuthGuard } from "@/shared/components/PartnerAuthGuard";
import { VendorSidebar, usePersistedSidebarCollapsed } from "@/shared/layout/VendorSidebar";
import { VendorStatusBanner } from "@/shared/components/VendorStatusBanner";
import { useVendorOrderTracking } from "@/lib/hooks/useOrderTracking";
import { useVendorProfile } from "@/lib/hooks/useApi";
import { List } from "@phosphor-icons/react";
import { useState } from "react";

export function VendorDashboardLayout({ children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = usePersistedSidebarCollapsed();
  const { data: vendorProfile } = useVendorProfile();

  useVendorOrderTracking();

  const initials = (vendorProfile?.business_name || "VP")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <PartnerAuthGuard role="vendor">
      <div className="flex min-h-screen bg-surface-subtle relative overflow-x-hidden">
        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
            onClick={() => setIsMobileOpen(false)}
            aria-hidden="true"
          />
        )}

        <VendorSidebar
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />

        <div
          className={`flex-1 min-w-0 transition-all duration-300 ease-in-out ml-0 ${
            isCollapsed ? "md:ml-[80px]" : "md:ml-[276px]"
          }`}
        >
          <header className="md:hidden h-[60px] bg-white border-b border-neutral-200 px-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              className="p-2 -ml-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <List size={24} weight="bold" />
            </button>
            <span className="font-heading font-extrabold text-[16px] text-ink-headline">Vendor Portal</span>
            <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center font-bold text-xs text-neutral-600 overflow-hidden">
              {vendorProfile?.logo_url ? (
                <img src={vendorProfile.logo_url} alt="" className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
          </header>

          <main className="min-h-full p-4 md:p-8 lg:px-9">
            <div className="mb-4">
              <VendorStatusBanner profile={vendorProfile} />
            </div>
            {children}
          </main>
        </div>
      </div>
    </PartnerAuthGuard>
  );
}
