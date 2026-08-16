import { Suspense } from "react";
import { HospitalDetailPage } from "@/features/hospitals/pages/HospitalDetailPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HospitalDetailPage />
    </Suspense>
  );
}
