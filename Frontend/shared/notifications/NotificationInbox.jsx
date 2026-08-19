"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, Checks, Sparkle } from "@phosphor-icons/react";
import { useInboxNotifications, formatNotificationTime } from "@/lib/hooks/useInboxNotifications";
import { getSocket } from "@/lib/socket";
import { cn } from "@/utils/cn";

export function NotificationInbox({
  enabled = true,
  getSocket: getSocketFn,
  variant = "light",
  className,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { notifications, unreadCount, markRead, markAllRead } = useInboxNotifications({
    enabled,
    getSocket: getSocketFn,
  });

  useEffect(() => {
    const onClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const isDark = variant === "dark";

  return (
    <div className={cn("relative", className)} ref={ref}>
      <button
        type="button"
        onClick={() => enabled && setOpen((value) => !value)}
        className={
          isDark
            ? "relative p-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700/80 transition-colors"
            : "relative rounded-xl p-2 text-[#334E68] transition-colors hover:bg-[#F1F7FA] hover:text-[#0B6E99]"
        }
        aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
      >
        <Bell size={20} />
        {unreadCount > 0 ? (
          <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-[#EF233C] text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        ) : null}
      </button>

      {open && enabled ? (
        <div
          className={cn(
            "absolute right-0 top-full mt-2 w-[340px] sm:w-[380px] rounded-2xl border shadow-xl z-50 overflow-hidden",
            isDark ? "bg-slate-900 border-white/10" : "bg-white border-[#D9DEE5]"
          )}
        >
          <div
            className={cn(
              "flex items-center justify-between px-3.5 py-3 border-b",
              isDark ? "border-white/10" : "border-neutral-100"
            )}
          >
            <div className="flex items-center gap-2">
              <p className={cn("text-sm font-bold", isDark ? "text-white" : "text-slate-900")}>
                Notifications
              </p>
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

          <div className="max-h-[340px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-10 px-6 text-center">
                <Sparkle size={22} className="mx-auto mb-2 text-slate-300" />
                <p className={cn("text-xs font-bold", isDark ? "text-slate-200" : "text-slate-700")}>
                  You&apos;re all caught up
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  New leads, orders, and booking alerts will appear here.
                </p>
              </div>
            ) : (
              notifications.map((item) => {
                const content = (
                  <div
                    className={cn(
                      "p-3.5 text-left transition-colors",
                      !item.read ? "bg-sky-50/70" : "hover:bg-neutral-50"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold text-slate-900">{item.title}</p>
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
                      {content}
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
                    {content}
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

export function CustomerNotificationInbox({ isAuthenticated }) {
  return (
    <NotificationInbox
      enabled={Boolean(isAuthenticated)}
      getSocket={() => getSocket("customer")}
    />
  );
}
