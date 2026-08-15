"use client";
import { Suspense } from "react";

import { use } from "react";
import { ConsultationPage } from "@/features/doctors/pages/ConsultationPage";

export default function Page({ params }) {
  const { meetingId } = use(params);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConsultationPage meetingId={meetingId} />
    </Suspense>
  );
}
