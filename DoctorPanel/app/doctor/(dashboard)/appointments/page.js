"use client";

import { useMemo, useState } from "react";
import { CalendarCheck, VideoCamera, User } from "@phosphor-icons/react";
import { Badge } from "@/shared/components/Badge";
import { AppointmentDetailModal } from "@/features/doctor-panel/components/AppointmentDetailModal";
import {
  useDoctorPortalAppointments,
  useUpdateDoctorAppointmentStatus,
} from "@/lib/hooks/usePartnerPortal";

export default function DoctorAppointmentsPage() {
  const { data: appointments = [], isLoading } = useDoctorPortalAppointments();
  const updateStatus = useUpdateDoctorAppointmentStatus();
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const todayFormatted = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const todayCount = appointments.filter((a) => a.date === todayFormatted && a.status !== "cancelled").length;
  const videoCount = appointments.filter((a) => a.isOnline && a.status !== "cancelled").length;
  const inPersonCount = appointments.filter((a) => a.isInPerson && a.status !== "cancelled").length;

  const sortedAppointments = useMemo(
    () => [...appointments].sort((a, b) => new Date(b.raw?.appointment_date || 0) - new Date(a.raw?.appointment_date || 0)),
    [appointments]
  );

  const handleStatusChange = (id, status) => {
    updateStatus.mutate({ id, status });
    setSelectedAppointment((prev) => (prev?.id === id ? { ...prev, status } : prev));
  };

  if (isLoading) {
    return <div className="text-neutral-500 text-sm">Loading appointments...</div>;
  }

  return (
    <>
      <div className="animate-in fade-in zoom-in-95 duration-500">
        <div className="mb-8">
          <h1 className="text-[28px] font-heading font-extrabold text-ink-headline tracking-tight">Appointments</h1>
          <p className="text-[14px] text-neutral-500 mt-1">Manage and review all patient appointments.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-[16px] border border-neutral-200 shadow-sm">
            <div className="flex items-center gap-3 text-brand-primary mb-2">
              <CalendarCheck size={20} weight="fill" />
              <span className="font-bold text-[13px] uppercase tracking-wider">Today</span>
            </div>
            <div className="text-[32px] font-black text-ink-900">{todayCount}</div>
          </div>
          <div className="bg-white p-5 rounded-[16px] border border-neutral-200 shadow-sm">
            <div className="flex items-center gap-3 text-status-info mb-2">
              <VideoCamera size={20} weight="fill" />
              <span className="font-bold text-[13px] uppercase tracking-wider">Video Calls</span>
            </div>
            <div className="text-[32px] font-black text-ink-900">{videoCount}</div>
          </div>
          <div className="bg-white p-5 rounded-[16px] border border-neutral-200 shadow-sm">
            <div className="flex items-center gap-3 text-status-success mb-2">
              <User size={20} weight="fill" />
              <span className="font-bold text-[13px] uppercase tracking-wider">In-Person</span>
            </div>
            <div className="text-[32px] font-black text-ink-900">{inPersonCount}</div>
          </div>
        </div>

        <div className="bg-white rounded-[16px] border border-neutral-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-[12px] font-bold text-neutral-500 uppercase tracking-wider">
                  <th className="p-4 pl-6">ID</th>
                  <th className="p-4">Patient</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Time</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {sortedAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-neutral-500 text-sm">
                      No appointments yet.
                    </td>
                  </tr>
                ) : (
                  sortedAppointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="p-4 pl-6 text-[14px] font-bold text-ink-900">{String(apt.id).slice(0, 8)}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand-light text-brand-primary flex items-center justify-center font-bold text-xs">
                            {apt.patient.charAt(0)}
                          </div>
                          <span className="text-[14px] font-medium text-neutral-700">{apt.patient}</span>
                        </div>
                      </td>
                      <td className="p-4 text-[13px] text-neutral-600">{apt.type}</td>
                      <td className="p-4 text-[13px] text-neutral-600">{apt.date}</td>
                      <td className="p-4 text-[14px] font-bold text-ink-900">{apt.time}</td>
                      <td className="p-4"><Badge status={apt.status} /></td>
                      <td className="p-4 pr-6 text-right">
                        <button
                          onClick={() => setSelectedAppointment(apt)}
                          className="px-3 py-1.5 text-[12px] font-semibold text-brand-primary border border-brand-primary/30 rounded-md hover:bg-brand-light transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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
