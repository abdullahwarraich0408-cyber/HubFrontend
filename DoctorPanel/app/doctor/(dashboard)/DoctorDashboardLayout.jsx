"use client";

import { useState } from "react";
import { PartnerAuthGuard } from "@/shared/components/PartnerAuthGuard";
import { DoctorSidebar } from "@/shared/layout/DoctorSidebar";
import { Menu, Stethoscope } from "lucide-react";

export function DoctorDashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <PartnerAuthGuard role="doctor">
      <div className="min-h-screen bg-slate-50/75 text-slate-800 font-sans antialiased selection:bg-teal-500/20 selection:text-teal-700">
        <DoctorSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        {/* Mobile Header Bar */}
        <header className="md:hidden sticky top-0 z-30 h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between text-white shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Open Navigation Drawer"
            >
              <Menu size={22} />
            </button>
            <div className="flex items-center gap-2">
              <Stethoscope size={20} className="text-teal-400" />
              <span className="font-semibold text-sm tracking-tight">Medzoos Doctor</span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="transition-all duration-200 ease-in-out md:pl-[250px]">
          <main className="min-h-[calc(100vh-3.5rem)] md:min-h-screen p-4 sm:p-6 lg:p-8 max-w-[1536px] mx-auto">
            {children}
          </main>
        </div>
      </div>
    </PartnerAuthGuard>
  );
}

