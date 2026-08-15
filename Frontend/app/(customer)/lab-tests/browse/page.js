import { Suspense } from "react";
import { LabTestsPage } from "@/features/lab-tests/pages/LabTestsPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LabTestsPage />
    </Suspense>
  );
}
