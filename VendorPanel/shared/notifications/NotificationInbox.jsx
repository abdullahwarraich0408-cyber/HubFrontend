"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, Checks, Sparkle } from "@phosphor-icons/react";
import { useVendorNotifications, useMarkVendorNotificationRead, useMarkAllVendorNotifications } from "@/lib/hooks/useApi";
import { formatNotificationTime } from "@/lib/hooks/useInboxNotifications";
import { getVendorSocket } from "@/lib/socket";
import { cn } from "@/utils/cn";
import { partnerRoutes } from "@/lib/constants/partnerRoutes";

function notificationLink(item) {
  const type = String(item.type || "").toLowerCase();
  if (type.includes("prescription")) return partnerRoutes.vendor.prescriptionOrders;
  if (type.includes("order")) return partnerRoutes.vendor.orders;
  if (type.includes("payout")) return partnerRoutes.vendor.payouts;
  if (type.includes("return")) return partnerRoutes.vendor.returns;
  if (type.includes("stock") || type.includes("expiry") || type.includes("product")) return partnerRoutes.vendor.products;
  return partnerRoutes.vendor.notifications;
}

export function VendorNotificationInbox({ className }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { data: notifications = [] } = useVendorNotifications();
  const markRead = useMarkVendorNotificationRead();
  const markAllRead = useMarkAllVendorNotifications();
  const unreadCount = notifications.filter((item) => item.status === "unread" || !item.read_at).length;

  useEffect(() => {
    const onClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    let socket = null;
    try {
      socket = getVendorSocket();
    } catch {
      socket = null;
    }
    if (!socket?.on) return undefined;
    const onNew = () => {};
    socket.on("notification:new", onNew);
    return () => socket.off("notification:new", onNew);
  }, []);

  return (
    <div className={cn("relative", className)} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative p-2 rounded-[var(--radius-md)] border border-[var(--color-neutral-200)] bg-white hover:bg-[var(--color-neutral-100)] transition-colors"
        aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
      >
        <Bell size={20} className="text-[var(--color-neutral-600)]" />
        {unreadCount > 0 ? (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--color-status-danger)] text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-full mt-2 w-[360px] bg-white rounded-2xl border border-neutral-200 shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-3.5 py-3 border-b border-neutral-100">
            <p className="text-sm font-bold text-ink-headline">Notifications</p>
            <div className="flex items-center gap-3">
              {unreadCount > 0 ? (
                <button type="button" onClick={() => markAllRead.mutate()} className="text-xs font-semibold text-brand-primary hover:underline inline-flex items-center gap-1">
                  <Checks size={14} />
                  Mark all read
                </button>
              ) : null}
              <Link href={partnerRoutes.vendor.notifications} className="text-xs font-semibold text-neutral-500 hover:text-ink-headline" onClick={() => setOpen(false)}>
                View all
              </Link>
            </div>
          </div>
          <div className="max-h-[340px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-10 px-6 text-center">
                <Sparkle size={22} className="mx-auto mb-2 text-slate-300" />
                <p className="text-xs font-bold text-slate-700">You&apos;re all caught up</p>
              </div>
            ) : (
              notifications.slice(0, 8).map((item) => {
                const unread = item.status === "unread" || !item.read_at;
                const href = notificationLink(item);
                return (
                  <Link
                    key={item.id}
                    href={href}
                    onClick={() => {
                      if (unread) markRead.mutate(item.id);
                      setOpen(false);
                    }}
                    className={cn("block border-b border-neutral-100 last:border-b-0 p-3.5 text-left", unread ? "bg-sky-50/70" : "hover:bg-neutral-50")}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold text-ink-headline">{item.title}</p>
                      <span className="text-[10px] text-slate-400 shrink-0">{formatNotificationTime(item.created_at)}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{item.message || item.body}</p>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
