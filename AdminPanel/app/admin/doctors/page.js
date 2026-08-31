"use client";

import { useState, useMemo } from "react";
import {
  useAdminDoctors,
  useCreateDoctor,
  useUpdateDoctor,
  useUpdateDoctorStatus,
  useDeleteDoctor,
  useAdminDoctorAppointments,
  useAdminHospitals,
  useAdminDoctorPracticeLocations,
  useCreateDoctorPracticeLocation,
  useUpdateDoctorPracticeLocation,
  useDeleteDoctorPracticeLocation,
} from "@/lib/hooks/useApi";

import { toast } from "sonner";
import {
  Users,
  CheckCircle,
  XCircle,
  Trash,
  CaretLeft,
  CaretRight,
  MagnifyingGlass,
  Plus,
  X,
  Buildings,
  CalendarBlank,
  PencilSimple,
  Stethoscope,
  Clock,
  CurrencyDollar,
  Briefcase,
  Copy,
  Check,
  Eye,
  CalendarCheck,

  ShieldCheck,
  EnvelopeSimple,
  UserCheck,
  WarningCircle,
  Info,
} from "@phosphor-icons/react";

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DEFAULT_SLOT = "09:00 AM - 01:00 PM";

const SAMPLE_DOCTOR_PHOTOS = [
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300",
  "https://images.unsplash.com/photo-1594824813620-72ec0b75ff60?auto=format&fit=crop&q=80&w=300",
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300",
  "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300",
  "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=300",
];

