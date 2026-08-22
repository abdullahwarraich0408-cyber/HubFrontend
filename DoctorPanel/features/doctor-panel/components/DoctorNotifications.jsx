"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { Bell, X, Calendar, Info, CheckCheck, Sparkles } from "lucide-react";
import { useInboxNotifications, formatNotificationTime } from "@/lib/hooks/useInboxNotifications";
import { getSocket } from "@/lib/socket";

export function DoctorNotifications({ className }) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const ref = useRef(null);
  const { notifications, unreadCount, markRead, markAllRead } = useInboxNotifications({
    getSocket: () => getSocket("partner"),
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredNotifications = useMemo(() => {
    if (filter === "appointments") {
      return notifications.filter((n) =>
        String(n.type || "").includes("appointment") || n.title?.toLowerCase().includes("appointment")
      );
    }
    if (filter === "system") {
      return notifications.filter(
        (n) =>
          !String(n.type || "").includes("appointment") &&
          !n.title?.toLowerCase().includes("appointment")
      );
    }
    return notifications;
  }, [notifications, filter]);

  return (
    <div className={`relative ${className || ""}`} ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700/80 transition-colors shadow-2xs focus:outline-none focus:ring-2 focus:ring-teal-500/50"
        aria-label="Doctor Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-slate-900 shadow-2xs">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-[360px] sm:w-[400px] bg-white rounded-xl border border-slate-200 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between p-3.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900">Notifications</h4>
              {unreadCount > 0 && (
                <span className="bg-teal-50 text-teal-700 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-teal-200/60">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllRead()}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 transition-colors flex items-center gap-1"
              >
                <CheckCheck size={14} />
                <span>Mark all as read</span>
              </button>
            )}
          </div>

          <div className="p-2 bg-slate-50/80 border-b border-slate-100 flex gap-1">
            {["all", "appointments", "system"].map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`flex-1 py-1 rounded-md text-xs font-semibold capitalize transition-all ${
                  filter === t
                    ? "bg-white text-slate-900 shadow-2xs border border-slate-200/80"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="max-h-[320px] overflow-y-auto divide-y divide-slate-100">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center text-slate-400">
                <Sparkles size={24} className="text-slate-300 mb-2" />
                <p className="text-xs font-bold text-slate-700">You're all caught up</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  New appointment and system notifications will appear here.
                </p>
              </div>
            ) : (
              filteredNotifications.map((n) => {
                const inner = (
                  <>
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 border border-teal-200/60 mt-0.5">
                      {String(n.type || "").includes("appointment") || n.title?.toLowerCase().includes("appointment") ? (
                        <Calendar size={16} />
                      ) : (
                        <Info size={16} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-bold text-slate-900 truncate">{n.title}</p>
                        {!n.read && <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />}
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-1">
                        {formatNotificationTime(n.createdAt)}
                      </p>
                    </div>
                  </>
                );

                return (
                  <div
                    key={n.id}
                    className={`flex items-start gap-3 p-3.5 transition-colors ${
                      !n.read ? "bg-blue-50/40" : "hover:bg-slate-50/60"
                    }`}
                  >
                    {n.link ? (
                      <Link
                        href={n.link}
                        className="flex items-start gap-3 flex-1 min-w-0"
                        onClick={() => {
                          if (!n.read) markRead(n.id);
                          setOpen(false);
                        }}
                      >
                        {inner}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className="flex items-start gap-3 flex-1 min-w-0 text-left"
                        onClick={() => !n.read && markRead(n.id)}
                      >
                        {inner}
                      </button>
                    )}
                    <button
                      onClick={() => markRead(n.id)}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors shrink-0"
                      title="Dismiss notification"
                    >
                      <X size={14} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
