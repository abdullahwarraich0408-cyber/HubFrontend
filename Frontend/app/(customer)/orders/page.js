import { Suspense } from "react";
import { OrdersPage } from "@/features/orders/pages/OrdersPage";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-[#627D98]">
          Loading orders…
        </div>
      }
    >
      <OrdersPage />
    </Suspense>
  );
}
