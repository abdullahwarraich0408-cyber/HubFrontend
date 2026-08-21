"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/utils/cn";
import {
  LayoutDashboard,
  CalendarCheck,
  Clock,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Bell
} from "lucide-react";
import { partnerAuthApi } from "@/lib/api/index";
import { useDoctorProfile } from "@/features/doctor-panel/hooks/useDoctorProfile";
import { partnerRoutes } from "@/lib/constants/partnerRoutes";
import { PartnerBrandLockup } from "@/shared/branding/PartnerBrandMark";

export function DoctorSidebar({ mobileOpen, setMobileOpen }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { profile, initials } = useDoctorProfile();
  const routes = partnerRoutes.doctor;

  const menuItems = [
    { name: "Overview", href: routes.dashboard, icon: LayoutDashboard },
    { name: "Appointments", href: routes.appointments, icon: CalendarCheck },
    { name: "Schedule", href: routes.schedule, icon: Clock },
    { name: "Patients", href: routes.patients, icon: Users },
    { name: "Settings", href: routes.settings, icon: Settings },
  ];

  const handleLogout = () => {
    partnerAuthApi.logout();
    router.push(routes.login);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden transition-opacity duration-200"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 h-full bg-[#082B3F] border-r border-white/10 z-50 transition-all duration-200 ease-in-out flex flex-col shadow-xl",
          // Mobile responsive drawer classes
          mobileOpen ? "translate-x-0 w-[260px]" : "-translate-x-full md:translate-x-0",
          // Desktop/Tablet collapse classes
          isCollapsed ? "md:w-[72px]" : "md:w-[250px]"
        )}
      >
        {/* Header */}
        <div className="h-[64px] flex items-center justify-between px-4 border-b border-white/10 shrink-0">
          <PartnerBrandLockup
            href={routes.dashboard}
            collapsed={isCollapsed && !mobileOpen}
            title="Doctor Portal"
          />

          {/* Desktop/Tablet Collapse toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800/60"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-slate-400 hover:text-white transition-colors p-1.5"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 py-4 px-3 flex flex-col gap-1 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen?.(false)}
                className={cn(
                  "relative flex items-center h-[42px] rounded-lg transition-all duration-150 group text-sm font-medium",
                  isCollapsed && !mobileOpen ? "justify-center px-0" : "px-3",
                  isActive
                    ? "bg-slate-800 text-white font-semibold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                )}
                title={isCollapsed && !mobileOpen ? item.name : undefined}
              >
                {/* Thin left indicator for active route */}
                {isActive && (
                  <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#0FA7E3] rounded-r-full" />
                )}
                <Icon
                  size={19}
                  className={cn(
                    "shrink-0 transition-colors",
                    isActive ? "text-[#0FA7E3]" : "text-slate-400 group-hover:text-slate-200"
                  )}
                />
                {(!isCollapsed || mobileOpen) && (
                  <span className="ml-3 truncate">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Doctor profile Footer */}
        <div className="p-3 border-t border-slate-800/80 shrink-0 bg-slate-900/50">
          <div className={cn("flex items-center gap-3", isCollapsed && !mobileOpen && "justify-center")}>
            <div className="w-[38px] h-[38px] rounded-full bg-[#17618E]/20 border border-[#17618E]/40 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-[#0FA7E3]">{initials || "DR"}</span>
            </div>
            {(!isCollapsed || mobileOpen) && (
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-semibold text-slate-100 truncate">{profile.name}</span>
                <span className="text-[11px] text-slate-400 truncate">{profile.specialty}</span>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className={cn(
              "w-full mt-3 flex items-center justify-center gap-2 h-[34px] rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors text-xs font-medium border border-slate-800 hover:border-rose-500/20",
              isCollapsed && !mobileOpen && "px-0"
            )}
            title="Sign out"
          >
            <LogOut size={15} />
            {(!isCollapsed || mobileOpen) && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

