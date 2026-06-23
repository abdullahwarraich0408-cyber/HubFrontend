"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  CalendarCheck,
  Users,
  VideoCamera,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  DownloadSimple,
  MagnifyingGlass,
  DotsThree,
  Stethoscope,
  CalendarBlank,
  Eye,
  Check,
  X,
} from "@phosphor-icons/react";
import {
  Line,
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

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

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

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const todayFormatted = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const todayAppointments = appointments.filter((a) => a.date === todayFormatted && a.status !== "cancelled");
  const videoCount = todayAppointments.filter((a) => a.type === "Video Call").length;
  const pendingCount = appointments.filter((a) => a.status === "pending").length;

  const recentAppointments = useMemo(() => {
    const todayList = appointments.filter((a) => a.date === todayFormatted);
    if (!search.trim()) return todayList.slice(0, 5);
    const q = search.toLowerCase();
    return todayList
      .filter((a) => a.patient.toLowerCase().includes(q) || String(a.id).toLowerCase().includes(q))
      .slice(0, 5);
  }, [appointments, search, todayFormatted]);

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
      <motion.div
        className="flex flex-col gap-6 max-w-[1440px] mx-auto w-full p-4 md:p-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[var(--radius-xl)] border border-[var(--color-neutral-200)] shadow-[var(--shadow-card)]"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full icon-box-light flex items-center justify-center shrink-0">
              <Stethoscope size={24} className="text-[var(--color-brand-primary)]" weight="fill" />
            </div>
            <div>
              <h1 className="font-[var(--font-heading)] text-2xl md:text-3xl font-bold text-[var(--color-ink-headline)] leading-tight">
                Welcome back, {profile.name}
              </h1>
              <p className="text-[var(--color-neutral-500)] text-sm md:text-base">{today}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-[var(--color-neutral-100)] rounded-[var(--radius-md)] border border-[var(--color-neutral-200)]">
              <MagnifyingGlass size={18} className="text-[var(--color-neutral-500)]" />
              <input
                type="text"
                placeholder="Search patients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-[var(--color-neutral-700)] placeholder:text-[var(--color-neutral-500)] w-[160px]"
              />
            </div>
            <DoctorNotifications />
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[var(--color-neutral-200)] text-[var(--color-neutral-700)] text-sm font-semibold rounded-[var(--radius-md)] hover:bg-[var(--color-neutral-100)] transition-colors shadow-sm"
            >
              <DownloadSimple size={18} weight="bold" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <KPICard title="Today's Appointments" value={stats?.todayAppointments ?? todayAppointments.length} trend="+2" positive icon={CalendarCheck} color="var(--color-brand-primary)" />
          <KPICard title="Total Patients" value={stats?.totalPatients ?? 0} trend="+12" positive icon={Users} color="var(--color-status-info)" />
          <KPICard title="Video Consultations" value={stats?.videoConsultations ?? videoCount} trend="+3" positive icon={VideoCamera} color="var(--color-status-success)" />
          <KPICard title="Revenue" value={`PKR ${Number(stats?.revenue || 0).toLocaleString()}`} trend={`${stats?.rating || 0}★`} positive icon={Clock} color="var(--color-status-warning)" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 bg-white rounded-[var(--radius-xl)] border border-[var(--color-neutral-200)] shadow-[var(--shadow-card)] flex flex-col p-6"
          >
            <div className="mb-6">
              <h3 className="font-[var(--font-heading)] text-xl font-bold text-[var(--color-ink-headline)]">
                Weekly Appointments
              </h3>
              <p className="text-[var(--color-neutral-500)] text-sm">Scheduled vs completed this week</p>
            </div>
            <div className="flex-1 min-h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={appointmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAppts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-brand-primary)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="var(--color-brand-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-neutral-200)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-neutral-500)" }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-neutral-500)" }} dx={-10} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid var(--color-neutral-200)", fontSize: "13px" }} />
                  <Area type="monotone" dataKey="appointments" stroke="var(--color-brand-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorAppts)" />
                  <Line type="monotone" dataKey="completed" stroke="var(--color-status-success)" strokeWidth={2} dot={{ r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-[var(--color-brand-light)] to-[var(--color-brand-primary)] rounded-[var(--radius-xl)] p-6 text-[var(--color-brand-dark)]"
          >
            <h3 className="font-[var(--font-heading)] text-lg font-bold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link href={partnerRoutes.doctor.appointments}>
                <button className="flex flex-col items-center gap-2 p-4 bg-white/90 backdrop-blur rounded-[var(--radius-md)] hover:bg-white transition-colors shadow-sm w-full">
                  <CalendarCheck size={24} weight="bold" className="text-[var(--color-brand-primary)]" />
                  <span className="text-sm font-semibold">Appointments</span>
                </button>
              </Link>
              <Link href={partnerRoutes.doctor.schedule}>
                <button className="flex flex-col items-center gap-2 p-4 bg-white/90 backdrop-blur rounded-[var(--radius-md)] hover:bg-white transition-colors shadow-sm w-full">
                  <CalendarBlank size={24} weight="bold" className="text-[var(--color-brand-primary)]" />
                  <span className="text-sm font-semibold">Schedule</span>
                </button>
              </Link>
              <Link href={partnerRoutes.doctor.patients}>
                <button className="flex flex-col items-center gap-2 p-4 bg-white/90 backdrop-blur rounded-[var(--radius-md)] hover:bg-white transition-colors shadow-sm w-full">
                  <Users size={24} weight="bold" className="text-[var(--color-brand-primary)]" />
                  <span className="text-sm font-semibold">Patients</span>
                </button>
              </Link>
              <Link href={partnerRoutes.doctor.settings}>
                <button className="flex flex-col items-center gap-2 p-4 bg-white/90 backdrop-blur rounded-[var(--radius-md)] hover:bg-white transition-colors shadow-sm w-full">
                  <Stethoscope size={24} weight="bold" className="text-[var(--color-brand-primary)]" />
                  <span className="text-sm font-semibold">Profile</span>
                </button>
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-[var(--radius-xl)] shadow-[var(--shadow-card)] border border-[var(--color-neutral-200)] overflow-hidden"
        >
          <div className="p-6 border-b border-[var(--color-neutral-200)] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-[var(--font-heading)] text-xl font-bold text-[var(--color-ink-headline)]">
                Today's Appointments
              </h3>
              <p className="text-[var(--color-neutral-500)] text-sm mt-1">Upcoming patient consultations</p>
            </div>
            <Link href={partnerRoutes.doctor.appointments} className="text-sm font-semibold text-[var(--color-brand-primary)] hover:underline">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--color-surface-subtle)] border-b border-[var(--color-neutral-200)]">
                  <th className="py-4 px-6 text-xs uppercase tracking-wider text-[var(--color-neutral-500)] font-bold">ID</th>
                  <th className="py-4 px-6 text-xs uppercase tracking-wider text-[var(--color-neutral-500)] font-bold">Patient</th>
                  <th className="py-4 px-6 text-xs uppercase tracking-wider text-[var(--color-neutral-500)] font-bold">Type</th>
                  <th className="py-4 px-6 text-xs uppercase tracking-wider text-[var(--color-neutral-500)] font-bold">Time</th>
                  <th className="py-4 px-6 text-xs uppercase tracking-wider text-[var(--color-neutral-500)] font-bold">Status</th>
                  <th className="py-4 px-6 text-xs uppercase tracking-wider text-[var(--color-neutral-500)] font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-neutral-200)]">
                {recentAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-[var(--color-surface-subtle)]/50 transition-colors">
                    <td className="py-4 px-6"><span className="text-sm font-bold text-[var(--color-ink-headline)]">{apt.id}</span></td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--color-brand-light)] text-[var(--color-brand-primary)] flex items-center justify-center font-bold text-xs shrink-0">
                          {apt.patient.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-[var(--color-neutral-700)]">{apt.patient}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-[var(--color-neutral-600)]">{apt.type}</td>
                    <td className="py-4 px-6 text-sm font-medium text-[var(--color-neutral-700)]">{apt.time}</td>
                    <td className="py-4 px-6"><Badge status={apt.status} /></td>
                    <td className="py-4 px-6 text-right relative" ref={openMenuId === apt.id ? menuRef : null}>
                      <button
                        onClick={() => setOpenMenuId(openMenuId === apt.id ? null : apt.id)}
                        className="p-1.5 rounded hover:bg-[var(--color-neutral-100)] transition-colors"
                      >
                        <DotsThree size={18} className="text-[var(--color-neutral-500)]" />
                      </button>
                      {openMenuId === apt.id && (
                        <div className="absolute right-6 top-full mt-1 w-[160px] bg-white border border-neutral-200 rounded-[10px] shadow-lg z-10 py-1 text-left">
                          <ActionMenuItem icon={Eye} label="View Details" onClick={() => { setSelectedAppointment(apt); setOpenMenuId(null); }} />
                          {apt.status === "pending" && (
                            <>
                              <ActionMenuItem icon={Check} label="Confirm" onClick={() => handleStatusChange(apt.id, "confirmed")} />
                              <ActionMenuItem icon={X} label="Cancel" onClick={() => handleStatusChange(apt.id, "cancelled")} />
                            </>
                          )}
                          {apt.status === "confirmed" && (
                            <ActionMenuItem icon={Check} label="Complete" onClick={() => handleStatusChange(apt.id, "completed")} />
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>

      <AppointmentDetailModal
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        onStatusChange={handleStatusChange}
      />
    </>
  );
}

function ActionMenuItem({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
    >
      <Icon size={16} />
      {label}
    </button>
  );
}

function KPICard({ title, value, trend, positive, icon: Icon, color }) {
  return (
    <div className="bg-white p-5 md:p-6 rounded-[var(--radius-xl)] border border-[var(--color-neutral-200)] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all group overflow-hidden relative">
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center" style={{ backgroundColor: `${color}10` }}>
          <Icon size={20} style={{ color }} weight="fill" />
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md ${positive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {positive ? <ArrowUpRight size={12} weight="bold" /> : <ArrowDownRight size={12} weight="bold" />}
          {trend}
        </div>
      </div>
      <div>
        <p className="text-xs md:text-sm text-[var(--color-neutral-500)] font-semibold uppercase tracking-wider mb-1">{title}</p>
        <h4 className="text-2xl md:text-3xl font-[var(--font-heading)] font-bold text-[var(--color-ink-headline)] leading-none">{value}</h4>
      </div>
    </div>
  );
}
