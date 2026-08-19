"use client";

import { useState, useEffect } from "react";
import { 
  MagnifyingGlass, 
  Globe, 
  ShieldCheck
} from "@phosphor-icons/react";
import { NotificationInbox } from "@/shared/notifications/NotificationInbox";
import { getAdminSocket } from "@/lib/socket";

export function AdminHeader() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
        ' • ' +
        now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-40 h-[72px] bg-white border-b border-[#0C1A2E]/10 px-6 flex items-center justify-between shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
      
      {/* Left: Global Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full group">
          <MagnifyingGlass size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0C1A2E]/40 group-focus-within:text-[#0C1A2E] transition-colors" />
          <input 
            type="text" 
            placeholder="Search orders, vendors, doctors, products..." 
            className="w-full h-10 pl-10 pr-10 rounded-xl bg-[#F8FAFC] border border-[#0C1A2E]/10 text-xs text-[#0C1A2E] placeholder-[#0C1A2E]/40 outline-none focus:bg-white focus:border-[#0C1A2E]/30 focus:ring-1 focus:ring-[#0C1A2E]/20 transition-all font-medium"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-[#0C1A2E]/5 text-[#0C1A2E]/50 rounded border border-[#0C1A2E]/10">
              /
            </span>
          </div>
        </div>
      </div>

      {/* Right: Server Time, System Badge & Profile */}
      <div className="flex items-center gap-4">
        
        {/* Realtime Time Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#0C1A2E]/10 text-xs font-mono font-medium text-[#0C1A2E]/70">
          <Globe size={14} className="text-[#0C1A2E]/60" />
          <span>{time || "Loading..."}</span>
        </div>

        {/* Minimal System Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0C1A2E]/5 border border-[#0C1A2E]/10 text-[#0C1A2E] text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#0C1A2E] animate-pulse"></span>
          <span>System Operational</span>
        </div>

        <NotificationInbox getSocket={getAdminSocket} />

        {/* Minimal Profile Widget */}
        <div className="flex items-center gap-3 pl-3 border-l border-[#0C1A2E]/10">
          <div className="w-9 h-9 rounded-xl bg-[#0A0F1D] flex items-center justify-center text-white font-bold text-xs">
            SA
          </div>
          <div className="hidden md:flex flex-col">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-[#0C1A2E]">Super Admin</span>
              <ShieldCheck size={14} weight="fill" className="text-[#0C1A2E]/70" />
            </div>
            <span className="text-[10px] text-[#0C1A2E]/50 font-semibold uppercase tracking-wider">
              Platform Lead
            </span>
          </div>
        </div>

      </div>

    </header>
  );
}

