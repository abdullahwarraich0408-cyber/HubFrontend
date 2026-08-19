"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FlaskConical,
  LayoutDashboard,
  CalendarCheck,
  TestTube,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { partnerAuthApi } from "@/lib/api/index";
import { useLabPortalProfile } from "@/lib/hooks/usePartnerPortal";
import { partnerRoutes } from "@/lib/constants/partnerRoutes";

const STORAGE_COLLAPSE_KEY = "medzoos_lab_sidebar_collapsed";

export function LabSidebar({ onCollapseChange, mobileOpen, onMobileClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: profile } = useLabPortalProfile();
  const routes = partnerRoutes.lab;

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_COLLAPSE_KEY);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        setIsCollapsed(parsed);
        onCollapseChange?.(parsed);
      }
    } catch {
      // Ignore
    }
  }, [onCollapseChange]);

  const toggleCollapse = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    onCollapseChange?.(next);
    try {
      localStorage.setItem(STORAGE_COLLAPSE_KEY, JSON.stringify(next));
    } catch {
      // Ignore
    }
  };

  const labName = profile?.name || "IDC";
  const initials = labName.charAt(0).toUpperCase() || "I";

  const menuItems = [
    { name: "Dashboard", href: routes.dashboard, icon: LayoutDashboard },
    { name: "Bookings", href: routes.bookings, icon: CalendarCheck },
    { name: "Tests", href: routes.tests, icon: TestTube },
    { name: "Reports", href: routes.reports, icon: BarChart3 },
    { name: "Settings", href: routes.settings, icon: Settings },
  ];

  const handleLogout = () => {
    partnerAuthApi.logout();
    router.push(routes.login);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#071A30] text-white select-none">
      {/* Top Header */}
      <div className="h-[72px] flex items-center justify-between px-5 border-b border-white/10 shrink-0">
        {!isCollapsed ? (
          <Link
            href={routes.dashboard}
            className="flex items-center gap-3 overflow-hidden group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#087F82]/20 flex items-center justify-center shrink-0 border border-[#087F82]/30 group-hover:scale-105 transition-transform">
              <FlaskConical className="w-5 h-5 text-[#087F82]" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-[20px] font-bold text-white tracking-tight leading-tight">
                Lab Portal
              </span>
              <span className="text-[10px] text-white/50 tracking-wider font-semibold uppercase">
                Medzoos
              </span>
            </div>
          </Link>
        ) : (
          <Link href={routes.dashboard} className="mx-auto" title="Lab Portal">
            <div className="w-9 h-9 rounded-lg bg-[#087F82]/20 flex items-center justify-center shrink-0 border border-[#087F82]/30">
              <FlaskConical className="w-5 h-5 text-[#087F82]" />
            </div>
          </Link>
        )}

        {/* Desktop Collapse Button */}
        <button
          type="button"
          onClick={toggleCollapse}
          className="hidden md:flex text-white/50 hover:text-white p-1.5 rounded-md hover:bg-white/5 transition-colors shrink-0"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>

        {/* Mobile Close Button */}
        <button
          type="button"
          onClick={onMobileClose}
          className="md:hidden text-white/60 hover:text-white p-1.5 rounded-md"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-3.5 flex flex-col gap-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== routes.dashboard && pathname.startsWith(`${item.href}`));

          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onMobileClose}
              className={cn(
                "relative flex items-center h-[46px] rounded-lg transition-all duration-150 group",
                isCollapsed ? "justify-center px-0" : "px-3.5",
                isActive
                  ? "bg-[#0A3445] text-white font-semibold shadow-xs"
                  : "text-white/70 hover:text-white hover:bg-[#0E294B]"
              )}
              title={isCollapsed ? item.name : undefined}
            >
              {/* Teal Accent Line on Far Left */}
              {isActive && (
                <div className="absolute left-0 top-1.5 bottom-1.5 w-[3.5px] bg-[#087F82] rounded-r" />
              )}

              <Icon
                size={20}
                className={cn(
                  "shrink-0 transition-colors",
                  isActive
                    ? "text-[#087F82]"
                    : "text-white/60 group-hover:text-white"
                )}
              />

              {!isCollapsed && (
                <span
                  className={cn(
                    "ml-3 text-[14px] tracking-tight whitespace-nowrap",
                    isActive ? "text-white font-medium" : "text-white/75"
                  )}
                >
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile & Logout */}
      <div className="p-4 border-t border-white/10 shrink-0 bg-[#071A30]">
        <Link
          href={routes.settings}
          onClick={onMobileClose}
          className={cn(
            "flex items-center p-2 rounded-xl hover:bg-white/5 transition-colors group",
            isCollapsed ? "justify-center" : "gap-3"
          )}
          title={isCollapsed ? `${labName} (Settings)` : undefined}
        >
          <div className="w-[42px] h-[42px] rounded-full bg-[#0E294B] border border-white/20 flex items-center justify-center shrink-0 shadow-inner group-hover:border-[#087F82] transition-colors">
            <span className="text-[15px] font-bold text-white tracking-wider">
              {initials}
            </span>
          </div>

          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden text-left">
              <span className="text-[14px] font-bold text-white tracking-tight truncate group-hover:text-[#7DD3D8] transition-colors">
                {labName}
              </span>
              <span className="text-[11px] font-bold text-[#087F82] uppercase tracking-wider">
                DIAGNOSTICS
              </span>
            </div>
          )}
        </Link>

        {/* Logout Button */}
        {!isCollapsed ? (
          <button
            type="button"
            onClick={handleLogout}
            className="w-full mt-3 flex items-center justify-center gap-2 h-[38px] rounded-lg text-[#EF233C] hover:bg-[#EF233C]/10 transition-colors text-[13px] font-semibold"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleLogout}
            title="Logout"
            className="w-full mt-3 flex items-center justify-center h-[38px] rounded-lg text-[#EF233C] hover:bg-[#EF233C]/10 transition-colors"
          >
            <LogOut size={18} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed) */}
      <aside
        className={cn(
          "hidden md:block fixed left-0 top-0 h-screen z-40 transition-all duration-250 ease-in-out border-r border-neutral-800 shadow-lg",
          isCollapsed ? "w-[80px]" : "w-[280px]"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onMobileClose}
          />
          <div className="relative w-[280px] h-full shadow-2xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
