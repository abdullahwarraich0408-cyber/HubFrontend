"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, Checks, Sparkle } from "@phosphor-icons/react";
import { useInboxNotifications, formatNotificationTime } from "@/lib/hooks/useInboxNotifications";
import { cn } from "@/utils/cn";

export function NotificationInbox({ enabled = true, getSocket, className, buttonClassName }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { notifications, unreadCount, markRead, markAllRead } = useInboxNotifications({
    enabled,
    getSocket,
  });

  useEffect(() => {
    const onClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className={cn("relative", className)} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={
          buttonClassName ||
          "relative w-9 h-9 rounded-xl bg-[#F8FAFC] hover:bg-[#0C1A2E]/5 border border-[#0C1A2E]/10 flex items-center justify-center text-[#0C1A2E] transition-colors"
        }
        aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
      >
        <Bell size={18} />
        {unreadCount > 0 ? (
          <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[#EF233C] text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-full mt-2 w-[360px] bg-white rounded-2xl border border-[#0C1A2E]/10 shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-3.5 py-3 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-[#0C1A2E]">Notifications</p>
              {unreadCount > 0 ? (
                <span className="text-[10px] font-bold bg-[#EF233C] text-white px-1.5 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              ) : null}
            </div>
            {unreadCount > 0 ? (
              <button
                type="button"
                onClick={() => markAllRead()}
                className="text-xs font-semibold text-[#0B6E99] hover:underline inline-flex items-center gap-1"
              >
                <Checks size={14} />
                Mark all read
              </button>
            ) : null}
          </div>
          <div className="max-h-[360px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-10 px-6 text-center">
                <Sparkle size={22} className="mx-auto mb-2 text-slate-300" />
                <p className="text-xs font-bold text-slate-700">No new alerts</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Leads, queries, orders, and partner applications will show here.
                </p>
              </div>
            ) : (
              notifications.map((item) => {
                const body = (
                  <div className={cn("p-3.5 text-left", !item.read ? "bg-sky-50/70" : "hover:bg-neutral-50")}>
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold text-[#0C1A2E]">{item.title}</p>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {formatNotificationTime(item.createdAt)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{item.message}</p>
                  </div>
                );
                if (item.link) {
                  return (
                    <Link
                      key={item.id}
                      href={item.link}
                      onClick={() => {
                        if (!item.read) markRead(item.id);
                        setOpen(false);
                      }}
                      className="block border-b border-neutral-100 last:border-b-0"
                    >
                      {body}
                    </Link>
                  );
                }
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => !item.read && markRead(item.id)}
                    className="block w-full border-b border-neutral-100 last:border-b-0"
                  >
                    {body}
                  </button>
                );
              })
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
