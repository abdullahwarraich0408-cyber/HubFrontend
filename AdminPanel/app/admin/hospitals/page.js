"use client";

import { useState, useMemo } from "react";
import {
  useAdminHospitals,
  useCreateHospital,
  useUpdateHospital,
  useUpdateHospitalStatus,
  useDeleteHospital,
  useAdminDoctors,
} from "@/lib/hooks/useApi";
import { isValidPakistaniPhone, formatPakistaniPhoneInput } from "@/lib/validators/pakistanPhone";
import { toast } from "sonner";

import {
  Buildings,
  MagnifyingGlass,
  Plus,
  X,
  PencilSimple,
  Trash,
  CheckCircle,
  XCircle,
  MapPin,
  Stethoscope,
  Phone,
  EnvelopeSimple,
  CaretLeft,
  CaretRight,
  ShieldCheck,
  WarningCircle,
  Eye,
  GlobeHemisphereWest,
  Copy,
  Check,
  Info,
  CalendarCheck,
  UserCheck,
} from "@phosphor-icons/react";

const emptyForm = {
  name: "",
  logo: "",
  cover_image: "",
  description: "",
  address: "",
  city: "",
  phone: "",
  email: "",
};

const SAMPLE_HOSPITAL_LOGOS = [
  "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=250",
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=250",
  "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=250",
  "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&q=80&w=250",
];

