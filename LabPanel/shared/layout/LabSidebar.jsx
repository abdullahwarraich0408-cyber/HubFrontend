"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/utils/cn";
import {
  Flask,
  SquaresFour,
  CalendarCheck,
  TestTube,
  ChartBar,
  Gear,
  SignOut,
  ArrowLineLeft,
  ArrowLineRight,
} from "@phosphor-icons/react";
import { partnerAuthApi } from "@/lib/api/index";
import { useLabPortalProfile } from "@/lib/hooks/usePartnerPortal";
import { partnerRoutes } from "@/lib/constants/partnerRoutes";

export function LabSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { data: profile } = useLabPortalProfile();
  const routes = partnerRoutes.lab || partnerRoutes.doctor;
  const initials = profile?.name?.charAt(0)?.toUpperCase() || "L";

  const menuItems = [
    { name: "Dashboard", href: routes.dashboard, icon: SquaresFour },
    { name: "Bookings", href: routes.bookings, icon: CalendarCheck },
    { name: "Tests", href: routes.tests, icon: TestTube },
    { name: "Reports", href: routes.reports, icon: ChartBar },
    { name: "Settings", href: routes.settings, icon: Gear },
  ];

  const handleLogout = () => {
    partnerAuthApi.logout();
    router.push(routes.login);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-ink-900 z-40 transition-all duration-250 ease-in-out flex flex-col",
        isCollapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      <div className="h-[64px] flex items-center justify-between px-4 border-b border-white/10 shrink-0">
        {!isCollapsed && (
          <Link href={routes.dashboard} className="flex items-center gap-2 overflow-hidden">
            <Flask size={28} className="text-brand-primary shrink-0" weight="fill" />
            <span className="font-heading text-[20px] text-white tracking-tight whitespace-nowrap">
              Lab Portal
            </span>
          </Link>
        )}
        {isCollapsed && (
          <Link href={routes.dashboard} className="mx-auto">
            <Flask size={28} className="text-brand-primary shrink-0" weight="fill" />
          </Link>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "text-white/50 hover:text-white transition-colors shrink-0",
            isCollapsed && "absolute -right-3 top-[20px] bg-ink-800 rounded-full p-1 border border-white/10"
          )}
        >
          {isCollapsed ? <ArrowLineRight size={16} /> : <ArrowLineLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 py-6 px-3 flex flex-col gap-2 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "relative flex items-center h-[44px] rounded-lg transition-colors group",
                isCollapsed ? "justify-center px-0" : "px-3",
                isActive ? "bg-brand-primary/20" : "hover:bg-white/5"
              )}
              title={isCollapsed ? item.name : undefined}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-brand-primary rounded-l-lg" />
              )}
              <item.icon
                size={20}
                weight={isActive ? "fill" : "regular"}
                className={cn(
                  "shrink-0",
                  isActive ? "text-brand-primary" : "text-white/60 group-hover:text-white"
                )}
              />
              {!isCollapsed && (
                <span
                  className={cn(
                    "ml-3 text-[14px] font-medium whitespace-nowrap",
                    isActive ? "text-white" : "text-white/70 group-hover:text-white"
                  )}
                >
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 shrink-0">
        <Link
          href={routes.settings}
          className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-3")}
        >
          <div className="w-[40px] h-[40px] rounded-full bg-ink-800 border border-white/20 flex items-center justify-center shrink-0">
            <span className="text-[14px] font-bold text-white">{initials}</span>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-[14px] font-semibold text-white whitespace-nowrap truncate">
                {profile?.name || "Lab Partner"}
              </span>
              <span className="text-[11px] text-brand-primary uppercase font-semibold">Diagnostics</span>
            </div>
          )}
        </Link>
        {!isCollapsed && (
          <button
            onClick={handleLogout}
            className="w-full mt-4 flex items-center justify-center gap-2 h-[36px] rounded-md text-status-danger hover:bg-status-danger/10 transition-colors text-[13px] font-semibold"
          >
            <SignOut size={16} />
            Logout
          </button>
        )}
      </div>
    </aside>
  );
}
