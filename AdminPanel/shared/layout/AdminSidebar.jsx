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
  FirstAidKit,
  Stethoscope,
  Flag,
  Globe,
  MagnifyingGlass,
  EnvelopeSimple,
} from "@phosphor-icons/react";
import { toast } from "sonner";

const navGroups = [
  {
    title: "OVERVIEW",
    items: [
      { name: "Executive Dashboard", path: "/admin", icon: House },
    ]
  },
  {
    title: "MARKETPLACE",
    items: [
      { name: "Vendors & Pharmacies", path: "/admin/vendors", icon: Storefront },
      { name: "Hospitals Network", path: "/admin/hospitals", icon: Buildings },
      { name: "Telehealth Doctors", path: "/admin/doctors", icon: Users },
      { name: "Lab Partners", path: "/admin/labs", icon: Pill },
      { name: "Lab Bookings", path: "/admin/lab-bookings", icon: Package },
      { name: "Product Catalog", path: "/admin/products", icon: Package },
      { name: "Customer Directory", path: "/admin/customers", icon: Users },
    ]
  },
  {
    title: "OPERATIONS",
    items: [
      { name: "Orders & Fulfillment", path: "/admin/orders", icon: Package },
      { name: "Leads & Inquiries", path: "/admin/inquiries", icon: EnvelopeSimple },
      { name: "Prescription Orders", path: "/admin/prescription-orders", icon: Pill },
      { name: "Financial & Payouts", path: "/admin/finance", icon: CurrencyDollar },
      { name: "Analytics & Reports", path: "/admin/analytics", icon: ChartLineUp },
    ]
  },
  {
    title: "CONTENT & APP",
    items: [
      { name: "Content Studio", path: "/admin/content", icon: SquaresFour },
      { name: "Home Posters", path: "/admin/home-posters", icon: Images },
      { name: "Care Actions", path: "/admin/content/care-actions", icon: FirstAidKit },
      { name: "Specialties", path: "/admin/content/specialties", icon: Stethoscope },
      { name: "Banners & Promos", path: "/admin/content/banners", icon: Flag },
      { name: "Site Details", path: "/admin/content/site", icon: Globe },
    ]
  },
  {
    title: "SYSTEM & SECURITY",
    items: [
      { name: "Marketing Tools", path: "/admin/marketing", icon: Megaphone },
      { name: "Audit & Security Logs", path: "/admin/audit-logs", icon: ShieldCheck },
      { name: "System Settings", path: "/admin/settings", icon: Gear },
    ]
  }
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

  const filteredGroups = navGroups.map(group => ({
    ...group,
    items: group.items.filter(item => 
      !searchQuery.trim() || item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(g => g.items.length > 0);

  return (
    <aside className="fixed left-0 top-0 h-full w-[270px] bg-[#082B3F] text-white flex flex-col z-50 font-[var(--font-plus-jakarta-sans)] border-r border-white/10 select-none overflow-hidden">
      
      {/* Brand Header */}
      <div className="h-[76px] flex items-center px-5 shrink-0 border-b border-white/10">
        <Link href="/admin" className="flex flex-col gap-1.5 group w-full min-w-0">
          <div className="flex items-center gap-2">
            <img
              src="/images/medzoos-wordmark-on-dark.png"
              alt="Medzoos"
              className="h-9 sm:h-10 w-auto max-w-[200px] object-contain object-left"
            />
            <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-widest uppercase bg-[#17618E]/30 text-[#0FA7E3] rounded border border-[#17618E]/40">
              PRO
            </span>
          </div>
          <span className="text-[10px] font-medium text-white/45 uppercase tracking-widest pl-0.5">
            Admin Portal
          </span>
        </Link>
      </div>

      {/* Minimal Search Input */}
      <div className="px-4 pt-4 pb-2">
        <div className="relative group">
          <MagnifyingGlass size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search menu..."
            className="w-full h-9 pl-9 pr-8 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/40 outline-none focus:border-white/30 focus:bg-white/10 transition-all font-medium"
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

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-4 scrollbar-none">
        {filteredGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="bg-white/[0.03] border border-white/10 rounded-2xl p-2 space-y-1">
            <div className="px-2.5 py-1 mb-1 bg-white/5 rounded-lg border border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-white/50 uppercase tracking-widest">
                {group.title}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
            </div>

            {group.items.map((item) => {
              const isActive = item.path === "/admin" 
                ? pathname === "/admin" 
                : pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`relative flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 text-xs font-semibold ${
                    isActive
                      ? "bg-white/15 text-white font-bold border-l-2 border-white shadow-sm"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <item.icon
                    size={17}
                    weight={isActive ? "fill" : "regular"}
                    className={`shrink-0 transition-colors ${
                      isActive ? "text-white" : "text-white/40 group-hover:text-white/80"
                    }`}
                  />
                  <span className="whitespace-nowrap tracking-wide">{item.name}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Minimal Profile Footer */}
      <div className="p-3 border-t border-white/10 bg-[#0A0F1D] space-y-2">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-xs font-bold text-white shrink-0">
              SA
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-white truncate">Super Admin</span>
              <span className="text-[10px] text-white/40 truncate font-mono">admin@medzoos.com</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Sign Out"
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 text-white/60 hover:text-white border border-white/10 flex items-center justify-center transition-colors shrink-0"
          >
            <SignOut size={16} weight="bold" />
          </button>
        </div>
      </div>
    </aside>
  );
}


