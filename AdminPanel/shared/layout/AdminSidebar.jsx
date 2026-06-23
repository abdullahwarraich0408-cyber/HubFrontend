"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  House,
  Storefront,
  Pill,
  Users,
  Package,
  CurrencyDollar,
  ChartLineUp,
  Megaphone,
  Gear,
  SignOut,
  Buildings,
  ShieldCheck
} from "@phosphor-icons/react";

const navGroups = [
  {
    title: "Overview",
    items: [
      { name: "Executive Dashboard", path: "/admin", icon: House },
    ]
  },
  {
    title: "Marketplace",
    items: [
      { name: "Vendors & Pharmacies", path: "/admin/vendors", icon: Storefront },
      { name: "Hospitals", path: "/admin/hospitals", icon: Buildings },
      { name: "Doctors (Telehealth)", path: "/admin/doctors", icon: Users },
      { name: "Lab Partners", path: "/admin/labs", icon: Pill },
      { name: "Lab Bookings", path: "/admin/lab-bookings", icon: Package },
      { name: "Product Catalog", path: "/admin/products", icon: Package },
      { name: "Customer Profiles", path: "/admin/customers", icon: Users },
    ]
  },
  {
    title: "Operations",
    items: [
      { name: "Orders & Fulfillment", path: "/admin/orders", icon: Package },
      { name: "Prescription Orders", path: "/admin/prescription-orders", icon: Pill },
      { name: "Financial & Payouts", path: "/admin/finance", icon: CurrencyDollar },
      { name: "Analytics & Reports", path: "/admin/analytics", icon: ChartLineUp },
    ]
  },
  {
    title: "Configuration",
    items: [
      { name: "Marketing Tools", path: "/admin/marketing", icon: Megaphone },
      { name: "Audit & Security", path: "/admin/audit-logs", icon: ShieldCheck },
      { name: "System Settings", path: "/admin/settings", icon: Gear },
    ]
  }
];

import { api } from "@/lib/api";
import { toast } from "sonner";

export function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await api.auth.logout();
      toast.success("Signed out successfully");
      window.location.href = "/portal-access";
    } catch (err) {
      console.error("Logout error", err);
      window.location.href = "/portal-access";
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-white text-[#0C1A2E] flex flex-col z-50 transition-all duration-300 font-[var(--font-plus-jakarta-sans)] shadow-[1px_0_12px_rgba(0,0,0,0.03)] border-r border-[#0C1A2E]/5">
      {/* Brand Header */}
      <div className="h-[80px] flex items-center px-6 shrink-0 border-b border-[#0C1A2E]/5">
        <Link href="/admin" className="flex items-center gap-3 relative z-10 group w-full">
          <div className="w-9 h-9 rounded-xl bg-[#0B6E72] flex items-center justify-center shrink-0 group-hover:bg-[#084F52] transition-colors">
            <ShieldCheck size={20} className="text-white" weight="fill" />
          </div>
          <div className="flex flex-col">
            <span className="font-[var(--font-dm-serif-display)] text-xl tracking-wide text-[#0C1A2E] leading-tight group-hover:text-[#0B6E72] transition-colors">
              PharmaHub
            </span>
            <span className="text-[10px] font-bold text-[#B8860B] tracking-[0.2em] uppercase leading-none mt-0.5">
              Admin Portal
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-6 px-4 scrollbar-hide flex flex-col gap-6">
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="flex flex-col gap-1">
            <h4 className="px-3 mb-2 text-[11px] font-bold text-[#0C1A2E]/40 uppercase tracking-[0.15em]">
              {group.title}
            </h4>
            {group.items.map((item) => {
              const isActive = item.path === "/admin" 
                ? pathname === "/admin" 
                : pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-semibold group overflow-hidden ${
                    isActive
                      ? "text-[#0B6E72] bg-[#E6F4F5]"
                      : "text-[#0C1A2E]/60 hover:text-[#0C1A2E] hover:bg-[#F6F8FA]"
                  }`}
                >
                  <item.icon
                    size={20}
                    weight={isActive ? "fill" : "regular"}
                    className={`shrink-0 transition-transform duration-200 ${
                      isActive 
                        ? "text-[#0B6E72]" 
                        : "text-[#0C1A2E]/40 group-hover:text-[#0C1A2E]/80 group-hover:scale-110"
                    }`}
                  />
                  <span className="whitespace-nowrap tracking-wide">{item.name}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Area */}
      <div className="p-4 mt-auto border-t border-[#0C1A2E]/5">
        <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full p-2.5 rounded-lg text-[#0C1A2E]/60 hover:text-[#DC2626] hover:bg-[#DC2626]/10 transition-colors text-sm font-semibold group">
          <SignOut size={18} weight="bold" className="group-hover:translate-x-0.5 transition-transform" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
