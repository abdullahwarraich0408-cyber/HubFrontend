"use client";

import { use } from "react";
import { useSelector } from "react-redux";
import { AppointmentChatPage } from "@/features/telehealth/pages/AppointmentChatPage";

export default function PatientAppointmentChatRoute({ params }) {
  const { id: appointmentId } = use(params);
  const { user } = useSelector((state) => state.auth);

  return (
    <AppointmentChatPage
      appointmentId={appointmentId}
      backHref="/account/appointments"
      currentUserId={user?.id}
      authMode="customer"
    />
  );
}
