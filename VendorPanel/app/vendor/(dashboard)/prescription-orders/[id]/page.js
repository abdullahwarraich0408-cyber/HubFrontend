"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, FileText } from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { TableSkeleton } from "@/shared/components/EmptyState";
import {
  usePrescriptionOrder,
  usePrescriptionDocument,
  useReviewPrescription,
  useAcceptPrescriptionOrder,
  useDeclinePrescriptionOrder,
  useConfirmPrescriptionStock,
  useMarkPrescriptionPacked,
} from "@/lib/hooks/useApi";
import { partnerRoutes } from "@/lib/constants/partnerRoutes";
import { RX_REJECTION_REASONS } from "@/lib/vendor/status";
import { formatPkr, formatDate } from "@/lib/format";
import { toast } from "sonner";

export default function PrescriptionReviewPage() {
  const { id } = useParams();
  const { data: order, isLoading } = usePrescriptionOrder(id);
  const { data: document } = usePrescriptionDocument(id);
  const review = useReviewPrescription();
  const acceptOrder = useAcceptPrescriptionOrder();
  const declineOrder = useDeclinePrescriptionOrder();
  const confirmStock = useConfirmPrescriptionStock();
  const markPacked = useMarkPrescriptionPacked();
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState(RX_REJECTION_REASONS[0]);
  const [notes, setNotes] = useState("");

  if (isLoading) return <TableSkeleton />;
  if (!order) return <p className="text-sm text-neutral-500">This prescription is unavailable.</p>;

  const items = order.items || [];
  const docUrl = document?.url;

  const submitReview = async (status) => {
    try {
      await review.mutateAsync({ id: order.id, status, notes, reason });
      toast.success(status === "APPROVED" ? "Prescription approved." : status === "REJECTED" ? "Prescription rejected." : "Review saved.");
    } catch (error) {
      toast.error(error.message || "You are not authorized to review prescriptions.");
    }
  };

  return (
    <div className="max-w-[960px] space-y-6">
      <Link href={partnerRoutes.vendor.prescriptionOrders} className="inline-flex items-center text-sm font-semibold text-neutral-500">
        <ArrowLeft size={16} className="mr-2" /> Back to prescription orders
      </Link>
      <div className="flex justify-between gap-4">
        <div>
          <h1 className="font-heading text-[28px] font-extrabold">Prescription review</h1>
          <p className="text-sm text-neutral-500">{formatDate(order.created_at, true)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <section className="bg-white rounded-[16px] border p-6">
        <h2 className="font-heading text-lg font-bold mb-3">Prescription document</h2>
        {docUrl ? (
          <a href={docUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-brand-primary font-semibold">
            <FileText size={18} /> Open secure prescription file
          </a>
        ) : (
          <p className="text-sm text-neutral-500">No document available.</p>
        )}
        {docUrl && /\.(png|jpe?g)$/i.test(docUrl) ? <img src={docUrl} alt="Prescription" className="mt-4 max-h-[420px] rounded-[12px] border" /> : null}
      </section>

      <section className="bg-white rounded-[16px] border overflow-hidden">
        <h2 className="p-6 font-heading text-lg font-bold">Requested medicines</h2>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-neutral-50 text-xs uppercase text-neutral-500">
              <th className="p-4">Requested medicine</th>
              <th className="p-4">Qty</th>
              <th className="p-4">Available product</th>
              <th className="p-4">Price</th>
              <th className="p-4">Decision</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="p-4 font-semibold">{item.name}</td>
                <td className="p-4">{item.quantity}</td>
                <td className="p-4">{item.matched_product_name || item.availability || "—"}</td>
                <td className="p-4">{formatPkr(item.unit_price || item.unitPrice)}</td>
                <td className="p-4">{item.availability || "Pending"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <label className="block text-sm font-semibold">Notes
        <textarea className="mt-1.5 w-full min-h-[80px] border rounded-lg p-3" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </label>

      <div className="flex flex-wrap gap-2">
        <Button onClick={() => submitReview("APPROVED")}>Approve</Button>
        <Button variant="secondary" onClick={() => submitReview("PARTIALLY_APPROVED")}>Partially Approve</Button>
        <Button variant="secondary" onClick={() => submitReview("CLARIFICATION_REQUIRED")}>Request Clarification</Button>
        <Button variant="danger" onClick={() => setRejectOpen(true)}>Reject</Button>
        {order.status === "awaiting_accept" ? (
          <>
            <Button variant="secondary" onClick={() => acceptOrder.mutate(order.id)}>Accept offer</Button>
            <Button variant="secondary" onClick={() => declineOrder.mutate(order.id)}>Decline offer</Button>
          </>
        ) : null}
        {order.status === "accepted" ? <Button variant="secondary" onClick={() => confirmStock.mutate({ id: order.id, stock_status: "all_available" })}>Confirm stock</Button> : null}
        {order.status === "confirmed" ? <Button variant="secondary" onClick={() => markPacked.mutate(order.id)}>Mark packed</Button> : null}
      </div>

      <ConfirmDialog
        open={rejectOpen}
        title="Reject this prescription?"
        description="The patient will be asked to provide a new prescription or choose another pharmacy."
        confirmLabel="Reject"
        destructive
        onCancel={() => setRejectOpen(false)}
        onConfirm={async () => {
          await submitReview("REJECTED");
          setRejectOpen(false);
        }}
      />
      {rejectOpen ? (
        <select className="border rounded-md px-3 py-2 text-sm" value={reason} onChange={(e) => setReason(e.target.value)}>
          {RX_REJECTION_REASONS.map((item) => <option key={item}>{item}</option>)}
        </select>
      ) : null}
    </div>
  );
}
