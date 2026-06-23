"use client";

import { useState } from "react";
import { useAuditLogs } from "@/lib/hooks/useApi";
import { ShieldCheck, MagnifyingGlass, Clock, DownloadSimple, Trash, ArchiveBox } from "@phosphor-icons/react";
import { useUserProfile } from "@/lib/hooks/useApi";
import Link from "next/link";
export default function AdminAuditLogsPage() {
  const { data: profile, isLoading: profileLoading, isError: profileError } = useUserProfile({ retry: false });
  const { data: logs = [], isLoading: logsLoading } = useAuditLogs();
  const [search, setSearch] = useState("");

  const filteredLogs = logs.filter(log => 
    (log.action || "").toLowerCase().includes(search.toLowerCase()) ||
    (log.entity || "").toLowerCase().includes(search.toLowerCase())
  );

  if (profileLoading || logsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CircleNotch size={48} className="text-[#0B6E72] animate-spin mb-4" />
        <p className="ml-4 text-[#0C1A2E] font-medium">Loading...</p>
      </div>
    );
  }

  if (profileError || !profile) {
    return (
      <div className="max-w-[800px] mx-auto p-6 text-center">
        <p className="text-[#0C1A2E] text-lg mb-4">Please log in to view audit logs.</p>
        <Link href="/login">
          <a className="px-6 py-2.5 bg-[#0B6E72] hover:bg-[#084F52] text-white rounded-lg text-sm font-bold transition-colors">Go to Login</a>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full font-[var(--font-plus-jakarta-sans)] animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-[var(--font-dm-serif-display)] text-3xl md:text-4xl text-[#0C1A2E] tracking-tight mb-2 flex items-center gap-3">
            <ShieldCheck size={32} className="text-[#0B6E72]" /> Security & Audit Logs
          </h1>
          <p className="text-[#0C1A2E]/60 text-sm font-medium">
            Monitor administrative actions and security events across the platform.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#0C1A2E]/10 shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-[#0C1A2E]/10 bg-[#F6F8FA]/50">
          <div className="relative w-full sm:w-[320px]">
            <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0C1A2E]/40" />
            <input 
              type="text"
              placeholder="Search by action or entity..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-[40px] pl-10 pr-4 rounded-lg border border-[#0C1A2E]/10 bg-white text-sm outline-none focus:border-[#0B6E72]"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F6F8FA] border-b border-[#0C1A2E]/10 text-xs font-bold text-[#0C1A2E]/60 uppercase">
                <th className="p-4 pl-6">Timestamp</th>
                <th className="p-4">Action</th>
                <th className="p-4">Target Entity</th>
                <th className="p-4">Admin ID</th>
                <th className="p-4 pr-6 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0C1A2E]/5">
              {isLoading ? (
                <tr><td colSpan="5" className="p-8 text-center text-[#0C1A2E]/40">Loading audit logs...</td></tr>
              ) : filteredLogs.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-[#0C1A2E]/40">No logs found.</td></tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#E6F4F5]/30 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="text-sm font-medium text-[#0C1A2E] flex items-center gap-2">
                        <Clock size={16} className="text-[#0C1A2E]/40" />
                        {new Date(log.created_at).toLocaleString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-bold text-[#0C1A2E] bg-[#F6F8FA] px-2 py-1 rounded border border-[#0C1A2E]/10">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-semibold capitalize">{log.entity}</div>
                      <div className="text-xs font-mono text-[#0C1A2E]/50">ID: {log.entity_id}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-xs font-mono text-[#0C1A2E]/70">{log.user_id}</div>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      {log.details ? (
                        <pre className="text-xs bg-[#F6F8FA] p-2 rounded border border-[#0C1A2E]/10 inline-block text-left max-w-[200px] overflow-hidden text-ellipsis whitespace-pre-wrap">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      ) : (
                        <span className="text-xs text-[#0C1A2E]/40">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
