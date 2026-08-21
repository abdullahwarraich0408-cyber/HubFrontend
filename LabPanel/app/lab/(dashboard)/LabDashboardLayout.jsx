"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Menu,
  Bell,
  PlusCircle,
  Check,
  Trash2,
  ExternalLink,
  Building2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { PartnerAuthGuard } from "@/shared/components/PartnerAuthGuard";
import { LabSidebar } from "@/shared/layout/LabSidebar";
import { setPartnerSession } from "@/lib/partnerAuth";
import {
  useLabStoreSubscription,
  useLabNotifications,
  useSimulateIncomingOrder,
  useLabPortalProfile,
} from "@/lib/hooks/usePartnerPortal";
import { cn } from "@/utils/cn";

function ImpersonationHydrator({ children }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    if (!accessToken) return;

    setPartnerSession({
      tokens: {
        accessToken,
        refreshToken: params.get("refreshToken") || undefined,
      },
      role: params.get("role") || "lab",
      partner: params.get("partner") ? JSON.parse(params.get("partner")) : undefined,
    });
    window.history.replaceState({}, "", window.location.pathname);
  }, []);

  return children;
}

export function LabDashboardLayout({ children }) {
  // Live reactive store updates across all queries
  useLabStoreSubscription();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifsOpen, setNotifsOpen] = useState(false);
  const notifRef = useRef(null);

  const { data: profile } = useLabPortalProfile();
  const {
    notifications,
    unreadCount,
    markAllAsRead,
    markAsRead,
    clearAll,
  } = useLabNotifications();

  const simulateMutation = useSimulateIncomingOrder();

  // Close notifications popover on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSimulateOrder = async () => {
    try {
      const newOrder = await simulateMutation.mutateAsync();
      toast.success(
        `New Order Created: ${newOrder.booking_number} (${newOrder.patient_name})`,
        {
          description: `${newOrder.test_name} · ${newOrder.collection_type}`,
        }
      );
    } catch (err) {
      toast.error("Failed to simulate order");
    }
  };

  const labName = profile?.name || "IDC";

  return (
    <ImpersonationHydrator>
      <PartnerAuthGuard role="lab">
        <div className="min-h-screen bg-[#F6F8FA] flex flex-col">
          {/* Top Header Toolbar */}
          <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-8 bg-white/95 backdrop-blur-xs border-b border-[#D9DEE5] shadow-2xs">
            {/* Mobile Hamburger & Brand */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="md:hidden p-2 rounded-lg text-[#082B3F] hover:bg-neutral-100"
                aria-label="Open menu"
              >
                <Menu size={22} />
              </button>

              <img
                src="/images/medzoos-mark.png"
                alt="Medzoos"
                className="h-10 w-10 object-contain md:hidden"
              />

              {/* Lab Branch Indicator */}
              <div className="hidden sm:flex items-center gap-2.5">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[13px] font-semibold text-[#082B3F]">
                  {labName} Diagnostics
                </span>
                <span className="text-[11px] font-bold text-[#17618E] bg-[#DEEEF9] border border-[#17618E]/30 px-2 py-0.5 rounded uppercase">
                  Islamabad Main
                </span>
              </div>
            </div>

            {/* Right Side Header Controls */}
            <div className="flex items-center gap-3">
              {/* Simulate Patient Order Generator Button */}
              <button
                type="button"
                onClick={handleSimulateOrder}
                disabled={simulateMutation.isPending}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#DEEEF9] hover:bg-teal-100 text-[#17618E] border border-[#17618E]/30 text-[12px] font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
                title="Simulate a live patient test booking"
              >
                <Sparkles size={14} className={simulateMutation.isPending ? "animate-spin" : ""} />
                <span>+ Simulate Order</span>
              </button>

              {/* Notification Center */}
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={() => setNotifsOpen(!notifsOpen)}
                  className="relative p-2 rounded-xl text-[#64748B] hover:text-[#082B3F] hover:bg-neutral-100 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell size={19} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#EF233C] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Popover */}
                {notifsOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-[#D9DEE5] shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="p-3.5 border-b border-[#D9DEE5] flex items-center justify-between bg-neutral-50/80">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold text-[#082B3F]">
                          Notifications
                        </span>
                        {unreadCount > 0 && (
                          <span className="text-[10px] font-bold bg-[#EF233C] text-white px-1.5 py-0.5 rounded-full">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={markAllAsRead}
                          className="text-[11px] font-semibold text-[#17618E] hover:underline"
                        >
                          Mark read
                        </button>
                        <span className="text-neutral-300">·</span>
                        <button
                          type="button"
                          onClick={clearAll}
                          className="text-[11px] font-semibold text-[#667085] hover:text-[#EF233C]"
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-neutral-100">
                      {notifications.length === 0 ? (
                        <div className="py-8 text-center text-[12px] text-[#667085]">
                          No notifications yet
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => {
                              markAsRead(n.id);
                              if (n.link) window.location.href = n.link;
                            }}
                            className={`p-3.5 text-[12px] hover:bg-neutral-50 transition-colors cursor-pointer ${
                              !n.read ? "bg-teal-50/40" : ""
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-bold text-[#082B3F]">
                                {n.title}
                              </span>
                              <span className="text-[10px] text-[#64748B] shrink-0">
                                {n.time}
                              </span>
                            </div>
                            <p className="text-[#64748B] mt-0.5 leading-relaxed">
                              {n.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Sidebar */}
          <LabSidebar
            onCollapseChange={(collapsed) => setIsCollapsed(collapsed)}
            mobileOpen={mobileOpen}
            onMobileClose={() => setMobileOpen(false)}
          />

          {/* Main Content Area */}
          <div
            className={cn(
              "flex-1 transition-all duration-250 ease-in-out",
              isCollapsed ? "md:ml-[80px]" : "md:ml-[280px]"
            )}
          >
            <main className="min-h-full px-5 py-6 md:px-9 md:pt-8 md:pb-16 max-w-[1600px]">
              {children}
            </main>
          </div>
        </div>
      </PartnerAuthGuard>
    </ImpersonationHydrator>
  );
}
