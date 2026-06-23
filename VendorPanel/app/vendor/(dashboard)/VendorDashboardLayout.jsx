"use client";

import { useState } from "react";
import { PartnerAuthGuard } from "@/shared/components/PartnerAuthGuard";
import { VendorSidebar } from "@/shared/layout/VendorSidebar";
import { List } from "@phosphor-icons/react";

export function VendorDashboardLayout({ children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <PartnerAuthGuard role="vendor">
      <div className="flex min-h-screen bg-surface-subtle relative overflow-x-hidden">
        {/* Mobile Sidebar Backdrop */}
        {isMobileOpen && (
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        <VendorSidebar 
          isMobileOpen={isMobileOpen} 
          setIsMobileOpen={setIsMobileOpen} 
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />

        <div 
          className={`flex-1 min-w-0 transition-all duration-250 ease-in-out ml-0 ${
            isCollapsed ? "md:ml-[72px]" : "md:ml-[260px]"
          }`}
        >
          {/* Mobile Sticky Header */}
          <header className="md:hidden h-[60px] bg-white border-b border-neutral-200 px-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="p-2 -ml-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <List size={24} weight="bold" />
            </button>
            <span className="font-heading font-extrabold text-[16px] text-ink-headline">Vendor Portal</span>
            <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center font-bold text-xs text-neutral-600">
              VP
            </div>
          </header>

          <main className="min-h-full p-4 md:p-8">{children}</main>
        </div>
      </div>
    </PartnerAuthGuard>
  );
}
