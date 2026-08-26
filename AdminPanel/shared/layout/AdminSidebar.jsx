"use client";

import { useState } from "react";
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
  ShieldCheck,
  Images,
  SquaresFour,
  Stethoscope,
  Flag,
  Globe,
  MagnifyingGlass,
  EnvelopeSimple,
  CaretDown,
  CaretRight,
  Flask,
  CalendarCheck,
} from "@phosphor-icons/react";
import { toast } from "sonner";

const navSections = [
  {
    id: "main",
    title: "MAIN",
    items: [
      { name: "Dashboard", path: "/admin", icon: House },
      { name: "Analytics", path: "/admin/analytics", icon: ChartLineUp },
    ],
  },
  {
    id: "operations",
    title: "OPERATIONS",
    items: [
      { name: "Orders", path: "/admin/orders", icon: Package },
      { name: "Prescriptions", path: "/admin/prescription-orders", icon: Pill },
      { name: "Lab Bookings", path: "/admin/lab-bookings", icon: CalendarCheck },
      { name: "Finances & Payouts", path: "/admin/finance", icon: CurrencyDollar },
      { name: "Inquiries & Leads", path: "/admin/inquiries", icon: EnvelopeSimple },
    ],
  },
  {
    id: "network",
    title: "HEALTHCARE NETWORK",
    items: [
      { name: "Pharmacies", path: "/admin/vendors", icon: Storefront },
      { name: "Doctors", path: "/admin/doctors", icon: Stethoscope },
      { name: "Hospitals", path: "/admin/hospitals", icon: Buildings },
      { name: "Lab Partners", path: "/admin/labs", icon: Flask },
      { name: "Product Catalog", path: "/admin/products", icon: SquaresFour },
      { name: "Patients Directory", path: "/admin/customers", icon: Users },
    ],
  },
  {
    id: "content",
    title: "APP & CONTENT",
    items: [
      { name: "Content Studio", path: "/admin/content", icon: Images },
      { name: "Home Posters", path: "/admin/home-posters", icon: Flag },
      { name: "Specialties", path: "/admin/content/specialties", icon: Stethoscope },
      { name: "Marketing Tools", path: "/admin/marketing", icon: Megaphone },
    ],
  },
  {
    id: "system",
    title: "SYSTEM",
    items: [
      { name: "Audit Logs", path: "/admin/audit-logs", icon: ShieldCheck },
      { name: "System Settings", path: "/admin/settings", icon: Gear },
    ],
  },
];

function clearAdminSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("medzoos_user");
  localStorage.removeItem("sehat1_user");
  localStorage.removeItem("pharmahub_user");
}

export function AdminSidebar() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedGroups, setCollapsedGroups] = useState({});

  const toggleGroup = (groupId) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const handleLogout = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const refreshToken =
      typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;

    clearAdminSession();

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";
      await Promise.race([
        fetch(`${API_BASE}/auth/logout`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(token && token !== "cookie-auth-active"
              ? { Authorization: `Bearer ${token}` }
              : {}),
          },
          body: JSON.stringify({ refreshToken }),
        }),
        new Promise((resolve) => setTimeout(resolve, 2000)),
      ]);
    } catch (err) {
      console.error("Logout error", err);
    }

    toast.success("Signed out safely");
    window.location.href = "/portal-access";
  };

  const filteredSections = navSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((s) => s.items.length > 0);

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-[#072435] text-white flex flex-col z-50 font-[var(--font-plus-jakarta-sans)] border-r border-white/10 select-none shadow-2xl">
      
      {/* Brand Header */}
      <div className="h-[70px] flex items-center px-5 shrink-0 border-b border-white/[0.08] bg-[#061D2B]">
        <Link href="/admin" className="flex items-center justify-between w-full group">
          <div className="flex items-center gap-2.5">
            <img
              src="/images/medzoos-wordmark-on-dark.png"
              alt="Medzoos"
              className="h-8 w-auto max-w-[150px] object-contain object-left transition-transform group-hover:scale-[1.02]"
            />
            <span className="px-1.5 py-0.5 text-[9px] font-mono font-extrabold tracking-wider uppercase bg-[#0FA7E3]/20 text-[#0FA7E3] rounded border border-[#0FA7E3]/30">
              ADMIN
            </span>
          </div>
        </Link>
      </div>

      {/* Modern Search Input */}
      <div className="px-3.5 pt-3.5 pb-2">
        <div className="relative group">
          <MagnifyingGlass
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#0FA7E3] transition-colors"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Quick search..."
            className="w-full h-8 pl-8 pr-7 bg-white/[0.05] border border-white/[0.08] rounded-lg text-xs text-white placeholder-white/40 outline-none focus:border-[#0FA7E3]/60 focus:bg-white/[0.08] focus:ring-1 focus:ring-[#0FA7E3]/30 transition-all font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-white/40 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3.5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {filteredSections.map((section) => {
          const isCollapsed = Boolean(collapsedGroups[section.id] && !searchQuery.trim());

          return (
            <div key={section.id} className="space-y-0.5">
              {/* Clean Section Header */}
              <button
                type="button"
                onClick={() => toggleGroup(section.id)}
                className="w-full flex items-center justify-between px-2.5 py-1 text-[10px] font-mono font-bold tracking-wider text-white/40 uppercase hover:text-white/70 transition-colors group"
              >
                <span>{section.title}</span>
                <span className="text-white/30 group-hover:text-white/60 transition-transform">
                  {isCollapsed ? <CaretRight size={10} weight="bold" /> : <CaretDown size={10} weight="bold" />}
                </span>
              </button>

              {/* Section Links */}
              {!isCollapsed && (
                <div className="space-y-0.5 pt-0.5">
                  {section.items.map((item) => {
                    const isActive =
                      item.path === "/admin"
                        ? pathname === "/admin"
                        : pathname.startsWith(item.path);

                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        className={`relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 group ${
                          isActive
                            ? "bg-[#0FA7E3]/15 text-white font-bold border-l-2 border-[#0FA7E3] shadow-sm shadow-black/20"
                            : "text-white/65 hover:text-white hover:bg-white/[0.06]"
                        }`}
                      >
                        <item.icon
                          size={16}
                          weight={isActive ? "fill" : "regular"}
                          className={`shrink-0 transition-colors ${
                            isActive
                              ? "text-[#0FA7E3]"
                              : "text-white/40 group-hover:text-white/80"
                          }`}
                        />
                        <span className="whitespace-nowrap tracking-normal truncate">
                          {item.name}
                        </span>

                        {isActive && (
                          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#0FA7E3] shadow-sm shadow-[#0FA7E3]" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Professional Profile & Quick Signout Footer */}
      <div className="p-3 border-t border-white/[0.08] bg-[#051824] shrink-0">
        <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] transition-colors">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0FA7E3] to-[#17618E] flex items-center justify-center text-xs font-extrabold text-white shrink-0 shadow-sm">
              SA
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white truncate">Super Admin</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
              <span className="text-[10px] text-white/40 truncate font-mono">
                admin@medzoos.com
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Sign Out"
            className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-rose-500/20 text-white/50 hover:text-rose-400 border border-white/[0.08] hover:border-rose-500/30 flex items-center justify-center transition-all shrink-0 ml-1"
          >
            <SignOut size={15} weight="bold" />
          </button>
        </div>
      </div>
    </aside>
  );
}
