"use client";

import { use } from "react";
import { ConsultationPage } from "@/features/doctors/pages/ConsultationPage";

export default function Page({ params }) {
  const { meetingId } = use(params);
  return <ConsultationPage meetingId={meetingId} />;
}
