import { Suspense } from "react";
import { DoctorProfilePage } from "@/features/doctors/pages/DoctorProfilePage";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--color-surface-subtle)]" />}>
      <DoctorProfilePage />
    </Suspense>
  );
}
