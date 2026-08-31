"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PartnerAuthGuard } from "@/shared/components/PartnerAuthGuard";
import { DoctorSidebar } from "@/shared/layout/DoctorSidebar";
import { DoctorNotifications } from "@/features/doctor-panel/components/DoctorNotifications";
import { useDoctorProfile } from "@/features/doctor-panel/hooks/useDoctorProfile";
import { Menu, Clock, Sparkles } from "lucide-react";
import { partnerRoutes } from "@/lib/constants/partnerRoutes";
import { cn } from "@/utils/cn";
import { resolvePhotoUrl } from "@/features/doctor-panel/pages/DoctorSettingsPage";

export function DoctorDashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { profile, initials } = useDoctorProfile();
  const photoUrl = resolvePhotoUrl(profile?.photo || profile?.photo_url);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("medzoos_doctor_sidebar_collapsed");
      if (saved !== null) {
        setIsCollapsed(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const handleToggleCollapse = (val) => {
    setIsCollapsed(val);
    try {
      localStorage.setItem("medzoos_doctor_sidebar_collapsed", JSON.stringify(val));
    } catch {}
  };

  return (
    <PartnerAuthGuard role="doctor">
      <div className="min-h-screen bg-[#F5F9FB] text-slate-800 font-sans antialiased selection:bg-teal-500/20 selection:text-teal-700">
        <DoctorSidebar
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          isCollapsed={isCollapsed}
          setIsCollapsed={handleToggleCollapse}
        />

        {/* Main Layout Container */}
        <div
          className={cn(
            "transition-all duration-200 ease-in-out flex flex-col min-h-screen",
            isCollapsed ? "md:pl-[72px]" : "md:pl-[250px]"
          )}
        >
          
          {/* Gen-Z Ultra-Glass Top Header Bar */}
          <header className="sticky top-0 z-30 h-16 bg-[#060B16]/92 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 flex items-center justify-between text-white shadow-lg shadow-slate-950/20">
            
            {/* Left: Mobile Toggle & Gen-Z Pill Badge */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden p-2 rounded-2xl text-slate-300 hover:text-white hover:bg-white/10 transition-all border border-white/10 active:scale-95"
                aria-label="Open Navigation Drawer"
              >
                <Menu size={20} />
              </button>

              <div className="flex items-center gap-3">
                {/* Gen-Z Online Status Pill */}
                <div className="hidden sm:flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-cyan-500/15 border border-teal-400/30 text-teal-300 text-[11px] font-mono font-bold tracking-wider uppercase shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse shadow-md shadow-teal-400" />
                  <span>⚡ 100% ONLINE & ACTIVE</span>
                </div>

                <div className="md:hidden flex items-center gap-2.5">
                  <img
                    src="/images/medzoos-mark-on-dark.png"
                    alt="Medzoos"
                    className="h-10 w-10 object-contain"
                  />
                  <span className="font-extrabold text-sm text-white tracking-tight">Medzoos</span>
                </div>
              </div>
            </div>

            {/* Right: Gen-Z Quick Actions & Profile Pill */}
            <div className="flex items-center gap-3">
              <Link
                href={partnerRoutes.doctor.schedule}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-teal-500/20 via-cyan-500/20 to-emerald-500/20 hover:from-teal-500/30 hover:to-cyan-500/30 text-teal-200 border border-teal-400/40 text-xs font-extrabold tracking-wide transition-all active:scale-95 shadow-md shadow-teal-500/10"
              >
                <Sparkles size={14} className="text-teal-300" />
                <span>Schedule</span>
              </Link>

              {/* Notification Drawer Trigger */}
              <DoctorNotifications />

              {/* Gen-Z Profile Pill */}
              <Link
                href={partnerRoutes.doctor.settings}
                className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 transition-all group active:scale-95 shadow-xs"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-tr from-teal-400 via-emerald-400 to-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center shadow-md shadow-teal-400/25 ring-2 ring-teal-400/30 shrink-0">
                  {photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photoUrl} alt={profile?.name || "Doctor"} className="w-full h-full object-cover" />
                  ) : (
                    initials || "DR"
                  )}
                </div>
                <div className="hidden md:flex flex-col text-left max-w-[150px] lg:max-w-[220px]">
                  <span className="text-xs font-bold text-slate-100 group-hover:text-teal-300 transition-colors leading-tight truncate">
                    {profile?.name || "Dr. Physician"}
                  </span>
                  <span className="text-[10px] text-teal-400 font-mono font-medium truncate">
                    {profile?.specialty || "Specialist"}
                  </span>
                </div>
              </Link>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1536px] w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </PartnerAuthGuard>
  );
}


