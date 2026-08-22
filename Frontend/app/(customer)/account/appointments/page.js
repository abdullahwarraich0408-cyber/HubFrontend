import { Suspense } from "react";
import { AppointmentsPage } from "@/features/account/pages/AppointmentsPage";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-[14px] text-neutral-500">
          Loading appointments…
        </div>
      }
    >
      <AppointmentsPage />
    </Suspense>
  );
}
