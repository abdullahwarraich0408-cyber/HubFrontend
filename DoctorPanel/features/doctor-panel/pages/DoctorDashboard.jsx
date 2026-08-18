"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  Video,
  Clock,
  Download,
  Search,
  MoreVertical,
  Stethoscope,
  ChevronRight,
  Eye,
  CheckCircle2,
  XCircle,
  Play,
  MapPin,
  PlusCircle,
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Badge } from "@/shared/components/Badge";
import Link from "next/link";
import { partnerRoutes } from "@/lib/constants/partnerRoutes";
import { useDoctorProfile, exportAppointmentsCsv } from "@/features/doctor-panel/hooks/useDoctorProfile";
import {
  useDoctorPortalAppointments,
  useDoctorPortalStats,
  useUpdateDoctorAppointmentStatus,
} from "@/lib/hooks/usePartnerPortal";
import { DoctorNotifications } from "@/features/doctor-panel/components/DoctorNotifications";
import { AppointmentDetailModal } from "@/features/doctor-panel/components/AppointmentDetailModal";

const appointmentData = [
  { name: "Mon", appointments: 12, completed: 10 },
  { name: "Tue", appointments: 15, completed: 14 },
  { name: "Wed", appointments: 18, completed: 16 },
  { name: "Thu", appointments: 14, completed: 13 },
  { name: "Fri", appointments: 20, completed: 18 },
  { name: "Sat", appointments: 8, completed: 7 },
  { name: "Sun", appointments: 5, completed: 5 },
];

