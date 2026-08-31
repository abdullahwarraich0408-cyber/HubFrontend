"use client";

import { useMemo, useState } from "react";
import {
  Calendar,
  Video,
  MapPin,
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  Play,
  UserCheck,
  FileText,
  Clock,
  XCircle,
  Eye
} from "lucide-react";
import { Badge } from "@/shared/components/Badge";
import { AppointmentDetailModal } from "@/features/doctor-panel/components/AppointmentDetailModal";
import {
  useDoctorPortalAppointments,
  useUpdateDoctorAppointmentStatus,
} from "@/lib/hooks/usePartnerPortal";
import Link from "next/link";
import { partnerRoutes } from "@/lib/constants/partnerRoutes";

export default function DoctorAppointmentsPage() {
  const { data: appointments = [], isLoading } = useDoctorPortalAppointments();
  const updateStatus = useUpdateDoctorAppointmentStatus();
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [openMenuId, setOpenMenuId] = useState(null);

  const todayFormatted = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const todayCount = appointments.filter((a) => a.date === todayFormatted && a.status !== "cancelled").length;
  const videoCount = appointments.filter((a) => (a.isOnline || a.type === "Video Call") && a.status !== "cancelled").length;
  const inPersonCount = appointments.filter((a) => (!a.isOnline && a.type !== "Video Call") && a.status !== "cancelled").length;

  const filteredAppointments = useMemo(() => {
    return appointments
      .filter((a) => {
        if (statusFilter !== "all" && a.status !== statusFilter) return false;
        if (typeFilter === "online" && (!a.isOnline && a.type !== "Video Call")) return false;
        if (typeFilter === "in_person" && (a.isOnline || a.type === "Video Call")) return false;
        if (search.trim()) {
          const q = search.toLowerCase().trim();
          const patientName = String(a.patient || a.patient_name || a.customer?.name || "").toLowerCase();
          const id = String(a.id || "").toLowerCase();
          const reason = String(a.reason || "").toLowerCase();
          const phone = String(a.phone || a.customer?.phone || "").toLowerCase();
          const type = String(a.type || "").toLowerCase();
          return (
            patientName.includes(q) ||
            id.includes(q) ||
            reason.includes(q) ||
            phone.includes(q) ||
            type.includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => new Date(b.raw?.appointment_date || 0) - new Date(a.raw?.appointment_date || 0));
  }, [appointments, statusFilter, typeFilter, search]);

  const handleStatusChange = (id, status) => {
    updateStatus.mutate({ id, status });
    setSelectedAppointment((prev) => (prev?.id === id ? { ...prev, status } : prev));
    setOpenMenuId(null);
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setTypeFilter("all");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-slate-500 text-xs font-medium">
        Loading appointment workspace...
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Appointments Workspace</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage and review all patient consultations and schedule states</p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-xl border border-slate-200/80 shadow-2xs text-xs font-medium text-slate-600">
            <div className="flex items-center gap-1.5 px-2 border-r border-slate-200">
              <Calendar size={14} className="text-teal-600" />
              <span>Today: <strong className="text-slate-900 font-bold">{todayCount}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 px-2 border-r border-slate-200">
              <Video size={14} className="text-blue-600" />
              <span>Online: <strong className="text-slate-900 font-bold">{videoCount}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 px-2">
              <MapPin size={14} className="text-emerald-600" />
              <span>In Clinic: <strong className="text-slate-900 font-bold">{inPersonCount}</strong></span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search patient name, ID or reason..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-teal-500 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-teal-500 cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="online">Video Consultation</option>
              <option value="in_person">In Clinic Visit</option>
            </select>

            {(search || statusFilter !== "all" || typeFilter !== "all") && (
              <button
                onClick={clearFilters}
                className="h-9 px-3 text-xs text-rose-600 hover:text-rose-700 font-semibold transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* DESKTOP TABLE VIEW */}
        <div className="hidden md:block bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
          {filteredAppointments.length === 0 ? (
            /* EMPTY STATE */
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                <Filter size={24} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">No appointments found</h3>
              <p className="text-xs text-slate-500 max-w-sm mb-4">
                Try adjusting your search filters or check back later for new patient bookings.
              </p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th scope="col" className="py-3 px-4 pl-6">Time</th>
                    <th scope="col" className="py-3 px-4">Patient</th>
                    <th scope="col" className="py-3 px-4">Visit Reason</th>
                    <th scope="col" className="py-3 px-4">Consultation</th>
                    <th scope="col" className="py-3 px-4">Payment</th>
                    <th scope="col" className="py-3 px-4">Status</th>
                    <th scope="col" className="py-3 px-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredAppointments.map((apt) => (
                    <tr
                      key={apt.id}
                      onClick={() => setSelectedAppointment(apt)}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4 pl-6 font-semibold text-slate-900 whitespace-nowrap">
                        <div>{apt.time}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{apt.date}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-200">
                            {apt.patient.charAt(0)}
                          </div>
                          <span className="font-semibold text-slate-900 group-hover:text-teal-700 transition-colors">
                            {apt.patient}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-[220px] truncate">
                        {apt.reason || "General Medical Checkup"}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {apt.isOnline || apt.type === "Video Call" ? (
                          <span className="inline-flex items-center gap-1.5 text-teal-700 font-medium bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/60">
                            <Video size={12} /> Online
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-slate-700 font-medium bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                            <MapPin size={12} /> In Clinic
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                            apt.paymentStatus === "Paid" || apt.paymentStatus === "paid"
                              ? "text-emerald-700"
                              : "text-amber-700"
                          }`}
                        >
                          {apt.paymentStatus || "Paid"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <Badge status={apt.status} />
                      </td>
                      <td
                        className="py-3.5 px-4 pr-6 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="inline-flex items-center justify-end gap-2">
                          {/* Primary Contextual Actions */}
                          {apt.status === "pending" && (
                            <button
                              onClick={() => handleStatusChange(apt.id, "confirmed")}
                              className="px-3 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded-md text-xs font-semibold transition-colors shadow-2xs"
                            >
                              Confirm
                            </button>
                          )}
                          {apt.status === "confirmed" && (apt.isOnline || apt.type === "Video Call") && (
                            <Link
                              href={
                                apt.meetingId
                                  ? `/consultation/${apt.meetingId}?appointment=${apt.id}`
                                  : partnerRoutes.doctor.appointments
                              }
                            >
                              <button className="px-3 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded-md text-xs font-semibold transition-colors shadow-2xs flex items-center gap-1">
                                <Play size={12} className="fill-white" /> Start
                              </button>
                            </Link>
                          )}
                          {apt.status === "confirmed" && !apt.isOnline && apt.type !== "Video Call" && (
                            <button
                              onClick={() => handleStatusChange(apt.id, "in_progress")}
                              className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold transition-colors shadow-2xs flex items-center gap-1"
                            >
                              <UserCheck size={12} /> Check In
                            </button>
                          )}
                          {apt.status === "completed" && (
                            <button
                              onClick={() => setSelectedAppointment(apt)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-semibold transition-colors flex items-center gap-1"
                            >
                              <FileText size={12} /> View Notes
                            </button>
                          )}

                          {/* Secondary Menu */}
                          <div className="relative">
                            <button
                              onClick={() => setOpenMenuId(openMenuId === apt.id ? null : apt.id)}
                              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors"
                              title="More options"
                            >
                              <MoreVertical size={16} />
                            </button>
                            {openMenuId === apt.id && (
                              <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg border border-slate-200 shadow-lg z-20 py-1 text-left">
                                <button
                                  onClick={() => { setSelectedAppointment(apt); setOpenMenuId(null); }}
                                  className="w-full px-3 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-50 font-medium flex items-center gap-2"
                                >
                                  <Eye size={14} /> View Details
                                </button>
                                {apt.status === "pending" && (
                                  <button
                                    onClick={() => handleStatusChange(apt.id, "cancelled")}
                                    className="w-full px-3 py-1.5 text-left text-xs text-rose-600 hover:bg-rose-50 font-medium flex items-center gap-2"
                                  >
                                    <XCircle size={14} /> Cancel Visit
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* MOBILE STRUCTURED LIST VIEW */}
        <div className="md:hidden space-y-3">
          {filteredAppointments.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
              <p className="text-xs text-slate-500">No appointments found.</p>
              <button
                onClick={clearFilters}
                className="mt-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredAppointments.map((apt) => (
              <div
                key={apt.id}
                onClick={() => setSelectedAppointment(apt)}
                className="bg-white rounded-xl border border-slate-200/80 p-4 space-y-2.5 shadow-2xs active:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500 font-mono">
                    <Clock size={13} />
                    <span>{apt.time}</span>
                    <span>•</span>
                    <span>{apt.date}</span>
                  </div>
                  <Badge status={apt.status} />
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200">
                    {apt.patient.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{apt.patient}</h4>
                    <p className="text-xs text-slate-500 truncate">{apt.reason || "General Checkup"}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-600 font-medium">
                    {apt.isOnline || apt.type === "Video Call" ? "📹 Video Call" : "📍 In Clinic"}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAppointment(apt);
                    }}
                    className="text-xs font-bold text-teal-700 hover:underline"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <AppointmentDetailModal
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        onStatusChange={handleStatusChange}
      />
    </>
  );
}