export function DoctorAvatar({ doctor, size = "md", className = "" }) {
  const [hasError, setHasError] = useState(false);
  const initials = (doctor?.name || "D")
    .replace(/^Dr\.?\s*/i, "")
    .slice(0, 2)
    .toUpperCase();

  const photoUrl = doctor?.photo_url || doctor?.photo || doctor?.avatar || doctor?.image;

  const resolvedUrl = useMemo(() => {
    if (!photoUrl) {
      const charSum = (doctor?.name || "doctor")
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return SAMPLE_DOCTOR_PHOTOS[Math.abs(charSum) % SAMPLE_DOCTOR_PHOTOS.length];
    }
    if (
      photoUrl.startsWith("http://") ||
      photoUrl.startsWith("https://") ||
      photoUrl.startsWith("data:")
    ) {
      return photoUrl;
    }
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const base = apiBase.replace(/\/api\/?$/, "");
    return photoUrl.startsWith("/") ? `${base}${photoUrl}` : `${base}/${photoUrl}`;
  }, [photoUrl, doctor?.name]);

  const sizeClasses = {
    sm: "w-8 h-8 rounded-lg text-[10px]",
    md: "w-10 h-10 rounded-xl text-xs",
    lg: "w-16 h-16 rounded-2xl text-lg",
  }[size] || "w-10 h-10 rounded-xl text-xs";

  if (!hasError && resolvedUrl) {
    return (
      <img
        src={resolvedUrl}
        alt={doctor?.name || "Doctor"}
        onError={() => setHasError(true)}
        className={`${sizeClasses} object-cover border border-slate-200/80 shadow-sm shrink-0 bg-slate-100 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses} bg-gradient-to-br from-[#0FA7E3] to-[#082B3F] text-white flex items-center justify-center font-bold shrink-0 shadow-sm ${className}`}
    >
      {initials}
    </div>
  );
}

const emptyLocationForm = {
  hospital_id: "",
  fee: "",
  days: [],
  slots: DEFAULT_SLOT,
};

function parseTimePart(part) {
  if (!part) return null;
  const str = String(part).trim();
  const match12 = str.match(/^(0?[1-9]|1[0-2])(?::([0-5][0-9]))?\s*(AM|PM|am|pm)$/i);
  if (match12) {
    let hours = parseInt(match12[1], 10);
    const minutes = match12[2] ? parseInt(match12[2], 10) : 0;
    const meridiem = match12[3].toUpperCase();
    if (meridiem === "PM" && hours < 12) hours += 12;
    if (meridiem === "AM" && hours === 12) hours = 0;
    return hours * 60 + minutes;
  }
  const match24 = str.match(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/);
  if (match24) {
    const hours = parseInt(match24[1], 10);
    const minutes = parseInt(match24[2], 10);
    return hours * 60 + minutes;
  }
  return null;
}

function formatMinutes(minutes) {
  const hrs24 = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const meridiem = hrs24 >= 12 ? "PM" : "AM";
  const hrs12 = hrs24 % 12 || 12;
  return `${String(hrs12).padStart(2, "0")}:${String(mins).padStart(2, "0")} ${meridiem}`;
}

export function validateAndFormatTimeSlot(rawSlot) {
  if (!rawSlot || typeof rawSlot !== "string") return null;
  const parts = rawSlot.replace(/[–—]/g, "-").split("-").map((p) => p.trim()).filter(Boolean);
  if (parts.length !== 2) return null;
  const start = parseTimePart(parts[0]);
  const end = parseTimePart(parts[1]);
  if (start == null || end == null || end <= start) return null;
  return `${formatMinutes(start)} - ${formatMinutes(end)}`;
}

export default function AdminDoctorsPage() {
  const { data: doctors = [], isLoading } = useAdminDoctors();
  const { data: hospitals = [] } = useAdminHospitals();
  const createDoctorMutation = useCreateDoctor();
  const updateDoctorMutation = useUpdateDoctor();
  const updateStatusMutation = useUpdateDoctorStatus();
  const deleteDoctorMutation = useDeleteDoctor();
  const createLocationMutation = useCreateDoctorPracticeLocation();
  const updateLocationMutation = useUpdateDoctorPracticeLocation();
  const deleteLocationMutation = useDeleteDoctorPracticeLocation();


  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null); // Doctor object being edited
  const [viewDoctor, setViewDoctor] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState("overview"); // 'overview' | 'schedule' | 'appointments'

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLocationTarget, setDeleteLocationTarget] = useState(null);

  const [editingLocationId, setEditingLocationId] = useState(null);
  const [locationForm, setLocationForm] = useState(emptyLocationForm);
  const [copiedId, setCopiedId] = useState(null);

  const { data: doctorAppointmentsData } = useAdminDoctorAppointments(viewDoctor?.id, {
    enabled: Boolean(viewDoctor?.id && activeDetailTab === "appointments"),
  });

  const { data: practiceLocations = [], isLoading: locationsLoading } = useAdminDoctorPracticeLocations(
    viewDoctor?.id,
    { enabled: Boolean(viewDoctor?.id) }
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    specialty: "",
    experience_years: "",
    fee: "",
    hospital_id: "",
    photo_url: "",
  });

  const [editFormData, setEditFormData] = useState({
    name: "",
    specialty: "",
    experience_years: "",
    fee: "",
    hospital_id: "",
    photo_url: "",
  });

  // Extract unique specialties
  const specialties = useMemo(() => {
    const set = new Set();
    doctors.forEach((d) => {
      if (d.specialty) set.add(d.specialty);
    });
    return Array.from(set);
  }, [doctors]);

  // Key performance metrics
  const kpis = useMemo(() => {
    const total = doctors.length;
    const active = doctors.filter((d) => d.is_active).length;
    const withHospital = doctors.filter((d) => d.hospital || d.hospital_id).length;
    const fees = doctors.map((d) => Number(d.fee) || 0).filter((f) => f > 0);
    const avgFee = fees.length ? Math.round(fees.reduce((a, b) => a + b, 0) / fees.length) : 2000;
    return { total, active, withHospital, avgFee };
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((d) => {
      const matchesSearch =
        !search.trim() ||
        (d.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (d.email || "").toLowerCase().includes(search.toLowerCase()) ||
        (d.specialty || "").toLowerCase().includes(search.toLowerCase()) ||
        (d.hospital || "").toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && d.is_active) ||
        (statusFilter === "inactive" && !d.is_active);

      const matchesSpecialty =
        specialtyFilter === "all" || d.specialty === specialtyFilter;

      return matchesSearch && matchesStatus && matchesSpecialty;
    });
  }, [doctors, search, statusFilter, specialtyFilter]);

  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
  const currentDoctors = filteredDoctors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const copyToClipboard = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success("Doctor ID copied");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    try {
      await createDoctorMutation.mutateAsync({
        ...formData,
        fee: Number(formData.fee) || 0,
        experience_years: Number(formData.experience_years) || 0,
        hospital_id: formData.hospital_id || null,
        photo_url: formData.photo_url || null,
      });
      toast.success("Doctor added successfully!");
      setShowAddModal(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        specialty: "",
        experience_years: "",
        fee: "",
        hospital_id: "",
        photo_url: "",
      });
    } catch (err) {
      toast.error(err.message || "Failed to add doctor");
    }
  };

  const openEditDoctor = (doctor) => {
    setEditingDoctor(doctor);
    const matchedHospital = hospitals.find(
      (h) =>
        h.id === doctor.hospital_id ||
        (h.name && doctor.hospital && h.name.trim().toLowerCase() === doctor.hospital.trim().toLowerCase())
    );
    setEditFormData({
      name: doctor.name || "",
      specialty: doctor.specialty || "",
      experience_years: doctor.experience_years ?? "",
      fee: doctor.fee ?? "",
      hospital_id: doctor.hospital_id || matchedHospital?.id || "",
      photo_url: doctor.photo_url || "",
    });
  };

  const handleUpdateDoctor = async (e) => {
    e.preventDefault();
    if (!editingDoctor) return;
    try {
      const selectedHospitalObj = hospitals.find((h) => h.id === editFormData.hospital_id);
      const hospitalName = selectedHospitalObj
        ? selectedHospitalObj.name
        : (editFormData.hospital_id ? editFormData.hospital_id : "Independent Practice");

      await updateDoctorMutation.mutateAsync({
        id: editingDoctor.id,
        name: editFormData.name.trim(),
        specialty: editFormData.specialty.trim(),
        fee: Number(editFormData.fee) || 0,
        experience_years: Number(editFormData.experience_years) || 0,
        hospital_id: editFormData.hospital_id || null,
        hospital: hospitalName,
        photo_url: editFormData.photo_url || null,
      });
      toast.success("Doctor profile updated successfully!");
      if (viewDoctor && viewDoctor.id === editingDoctor.id) {
        setViewDoctor((prev) => ({
          ...prev,
          ...editFormData,
          hospital: hospitalName,
        }));
      }
      setEditingDoctor(null);
    } catch (err) {
      toast.error(err.message || "Failed to update doctor");
    }
  };

  const handleUpdateStatus = async (id, is_active) => {
    try {
      await updateStatusMutation.mutateAsync({ id, is_active, note: "Updated by Admin" });
      toast.success(`Doctor marked as ${is_active ? "Active" : "Inactive"}`);
      if (viewDoctor && viewDoctor.id === id) {
        setViewDoctor((prev) => ({ ...prev, is_active }));
      }
    } catch (e) {
      toast.error(e.message || "Failed to update status");
    }
  };

  const confirmDeleteDoctor = async () => {
    if (!deleteTarget) return;
    try {
      await deleteDoctorMutation.mutateAsync(deleteTarget.id);
      toast.success(`Dr. ${deleteTarget.name} has been removed.`);
      if (viewDoctor && viewDoctor.id === deleteTarget.id) setViewDoctor(null);
      setDeleteTarget(null);
    } catch (e) {
      toast.error(e.message || "Failed to delete doctor");
    }
  };

  const confirmDeleteLocation = async () => {
    if (!viewDoctor || !deleteLocationTarget) return;
    try {
      await deleteLocationMutation.mutateAsync({
        doctorId: viewDoctor.id,
        locationId: deleteLocationTarget,
      });
      if (editingLocationId === deleteLocationTarget) resetLocationForm();
      toast.success("Hospital location removed");
      setDeleteLocationTarget(null);
    } catch (err) {
      toast.error(err.message || "Failed to remove location");
    }
  };

  const toggleDay = (day) => {

    setLocationForm((prev) => ({
      ...prev,
      days: prev.days.includes(day) ? prev.days.filter((d) => d !== day) : [...prev.days, day],
    }));
  };

  const startEditLocation = (loc) => {
    setEditingLocationId(loc.id);
    setLocationForm({
      hospital_id: loc.hospital_id || "",
      fee: loc.fee !== undefined ? String(loc.fee) : "",
      days: Array.isArray(loc.days) ? loc.days : [],
      slots: loc.slots || DEFAULT_SLOT,
    });
  };

  const resetLocationForm = () => {
    setEditingLocationId(null);
    setLocationForm({
      ...emptyLocationForm,
      fee: viewDoctor?.fee ? String(viewDoctor.fee) : "",
    });
  };

  const handleSaveLocation = async (e) => {
    e.preventDefault();
    if (!viewDoctor) return;

    if (!editingLocationId && !locationForm.hospital_id) {
      toast.error("Please select a hospital");
      return;
    }
    if (!locationForm.days.length) {
      toast.error("Select at least one day for this location");
      return;
    }

    const slotInput = locationForm.slots || DEFAULT_SLOT;
    const formattedSlot = validateAndFormatTimeSlot(slotInput);
    if (!formattedSlot) {
      toast.error("Invalid consultation hours format. Please use a valid format (e.g., 09:00 AM - 01:00 PM)");
      return;
    }

    try {
      if (editingLocationId) {
        await updateLocationMutation.mutateAsync({
          doctorId: viewDoctor.id,
          locationId: editingLocationId,
          data: {
            days: locationForm.days,
            slots: [formattedSlot],
            fee: locationForm.fee ? Number(locationForm.fee) : undefined,
          },
        });
        toast.success("Schedule updated");
        resetLocationForm();
      } else {
        await createLocationMutation.mutateAsync({
          doctorId: viewDoctor.id,
          data: {
            hospital_id: locationForm.hospital_id,
            days: locationForm.days,
            slots: [formattedSlot],
            fee: locationForm.fee ? Number(locationForm.fee) : undefined,
          },
        });
        toast.success("Hospital schedule added");
        resetLocationForm();
      }
    } catch (err) {
      toast.error(err.message || "Failed to save schedule");
    }
  };

  const handleOpenDetails = (doctor) => {
    setViewDoctor(doctor);
    setActiveDetailTab("overview");
    setLocationForm({
      ...emptyLocationForm,
      fee: doctor.fee ? String(doctor.fee) : "",
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full font-[var(--font-plus-jakarta-sans)] animate-in fade-in zoom-in-95 duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-[var(--font-dm-serif-display)] text-3xl md:text-4xl text-[#082B3F] tracking-tight">
            Doctor Management
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
            Approve, schedule, monitor, and manage practitioners.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#082B3F] hover:bg-[#0FA7E3] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Plus size={16} weight="bold" />
            <span>Onboard Doctor</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#082B3F] flex items-center justify-center shrink-0">
            <Stethoscope size={20} weight="bold" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Doctors</p>
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
            <Buildings size={20} weight="bold" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Hospital Linked</p>
            <p className="text-xl font-extrabold text-[#082B3F]">{kpis.withHospital}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <CurrencyDollar size={20} weight="bold" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Avg Consultation</p>
            <p className="text-xl font-extrabold text-[#082B3F]">PKR {kpis.avgFee.toLocaleString()}</p>
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
                placeholder="Search by doctor, specialty, hospital..."
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

            {/* Specialty Dropdown */}
            {specialties.length > 0 && (
              <select
                value={specialtyFilter}
                onChange={(e) => { setSpecialtyFilter(e.target.value); setCurrentPage(1); }}
                className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 outline-none focus:border-[#082B3F]"
              >
                <option value="all">All Specialties</option>
                {specialties.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="text-xs font-semibold text-slate-400 self-center">
            Showing <span className="font-bold text-[#082B3F]">{filteredDoctors.length}</span> doctors
          </div>
        </div>

        {/* Clean, Basic Doctors Table */}
        <div className="overflow-x-auto min-h-[380px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-5">Doctor Details</th>
                <th className="py-3.5 px-4">Specialty</th>
                <th className="py-3.5 px-4">Hospital / Practice</th>
                <th className="py-3.5 px-4">Fee</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="py-16 text-center text-slate-400 font-medium">
                    Loading doctors directory...
                  </td>
                </tr>
              ) : currentDoctors.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-16 text-center text-slate-400 font-medium">
                    No doctors found matching the search criteria.
                  </td>
                </tr>
              ) : (
                currentDoctors.map((doctor) => {
                  const feePkr = Number(doctor.fee) || 0;

                  return (
                    <tr
                      key={doctor.id}
                      className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                      onClick={() => handleOpenDetails(doctor)}
                    >
                      {/* Doctor Details with Photo Avatar */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <DoctorAvatar doctor={doctor} size="md" />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-bold text-[#082B3F] truncate group-hover:text-[#0FA7E3] transition-colors">
                                {doctor.name.startsWith("Dr.") ? doctor.name : `Dr. ${doctor.name}`}
                              </span>
                              <CheckCircle size={14} weight="fill" className="text-emerald-500 shrink-0" />
                            </div>
                            <span className="text-[11px] text-slate-400 truncate block font-mono">
                              {doctor.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Specialty */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-[#082B3F] text-xs font-bold border border-blue-100">
                          <Stethoscope size={13} weight="bold" />
                          {doctor.specialty || "General Physician"}
                        </span>
                      </td>

                      {/* Hospital Location */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <Buildings size={15} className="text-slate-400 shrink-0" />
                          <span className="text-xs font-medium text-slate-700 max-w-[220px] truncate">
                            {doctor.hospital || "Independent Practice"}
                          </span>
                        </div>
                      </td>

                      {/* Consultation Fee */}
                      <td className="py-3.5 px-4">
                        <span className="text-xs font-extrabold text-[#082B3F]">
                          PKR {feePkr.toLocaleString()}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {doctor.is_active ? (
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

                      {/* Clean Actions: Eye View (Icon only), Edit (Icon only), Delete (Icon only) */}
                      <td className="py-3.5 px-5 text-right">
                        <div
                          className="flex items-center justify-end gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Eye View Detail Button (Icon Only) */}
                          <button
                            onClick={() => handleOpenDetails(doctor)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-[#082B3F] text-[#082B3F] hover:text-white transition-all shadow-sm border border-slate-200"
                            title="View Complete Details"
                          >
                            <Eye size={16} weight="bold" />
                          </button>

                          {/* Edit Button (Icon Only) */}
                          <button
                            onClick={() => openEditDoctor(doctor)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-[#082B3F] text-[#082B3F] hover:text-white transition-all shadow-sm border border-slate-200"
                            title="Edit Doctor Profile"
                          >
                            <PencilSimple size={16} weight="bold" />
                          </button>

                          {/* Delete Button (Triggers Custom Modal) */}
                          <button
                            onClick={() => setDeleteTarget(doctor)}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all"
                            title="Delete Doctor"
                          >
                            <Trash size={16} weight="bold" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
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

      {/* Complete Doctor Detail Modal (Triggered by Eye Icon) */}
      {viewDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#082B3F]/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-slate-200 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/40 shrink-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <DoctorAvatar doctor={viewDoctor} size="lg" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-[#082B3F] truncate">
                        {viewDoctor.name.startsWith("Dr.") ? viewDoctor.name : `Dr. ${viewDoctor.name}`}
                      </h2>
                      <ShieldCheck size={18} weight="fill" className="text-emerald-500 shrink-0" />
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2 font-mono">
                      <span>{viewDoctor.email}</span>
                      <span>·</span>
                      <span className="text-slate-400">ID: {viewDoctor.id}</span>
                      <button
                        onClick={() => copyToClipboard(viewDoctor.id)}
                        className="text-slate-400 hover:text-slate-700"
                        title="Copy ID"
                      >
                        {copiedId === viewDoctor.id ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                      </button>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setViewDoctor(null)}
                    className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-200/50 transition-colors"
                  >
                    <X size={20} weight="bold" />
                  </button>
                </div>

              </div>

              {/* Navigation Tabs inside Detail Modal */}
              <div className="flex items-center gap-2 mt-6 border-b border-slate-200/80 -mb-6 pb-0">
                <button
                  onClick={() => setActiveDetailTab("overview")}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
                    activeDetailTab === "overview"
                      ? "border-[#082B3F] text-[#082B3F]"
                      : "border-transparent text-slate-400 hover:text-slate-700"
                  }`}
                >
                  <Stethoscope size={15} weight="bold" />
                  <span>Overview & Details</span>
                </button>

                <button
                  onClick={() => setActiveDetailTab("schedule")}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
                    activeDetailTab === "schedule"
                      ? "border-[#082B3F] text-[#082B3F]"
                      : "border-transparent text-slate-400 hover:text-slate-700"
                  }`}
                >
                  <CalendarBlank size={15} weight="bold" />
                  <span>Hospital Schedule ({practiceLocations.length})</span>
                </button>

                <button
                  onClick={() => setActiveDetailTab("appointments")}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
                    activeDetailTab === "appointments"
                      ? "border-[#082B3F] text-[#082B3F]"
                      : "border-transparent text-slate-400 hover:text-slate-700"
                  }`}
                >
                  <CalendarCheck size={15} weight="bold" />
                  <span>Appointments History</span>
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
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Specialty</p>
                      <p className="text-sm font-extrabold text-[#082B3F] mt-1">{viewDoctor.specialty || "General"}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Experience</p>
                      <p className="text-sm font-extrabold text-[#082B3F] mt-1">
                        {viewDoctor.experience_years ? `${viewDoctor.experience_years} Years` : "N/A"}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Consultation Fee</p>
                      <p className="text-sm font-extrabold text-[#082B3F] mt-1">
                        PKR {Number(viewDoctor.fee || 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Account Status</p>
                      <div className="mt-1">
                        {viewDoctor.is_active ? (
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

                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-4">
                    <h3 className="text-xs font-bold text-[#082B3F] uppercase tracking-wider">Hospital Affiliation</h3>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#082B3F] flex items-center justify-center shrink-0 font-bold">
                        <Buildings size={20} weight="bold" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#082B3F]">{viewDoctor.hospital || "Independent Practice"}</p>
                        <p className="text-xs text-slate-400">Main practicing medical center</p>
                      </div>
                    </div>
                  </div>

                  {/* Status Toggle Action */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div>
                      <p className="text-xs font-bold text-[#082B3F]">Practitioner Visibility</p>
                      <p className="text-[11px] text-slate-500">
                        {viewDoctor.is_active
                          ? "This doctor is currently visible to patients and accepting bookings."
                          : "This doctor is hidden and cannot accept new patient consultations."}
                      </p>
                    </div>
                    <button
                      onClick={() => handleUpdateStatus(viewDoctor.id, !viewDoctor.is_active)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                        viewDoctor.is_active
                          ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                          : "bg-emerald-600 text-white hover:bg-emerald-700"
                      }`}
                    >
                      {viewDoctor.is_active ? "Deactivate Doctor" : "Activate Doctor"}
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 2: Hospital Schedule */}
              {activeDetailTab === "schedule" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div>
                    <h3 className="text-xs font-bold text-[#082B3F] uppercase tracking-wider mb-3">
                      Active Practice Locations ({practiceLocations.length})
                    </h3>

                    {locationsLoading ? (
                      <p className="text-xs text-slate-400">Loading locations...</p>
                    ) : practiceLocations.length === 0 ? (
                      <div className="p-5 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                        No hospital schedule configured yet. Add practice days below.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {practiceLocations.map((location) => (
                          <div
                            key={location.id}
                            className={`flex items-start justify-between gap-3 p-4 rounded-xl border transition-all ${
                              editingLocationId === location.id
                                ? "border-[#0FA7E3] bg-blue-50/30"
                                : "border-slate-200 bg-white"
                            }`}
                          >
                            <div className="min-w-0">
                              <p className="font-bold text-sm text-[#082B3F]">{location.title}</p>
                              {location.address && (
                                <p className="text-xs text-slate-400 mt-0.5">{location.address}</p>
                              )}
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {(location.days || []).map((d) => (
                                  <span
                                    key={d}
                                    className="px-2 py-0.5 rounded-md bg-blue-50 text-[#082B3F] font-bold text-[10px] border border-blue-100"
                                  >
                                    {d.slice(0, 3)}
                                  </span>
                                ))}
                              </div>
                              <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1 font-medium">
                                <Clock size={13} /> {location.availability || location.slots || DEFAULT_SLOT}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-sm font-extrabold text-[#082B3F]">
                                PKR {(location.fee || viewDoctor.fee || 0).toLocaleString()}
                              </p>
                              <div className="flex items-center justify-end gap-2 mt-3">
                                <button
                                  type="button"
                                  onClick={() => startEditLocation(location)}
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-[#082B3F] hover:bg-slate-100 transition-colors"
                                  title="Edit Schedule"
                                >
                                  <PencilSimple size={15} weight="bold" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteLocationTarget(location.id)}
                                  className="text-xs font-bold text-rose-500 hover:text-rose-700 transition-colors"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add / Edit Form */}
                  <form
                    onSubmit={handleSaveLocation}
                    className="p-5 rounded-2xl border border-blue-200/80 bg-blue-50/40 space-y-4"
                  >
                    <h3 className="text-xs font-bold text-[#082B3F] uppercase tracking-wider">
                      {editingLocationId ? "Edit Hospital Schedule" : "Add Practice Hospital"}
                    </h3>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#082B3F] mb-1.5">
                          Select Hospital *
                        </label>
                        <select
                          required
                          value={locationForm.hospital_id}
                          onChange={(e) => setLocationForm({ ...locationForm, hospital_id: e.target.value })}
                          disabled={Boolean(editingLocationId)}
                          className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium bg-white outline-none focus:border-[#082B3F] disabled:bg-slate-100"
                        >
                          <option value="">Choose hospital</option>
                          {hospitals
                            .filter((h) => h.is_active)
                            .map((hospital) => (
                              <option key={hospital.id} value={hospital.id}>
                                {hospital.name}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#082B3F] mb-1.5">
                          Consultation Fee (PKR)
                        </label>
                        <input
                          type="number"
                          value={locationForm.fee}
                          onChange={(e) => setLocationForm({ ...locationForm, fee: e.target.value })}
                          className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-[#082B3F] bg-white"
                          placeholder={viewDoctor.fee ? String(viewDoctor.fee) : "2500"}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#082B3F] mb-2">
                        Active Days at this Hospital *
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {WEEKDAYS.map((day) => (
                          <button
                            key={day}
                            type="button"
                            onClick={() => toggleDay(day)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              locationForm.days.includes(day)
                                ? "bg-[#082B3F] text-white shadow-sm"
                                : "bg-white text-slate-600 border border-slate-200 hover:border-slate-400"
                            }`}
                          >
                            {day.slice(0, 3)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#082B3F] mb-1.5">
                        Daily Time Slot
                      </label>
                      <input
                        type="text"
                        value={locationForm.slots}
                        onChange={(e) => setLocationForm({ ...locationForm, slots: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-[#082B3F] bg-white"
                        placeholder="09:00 AM - 01:00 PM"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="submit"
                        disabled={createLocationMutation.isPending || updateLocationMutation.isPending}
                        className="flex-1 h-10 rounded-xl bg-[#082B3F] text-white text-xs font-bold hover:bg-[#0FA7E3] disabled:opacity-50 transition-all shadow-sm"
                      >
                        {createLocationMutation.isPending || updateLocationMutation.isPending
                          ? "Saving..."
                          : editingLocationId
                            ? "Save Schedule Changes"
                            : "Add Location to Doctor"}
                      </button>
                      {editingLocationId && (
                        <button
                          type="button"
                          onClick={resetLocationForm}
                          className="h-10 px-4 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:bg-white transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              )}

              {/* Tab 3: Appointments */}
              {activeDetailTab === "appointments" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Total Revenue</p>
                      <p className="text-base font-extrabold text-[#082B3F] mt-1">
                        PKR {(doctorAppointmentsData?.summary?.revenue || 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Completed</p>
                      <p className="text-base font-extrabold text-emerald-600 mt-1">
                        {doctorAppointmentsData?.summary?.completed || 0}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Pending</p>
                      <p className="text-base font-extrabold text-amber-600 mt-1">
                        {doctorAppointmentsData?.summary?.pending || 0}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {(doctorAppointmentsData?.appointments || []).length === 0 ? (
                      <div className="p-8 text-center text-xs text-slate-400 font-medium">
                        No appointments found for this doctor.
                      </div>
                    ) : (
                      doctorAppointmentsData.appointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 flex items-center justify-between gap-3"
                        >
                          <div>
                            <p className="font-bold text-xs text-[#082B3F]">
                              {appointment.customer?.name || "Patient"}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {new Date(appointment.appointment_date).toLocaleDateString()} · {appointment.slot}
                            </p>
                          </div>
                          <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-lg bg-white border border-slate-200 text-[#082B3F]">
                            {appointment.status}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 px-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => setDeleteTarget(viewDoctor)}
                className="text-xs font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-rose-50 transition-colors"
              >
                <Trash size={15} weight="bold" />
                <span>Delete Doctor</span>
              </button>

              <button
                type="button"
                onClick={() => setViewDoctor(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#082B3F] text-white hover:bg-[#0FA7E3] transition-all shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Doctor Modal */}
      {editingDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#082B3F]/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#082B3F] text-white flex items-center justify-center">
                  <PencilSimple size={18} weight="bold" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#082B3F]">Edit Doctor Profile</h2>
                  <p className="text-xs text-slate-400 font-medium">Update practitioner details and affiliations</p>
                </div>
              </div>
              <button
                onClick={() => setEditingDoctor(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/50 transition-colors"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            <form onSubmit={handleUpdateDoctor} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-[#082B3F] mb-1.5 uppercase tracking-wider">
                  Doctor Full Name *
                </label>
                <input
                  required
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 outline-none focus:border-[#082B3F] text-xs font-medium text-[#082B3F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#082B3F] mb-1.5 uppercase tracking-wider">
                    Specialty *
                  </label>
                  <input
                    required
                    type="text"
                    value={editFormData.specialty}
                    onChange={(e) => setEditFormData({ ...editFormData, specialty: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 outline-none focus:border-[#082B3F] text-xs font-medium text-[#082B3F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#082B3F] mb-1.5 uppercase tracking-wider">
                    Photo URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={editFormData.photo_url}
                    onChange={(e) => setEditFormData({ ...editFormData, photo_url: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 outline-none focus:border-[#082B3F] text-xs font-medium text-[#082B3F]"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#082B3F] mb-1.5 uppercase tracking-wider">
                    Experience (Years)
                  </label>
                  <input
                    required
                    type="number"
                    value={editFormData.experience_years}
                    onChange={(e) => setEditFormData({ ...editFormData, experience_years: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 outline-none focus:border-[#082B3F] text-xs font-medium text-[#082B3F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#082B3F] mb-1.5 uppercase tracking-wider">
                    Consultation Fee (PKR)
                  </label>
                  <input
                    required
                    type="number"
                    value={editFormData.fee}
                    onChange={(e) => setEditFormData({ ...editFormData, fee: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 outline-none focus:border-[#082B3F] text-xs font-medium text-[#082B3F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#082B3F] mb-1.5 uppercase tracking-wider">
                  Primary Hospital Affiliation
                </label>
                <select
                  value={editFormData.hospital_id}
                  onChange={(e) => setEditFormData({ ...editFormData, hospital_id: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 outline-none focus:border-[#082B3F] text-xs font-medium text-[#082B3F] bg-white"
                >
                  <option value="">Independent Practice (no hospital)</option>
                  {hospitals
                    .filter((h) => h.is_active)
                    .map((hospital) => (
                      <option key={hospital.id} value={hospital.id}>
                        {hospital.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingDoctor(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateDoctorMutation.isPending}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#082B3F] text-white hover:bg-[#0FA7E3] disabled:opacity-50 transition-all shadow-sm"
                >
                  {updateDoctorMutation.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modern Delete Doctor Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#082B3F]/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-6 border border-slate-200 animate-in zoom-in-95 duration-200 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 border border-rose-100 shadow-sm">
              <Trash size={28} weight="bold" />
            </div>

            <h3 className="text-lg font-bold text-[#082B3F]">
              Delete Doctor Profile?
            </h3>

            <p className="text-xs text-slate-500 mt-2 max-w-sm leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="text-[#082B3F]">
                {deleteTarget.name.startsWith("Dr.") ? deleteTarget.name : `Dr. ${deleteTarget.name}`}
              </strong>
              ? This action cannot be undone and will remove all their consultation schedules and credentials.
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
                onClick={confirmDeleteDoctor}
                disabled={deleteDoctorMutation.isPending}
                className="flex-1 h-11 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50 transition-all shadow-sm"
              >
                {deleteDoctorMutation.isPending ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Location Confirmation Modal */}
      {deleteLocationTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#082B3F]/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden p-6 border border-slate-200 animate-in zoom-in-95 duration-200 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3 border border-rose-100">
              <WarningCircle size={24} weight="bold" />
            </div>

            <h3 className="text-base font-bold text-[#082B3F]">
              Remove Hospital Location?
            </h3>

            <p className="text-xs text-slate-500 mt-2">
              Remove this hospital from the doctor's weekly practice schedule?
            </p>

            <div className="flex items-center gap-2.5 w-full mt-5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteLocationTarget(null)}
                className="flex-1 h-10 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteLocation}
                disabled={deleteLocationMutation.isPending}
                className="flex-1 h-10 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {deleteLocationMutation.isPending ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Doctor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#082B3F]/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#082B3F] text-white flex items-center justify-center">
                  <Stethoscope size={18} weight="bold" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#082B3F]">Onboard New Doctor</h2>
                  <p className="text-xs text-slate-400 font-medium">Create a new telehealth provider profile</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/50 transition-colors"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            <form onSubmit={handleAddDoctor} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-[#082B3F] mb-1.5 uppercase tracking-wider">
                  Doctor Full Name *
                </label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 outline-none focus:border-[#082B3F] text-xs font-medium text-[#082B3F]"
                  placeholder="e.g. Dr. Ayesha Khan"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#082B3F] mb-1.5 uppercase tracking-wider">
                    Email Address *
                  </label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 outline-none focus:border-[#082B3F] text-xs font-medium text-[#082B3F]"
                    placeholder="doctor@medzoos.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#082B3F] mb-1.5 uppercase tracking-wider">
                    Password *
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
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#082B3F] mb-1.5 uppercase tracking-wider">
                    Specialty *
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 outline-none focus:border-[#082B3F] text-xs font-medium text-[#082B3F]"
                    placeholder="e.g. Cardiologist"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#082B3F] mb-1.5 uppercase tracking-wider">
                    Photo URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.photo_url}
                    onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 outline-none focus:border-[#082B3F] text-xs font-medium text-[#082B3F]"
                    placeholder="https://images.unsplash..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#082B3F] mb-1.5 uppercase tracking-wider">
                    Experience (Years)
                  </label>
                  <input
                    required
                    type="number"
                    value={formData.experience_years}
                    onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 outline-none focus:border-[#082B3F] text-xs font-medium text-[#082B3F]"
                    placeholder="10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#082B3F] mb-1.5 uppercase tracking-wider">
                    Consultation Fee (PKR)
                  </label>
                  <input
                    required
                    type="number"
                    value={formData.fee}
                    onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 outline-none focus:border-[#082B3F] text-xs font-medium text-[#082B3F]"
                    placeholder="2500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#082B3F] mb-1.5 uppercase tracking-wider">
                  Primary Hospital Affiliation
                </label>
                <select
                  value={formData.hospital_id}
                  onChange={(e) => setFormData({ ...formData, hospital_id: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 outline-none focus:border-[#082B3F] text-xs font-medium text-[#082B3F] bg-white"
                >
                  <option value="">Independent Practice (no hospital)</option>
                  {hospitals
                    .filter((h) => h.is_active)
                    .map((hospital) => (
                      <option key={hospital.id} value={hospital.id}>
                        {hospital.name}
                      </option>
                    ))}
                </select>
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
                  disabled={createDoctorMutation.isPending}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#082B3F] text-white hover:bg-[#0FA7E3] disabled:opacity-50 transition-all shadow-sm"
                >
                  {createDoctorMutation.isPending ? "Creating..." : "Add Doctor Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
