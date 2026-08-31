"use client";

import { useState, useMemo } from "react";
import {
  useAdminLabs,
  useCreateLab,
  useUpdateLab,
  useUpdateLabStatus,
  useDeleteLab,
} from "@/lib/hooks/useApi";
import { toast } from "sonner";
import {
  Flask,
  CheckCircle,
  XCircle,
  Trash,
  MagnifyingGlass,
  Plus,
  X,
  PencilSimple,
  Copy,
  Check,
  Eye,

  ShieldCheck,
  Clock,
  CaretLeft,
  CaretRight,
  TestTube,
  Info,
  WarningCircle,
  FileText,
} from "@phosphor-icons/react";

const SAMPLE_LAB_LOGOS = [
  "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=250",
  "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=250",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=250",
  "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=250",
];

function LabAvatar({ lab, size = "md", className = "" }) {
  const [hasError, setHasError] = useState(false);
  const initials = (lab?.name || "L").slice(0, 2).toUpperCase();
  const logo = lab?.logo || lab?.cover_image;

  const resolvedUrl = useMemo(() => {
    if (!logo) {
      const charSum = (lab?.name || "lab")
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return SAMPLE_LAB_LOGOS[Math.abs(charSum) % SAMPLE_LAB_LOGOS.length];
    }
    if (logo.startsWith("http://") || logo.startsWith("https://") || logo.startsWith("data:")) {
      return logo;
    }
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const base = apiBase.replace(/\/api\/?$/, "");
    return logo.startsWith("/") ? `${base}${logo}` : `${base}/${logo}`;
  }, [logo, lab?.name]);

  const sizeClasses = {
    sm: "w-8 h-8 rounded-lg text-xs",
    md: "w-10 h-10 rounded-xl text-xs",
    lg: "w-16 h-16 rounded-2xl text-lg",
  }[size] || "w-10 h-10 rounded-xl text-xs";

  if (!hasError && resolvedUrl) {
    return (
      <img
        src={resolvedUrl}
        alt={lab?.name || "Lab"}
        onError={() => setHasError(true)}
        className={`${sizeClasses} object-cover border border-slate-200/80 shadow-sm shrink-0 bg-slate-100 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses} bg-gradient-to-br from-[#0FA7E3] to-[#082B3F] text-white flex items-center justify-center font-bold shrink-0 shadow-sm ${className}`}
    >
      <Flask size={size === "lg" ? 28 : 20} weight="bold" />
    </div>
  );
}

export default function AdminLabsPage() {
  const { data: labs = [], isLoading } = useAdminLabs();
  const createLabMutation = useCreateLab();
  const updateLabMutation = useUpdateLab();
  const updateStatusMutation = useUpdateLabStatus();
  const deleteLabMutation = useDeleteLab();


  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [showAddModal, setShowAddModal] = useState(false);
  const [viewLab, setViewLab] = useState(null);
  const [editingLab, setEditingLab] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState("overview"); // 'overview' | 'edit'
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    license_number: "",
  });

  const [editFormData, setEditFormData] = useState({
    name: "",
    license_number: "",
  });

  // KPI Metrics
  const kpis = useMemo(() => {
    const total = labs.length;
    const approved = labs.filter((l) => (l.status || "").toLowerCase() === "approved").length;
    const pending = labs.filter((l) => (l.status || "").toLowerCase() === "pending").length;
    const suspended = labs.filter((l) =>
      ["suspended", "rejected"].includes((l.status || "").toLowerCase())
    ).length;
    return { total, approved, pending, suspended };
  }, [labs]);

  // Filtered Labs
  const filteredLabs = useMemo(() => {
    return labs.filter((l) => {
      const matchesSearch =
        !search.trim() ||
        (l.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (l.email || "").toLowerCase().includes(search.toLowerCase()) ||
        (l.license_number || "").toLowerCase().includes(search.toLowerCase());

      const status = (l.status || "pending").toLowerCase();
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "approved" && status === "approved") ||
        (statusFilter === "pending" && status === "pending") ||
        (statusFilter === "suspended" && (status === "suspended" || status === "rejected"));

      return matchesSearch && matchesStatus;
    });
  }, [labs, search, statusFilter]);

  const totalPages = Math.ceil(filteredLabs.length / itemsPerPage);
  const currentLabs = filteredLabs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const copyToClipboard = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success("Lab ID copied");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddLab = async (e) => {
    e.preventDefault();

    const cleanLicense = (formData.license_number || '').trim();
    if (cleanLicense && cleanLicense.toUpperCase() !== 'PENDING') {
      const duplicate = labs.find(
        (l) => (l.license_number || '').trim().toLowerCase() === cleanLicense.toLowerCase()
      );
      if (duplicate) {
        toast.error(`License / registration number '${cleanLicense}' is already registered to ${duplicate.name || "another lab"}.`);
        return;
      }
    }

    try {
      await createLabMutation.mutateAsync({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        license_number: cleanLicense,
      });
      toast.success("Lab partner added successfully!");
      setShowAddModal(false);
      setFormData({ name: "", email: "", password: "", license_number: "" });
    } catch (err) {
      toast.error(err.message || "Failed to add lab partner");
    }
  };

  const handleOpenDetails = (lab) => {
    setViewLab(lab);
    setActiveDetailTab("overview");
    setEditFormData({
      name: lab.name || "",
      license_number: lab.license_number || "",
    });
  };

  const handleOpenEdit = (lab) => {
    setEditingLab(lab);
    setEditFormData({
      name: lab.name || "",
      license_number: lab.license_number || "",
    });
  };

  const handleUpdateLab = async (e) => {
    e.preventDefault();
    if (!editingLab && !viewLab) return;
    const target = editingLab || viewLab;

    const cleanLicense = (editFormData.license_number || '').trim();
    if (cleanLicense && cleanLicense.toUpperCase() !== 'PENDING') {
      const duplicate = labs.find(
        (l) => l.id !== target.id && (l.license_number || '').trim().toLowerCase() === cleanLicense.toLowerCase()
      );
      if (duplicate) {
        toast.error(`License / registration number '${cleanLicense}' is already registered to ${duplicate.name || "another lab"}.`);
        return;
      }
    }

    try {
      await updateLabMutation.mutateAsync({
        id: target.id,
        name: editFormData.name.trim(),
        license_number: cleanLicense,
      });
      toast.success("Lab partner updated successfully!");
      if (viewLab && viewLab.id === target.id) {
        setViewLab((prev) => ({ ...prev, name: editFormData.name.trim(), license_number: cleanLicense }));
      }
      setEditingLab(null);
    } catch (err) {
      toast.error(err.message || "Failed to update lab");
    }
  };


  const handleUpdateStatus = async (id, status) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status, note: "Status updated by Admin" });
      toast.success(`Lab marked as ${status}`);
      if (viewLab && viewLab.id === id) {
        setViewLab((prev) => ({ ...prev, status }));
      }
    } catch (e) {
      toast.error(e.message || "Failed to update status");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteLabMutation.mutateAsync(deleteTarget.id);
      toast.success(`"${deleteTarget.name}" deleted successfully!`);
      if (viewLab && viewLab.id === deleteTarget.id) setViewLab(null);
      setDeleteTarget(null);
    } catch (e) {
      toast.error(e.message || "Failed to delete lab");
    }
  };

  const renderStatusBadge = (status) => {

    const s = (status || "pending").toLowerCase();
    switch (s) {
      case "approved":
      case "active":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Approved
          </span>
        );
      case "suspended":
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-50 text-rose-700 border border-rose-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Suspended
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-50 text-amber-700 border border-amber-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full font-[var(--font-plus-jakarta-sans)] animate-in fade-in zoom-in-95 duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-[var(--font-dm-serif-display)] text-3xl md:text-4xl text-[#082B3F] tracking-tight">
            Lab Partners Management
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
            Approve, monitor, verify licenses, and manage diagnostic partners.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#082B3F] hover:bg-[#0FA7E3] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Plus size={16} weight="bold" />
            <span>Add Lab Partner</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#082B3F] flex items-center justify-center shrink-0">
            <Flask size={20} weight="bold" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Labs</p>
            <p className="text-xl font-extrabold text-[#082B3F]">{kpis.total}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle size={20} weight="bold" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Approved & Active</p>
            <p className="text-xl font-extrabold text-emerald-600">{kpis.approved}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock size={20} weight="bold" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Review</p>
            <p className="text-xl font-extrabold text-amber-600">{kpis.pending}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <XCircle size={20} weight="bold" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Suspended</p>
            <p className="text-xl font-extrabold text-rose-600">{kpis.suspended}</p>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col overflow-hidden">
        
        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative w-full sm:w-[320px]">
              <MagnifyingGlass
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search by lab name, email, license..."
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

            {/* Status Tabs */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
              {["all", "approved", "pending", "suspended"].map((st) => (
                <button
                  key={st}
                  onClick={() => {
                    setStatusFilter(st);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                    statusFilter === st
                      ? "bg-[#082B3F] text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {st === "all" ? "All" : st}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs font-semibold text-slate-400 self-center">
            Showing <span className="font-bold text-[#082B3F]">{filteredLabs.length}</span> labs
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto min-h-[380px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-5">Lab Partner</th>
                <th className="py-3.5 px-4">License / Registration</th>
                <th className="py-3.5 px-4">Date Added</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="py-16 text-center text-slate-400 font-medium">
                    Loading lab partners...
                  </td>
                </tr>
              ) : currentLabs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-16 text-center text-slate-400 font-medium">
                    No lab partners found matching the criteria.
                  </td>
                </tr>
              ) : (
                currentLabs.map((lab) => (
                  <tr
                    key={lab.id}
                    className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                    onClick={() => handleOpenDetails(lab)}
                  >
                    {/* Lab Partner Details */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <LabAvatar lab={lab} size="md" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-[#082B3F] truncate group-hover:text-[#0FA7E3] transition-colors">
                              {lab.name}
                            </span>
                            {lab.status === "approved" && (
                              <ShieldCheck size={14} weight="fill" className="text-emerald-500 shrink-0" />
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 truncate block font-mono">
                            {lab.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* License Number */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 text-slate-700 text-xs font-mono font-bold border border-slate-200">
                        <TestTube size={13} weight="bold" className="text-[#0FA7E3]" />
                        <span>{lab.license_number || "PENDING"}</span>
                      </span>
                    </td>

                    {/* Date Added */}
                    <td className="py-3.5 px-4 text-xs text-slate-500 font-medium">
                      {lab.created_at
                        ? new Date(lab.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "—"}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      {renderStatusBadge(lab.status)}
                    </td>

                    {/* Clean Actions: [ 👁️ ] [ ✏️ ] [ 🔑 ] [ 🗑️ ] */}
                    <td className="py-3.5 px-5 text-right">
                      <div
                        className="flex items-center justify-end gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Eye Details Button (Icon Only) */}
                        <button
                          onClick={() => handleOpenDetails(lab)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-[#082B3F] text-[#082B3F] hover:text-white transition-all shadow-sm border border-slate-200"
                          title="View Complete Lab Details"
                        >
                          <Eye size={16} weight="bold" />
                        </button>

                        {/* Edit Button (Icon Only) */}
                        <button
                          onClick={() => handleOpenEdit(lab)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-[#082B3F] text-[#082B3F] hover:text-white transition-all shadow-sm border border-slate-200"
                          title="Edit Lab Profile"
                        >
                          <PencilSimple size={16} weight="bold" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => setDeleteTarget(lab)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all"
                          title="Delete Lab Partner"
                        >
                          <Trash size={16} weight="bold" />
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

      {/* Complete Lab Details Modal (Triggered by Eye Icon) */}
      {viewLab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#082B3F]/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-slate-200 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/40 shrink-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <LabAvatar lab={viewLab} size="lg" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-[#082B3F] truncate">
                        {viewLab.name}
                      </h2>
                      {viewLab.status === "approved" && (
                        <ShieldCheck size={18} weight="fill" className="text-emerald-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2 font-mono">
                      <span>{viewLab.email}</span>
                      <span>·</span>
                      <span className="text-slate-400">ID: {viewLab.id}</span>
                      <button
                        onClick={() => copyToClipboard(viewLab.id)}
                        className="text-slate-400 hover:text-slate-700"
                        title="Copy ID"
                      >
                        {copiedId === viewLab.id ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                      </button>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Status Toggle Button */}
                  {viewLab.status === "approved" ? (
                    <button
                      onClick={() => handleUpdateStatus(viewLab.id, "suspended")}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-all"
                    >
                      Suspend Lab
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateStatus(viewLab.id, "approved")}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-all"
                    >
                      Approve Lab
                    </button>
                  )}

                  <button
                    onClick={() => setViewLab(null)}
                    className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-200/50 transition-colors"
                  >
                    <X size={20} weight="bold" />
                  </button>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-2 mt-6 border-b border-slate-200/80 -mb-6 pb-0">
                <button
                  onClick={() => setActiveDetailTab("overview")}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
                    activeDetailTab === "overview"
                      ? "border-[#082B3F] text-[#082B3F]"
                      : "border-transparent text-slate-400 hover:text-slate-700"
                  }`}
                >
                  <Info size={15} weight="bold" />
                  <span>Overview & Status</span>
                </button>

                <button
                  onClick={() => setActiveDetailTab("edit")}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
                    activeDetailTab === "edit"
                      ? "border-[#082B3F] text-[#082B3F]"
                      : "border-transparent text-slate-400 hover:text-slate-700"
                  }`}
                >
                  <PencilSimple size={15} weight="bold" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto flex-1 p-6 space-y-6">
              {activeDetailTab === "overview" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">License / Reg</p>
                      <p className="text-sm font-extrabold text-[#082B3F] mt-1 font-mono">{viewLab.license_number || "PENDING"}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</p>
                      <div className="mt-1">
                        {renderStatusBadge(viewLab.status)}
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Partner Since</p>
                      <p className="text-sm font-extrabold text-[#082B3F] mt-1">
                        {viewLab.created_at ? new Date(viewLab.created_at).toLocaleDateString() : "Active"}
                      </p>
                    </div>
                  </div>
                </div>
              )}


              {activeDetailTab === "edit" && (
                <form onSubmit={handleUpdateLab} className="space-y-4 animate-in fade-in duration-200">
                  <div>
                    <label className="block text-xs font-bold text-[#082B3F] mb-1.5 uppercase tracking-wider">
                      Lab Partner Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 outline-none focus:border-[#082B3F] text-xs font-medium text-[#082B3F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#082B3F] mb-1.5 uppercase tracking-wider">
                      License / Registration Number
                    </label>
                    <input
                      type="text"
                      value={editFormData.license_number}
                      onChange={(e) => setEditFormData({ ...editFormData, license_number: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 outline-none focus:border-[#082B3F] text-xs font-medium text-[#082B3F]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={updateLabMutation.isPending}
                    className="w-full h-11 rounded-xl bg-[#082B3F] text-white text-xs font-bold hover:bg-[#0FA7E3] disabled:opacity-50 transition-all shadow-sm mt-2"
                  >
                    {updateLabMutation.isPending ? "Saving..." : "Save Lab Profile Changes"}
                  </button>
                </form>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 px-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => setDeleteTarget(viewLab)}
                className="text-xs font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-rose-50 transition-colors"
              >
                <Trash size={15} weight="bold" />
                <span>Delete Lab</span>
              </button>

              <button
                type="button"
                onClick={() => setViewLab(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#082B3F] text-white hover:bg-[#0FA7E3] transition-all shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Lab Modal (Triggered by [ ✏️ ] Button) */}
      {editingLab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#082B3F]/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#082B3F] text-white flex items-center justify-center font-bold text-xs">
                  <PencilSimple size={18} weight="bold" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#082B3F]">Edit Lab Partner</h2>
                  <p className="text-xs text-slate-400 font-medium">Update diagnostic provider details</p>
                </div>
              </div>
              <button
                onClick={() => setEditingLab(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/50 transition-colors"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            <form onSubmit={handleUpdateLab} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-[#082B3F] mb-1.5 uppercase tracking-wider">
                  Lab Name *
                </label>
                <input
                  required
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 outline-none focus:border-[#082B3F] text-xs font-medium text-[#082B3F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#082B3F] mb-1.5 uppercase tracking-wider">
                  License Number
                </label>
                <input
                  type="text"
                  value={editFormData.license_number}
                  onChange={(e) => setEditFormData({ ...editFormData, license_number: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 outline-none focus:border-[#082B3F] text-xs font-medium text-[#082B3F]"
                  placeholder="e.g. LAB-12345"
                />
              </div>

              <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingLab(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateLabMutation.isPending}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#082B3F] text-white hover:bg-[#0FA7E3] disabled:opacity-50 transition-all shadow-sm"
                >
                  {updateLabMutation.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Lab Partner Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#082B3F]/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#082B3F] text-white flex items-center justify-center font-bold text-xs">
                  <Flask size={18} weight="bold" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#082B3F]">Add New Lab Partner</h2>
                  <p className="text-xs text-slate-400 font-medium">Register diagnostic provider credentials</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/50 transition-colors"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            <form onSubmit={handleAddLab} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-[#082B3F] mb-1.5 uppercase tracking-wider">
                  Lab Name *
                </label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 outline-none focus:border-[#082B3F] text-xs font-medium text-[#082B3F]"
                  placeholder="e.g. Chughtai Lab / City Diagnostics"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#082B3F] mb-1.5 uppercase tracking-wider">
                  Email Login *
                </label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 outline-none focus:border-[#082B3F] text-xs font-medium text-[#082B3F]"
                  placeholder="lab@diagnostics.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#082B3F] mb-1.5 uppercase tracking-wider">
                  Default Password *
                </label>
                <input
                  required
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 outline-none focus:border-[#082B3F] text-xs font-medium text-[#082B3F]"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#082B3F] mb-1.5 uppercase tracking-wider">
                  License Number
                </label>
                <input
                  type="text"
                  value={formData.license_number}
                  onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 outline-none focus:border-[#082B3F] text-xs font-medium text-[#082B3F]"
                  placeholder="e.g. LAB-PK-54321"
                />
              </div>

              <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLabMutation.isPending}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#082B3F] text-white hover:bg-[#0FA7E3] disabled:opacity-50 transition-all shadow-sm"
                >
                  {createLabMutation.isPending ? "Adding..." : "Add Lab Partner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Lab Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#082B3F]/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-6 border border-slate-200 animate-in zoom-in-95 duration-200 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 border border-rose-100 shadow-sm">
              <Trash size={28} weight="bold" />
            </div>

            <h3 className="text-lg font-bold text-[#082B3F]">
              Delete Lab Partner?
            </h3>

            <p className="text-xs text-slate-500 mt-2 max-w-sm leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-[#082B3F]">{deleteTarget.name}</strong>? This action cannot be undone and will remove all their diagnostic test bookings and partner credentials.
            </p>

            <div className="flex items-center gap-3 w-full mt-6 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 h-11 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleteLabMutation.isPending}
                className="flex-1 h-11 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50 transition-all shadow-sm"
              >
                {deleteLabMutation.isPending ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
