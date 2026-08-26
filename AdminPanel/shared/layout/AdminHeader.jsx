"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { 
  MagnifyingGlass, 
  Globe, 
  ShieldCheck,
  Clock,
  CaretDown,
  SignOut,
  Gear,
  ChartLineUp,
  Storefront,
  Stethoscope,
  Buildings,
  Flask,
  Package,
  Pill,
  CalendarCheck,
  Tag,
  ArrowSquareOut,
  X,
  Check,
  User,
  Sparkle
} from "@phosphor-icons/react";
import { NotificationInbox } from "@/shared/notifications/NotificationInbox";
import { getAdminSocket } from "@/lib/socket";
import { clearAdminSession } from "@/lib/auth/adminSession";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

const QUICK_SEARCH_ITEMS = [
  { name: "Executive Dashboard", path: "/admin", category: "Core Navigation", icon: ChartLineUp },
  { name: "Doctor Management", path: "/admin/doctors", category: "Healthcare Network", icon: Stethoscope },
  { name: "Hospital Network", path: "/admin/hospitals", category: "Healthcare Network", icon: Buildings },
  { name: "Pharmacy & Vendors", path: "/admin/vendors", category: "Healthcare Network", icon: Storefront },
  { name: "Diagnostic Lab Partners", path: "/admin/labs", category: "Healthcare Network", icon: Flask },
  { name: "Order Fulfillment Queue", path: "/admin/orders", category: "Operations", icon: Package },
  { name: "Prescription Verifications", path: "/admin/prescription-orders", category: "Operations", icon: Pill },
  { name: "Lab Test Bookings", path: "/admin/lab-bookings", category: "Operations", icon: CalendarCheck },
  { name: "Marketing & Offers", path: "/admin/marketing", category: "Growth & Content", icon: Tag },
  { name: "Security & Audit Trail", path: "/admin/audit-logs", category: "System", icon: ShieldCheck },
  { name: "System Settings", path: "/admin/settings", category: "System", icon: Gear },
];

