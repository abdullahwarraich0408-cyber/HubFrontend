"use client";

import { useDoctorPortalProfile } from "@/lib/hooks/usePartnerPortal";
import { DEFAULT_DOCTOR_PROFILE } from "../data/doctorData";

export function useDoctorProfile() {
  const { data: profile, isLoading, isError } = useDoctorPortalProfile();

  const resolved = { ...DEFAULT_DOCTOR_PROFILE, ...(profile || {}) };
  const displayName = resolved.name?.trim() || "Doctor";

  const initials = displayName
    .replace(/^Dr\.\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "DR";

  return {
    profile: { ...resolved, name: displayName },
    isLoaded: !isLoading,
    isError,
    initials,
    updateProfile: () => {},
  };
}

export function exportAppointmentsCsv(appointments, filename = "doctor-appointments.csv") {
  const headers = ["ID", "Patient", "Type", "Date", "Time", "Status", "Reason"];
  const rows = appointments.map((apt) =>
    [apt.id, apt.patient, apt.type, apt.date || "Today", apt.time, apt.status, apt.reason || ""]
      .map((val) => `"${String(val).replace(/"/g, '""')}"`)
      .join(",")
  );
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
