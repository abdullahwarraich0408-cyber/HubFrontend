import { Suspense } from "react";
import { MedicinesPage } from "@/features/medicines/pages/MedicinesPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MedicinesPage />
    </Suspense>
  );
}
