"use client";

import { useState, useMemo } from "react";
import { useAuditLogs } from "@/lib/hooks/useApi";
import {
  ShieldCheck,
  MagnifyingGlass,
  Clock,
  DownloadSimple,
  CircleNotch,
  Eye,
  X,
  Copy,
  Check,
  Stethoscope,
  Buildings,
  Storefront,
  Flask,
  Tag,
  ArrowsClockwise,
  CaretLeft,
  CaretRight,
  User,
  Shield,
  Activity,
  FileCode,
} from "@phosphor-icons/react";
import { toast } from "sonner";

export default function AdminAuditLogsPage() {
  const { data: logs = [], isLoading: logsLoading, refetch } = useAuditLogs();

  const [search, setSearch] = useState("");
  const [entityFilter, setEntityFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [viewLog, setViewLog] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Key Metrics
  const kpis = useMemo(() => {
    const total = logs.length;
    const doctorActions = logs.filter(
      (l) => (l.entity || "").toLowerCase() === "doctor" || (l.action || "").includes("DOCTOR")
    ).length;
    const vendorActions = logs.filter(
      (l) => (l.entity || "").toLowerCase() === "vendor" || (l.action || "").includes("VENDOR")
    ).length;
    const hospitalAndLabActions = logs.filter(
      (l) =>
        ["hospital", "lab"].includes((l.entity || "").toLowerCase()) ||
        (l.action || "").includes("HOSPITAL") ||
        (l.action || "").includes("LAB")
    ).length;

    return { total, doctorActions, vendorActions, hospitalAndLabActions };
  }, [logs]);

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const s = search.toLowerCase();
      const matchesSearch =
        !search.trim() ||
        (log.action || "").toLowerCase().includes(s) ||
        (log.entity || "").toLowerCase().includes(s) ||
        (log.entity_id || "").toLowerCase().includes(s) ||
        (log.user_id || "").toLowerCase().includes(s) ||
        JSON.stringify(log.details || {}).toLowerCase().includes(s);

      const entity = (log.entity || "").toLowerCase();
      const action = (log.action || "").toLowerCase();

      const matchesEntity =
        entityFilter === "all" ||
        (entityFilter === "doctor" && (entity === "doctor" || action.includes("doctor"))) ||
        (entityFilter === "vendor" && (entity === "vendor" || action.includes("vendor"))) ||
        (entityFilter === "hospital" && (entity === "hospital" || action.includes("hospital"))) ||
        (entityFilter === "lab" && (entity === "lab" || action.includes("lab"))) ||
        (entityFilter === "offer" && (entity === "offer" || action.includes("offer")));

      return matchesSearch && matchesEntity;
    });
  }, [logs, search, entityFilter]);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const currentLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id || text);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCSV = () => {
    const headers = ["Timestamp", "Action", "Entity", "Entity_ID", "User_ID", "Details"];
    const rows = filteredLogs.map((log) => [
      new Date(log.created_at || Date.now()).toISOString(),
      `"${log.action || ""}"`,
      `"${log.entity || ""}"`,
      `"${log.entity_id || ""}"`,
      `"${log.user_id || ""}"`,
      `"${JSON.stringify(log.details || {}).replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `medzoos_audit_trail_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    toast.success("Audit trail exported successfully!");
  };

  const getEntityIcon = (entity) => {
    const e = (entity || "").toLowerCase();
    switch (e) {
      case "doctor":
        return <Stethoscope size={14} weight="bold" className="text-[#0FA7E3]" />;
      case "hospital":
        return <Buildings size={14} weight="bold" className="text-indigo-500" />;
      case "vendor":
        return <Storefront size={14} weight="bold" className="text-emerald-500" />;
      case "lab":
        return <Flask size={14} weight="bold" className="text-amber-500" />;
      case "offer":
        return <Tag size={14} weight="bold" className="text-purple-500" />;
      default:
        return <Shield size={14} weight="bold" className="text-slate-400" />;
    }
  };

  const getActionBadge = (action) => {
    const a = (action || "").toUpperCase();
    if (a.includes("DELETE") || a.includes("REMOVE") || a.includes("REJECT")) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 text-xs font-bold font-mono border border-rose-200/80">
          {action}
        </span>
      );
    }
    if (a.includes("CREATE") || a.includes("APPROVE") || a.includes("ACTIVATE")) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold font-mono border border-emerald-200/80">
          {action}
        </span>
      );
    }
    if (a.includes("STATUS") || a.includes("UPDATE") || a.includes("EDIT")) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 text-[#082B3F] text-xs font-bold font-mono border border-blue-200/80">
          {action}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold font-mono border border-slate-200">
        {action}
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full font-[var(--font-plus-jakarta-sans)] animate-in fade-in zoom-in-95 duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-[var(--font-dm-serif-display)] text-3xl md:text-4xl text-[#082B3F] tracking-tight flex items-center gap-3">
            <ShieldCheck size={32} className="text-[#0FA7E3]" weight="fill" />
            Security & Audit Trail
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
            Immutable log of administrative operations, doctor approvals, credential changes, and system events.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <ArrowsClockwise size={16} weight="bold" />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#082B3F] hover:bg-[#0FA7E3] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <DownloadSimple size={16} weight="bold" />
            <span>Export Trail CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#082B3F] flex items-center justify-center shrink-0">
            <ShieldCheck size={20} weight="bold" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Events</p>
            <p className="text-xl font-extrabold text-[#082B3F]">{kpis.total}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-[#0FA7E3] flex items-center justify-center shrink-0">
            <Stethoscope size={20} weight="bold" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Doctor Actions</p>
            <p className="text-xl font-extrabold text-[#082B3F]">{kpis.doctorActions}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Storefront size={20} weight="bold" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pharmacy Actions</p>
            <p className="text-xl font-extrabold text-[#082B3F]">{kpis.vendorActions}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Buildings size={20} weight="bold" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Hospitals & Labs</p>
            <p className="text-xl font-extrabold text-[#082B3F]">{kpis.hospitalAndLabActions}</p>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col overflow-hidden">
        
        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative w-full sm:w-[340px]">
              <MagnifyingGlass
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search action, entity ID, admin user..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-10 pl-10 pr-8 rounded-xl border border-slate-200 bg-white text-xs font-medium text-[#082B3F] placeholder-slate-400 outline-none focus:border-[#082B3F] focus:ring-1 focus:ring-[#082B3F]/20 transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Entity Filters */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
              {["all", "doctor", "vendor", "hospital", "lab", "offer"].map((ent) => (
                <button
                  key={ent}
                  onClick={() => {
                    setEntityFilter(ent);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                    entityFilter === ent
                      ? "bg-[#082B3F] text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {ent === "all" ? "All Entities" : ent}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs font-semibold text-slate-400 self-center">
            Showing <span className="font-bold text-[#082B3F]">{filteredLogs.length}</span> audit records
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto min-h-[380px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-5">Timestamp</th>
                <th className="py-3.5 px-4">Action Triggered</th>
                <th className="py-3.5 px-4">Target Entity</th>
                <th className="py-3.5 px-4">Actor / Admin</th>
                <th className="py-3.5 px-5 text-right">Payload & Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logsLoading ? (
                <tr>
                  <td colSpan="5" className="py-16 text-center text-slate-400 font-medium">
                    <div className="flex items-center justify-center gap-2">
                      <CircleNotch size={20} className="animate-spin text-[#0FA7E3]" />
                      <span>Loading audit trail...</span>
                    </div>
                  </td>
                </tr>
              ) : currentLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-16 text-center text-slate-400 font-medium">
                    No audit records found matching the query.
                  </td>
                </tr>
              ) : (
                currentLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                    onClick={() => setViewLog(log)}
                  >
                    {/* Timestamp */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2">
                        <Clock size={15} className="text-slate-400 shrink-0" />
                        <div>
                          <span className="text-xs font-bold text-[#082B3F] block">
                            {new Date(log.created_at || Date.now()).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(log.created_at || Date.now()).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Action Triggered */}
                    <td className="py-3.5 px-4">
                      {getActionBadge(log.action)}
                    </td>

                    {/* Target Entity */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                          {getEntityIcon(log.entity)}
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-[#082B3F] capitalize block">
                            {log.entity || "System"}
                          </span>
                          {log.entity_id && (
                            <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                              ID: ...{log.entity_id.slice(-8)}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyToClipboard(log.entity_id, `ent_${log.id}`);
                                }}
                                className="text-slate-400 hover:text-slate-700"
                                title="Copy Entity ID"
                              >
                                {copiedId === `ent_${log.id}` ? (
                                  <Check size={11} className="text-emerald-500" />
                                ) : (
                                  <Copy size={11} />
                                )}
                              </button>
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Actor / Admin */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                        <User size={14} className="text-slate-400 shrink-0" />
                        <span className="font-mono text-[11px] truncate max-w-[140px]">
                          {log.user_id || "System Administrator"}
                        </span>
                      </div>
                    </td>

                    {/* Payload Actions */}
                    <td className="py-3.5 px-5 text-right">
                      <div
                        className="flex items-center justify-end gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => setViewLog(log)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#082B3F] text-[#082B3F] hover:text-white text-xs font-bold transition-all shadow-sm border border-slate-200"
                          title="Inspect Event Payload"
                        >
                          <Eye size={15} weight="bold" />
                          <span>Inspect</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 transition-colors"
              >
                <CaretLeft size={14} weight="bold" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                    currentPage === p
                      ? "bg-[#082B3F] text-white"
                      : "text-slate-600 hover:bg-white border border-slate-200"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 transition-colors"
              >
                <CaretRight size={14} weight="bold" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Audit Log JSON Inspector Modal */}
      {viewLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#082B3F]/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-slate-200 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/40 shrink-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#082B3F] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <FileCode size={24} weight="bold" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#082B3F]">
                      Audit Event Inspector
                    </h2>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      Event ID: {viewLog.id}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setViewLog(null)}
                  className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-200/50 transition-colors"
                >
                  <X size={20} weight="bold" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto flex-1 p-6 space-y-5">
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Action</span>
                  <span className="text-xs font-bold text-[#082B3F] mt-0.5 block">{viewLog.action}</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Entity</span>
                  <span className="text-xs font-bold text-[#082B3F] capitalize mt-0.5 block">{viewLog.entity}</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Timestamp</span>
                  <span className="text-xs font-bold text-[#082B3F] mt-0.5 block">
                    {new Date(viewLog.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#082B3F] uppercase tracking-wider">
                    Full JSON Payload
                  </h3>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(viewLog, null, 2), "payload")}
                    className="text-xs font-bold text-[#0FA7E3] hover:underline flex items-center gap-1"
                  >
                    {copiedId === "payload" ? <Check size={13} /> : <Copy size={13} />}
                    <span>Copy JSON</span>
                  </button>
                </div>

                <div className="bg-[#082B3F] text-emerald-400 p-4 rounded-2xl font-mono text-xs overflow-x-auto max-h-[320px] leading-relaxed shadow-inner">
                  <pre>{JSON.stringify(viewLog, null, 2)}</pre>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 px-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end shrink-0">
              <button
                type="button"
                onClick={() => setViewLog(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#082B3F] text-white hover:bg-[#0FA7E3] transition-all shadow-sm"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