export function DoctorDashboard() {
  const { profile } = useDoctorProfile();
  const { data: appointments = [], isLoading } = useDoctorPortalAppointments();
  const { data: stats } = useDoctorPortalStats();
  const updateStatus = useUpdateDoctorAppointmentStatus();
  const [search, setSearch] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    if (openMenuId) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [openMenuId]);

  const todayFormatted = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const todayAppointments = useMemo(
    () => appointments.filter((a) => a.date === todayFormatted),
    [appointments, todayFormatted]
  );

  const activeTodayAppointments = useMemo(
    () => todayAppointments.filter((a) => a.status !== "cancelled"),
    [todayAppointments]
  );

  const videoCount = activeTodayAppointments.filter((a) => a.isOnline || a.type === "Video Call").length;

  // Next upcoming confirmed/pending appointment
  const nextConsultation = useMemo(() => {
    return (
      appointments.find(
        (a) => ["pending", "confirmed", "in_progress"].includes(a.status) && (a.date === todayFormatted || !a.date)
      ) || appointments.find((a) => ["pending", "confirmed"].includes(a.status))
    );
  }, [appointments, todayFormatted]);

  const filteredTodayAppointments = useMemo(() => {
    if (!search.trim()) return todayAppointments;
    const q = search.toLowerCase();
    return todayAppointments.filter(
      (a) =>
        a.patient.toLowerCase().includes(q) ||
        String(a.id).toLowerCase().includes(q) ||
        (a.reason && a.reason.toLowerCase().includes(q))
    );
  }, [todayAppointments, search]);

  const handleStatusChange = (id, status) => {
    updateStatus.mutate({ id, status });
    setSelectedAppointment((prev) => (prev?.id === id ? { ...prev, status } : prev));
    setOpenMenuId(null);
  };

  const handleExport = () => {
    exportAppointmentsCsv(appointments);
  };

  return (
    <>
      <div className="space-y-6 animate-in fade-in duration-200">
        {/* Physician Command Center Header */}
        <div className="bg-slate-900 rounded-xl p-5 md:p-6 text-white border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">
                Command Center
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Good morning, {profile.name}
            </h1>
            {/* Inline Stats Strip */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-300 pt-1 font-medium">
              <span className="text-teal-400 font-semibold">{stats?.todayAppointments ?? activeTodayAppointments.length} Appointments Today</span>
              <span className="text-slate-700">|</span>
              <span>{stats?.totalPatients ?? 0} Patients</span>
              <span className="text-slate-700">|</span>
              <span>{stats?.videoConsultations ?? videoCount} Video Calls</span>
              <span className="text-slate-700">|</span>
              <span className="text-emerald-400 font-semibold">PKR {Number(stats?.revenue || 0).toLocaleString()}</span>
              {stats?.rating > 0 && (
                <>
                  <span className="text-slate-700">|</span>
                  <span className="text-amber-400 font-semibold">★ {stats.rating}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 pt-2 md:pt-0">
            {/* Search Input */}
            <div className="relative hidden sm:block">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search patient..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-44 lg:w-56 h-9 pl-9 pr-3 text-xs bg-slate-800/90 text-slate-100 placeholder:text-slate-400 rounded-lg border border-slate-700 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
              />
            </div>
            <DoctorNotifications />
          </div>
        </div>

        {/* Compact Quick Actions Toolbar */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 shadow-2xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Link href={partnerRoutes.doctor.schedule}>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100/80 hover:bg-slate-200/80 hover:text-slate-900 transition-colors">
                <PlusCircle size={15} className="text-teal-600" />
                <span>New Availability</span>
              </button>
            </Link>
            <Link href={partnerRoutes.doctor.appointments}>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100/80 hover:bg-slate-200/80 hover:text-slate-900 transition-colors">
                <Calendar size={15} className="text-blue-600" />
                <span>View Appointments</span>
              </button>
            </Link>
            <Link href={partnerRoutes.doctor.patients}>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100/80 hover:bg-slate-200/80 hover:text-slate-900 transition-colors">
                <Users size={15} className="text-violet-600" />
                <span>Patient Records</span>
              </button>
            </Link>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors ml-auto sm:ml-0"
          >
            <Download size={14} className="text-slate-600" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Split Layout: Weekly Analytics & Next Consultation Highlight Strip */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Appointments Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Weekly Appointments Volume</h2>
                <p className="text-xs text-slate-500">Scheduled vs completed consultations</p>
              </div>
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                +14% this week
              </span>
            </div>
            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={appointmentData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAppts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#64748b" }} dy={5} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      color: "#fff",
                      borderRadius: "8px",
                      border: "none",
                      fontSize: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                    }}
                  />
                  <Area type="monotone" dataKey="appointments" stroke="#0d9488" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAppts)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* NEXT CONSULTATION FEATURE STRIP */}
          <div className="bg-slate-900 text-white rounded-xl border border-slate-800 p-5 flex flex-col justify-between relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 p-8 bg-teal-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-teal-400 uppercase tracking-wider bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/20">
                  <Sparkles size={12} />
                  Next Consultation
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {nextConsultation?.time || "Up Next"}
                </span>
              </div>

              {nextConsultation ? (
                <div className="space-y-3 my-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-500/20 text-teal-300 font-bold text-sm flex items-center justify-center border border-teal-500/30">
                      {nextConsultation.patient.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-white leading-tight">
                        {nextConsultation.patient}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-300">
                        {nextConsultation.isOnline || nextConsultation.type === "Video Call" ? (
                          <span className="inline-flex items-center gap-1 text-teal-300 font-medium">
                            <Video size={13} /> Video Consultation
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-300 font-medium">
                            <MapPin size={13} /> In Clinic Visit
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {nextConsultation.reason && (
                    <div className="text-xs text-slate-400 bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/60 line-clamp-2">
                      <span className="text-slate-300 font-semibold">Reason:</span> {nextConsultation.reason}
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-6 text-center text-slate-400 text-xs">
                  No upcoming consultations scheduled right now.
                </div>
              )}
            </div>

            {nextConsultation && (
              <div className="pt-3 border-t border-slate-800 mt-2">
                {nextConsultation.isOnline || nextConsultation.type === "Video Call" ? (
                  <Link
                    href={
                      nextConsultation.meetingId
                        ? `/consultation/${nextConsultation.meetingId}?appointment=${nextConsultation.id}`
                        : `${partnerRoutes.doctor.appointments}`
                    }
                    className="w-full"
                  >
                    <button className="w-full h-10 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs">
                      <Play size={14} className="fill-white" />
                      <span>Start Consultation</span>
                    </button>
                  </Link>
                ) : (
                  <button
                    onClick={() => setSelectedAppointment(nextConsultation)}
                    className="w-full h-10 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 border border-slate-700"
                  >
                    <Eye size={14} />
                    <span>View Patient Details</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* TODAY'S APPOINTMENTS TABLE */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200/80 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Today's appointments</h2>
              <p className="text-xs text-slate-500 mt-0.5">Manage and review your patient schedule for today</p>
            </div>
            <Link
              href={partnerRoutes.doctor.appointments}
              className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-800 transition-colors"
            >
              <span>View all</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            {filteredTodayAppointments.length === 0 ? (
              /* EMPTY STATE */
              <div className="p-12 text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                  <Calendar size={24} />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">Your schedule is clear today</h3>
                <p className="text-xs text-slate-500 max-w-sm mb-4">
                  No appointments are currently scheduled for today. You can adjust your hours anytime.
                </p>
                <Link href={partnerRoutes.doctor.schedule}>
                  <button className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs">
                    Manage Schedule
                  </button>
                </Link>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th scope="col" className="py-3 px-4 pl-6">Time</th>
                    <th scope="col" className="py-3 px-4">Patient</th>
                    <th scope="col" className="py-3 px-4">Consultation</th>
                    <th scope="col" className="py-3 px-4">Reason</th>
                    <th scope="col" className="py-3 px-4">Status</th>
                    <th scope="col" className="py-3 px-4 pr-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredTodayAppointments.map((apt) => {
                    const isNext = nextConsultation?.id === apt.id;
                    return (
                      <tr
                        key={apt.id}
                        className={`transition-colors hover:bg-slate-50/60 ${
                          isNext ? "bg-teal-50/40 border-l-2 border-l-teal-600" : ""
                        }`}
                      >
                        <td className="py-3.5 px-4 pl-6 font-semibold text-slate-900 whitespace-nowrap">
                          {apt.time}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-200">
                              {apt.patient.charAt(0)}
                            </div>
                            <span className="font-semibold text-slate-900">{apt.patient}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {apt.isOnline || apt.type === "Video Call" ? (
                            <span className="inline-flex items-center gap-1.5 text-teal-700 font-medium bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200/60">
                              <Video size={13} /> Video
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-slate-700 font-medium bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                              <MapPin size={13} /> In Clinic
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 max-w-[200px] truncate">
                          {apt.reason || "General Consultation"}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <Badge status={apt.status} />
                        </td>
                        <td className="py-3.5 px-4 pr-6 text-right whitespace-nowrap relative" ref={openMenuId === apt.id ? menuRef : null}>
                          <div className="inline-flex items-center justify-end gap-1.5">
                            {apt.status === "pending" && (
                              <button
                                onClick={() => handleStatusChange(apt.id, "confirmed")}
                                className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-md text-[11px] font-semibold border border-teal-200 transition-colors"
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
                                <button className="px-2.5 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded-md text-[11px] font-semibold transition-colors flex items-center gap-1">
                                  <Play size={11} className="fill-white" /> Start
                                </button>
                              </Link>
                            )}
                            <button
                              onClick={() => setSelectedAppointment(apt)}
                              className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
                              title="View Details"
                            >
                              <Eye size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
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

