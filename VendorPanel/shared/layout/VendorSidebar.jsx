"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/utils/cn";
import {
  FileText,
  SquaresFour,
  Pill,
  PlusCircle,
  Package,
  ChartLineUp,
  Gear,
  SignOut,
  ArrowLineLeft,
  ArrowLineRight,
  X,
  Warehouse,
  ArrowUUpLeft,
  Wallet,
  Bell,
  UsersThree,
} from "@phosphor-icons/react";
import { partnerRoutes } from "@/lib/constants/partnerRoutes";
import { partnerAuthApi } from "@/lib/api/index";
import { useVendorProfile } from "@/lib/hooks/useApi";
import { PartnerBrandLockup } from "@/shared/branding/PartnerBrandMark";

const SIDEBAR_KEY = "medzoos.vendor.sidebarCollapsed";

export function VendorSidebar({ isMobileOpen, setIsMobileOpen, isCollapsed, setIsCollapsed }) {
  const pathname = usePathname();
  const router = useRouter();
  const routes = partnerRoutes.vendor;
  const { data: vendorProfile } = useVendorProfile();

  useEffect(() => {
    if (setIsMobileOpen) setIsMobileOpen(false);
  }, [pathname, setIsMobileOpen]);

  const initials = (vendorProfile?.business_name || "V")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    partnerAuthApi.logout();
    router.push(routes.login);
  };

  const menuItems = [
    { name: "Dashboard", href: routes.dashboard, icon: SquaresFour },
    { name: "My Products", href: routes.products, icon: Pill },
    { name: "Add Product", href: routes.productsNew, icon: PlusCircle },
    { name: "Inventory", href: routes.inventory, icon: Warehouse },
    { name: "Orders", href: routes.orders, icon: Package },
    { name: "Prescription Orders", href: routes.prescriptionOrders, icon: FileText },
    { name: "Returns", href: routes.returns, icon: ArrowUUpLeft },
    { name: "Sales Report", href: routes.salesReport, icon: ChartLineUp },
    { name: "Payouts", href: routes.payouts, icon: Wallet },
    { name: "Notifications", href: routes.notifications, icon: Bell },
    { name: "Staff", href: routes.staff, icon: UsersThree },
    { name: "Account Settings", href: routes.accountSettings, icon: Gear },
  ];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-[var(--color-ink-900)] z-50 transition-all duration-300 ease-in-out flex flex-col",
        isCollapsed ? "md:w-[80px]" : "md:w-[276px]",
        "w-[276px]",
        isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
    >
      <div className="h-[64px] flex items-center justify-between px-4 border-b border-white/10 shrink-0 gap-2">
        <PartnerBrandLockup
          href={routes.dashboard}
          collapsed={isCollapsed}
          title="Vendor Portal"
        />
        <button
          type="button"
          onClick={() => {
            const next = !isCollapsed;
            setIsCollapsed(next);
            try {
              localStorage.setItem(SIDEBAR_KEY, String(next));
            } catch {
              /* ignore */
            }
          }}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "hidden md:block text-white/50 hover:text-white transition-colors shrink-0",
            isCollapsed && "absolute -right-3 top-[20px] bg-ink-800 rounded-full p-1 border border-white/10"
          )}
        >
          {isCollapsed ? <ArrowLineRight size={16} /> : <ArrowLineLeft size={20} />}
        </button>
        <button type="button" onClick={() => setIsMobileOpen(false)} className="block md:hidden text-white/50 hover:text-white" aria-label="Close menu">
          <X size={24} />
        </button>
      </div>

      <nav className="flex-1 py-6 px-3 flex flex-col gap-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== routes.dashboard && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              title={isCollapsed ? item.name : undefined}
              aria-label={item.name}
              className={cn(
                "relative flex items-center h-[44px] rounded-lg transition-colors group",
                isCollapsed ? "justify-center px-0" : "px-3",
                isActive ? "bg-[#0A3D52]" : "hover:bg-[#10243C]"
              )}
            >
              {isActive && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-brand-primary rounded-l-lg" />}
              <item.icon size={20} weight={isActive ? "fill" : "regular"} className={cn("shrink-0", isActive ? "text-brand-primary" : "text-white/60 group-hover:text-white")} />
              {!isCollapsed && (
                <span className={cn("ml-3 text-[14px] font-medium whitespace-nowrap", isActive ? "text-white" : "text-white/70 group-hover:text-white")}>
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 shrink-0">
        <div className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-3")}>
          <div className="w-[40px] h-[40px] rounded-full bg-ink-800 border border-white/20 flex items-center justify-center shrink-0 overflow-hidden">
            {vendorProfile?.logo_url ? (
              <img src={vendorProfile.logo_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-[14px] font-bold text-white">{initials}</span>
            )}
          </div>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-[14px] font-semibold text-white whitespace-nowrap truncate">{vendorProfile?.business_name || "Vendor"}</span>
              <span className="text-[11px] text-brand-primary uppercase font-semibold">Vendor</span>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <button
            type="button"
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

export function usePersistedSidebarCollapsed() {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem(SIDEBAR_KEY) === "true";
    } catch {
      return false;
    }
  });
  return [isCollapsed, setIsCollapsed];
}