function HospitalAvatar({ hospital, size = "md", className = "" }) {
  const [hasError, setHasError] = useState(false);
  const logo = hospital?.logo || hospital?.cover_image;

  const resolvedUrl = useMemo(() => {
    if (!logo) {
      const charSum = (hospital?.name || "hospital")
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return SAMPLE_HOSPITAL_LOGOS[Math.abs(charSum) % SAMPLE_HOSPITAL_LOGOS.length];
    }
    if (logo.startsWith("http://") || logo.startsWith("https://") || logo.startsWith("data:")) {
      return logo;
    }
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const base = apiBase.replace(/\/api\/?$/, "");
    return logo.startsWith("/") ? `${base}${logo}` : `${base}/${logo}`;
  }, [logo, hospital?.name]);

  const sizeClasses = {
    sm: "w-8 h-8 rounded-lg text-xs",
    md: "w-10 h-10 rounded-xl text-sm",
    lg: "w-16 h-16 rounded-2xl text-lg",
  }[size] || "w-10 h-10 rounded-xl text-sm";

  if (!hasError && resolvedUrl) {
    return (
      <img
        src={resolvedUrl}
        alt={hospital?.name || "Hospital"}
        onError={() => setHasError(true)}
        className={`${sizeClasses} object-cover border border-slate-200/80 shadow-sm shrink-0 bg-slate-100 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses} bg-gradient-to-br from-[#0FA7E3] to-[#082B3F] text-white flex items-center justify-center font-bold shrink-0 shadow-sm ${className}`}
    >
      <Buildings size={size === "lg" ? 28 : 20} weight="bold" />
    </div>
  );
}

export default function AdminHospitalsPage() {
  const { data: hospitals = [], isLoading } = useAdminHospitals();
  const { data: doctors = [] } = useAdminDoctors();
  const createMutation = useCreateHospital();
  const updateMutation = useUpdateHospital();
  const statusMutation = useUpdateHospitalStatus();
  const deleteMutation = useDeleteHospital();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [showAddModal, setShowAddModal] = useState(false);
  const [viewHospital, setViewHospital] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState("overview"); // 'overview' | 'doctors' | 'edit'

  const [editFormData, setEditFormData] = useState(emptyForm);
  const [addFormData, setAddFormData] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Extract unique cities
  const cities = useMemo(() => {
    const set = new Set();
    hospitals.forEach((h) => {
      if (h.city) set.add(h.city.trim());
    });
    return Array.from(set);
  }, [hospitals]);

  // Key performance metrics
  const kpis = useMemo(() => {
    const total = hospitals.length;
    const active = hospitals.filter((h) => h.is_active).length;
    const totalDoctors = hospitals.reduce((acc, h) => acc + (h._count?.doctors || 0), 0);
    const totalCities = cities.length;
    return { total, active, totalDoctors, totalCities };
  }, [hospitals, cities]);

  // Filtered hospitals
  const filtered = useMemo(() => {
    return hospitals.filter((h) => {
      const matchesSearch =
        !search.trim() ||
        (h.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (h.city || "").toLowerCase().includes(search.toLowerCase()) ||
        (h.address || "").toLowerCase().includes(search.toLowerCase()) ||
        (h.email || "").toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && h.is_active) ||
        (statusFilter === "inactive" && !h.is_active);

      const matchesCity = cityFilter === "all" || h.city === cityFilter;

      return matchesSearch && matchesStatus && matchesCity;
    });
  }, [hospitals, search, statusFilter, cityFilter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Practicing doctors for the selected hospital
  const affiliatedDoctors = useMemo(() => {
    if (!viewHospital) return [];
    return doctors.filter(
      (d) =>
        d.hospital_id === viewHospital.id ||
        (d.hospital && d.hospital.toLowerCase() === viewHospital.name.toLowerCase())
    );
  }, [doctors, viewHospital]);

  const copyToClipboard = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success("Hospital ID copied");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenDetails = (hospital) => {
    setViewHospital(hospital);
    setActiveDetailTab("overview");
    setEditFormData({
      name: hospital.name || "",
      logo: hospital.logo || "",
      cover_image: hospital.cover_image || "",
      description: hospital.description || "",
      address: hospital.address || "",
      city: hospital.city || "",
      phone: hospital.phone || "",
      email: hospital.email || "",
    });
  };

  const handleCreateHospital = async (e) => {
    e.preventDefault();

    if (addFormData.phone && !isValidPakistaniPhone(addFormData.phone)) {
      toast.error("Please enter a valid Pakistani phone number (e.g. +92 300 1234567 or 042 35789012)");
      return;
    }

    try {
      await createMutation.mutateAsync(addFormData);
      toast.success("Hospital created successfully!");
      setShowAddModal(false);
      setAddFormData(emptyForm);
    } catch (err) {
      toast.error(err.message || "Failed to create hospital");
    }
  };

  const handleUpdateHospital = async (e) => {
    e.preventDefault();
    if (!viewHospital) return;

    if (editFormData.phone && !isValidPakistaniPhone(editFormData.phone)) {
      toast.error("Please enter a valid Pakistani phone number (e.g. +92 300 1234567 or 042 35789012)");
      return;
    }

    try {
      await updateMutation.mutateAsync({ id: viewHospital.id, ...editFormData });
      toast.success("Hospital profile updated!");
      setViewHospital((prev) => ({ ...prev, ...editFormData }));
      setActiveDetailTab("overview");
    } catch (err) {
      toast.error(err.message || "Failed to update hospital");
    }
  };


  const handleToggleStatus = async (hospital) => {
    try {
      await statusMutation.mutateAsync({ id: hospital.id, is_active: !hospital.is_active });
      toast.success(`Hospital marked as ${hospital.is_active ? "Inactive" : "Active"}`);
      if (viewHospital && viewHospital.id === hospital.id) {
        setViewHospital((prev) => ({ ...prev, is_active: !prev.is_active }));
      }
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success(`"${deleteTarget.name}" deleted successfully`);
      if (viewHospital && viewHospital.id === deleteTarget.id) setViewHospital(null);
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message || "Failed to delete hospital");
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full font-[var(--font-plus-jakarta-sans)] animate-in fade-in zoom-in-95 duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-[var(--font-dm-serif-display)] text-3xl md:text-4xl text-[#082B3F] tracking-tight">
            Hospital Network Management
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
            Register and manage medical complexes, clinics, and doctor practice affiliations.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#082B3F] hover:bg-[#0FA7E3] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Plus size={16} weight="bold" />
            <span>Add Hospital</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#082B3F] flex items-center justify-center shrink-0">
            <Buildings size={20} weight="bold" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Hospitals</p>
            <p className="text-xl font-extrabold text-[#082B3F]">{kpis.total}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle size={20} weight="bold" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Status</p>
            <p className="text-xl font-extrabold text-emerald-600">{kpis.active}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Stethoscope size={20} weight="bold" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Affiliated Doctors</p>
            <p className="text-xl font-extrabold text-[#082B3F]">{kpis.totalDoctors}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <GlobeHemisphereWest size={20} weight="bold" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Cities Covered</p>
            <p className="text-xl font-extrabold text-[#082B3F]">{kpis.totalCities}</p>
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
                placeholder="Search by hospital name, city, address..."
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

            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => { setStatusFilter("all"); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === "all"
                    ? "bg-[#082B3F] text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                All
              </button>
              <button
                onClick={() => { setStatusFilter("active"); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === "active"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-500 hover:text-emerald-700"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => { setStatusFilter("inactive"); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === "inactive"
                    ? "bg-rose-600 text-white shadow-sm"
                    : "text-slate-500 hover:text-rose-700"
                }`}
              >
                Inactive
              </button>
            </div>

            {/* City Dropdown */}
            {cities.length > 0 && (
              <select
                value={cityFilter}
                onChange={(e) => { setCityFilter(e.target.value); setCurrentPage(1); }}
                className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 outline-none focus:border-[#082B3F]"
              >
                <option value="all">All Cities</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="text-xs font-semibold text-slate-400 self-center">
            Showing <span className="font-bold text-[#082B3F]">{filtered.length}</span> hospitals
          </div>
        </div>

        {/* Clean Basic Table with Eye Button */}
        <div className="overflow-x-auto min-h-[380px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-5">Hospital Facility</th>
                <th className="py-3.5 px-4">Location / City</th>
                <th className="py-3.5 px-4">Affiliated Doctors</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="py-16 text-center text-slate-400 font-medium">
                    Loading hospital network...
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-16 text-center text-slate-400 font-medium">
                    No hospitals found matching the search criteria.
                  </td>
                </tr>
              ) : (
                currentItems.map((hospital) => (
                  <tr
                    key={hospital.id}
                    className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                    onClick={() => handleOpenDetails(hospital)}
                  >
                    {/* Hospital Facility */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <HospitalAvatar hospital={hospital} size="md" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-[#082B3F] truncate group-hover:text-[#0FA7E3] transition-colors">
                              {hospital.name}
                            </span>
                            <ShieldCheck size={14} weight="fill" className="text-emerald-500 shrink-0" />
                          </div>
                          <span className="text-[11px] text-slate-400 truncate block font-mono">
                            {hospital.email || hospital.phone || "No contact info"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Location / City */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#082B3F]">
                          <MapPin size={13} weight="bold" className="text-rose-500" />
                          {hospital.city || "Pakistan"}
                        </span>
                        <span className="text-[11px] text-slate-400 truncate max-w-[200px]">
                          {hospital.address || "Main medical center"}
                        </span>
                      </div>
                    </td>

                    {/* Doctors Count */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-[#082B3F] text-xs font-bold border border-blue-100">
                        <Stethoscope size={13} weight="bold" />
                        <span>{hospital._count?.doctors ?? 0} {hospital._count?.doctors === 1 ? "Doctor" : "Doctors"}</span>
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {hospital.is_active ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-50 text-rose-700 border border-rose-200/80">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          Inactive
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right">
                      <div
                        className="flex items-center justify-end gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Eye Details Button (Icon only) */}
                        <button
                          onClick={() => handleOpenDetails(hospital)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-[#082B3F] text-[#082B3F] hover:text-white transition-all shadow-sm border border-slate-200"
                          title="View Details"
                        >
                          <Eye size={16} weight="bold" />
                        </button>

                        {/* Edit Button (Icon only) */}
                        <button
                          onClick={() => {
                            handleOpenDetails(hospital);
                            setActiveDetailTab("edit");
                          }}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-[#082B3F] text-[#082B3F] hover:text-white transition-all shadow-sm border border-slate-200"
                          title="Edit Hospital Facility"
                        >
                          <PencilSimple size={16} weight="bold" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => setDeleteTarget(hospital)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all"
                          title="Delete Hospital"
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

      {/* Complete Hospital Detail Modal (Triggered by Eye Icon) */}
      {viewHospital && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#082B3F]/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-slate-200 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/40 shrink-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <HospitalAvatar hospital={viewHospital} size="lg" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-[#082B3F] truncate">
                        {viewHospital.name}
                      </h2>
                      <ShieldCheck size={18} weight="fill" className="text-emerald-500 shrink-0" />
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2 font-mono">
                      <span>{viewHospital.city || "Pakistan"}</span>
                      <span>·</span>
                      <span className="text-slate-400">ID: {viewHospital.id}</span>
                      <button
                        onClick={() => copyToClipboard(viewHospital.id)}
                        className="text-slate-400 hover:text-slate-700"
                        title="Copy ID"
                      >
                        {copiedId === viewHospital.id ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                      </button>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Status toggle pill inside modal header */}
                  <button
                    onClick={() => handleToggleStatus(viewHospital)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      viewHospital.is_active
                        ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                    }`}
                  >
                    {viewHospital.is_active ? "Deactivate" : "Activate"}
                  </button>

                  <button
                    onClick={() => setViewHospital(null)}
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
                  <span>Overview & Facility</span>
                </button>

                <button
                  onClick={() => setActiveDetailTab("doctors")}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
                    activeDetailTab === "doctors"
                      ? "border-[#082B3F] text-[#082B3F]"
                      : "border-transparent text-slate-400 hover:text-slate-700"
                  }`}
                >
                  <Stethoscope size={15} weight="bold" />
                  <span>Practicing Doctors ({affiliatedDoctors.length})</span>
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
              
              {/* Tab 1: Overview */}
              {activeDetailTab === "overview" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">City</p>
                      <p className="text-sm font-extrabold text-[#082B3F] mt-1">{viewHospital.city || "Pakistan"}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Doctors Linked</p>
                      <p className="text-sm font-extrabold text-[#082B3F] mt-1">{affiliatedDoctors.length} Practitioners</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Phone</p>
                      <p className="text-sm font-extrabold text-[#082B3F] mt-1 truncate">{viewHospital.phone || "—"}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</p>
                      <div className="mt-1">
                        {viewHospital.is_active ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                            <CheckCircle size={14} weight="fill" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600">
                            <XCircle size={14} weight="fill" /> Inactive
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-3">
                    <h3 className="text-xs font-bold text-[#082B3F] uppercase tracking-wider">Location & Contact</h3>
                    <div className="flex items-start gap-3">
                      <MapPin size={20} weight="bold" className="text-rose-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-[#082B3F]">{viewHospital.address || "Street address not specified"}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{viewHospital.city}, Pakistan</p>
                      </div>
                    </div>
                    {viewHospital.email && (
                      <div className="flex items-center gap-3 pt-2">
                        <EnvelopeSimple size={18} className="text-slate-400 shrink-0" />
                        <span className="text-xs font-mono text-slate-600">{viewHospital.email}</span>
                      </div>
                    )}
                  </div>

                  {viewHospital.description && (
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-2">
                      <h3 className="text-xs font-bold text-[#082B3F] uppercase tracking-wider">About the Hospital</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{viewHospital.description}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Practicing Doctors */}
              {activeDetailTab === "doctors" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-[#082B3F] uppercase tracking-wider">
                      Doctors Practicing at {viewHospital.name}
                    </h3>
                    <span className="text-xs font-bold text-slate-400">{affiliatedDoctors.length} Registered</span>
                  </div>

                  {affiliatedDoctors.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400 font-medium rounded-2xl border border-dashed border-slate-200">
                      No doctors are currently attached to this hospital. You can link doctors via the Doctors Management page.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {affiliatedDoctors.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0FA7E3] to-[#082B3F] text-white flex items-center justify-center font-bold text-xs shrink-0">
                              {(doc.name || "D").replace(/^Dr\.?\s*/i, "").slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-[#082B3F]">
                                {doc.name.startsWith("Dr.") ? doc.name : `Dr. ${doc.name}`}
                              </p>
                              <p className="text-xs text-slate-500">{doc.specialty || "Specialist"} · {doc.experience_years ? `${doc.experience_years} Yrs Exp` : "Practitioner"}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-extrabold text-[#082B3F]">PKR {Number(doc.fee || 0).toLocaleString()}</p>
                            <span className="text-[10px] text-emerald-600 font-bold">Accepting Appointments</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Edit Form */}
              {activeDetailTab === "edit" && (
                <form onSubmit={handleUpdateHospital} className="space-y-4 animate-in fade-in duration-200">
                  <div>
                    <label className="block text-xs font-bold text-[#082B3F] mb-1.5 uppercase tracking-wider">Hospital Name *</label>
                    <input
                      required
                      type="text"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 outline-none focus:border-[#082B3F] text-xs font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#082B3F] mb-1.5 uppercase tracking-wider">City *</label>
                      <input
                        required
                        type="text"
                        value={editFormData.city}
                        onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 outline-none focus:border-[#082B3F] text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#082B3F] mb-1.5 uppercase tracking-wider">Phone</label>
                      <input
                        type="text"
                        maxLength={16}
                        placeholder="+92 300 1234567"
                        value={editFormData.phone}
                        onChange={(e) => setEditFormData({ ...editFormData, phone: formatPakistaniPhoneInput(e.target.value) })}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 outline-none focus:border-[#082B3F] text-xs font-medium"
                      />
                    </div>
                  </div>


                  <div>
                    <label className="block text-xs font-bold text-[#082B3F] mb-1.5 uppercase tracking-wider">Official Email</label>
                    <input
                      type="email"
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 outline-none focus:border-[#082B3F] text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#082B3F] mb-1.5 uppercase tracking-wider">Street Address</label>
                    <input
                      type="text"
                      value={editFormData.address}
                      onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 outline-none focus:border-[#082B3F] text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#082B3F] mb-1.5 uppercase tracking-wider">Description</label>
                    <textarea
                      rows={2}
                      value={editFormData.description}
                      onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-[#082B3F] text-xs font-medium resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#082B3F] mb-1.5 uppercase tracking-wider">Logo URL</label>
                      <input
                        type="url"
                        value={editFormData.logo}
                        onChange={(e) => setEditFormData({ ...editFormData, logo: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 outline-none focus:border-[#082B3F] text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#082B3F] mb-1.5 uppercase tracking-wider">Banner Image URL</label>
                      <input
                        type="url"
                        value={editFormData.cover_image}
                        onChange={(e) => setEditFormData({ ...editFormData, cover_image: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 outline-none focus:border-[#082B3F] text-xs font-medium"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="w-full h-11 rounded-xl bg-[#082B3F] text-white text-xs font-bold hover:bg-[#0FA7E3] disabled:opacity-50 transition-all shadow-sm mt-2"
                  >
                    {updateMutation.isPending ? "Saving..." : "Save Hospital Changes"}
                  </button>
                </form>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 px-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => setDeleteTarget(viewHospital)}
                className="text-xs font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-rose-50 transition-colors"
              >
                <Trash size={15} weight="bold" />
                <span>Delete Hospital</span>
              </button>

              <button
                type="button"
                onClick={() => setViewHospital(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#082B3F] text-white hover:bg-[#0FA7E3] transition-all shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Hospital Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#082B3F]/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#082B3F] text-white flex items-center justify-center font-bold text-xs">
                  <Buildings size={18} weight="bold" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#082B3F]">Add New Hospital</h2>
                  <p className="text-xs text-slate-400 font-medium">Create a new healthcare institution profile</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/50 transition-colors"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            <form onSubmit={handleCreateHospital} className="p-6 overflow-y-auto flex-1 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-[#082B3F] mb-1.5 uppercase tracking-wider">
                  Hospital Name *
                </label>
                <input
                  required
                  type="text"
                  value={addFormData.name}
                  onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 outline-none focus:border-[#082B3F] text-xs font-medium text-[#082B3F]"
                  placeholder="e.g. Shifa International Hospital"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#082B3F] mb-1.5 uppercase tracking-wider">
                    City *
                  </label>
                  <input
                    required
                    type="text"
                    value={addFormData.city}
                    onChange={(e) => setAddFormData({ ...addFormData, city: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 outline-none focus:border-[#082B3F] text-xs font-medium text-[#082B3F]"
                    placeholder="Islamabad / Lahore / Karachi"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#082B3F] mb-1.5 uppercase tracking-wider">
                    Official Phone
                  </label>
                  <input
                    type="text"
                    maxLength={16}
                    value={addFormData.phone}
                    onChange={(e) => setAddFormData({ ...addFormData, phone: formatPakistaniPhoneInput(e.target.value) })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 outline-none focus:border-[#082B3F] text-xs font-medium text-[#082B3F]"
                    placeholder="+92 51 8463000 / 0300 1234567"
                  />
                </div>

              </div>

              <div>
                <label className="block text-xs font-bold text-[#082B3F] mb-1.5 uppercase tracking-wider">
                  Official Email
                </label>
                <input
                  type="email"
                  value={addFormData.email}
                  onChange={(e) => setAddFormData({ ...addFormData, email: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 outline-none focus:border-[#082B3F] text-xs font-medium text-[#082B3F]"
                  placeholder="info@hospital.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#082B3F] mb-1.5 uppercase tracking-wider">
                  Street Address
                </label>
                <input
                  type="text"
                  value={addFormData.address}
                  onChange={(e) => setAddFormData({ ...addFormData, address: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 outline-none focus:border-[#082B3F] text-xs font-medium text-[#082B3F]"
                  placeholder="Sector H-8/4, Pitras Bukhari Road"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#082B3F] mb-1.5 uppercase tracking-wider">
                  Hospital Description
                </label>
                <textarea
                  rows={2}
                  value={addFormData.description}
                  onChange={(e) => setAddFormData({ ...addFormData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-[#082B3F] text-xs font-medium text-[#082B3F] resize-none"
                  placeholder="Premier tertiary care hospital in Pakistan..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#082B3F] mb-1.5 uppercase tracking-wider">
                    Logo URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={addFormData.logo}
                    onChange={(e) => setAddFormData({ ...addFormData, logo: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 outline-none focus:border-[#082B3F] text-xs font-medium text-[#082B3F]"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#082B3F] mb-1.5 uppercase tracking-wider">
                    Banner URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={addFormData.cover_image}
                    onChange={(e) => setAddFormData({ ...addFormData, cover_image: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 outline-none focus:border-[#082B3F] text-xs font-medium text-[#082B3F]"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#082B3F] text-white hover:bg-[#0FA7E3] disabled:opacity-50 transition-all shadow-sm"
                >
                  {createMutation.isPending ? "Creating..." : "Create Hospital"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Hospital Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#082B3F]/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-6 border border-slate-200 animate-in zoom-in-95 duration-200 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 border border-rose-100 shadow-sm">
              <Trash size={28} weight="bold" />
            </div>

            <h3 className="text-lg font-bold text-[#082B3F]">
              Delete Hospital Facility?
            </h3>

            <p className="text-xs text-slate-500 mt-2 max-w-sm leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-[#082B3F]">{deleteTarget.name}</strong>? This action cannot be undone and will unbind all associated doctor practice schedules.
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
                disabled={deleteMutation.isPending}
                className="flex-1 h-11 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50 transition-all shadow-sm"
              >
                {deleteMutation.isPending ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
