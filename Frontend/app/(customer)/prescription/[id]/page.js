"use client";

import Link from "next/link";
import { use } from "react";
import { toast } from "sonner";
import { Button } from "@/shared/components/Button";
import { Badge } from "@/shared/components/Badge";
import { HorizontalTrackingTimeline } from "@/shared/components/HorizontalTrackingTimeline";
import { usePrescriptionOrder, useConfirmPrescriptionOrder, useRetryPrescriptionOrder } from "@/lib/hooks/useApi";
import { PRESCRIPTION_STATUS_LABELS } from "@/lib/mappers/prescriptionOrder";
import { PrescriptionAssignmentTimeline } from "@/features/prescription/components/PrescriptionAssignmentTimeline";

export default function Page({ params }) {
  const { id } = use(params);
  const { data: order, isLoading } = usePrescriptionOrder(id);
  const confirmOrder = useConfirmPrescriptionOrder();
  const retryOrder = useRetryPrescriptionOrder();

  if (isLoading) return <div className="p-8 text-center">Loading prescription order...</div>;
  if (!order) {
    return (
      <div className="p-8 text-center">
        <p className="mb-4">Prescription order not found.</p>
        <Link href="/orders" className="text-brand-primary font-semibold">View all orders</Link>
      </div>
    );
  }

  const original = order.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, order.estimatedValue);
  const available = order.availableItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-start mb-6">
        <div>
          <Link href="/orders" className="text-[13px] text-neutral-500 hover:text-brand-primary mb-2 inline-block">
            ← Back to orders
          </Link>
          <h1 className="text-[28px] font-heading font-bold">{order.shortId}</h1>
          <p className="text-neutral-500">{PRESCRIPTION_STATUS_LABELS[order.status] || order.status}</p>
          <p className="text-[12px] text-neutral-400 mt-1">Placed {order.createdAtLabel}</p>
        </div>
        <Badge status={order.status} />
      </div>

      {order.statusTimeline?.length > 0 && (
        <div className="bg-white border rounded-[16px] p-5 sm:p-6 mb-4">
          <h2 className="text-[16px] font-bold mb-4">Order progress</h2>
          <HorizontalTrackingTimeline steps={order.statusTimeline} />
        </div>
      )}

      <div className="bg-white border rounded-[16px] p-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mb-4">
        <div><p className="text-xs text-neutral-400">Medicines</p><p className="font-bold">{order.medicineCount}</p></div>
        <div><p className="text-xs text-neutral-400">ETA</p><p className="font-bold">{order.etaMinutes || "-"} min</p></div>
        <div><p className="text-xs text-neutral-400">Distance</p><p className="font-bold">{order.distanceKm != null ? `${order.distanceKm.toFixed(1)} km` : "-"}</p></div>
        <div><p className="text-xs text-neutral-400">Delivery</p><p className="font-bold capitalize">{order.deliveryType}</p></div>
      </div>

      <div className="bg-white border rounded-[16px] p-5 sm:p-6 mb-4">
        <h2 className="text-[16px] font-bold mb-1">Pharmacy assignment history</h2>
        <p className="text-[13px] text-neutral-500 mb-4">
          Track which pharmacies received your prescription and how they responded.
        </p>
        <PrescriptionAssignmentTimeline
          history={order.assignmentHistory}
          assignedVendor={order.assignedVendor}
          currentVendor={order.currentVendor}
        />
      </div>

      {order.status === "no_vendor" && (
        <div className="bg-white border rounded-[16px] p-6 space-y-4 mb-4">
          <p className="font-bold text-lg">Nearby pharmacy did not accept in time</p>
          <p className="text-neutral-600 text-[14px]">
            We found a pharmacy in your area, but it did not accept this prescription within 30 seconds.
            {order.assignmentHistory.length > 0 && (
              <> See the assignment history above for details on each pharmacy contacted.</>
            )}
          </p>
          <Button
            isLoading={retryOrder.isPending}
            onClick={() =>
              retryOrder.mutateAsync(id)
                .then(() => toast.success("Searching for pharmacies again..."))
                .catch((error) => toast.error(error.message))
            }
          >
            Search again
          </Button>
        </div>
      )}

      {order.status === "customer_review" && (
        <div className="bg-white border rounded-[16px] p-6 space-y-4">
          <p className="text-lg font-bold">Original: Rs {original.toLocaleString()}</p>
          <div>
            <p className="font-bold mb-2">Available</p>
            {order.availableItems.map((item) => (
              <p key={item.id} className="text-status-success">✓ {item.name}</p>
            ))}
          </div>
          {order.unavailableItems.length > 0 && (
            <div>
              <p className="font-bold mb-2">Unavailable</p>
              {order.unavailableItems.map((item) => (
                <p key={item.id} className="text-status-danger">✗ {item.name}</p>
              ))}
            </div>
          )}
          <p className="font-bold text-brand-primary">Updated: Rs {available.toLocaleString()}</p>
          <div className="flex gap-3">
            <Button
              onClick={() =>
                confirmOrder.mutateAsync({ id, confirmed: true })
                  .then(() => toast.success("Order confirmed"))
                  .catch((error) => toast.error(error.message))
              }
            >
              Continue
            </Button>
            <Button variant="secondary" onClick={() => confirmOrder.mutateAsync({ id, confirmed: false })}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
