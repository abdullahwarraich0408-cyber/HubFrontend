"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, X } from "@phosphor-icons/react";
import { DOCTOR_NOTIFICATIONS } from "../data/doctorData";

export function DoctorNotifications({ className }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(DOCTOR_NOTIFICATIONS);
  const ref = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const dismiss = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className={`relative ${className || ""}`} ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-[var(--radius-md)] border border-[var(--color-neutral-200)] bg-white hover:bg-[var(--color-neutral-100)] transition-colors"
      >
        <Bell size={20} className="text-[var(--color-neutral-600)]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-status-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-[320px] bg-white rounded-[16px] border border-neutral-200 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between p-4 border-b border-neutral-200">
            <h4 className="text-[14px] font-bold text-ink-headline">Notifications</h4>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-[12px] font-semibold text-brand-primary hover:underline">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-6 text-center text-[13px] text-neutral-500">No notifications</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex gap-3 p-4 border-b border-neutral-100 last:border-0 ${!n.read ? "bg-brand-light/30" : ""}`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-ink-headline">{n.title}</p>
                    <p className="text-[12px] text-neutral-500 mt-0.5">{n.message}</p>
                    <p className="text-[11px] text-neutral-400 mt-1">{n.time}</p>
                  </div>
                  <button onClick={() => dismiss(n.id)} className="p-1 text-neutral-400 hover:text-neutral-700 shrink-0">
                    <X size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
