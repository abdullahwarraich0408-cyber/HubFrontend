"use client";

import { useMemo } from "react";
import Link from "next/link";
import { FileText } from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { PageHeader } from "@/shared/components/PageHeader";
import { TableSkeleton } from "@/shared/components/EmptyState";
import {
  useVendorPrescriptionOrders,
  useVendorPrescriptionHistory,
  useAcceptPrescriptionOrder,
  useDeclinePrescriptionOrder,
} from "@/lib/hooks/useApi";
import { partnerRoutes } from "@/lib/constants/partnerRoutes";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";

export default function VendorPrescriptionOrdersPage() {
  const { data: activeOrders = [], isLoading } = useVendorPrescriptionOrders();
  const { data: historyOrders = [] } = useVendorPrescriptionHistory();
  const acceptOrder = useAcceptPrescriptionOrder();
  const declineOrder = useDeclinePrescriptionOrder();

  const awaiting = activeOrders.filter((order) => ["awaiting_accept", "PENDING_REVIEW", "UNDER_REVIEW", "finding_vendor"].includes(order.status)).length;
  const approvedToday = historyOrders.filter((order) => ["APPROVED", "accepted", "confirmed", "packed", "delivered"].includes(order.status)).length;
  const attention = activeOrders.filter((order) => ["CLARIFICATION_REQUIRED", "stock_pending", "customer_review"].includes(order.status)).length;

  const queue = useMemo(
    () => [...activeOrders].sort((a, b) => new Date(a.created_at || a.createdAtLabel) - new Date(b.created_at || 0)),
    [activeOrders]
  );

  return (
    <div>
      <PageHeader title="Prescription Orders" description="Review prescriptions and respond to medicine requests." />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card label="Awaiting Review" value={awaiting} />
        <Card label="Approved Today" value={approvedToday} />
        <Card label="Requires Attention" value={attention} />
      </div>

      <div className="bg-white rounded-[16px] border overflow-hidden">
        {isLoading ? <TableSkeleton /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-neutral-50 text-[12px] font-bold text-neutral-500 uppercase">
                  <th className="p-4 pl-6">Request</th>
                  <th className="p-4">Patient</th>
                  <th className="p-4">Prescription</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Received</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {queue.length === 0 ? (
                  <tr><td colSpan={7} className="p-10 text-center text-neutral-500">No prescription requests awaiting review.</td></tr>
                ) : queue.map((order) => (
                  <tr key={order.id} className="h-[62px]">
                    <td className="p-4 pl-6 font-bold">{order.shortId}</td>
                    <td className="p-4">{order.patient || order.customer?.name || "Patient"}</td>
                    <td className="p-4">{order.fileUrl ? <FileText size={18} /> : "—"}</td>
                    <td className="p-4">{order.medicineCount}</td>
                    <td className="p-4">{order.createdAtLabel || formatDate(order.created_at, true)}</td>
                    <td className="p-4"><StatusBadge status={order.status} /></td>
                    <td className="p-4 pr-6 text-right space-x-2">
                      {order.status === "awaiting_accept" ? (
                        <>
                          <Button size="sm" onClick={() => acceptOrder.mutateAsync(order.id).then(() => toast.success("Prescription accepted.")).catch((e) => toast.error(e.message))}>Accept</Button>
                          <Button size="sm" variant="danger" onClick={() => declineOrder.mutateAsync(order.id).then(() => toast.success("Prescription declined.")).catch((e) => toast.error(e.message))}>Reject</Button>
                        </>
                      ) : null}
                      <Link href={partnerRoutes.vendor.prescriptionOrder(order.id)}><Button size="sm" variant="secondary">Review</Button></Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ label, value }) {
  return (
    <div className="bg-white p-5 rounded-[16px] border">
      <p className="text-[13px] font-bold uppercase tracking-wider text-neutral-500">{label}</p>
      <p className="text-[32px] font-black mt-2">{value}</p>
    </div>
  );
}
