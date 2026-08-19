"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Package, Truck, CheckCircle } from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { PageHeader } from "@/shared/components/PageHeader";
import { Pagination } from "@/shared/components/Pagination";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { TableSkeleton } from "@/shared/components/EmptyState";
import { Input } from "@/shared/components/Input";
import {
  useVendorOrders,
  useVendorDashboardStats,
  useUpdateVendorOrderStatus,
} from "@/lib/hooks/useApi";
import { useDebouncedValue } from "@/lib/hooks/useDebouncedValue";
import { partnerRoutes } from "@/lib/constants/partnerRoutes";
import { nextOrderAction, ORDER_REJECTION_REASONS } from "@/lib/vendor/status";
import { formatPkr, formatDate } from "@/lib/format";
import { toast } from "sonner";

export default function VendorOrdersRoute() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <VendorOrdersPage />
    </Suspense>
  );
}

export function VendorOrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("pageSize") || 20);
  const status = searchParams.get("status") || "";
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const debounced = useDebouncedValue(search);
  const params = useMemo(() => ({ page, pageSize, status, search: debounced }), [page, pageSize, status, debounced]);
  const { data, isLoading } = useVendorOrders(params);
  const { data: stats } = useVendorDashboardStats();
  const updateStatus = useUpdateVendorOrderStatus();
  const orders = data?.orders || [];
  const [rejecting, setRejecting] = useState(null);
  const [reason, setReason] = useState(ORDER_REJECTION_REASONS[0]);

  const setQuery = (updates) => {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value == null || value === "") next.delete(key);
      else next.set(key, String(value));
    });
    router.push(`${partnerRoutes.vendor.orders}?${next.toString()}`);
  };

  const runAction = async (order, action) => {
    if (action.destructive && action.status === "REJECTED") {
      setRejecting({ order, action });
      return;
    }
    try {
      await updateStatus.mutateAsync({ id: order.id, status: action.status });
      toast.success(action.status === "ACCEPTED" ? "Order accepted." : action.status === "READY_FOR_PICKUP" ? "Order marked as ready." : "Order updated.");
    } catch (error) {
      toast.error(error.message || "This order has already been updated.");
    }
  };

  return (
    <div>
      <PageHeader title="Order Management" description="Track and fulfill orders placed with your pharmacy only." />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Metric icon={Package} label="Pending Fulfillment" value={stats?.orderSummary?.pending || 0} color="text-warning-600" />
        <Metric icon={Truck} label="Out for Delivery" value={stats?.orderSummary?.outForDelivery || 0} color="text-brand-primary" />
        <Metric icon={CheckCircle} label="Completed Today" value={stats?.orderSummary?.completedToday || 0} color="text-status-success" />
      </div>

      <div className="bg-white rounded-[16px] border border-neutral-200 overflow-hidden">
        <div className="p-4 border-b border-neutral-200 flex flex-col md:flex-row gap-3">
          <Input placeholder="Search order number, customer, phone, product" value={search} onChange={(e) => { setSearch(e.target.value); setQuery({ search: e.target.value, page: 1 }); }} />
          <select className="h-[46px] rounded-lg border px-3 text-sm" value={status} onChange={(e) => setQuery({ status: e.target.value, page: 1 })} aria-label="Filter by status">
            <option value="">All statuses</option>
            {["NEW", "ACCEPTED", "PREPARING", "READY_FOR_PICKUP", "OUT_FOR_DELIVERY", "DELIVERED", "COMPLETED", "CANCELLED", "REJECTED"].map((value) => (
              <option key={value} value={value}>{value.replace(/_/g, " ")}</option>
            ))}
          </select>
        </div>
        {isLoading ? <TableSkeleton /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-neutral-50 text-[12px] font-bold text-neutral-500 uppercase">
                  <th className="p-4 pl-6">Order</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {orders.length === 0 ? (
                  <tr><td colSpan={6} className="p-8 text-center text-sm text-neutral-500">No orders yet for your store.</td></tr>
                ) : orders.map((order) => (
                  <tr key={order.id} className="h-[62px] hover:bg-neutral-50/50">
                    <td className="p-4 pl-6 font-bold">
                      <Link href={partnerRoutes.vendor.order(order.id)} className="hover:underline">{order.order_number || String(order.id).slice(0, 8)}</Link>
                      <div className="text-xs text-neutral-400">{formatDate(order.created_at, true)}</div>
                    </td>
                    <td className="p-4">{order.customer?.name || "Customer"}</td>
                    <td className="p-4">{order.items?.length || 0}</td>
                    <td className="p-4 font-bold">{formatPkr(order.total_amount)}</td>
                    <td className="p-4"><StatusBadge status={order.status} kind="order" /></td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex justify-end gap-2 flex-wrap">
                        {nextOrderAction(order.status).map((action) => (
                          <Button key={action.status} size="sm" variant={action.destructive ? "danger" : "secondary"} onClick={() => runAction(order, action)}>
                            {action.label}
                          </Button>
                        ))}
                        <Link href={partnerRoutes.vendor.order(order.id)}><Button size="sm" variant="ghost">View Details</Button></Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={page} pageSize={pageSize} total={data?.total || 0} onPageChange={(next) => setQuery({ page: next })} onPageSizeChange={(next) => setQuery({ pageSize: next, page: 1 })} />
      </div>

      <ConfirmDialog
        open={Boolean(rejecting)}
        title="Reject this order?"
        description="The customer will be notified that the pharmacy cannot fulfill this order."
        confirmLabel="Reject Order"
        destructive
        onCancel={() => setRejecting(null)}
        onConfirm={async () => {
          try {
            await updateStatus.mutateAsync({ id: rejecting.order.id, status: "REJECTED", reason, rejection_reason: reason });
            toast.success("Order rejected.");
            setRejecting(null);
          } catch (error) {
            toast.error(error.message || "This order has already been updated.");
          }
        }}
      />
      {rejecting ? (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] bg-white border rounded-xl shadow-lg p-3">
          <label className="text-xs font-semibold">Rejection reason
            <select className="ml-2 border rounded-md px-2 py-1" value={reason} onChange={(e) => setReason(e.target.value)}>
              {ORDER_REJECTION_REASONS.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
        </div>
      ) : null}
    </div>
  );
}

function Metric({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white p-5 rounded-[16px] border border-neutral-200">
      <div className={`flex items-center gap-3 ${color} mb-2`}>
        <Icon size={20} weight="fill" />
        <span className="font-bold text-[13px] uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-[32px] font-black text-ink-900">{value}</div>
    </div>
  );
}
