"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { TableSkeleton } from "@/shared/components/EmptyState";
import { useVendorOrder, useUpdateVendorOrderStatus } from "@/lib/hooks/useApi";
import { partnerRoutes } from "@/lib/constants/partnerRoutes";
import { nextOrderAction, ORDER_REJECTION_REASONS } from "@/lib/vendor/status";
import { formatPkr, formatDate } from "@/lib/format";
import { toast } from "sonner";

export default function OrderDetailPage() {
  const { id } = useParams();
  const { data: order, isLoading } = useVendorOrder(id);
  const updateStatus = useUpdateVendorOrderStatus();
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState(ORDER_REJECTION_REASONS[0]);

  if (isLoading) return <TableSkeleton />;
  if (!order) return <p className="text-sm text-neutral-500">This order is unavailable.</p>;

  const addr = order.delivery_address;
  const addressText = typeof addr === "string" ? addr : [addr?.street || addr?.address, addr?.city, addr?.state, addr?.zip || addr?.zipCode].filter(Boolean).join(", ");

  const run = async (action) => {
    if (action.status === "REJECTED") {
      setRejecting(true);
      return;
    }
    try {
      await updateStatus.mutateAsync({ id: order.id, status: action.status });
      toast.success(action.label === "Mark Ready" ? "Order marked as ready." : "Order updated.");
    } catch (error) {
      toast.error(error.message || "This order has already been updated.");
    }
  };

  return (
    <div className="max-w-[960px] space-y-6">
      <Link href={partnerRoutes.vendor.orders} className="inline-flex items-center text-sm font-semibold text-neutral-500">
        <ArrowLeft size={16} className="mr-2" /> Back to orders
      </Link>
      <div className="flex flex-wrap justify-between gap-4">
        <div>
          <h1 className="font-heading text-[28px] font-extrabold">{order.order_number || "Order"}</h1>
          <p className="text-sm text-neutral-500">{formatDate(order.created_at, true)}</p>
        </div>
        <StatusBadge status={order.status} kind="order" />
      </div>

      <section className="bg-white rounded-[16px] border p-6 grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xs uppercase font-bold text-neutral-500 mb-2">Order Information</h2>
          <p>Payment: {order.payment_status || "—"}</p>
          <p>Delivery: {order.delivery_type || order.delivery_method || "Delivery"}</p>
        </div>
        <div>
          <h2 className="text-xs uppercase font-bold text-neutral-500 mb-2">Customer</h2>
          <p className="font-semibold">{order.customer?.name}</p>
          <p>{order.customer?.phone || "—"}</p>
          <p className="text-sm text-neutral-600">{addressText || "—"}</p>
        </div>
      </section>

      <section className="bg-white rounded-[16px] border overflow-hidden">
        <h2 className="p-6 font-heading text-lg font-bold">Products</h2>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-neutral-50 text-xs uppercase text-neutral-500">
              <th className="p-4">Name</th>
              <th className="p-4">Qty</th>
              <th className="p-4">Unit price</th>
              <th className="p-4">Subtotal</th>
              <th className="p-4">Rx</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {(order.items || []).map((item) => (
              <tr key={item.id}>
                <td className="p-4 font-semibold">{item.product?.name}</td>
                <td className="p-4">{item.quantity}</td>
                <td className="p-4">{formatPkr(item.unit_price)}</td>
                <td className="p-4">{formatPkr(Number(item.unit_price) * item.quantity)}</td>
                <td className="p-4">{item.product?.prescription_required ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="bg-white rounded-[16px] border p-6 space-y-2 text-sm">
        <h2 className="font-heading text-lg font-bold">Financial Summary</h2>
        <Row label="Subtotal" value={formatPkr(order.subtotal || order.total_amount)} />
        <Row label="Discount" value={formatPkr(order.discount_amount)} />
        <Row label="Delivery" value={formatPkr(order.delivery_fee)} />
        <Row label="Platform fee" value={formatPkr(order.platform_fee)} />
        <Row label="Commission" value={formatPkr(order.commission_amount)} />
        <Row label="Vendor earnings" value={formatPkr(order.vendor_net)} />
        <Row label="Total" value={formatPkr(order.total_amount)} strong />
      </section>

      <section className="bg-white rounded-[16px] border p-6">
        <h2 className="font-heading text-lg font-bold mb-3">Status Timeline</h2>
        <div className="space-y-2 text-sm">
          {(order.events || []).length === 0 ? <p className="text-neutral-500">Order placed</p> : null}
          {(order.events || []).map((event) => (
            <p key={event.id}>{formatDate(event.created_at, true)} · {event.status || event.action || event.type}</p>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        {nextOrderAction(order.status).map((action) => (
          <Button key={action.status} variant={action.destructive ? "danger" : "primary"} onClick={() => run(action)}>
            {action.label}
          </Button>
        ))}
      </div>

      <ConfirmDialog
        open={rejecting}
        title="Reject this order?"
        description="The customer will be notified that the pharmacy cannot fulfill this order."
        confirmLabel="Reject Order"
        destructive
        onCancel={() => setRejecting(false)}
        onConfirm={async () => {
          try {
            await updateStatus.mutateAsync({ id: order.id, status: "REJECTED", reason, rejection_reason: reason });
            toast.success("Order rejected.");
            setRejecting(false);
          } catch (error) {
            toast.error(error.message);
          }
        }}
      />
      {rejecting ? (
        <select className="border rounded-md px-3 py-2 text-sm" value={reason} onChange={(e) => setReason(e.target.value)}>
          {ORDER_REJECTION_REASONS.map((item) => <option key={item}>{item}</option>)}
        </select>
      ) : null}
    </div>
  );
}

function Row({ label, value, strong }) {
  return (
    <div className={`flex justify-between ${strong ? "font-bold text-base" : ""}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
