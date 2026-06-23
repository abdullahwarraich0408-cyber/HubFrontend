import { Suspense } from "react";
import { CheckoutPage } from "@/features/checkout/pages/CheckoutPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center">Loading checkout...</div>}>
      <CheckoutPage />
    </Suspense>
  );
}
