"use client";

import { use } from "react";
import { AppointmentChatPage } from "@/features/telehealth/pages/AppointmentChatPage";
import { getPartnerData } from "@/lib/partnerAuth";
import { partnerRoutes } from "@/lib/constants/partnerRoutes";

export default function DoctorAppointmentChatRoute({ params }) {
  const { id: appointmentId } = use(params);
  const partner = typeof window !== "undefined" ? getPartnerData() : null;

  return (
    <AppointmentChatPage
      appointmentId={appointmentId}
      backHref={partnerRoutes.doctor.appointments}
      currentUserId={partner?.id}
      authMode="partner"
    />
  );
}
