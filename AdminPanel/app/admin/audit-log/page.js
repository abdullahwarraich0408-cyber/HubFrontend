"use client";

import { ListMagnifyingGlass } from "@phosphor-icons/react";

export default function AdminAuditLogPage() {
  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-heading font-extrabold text-ink-headline tracking-tight">System Audit Log</h1>
          <p className="text-[14px] text-neutral-500 mt-1">Track administrative actions and system events.</p>
        </div>
      </div>

      <div className="bg-white rounded-[16px] border border-neutral-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
        <ListMagnifyingGlass size={48} weight="duotone" className="text-neutral-300 mb-4" />
        <h3 className="text-[18px] font-bold text-ink-headline mb-2">Security & Audit</h3>
        <p className="text-[14px] text-neutral-500 max-w-[400px]">Data table showing all CRUD operations across the system for security compliance.</p>
      </div>
    </div>
  );
}
