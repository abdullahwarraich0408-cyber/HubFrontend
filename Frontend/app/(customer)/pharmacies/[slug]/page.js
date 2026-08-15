import { Suspense } from "react";
import { VendorDetailPage } from "@/features/pharmacies/pages/VendorDetailPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VendorDetailPage />
    </Suspense>
  );
}
