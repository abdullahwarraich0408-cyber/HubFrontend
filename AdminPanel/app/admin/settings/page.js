"use client";

import { useUserProfile } from "@/lib/hooks/useApi";
import { Gear, User, Bell, ShieldCheck } from "@phosphor-icons/react";

export default function AdminSettingsPage() {
  const { data: profile } = useUserProfile();

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 max-w-[800px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-heading font-extrabold text-ink-headline tracking-tight">System Settings</h1>
          <p className="text-[14px] text-neutral-500 mt-1">Manage global platform configurations.</p>
        </div>
      </div>

      <div className="bg-white rounded-[16px] border border-neutral-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col overflow-hidden mb-6">
        <div className="p-6 border-b border-neutral-200 flex items-center gap-3">
          <User size={24} className="text-[#0B6E72]" />
          <h3 className="text-[18px] font-bold text-ink-headline">Admin Profile</h3>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-1.5">Full Name</label>
            <input type="text" defaultValue={profile?.name || "Admin"} className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 bg-neutral-50 text-sm font-medium text-neutral-600 outline-none" readOnly />
          </div>
          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-1.5">Email Address</label>
            <input type="email" defaultValue={profile?.email || "admin@pharmahub.com"} className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 bg-neutral-50 text-sm font-medium text-neutral-600 outline-none" readOnly />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[16px] border border-neutral-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col overflow-hidden mb-6">
        <div className="p-6 border-b border-neutral-200 flex items-center gap-3">
          <Bell size={24} className="text-[#0B6E72]" />
          <h3 className="text-[18px] font-bold text-ink-headline">Notifications</h3>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-neutral-300 text-[#0B6E72] focus:ring-[#0B6E72]" />
            <span className="text-sm font-medium text-neutral-700">Email alerts for new vendor registrations</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-neutral-300 text-[#0B6E72] focus:ring-[#0B6E72]" />
            <span className="text-sm font-medium text-neutral-700">Daily summary of system orders and revenue</span>
          </label>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button className="px-6 py-2.5 bg-[#0B6E72] hover:bg-[#084F52] text-white rounded-lg text-sm font-bold transition-colors">
          Save Settings
        </button>
      </div>
    </div>
  );
}