export function AdminHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [time, setTime] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPortalsOpen, setIsPortalsOpen] = useState(false);

  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const portalsRef = useRef(null);

  // Live Realtime Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
        " · " +
        now.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard shortcut for search (/ and Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === "/" || (e.ctrlKey && e.key === "k")) && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsProfileOpen(false);
        setIsPortalsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
      if (portalsRef.current && !portalsRef.current.contains(e.target)) {
        setIsPortalsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter search matches
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return QUICK_SEARCH_ITEMS;
    const q = searchQuery.toLowerCase();
    return QUICK_SEARCH_ITEMS.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.path.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleSelectSearch = (path) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    router.push(path);
  };

  const handleLogout = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;

    clearAdminSession();

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";
      await Promise.race([
        fetch(`${API_BASE}/auth/logout`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(token && token !== "cookie-auth-active" ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ refreshToken }),
        }),
        new Promise((resolve) => setTimeout(resolve, 1500)),
      ]);
    } catch (err) {
      console.error("Logout error", err);
    }

    toast.success("Signed out safely");
    window.location.href = "/portal-access";
  };

  return (
    <header className="sticky top-0 z-40 h-[72px] bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 sm:px-8 flex items-center justify-between shadow-[0_1px_8px_rgba(8,43,63,0.04)] font-[var(--font-plus-jakarta-sans)] transition-all">
      
      {/* Left: Global Command Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-lg relative" ref={searchRef}>
        <div className="relative w-full group">
          <MagnifyingGlass
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0FA7E3] transition-colors"
          />
          <input
            type="text"
            placeholder="Search doctors, hospitals, pharmacies, orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchOpen(true)}
            className="w-full h-10 pl-10 pr-12 rounded-xl bg-slate-50 border border-slate-200/90 text-xs font-semibold text-[#082B3F] placeholder-slate-400 outline-none focus:bg-white focus:border-[#082B3F] focus:ring-2 focus:ring-[#082B3F]/10 transition-all"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-white text-slate-400 rounded-md border border-slate-200 shadow-2xs">
              /
            </kbd>
          </div>
        </div>

        {/* Command Search Dropdown Overlay */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-2.5 max-h-[360px] overflow-y-auto divide-y divide-slate-100">
              {searchResults.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400 font-medium">
                  No matching platform destinations found.
                </div>
              ) : (
                searchResults.map((item, idx) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.path;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectSearch(item.path)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                        isActive
                          ? "bg-[#082B3F] text-white"
                          : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isActive ? "bg-white/20 text-white" : "bg-blue-50 text-[#082B3F]"
                          }`}
                        >
                          <Icon size={16} weight="bold" />
                        </div>
                        <div>
                          <p className={`text-xs font-bold ${isActive ? "text-white" : "text-[#082B3F]"}`}>
                            {item.name}
                          </p>
                          <p className={`text-[10px] ${isActive ? "text-white/70" : "text-slate-400"}`}>
                            {item.category}
                          </p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-mono ${isActive ? "text-white/60" : "text-slate-300"}`}>
                        {item.path}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
            <div className="p-2.5 px-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium">
              <span>Press <kbd className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200">ESC</kbd> to exit</span>
              <span className="text-[#082B3F] font-bold">Medzoos Quick Navigation</span>
            </div>
          </div>
        )}
      </div>

      {/* Right Controls: Clock, Live Status, Portals, Notifications & Admin Avatar */}
      <div className="flex items-center gap-3.5">
        
        {/* Realtime Live Clock */}
        <div className="hidden xl:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-mono font-bold text-slate-600 shadow-2xs">
          <Clock size={15} className="text-[#0FA7E3]" weight="bold" />
          <span>{time || "Loading..."}</span>
        </div>

        {/* System Operational Live Status Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-700 text-xs font-bold shadow-2xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>System Operational</span>
        </div>

        {/* Partner Portals Fast Switcher */}
        <div className="relative hidden md:block" ref={portalsRef}>
          <button
            onClick={() => setIsPortalsOpen(!isPortalsOpen)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-[#082B3F] hover:text-white border border-slate-200/80 text-xs font-bold text-[#082B3F] transition-all shadow-2xs"
          >
            <Globe size={15} weight="bold" />
            <span>Portals</span>
            <CaretDown size={12} weight="bold" className={`transition-transform ${isPortalsOpen ? "rotate-180" : ""}`} />
          </button>

          {isPortalsOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-slate-200 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Partner Cloud Portals
              </div>
              <a
                href={process.env.NEXT_PUBLIC_DOCTOR_PANEL_URL || "http://localhost:3002"}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-xs font-bold text-[#082B3F] transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <Stethoscope size={16} className="text-[#0FA7E3]" weight="bold" />
                  <span>Doctor Portal</span>
                </div>
                <ArrowSquareOut size={14} className="text-slate-400 group-hover:text-[#082B3F]" />
              </a>
              <a
                href={process.env.NEXT_PUBLIC_VENDOR_PANEL_URL || "http://localhost:3003"}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-xs font-bold text-[#082B3F] transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <Storefront size={16} className="text-emerald-500" weight="bold" />
                  <span>Pharmacy Portal</span>
                </div>
                <ArrowSquareOut size={14} className="text-slate-400 group-hover:text-[#082B3F]" />
              </a>
              <a
                href={process.env.NEXT_PUBLIC_LAB_PANEL_URL || "http://localhost:3004"}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-xs font-bold text-[#082B3F] transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <Flask size={16} className="text-indigo-500" weight="bold" />
                  <span>Lab Diagnostics</span>
                </div>
                <ArrowSquareOut size={14} className="text-slate-400 group-hover:text-[#082B3F]" />
              </a>
            </div>
          )}
        </div>

        {/* Real-time Socket Notification Inbox */}
        <NotificationInbox getSocket={getAdminSocket} />

        {/* Executive Admin Profile Menu Dropdown */}
        <div className="relative pl-2" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 p-1.5 pr-2.5 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200/80 group"
          >
            {/* Gradient Avatar */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0FA7E3] to-[#082B3F] text-white flex items-center justify-center font-extrabold text-xs shadow-sm">
              SA
            </div>
            <div className="hidden md:flex flex-col text-left">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-[#082B3F] group-hover:text-[#0FA7E3] transition-colors">
                  Super Admin
                </span>
                <ShieldCheck size={14} weight="fill" className="text-emerald-500 shrink-0" />
              </div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                Platform Lead
              </span>
            </div>
            <CaretDown size={12} weight="bold" className={`text-slate-400 transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0FA7E3] to-[#082B3F] text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
                    SA
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#082B3F] truncate">Super Administrator</p>
                    <p className="text-[11px] text-slate-400 font-mono truncate">admin@medzoos.com</p>
                  </div>
                </div>
              </div>

              <div className="p-2 space-y-1">
                <Link
                  href="/admin/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-bold text-[#082B3F] hover:bg-slate-50 transition-colors"
                >
                  <Gear size={16} className="text-slate-400" weight="bold" />
                  <span>Platform Settings</span>
                </Link>

                <Link
                  href="/admin/audit-logs"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-bold text-[#082B3F] hover:bg-slate-50 transition-colors"
                >
                  <ShieldCheck size={16} className="text-slate-400" weight="bold" />
                  <span>Security & Audit Trail</span>
                </Link>

                <Link
                  href="/admin/analytics"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-bold text-[#082B3F] hover:bg-slate-50 transition-colors"
                >
                  <ChartLineUp size={16} className="text-slate-400" weight="bold" />
                  <span>Analytics Dashboard</span>
                </Link>
              </div>

              <div className="p-2 border-t border-slate-100 bg-slate-50/50">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <SignOut size={16} weight="bold" />
                  <span>Sign Out Safely</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </header>
  );
}
