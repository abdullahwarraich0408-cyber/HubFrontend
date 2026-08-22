"use client";

import { PageHeader } from "@/shared/components/PageHeader";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { TableSkeleton } from "@/shared/components/EmptyState";
import { useVendorReturns, useUpdateVendorReturn } from "@/lib/hooks/useApi";
import { RETURN_STATUSES } from "@/lib/vendor/status";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";

export default function ReturnsPage() {
  const { data: returns = [], isLoading } = useVendorReturns();
  const updateReturn = useUpdateVendorReturn();

  return (
    <div>
      <PageHeader title="Returns" description="Review pharmacy return requests and apply Medzoos refund rules." />
      <div className="bg-white rounded-[16px] border overflow-hidden">
        {isLoading ? <TableSkeleton /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-neutral-50 text-[12px] font-bold text-neutral-500 uppercase">
                  <th className="p-4 pl-6">Return ID</th>
                  <th className="p-4">Order</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Reason</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Requested at</th>
                  <th className="p-4 pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {returns.length === 0 ? (
                  <tr><td colSpan={8} className="p-10 text-center text-neutral-500">No returns yet.</td></tr>
                ) : returns.map((item) => (
                  <tr key={item.id} className="h-[62px]">
                    <td className="p-4 pl-6 font-semibold">{item.return_number || String(item.id).slice(0, 8)}</td>
                    <td className="p-4">{item.order?.order_number || item.order_id?.slice?.(0, 8)}</td>
                    <td className="p-4">{item.customer?.name || item.order?.customer?.name || "Customer"}</td>
                    <td className="p-4">{item.items?.length || item.item_count || 1}</td>
                    <td className="p-4">{item.reason}</td>
                    <td className="p-4"><StatusBadge status={item.status} /></td>
                    <td className="p-4">{formatDate(item.created_at, true)}</td>
                    <td className="p-4 pr-6 text-right">
                      <select
                        className="h-10 border rounded-lg px-2 text-sm"
                        value={item.status}
                        onChange={(event) =>
                          updateReturn.mutateAsync({ id: item.id, status: event.target.value })
                            .then(() => toast.success("Return updated."))
                            .catch((error) => toast.error(error.message))
                        }
                      >
                        {RETURN_STATUSES.map((status) => <option key={status}>{status}</option>)}
                      </select>
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
