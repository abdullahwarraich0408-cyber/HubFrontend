import { Suspense } from "react";
import { DoctorsPage } from "@/features/doctors/pages/DoctorsPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-neutral-500">Loading doctors...</div>}>
      <DoctorsPage />
    </Suspense>
  );
}
