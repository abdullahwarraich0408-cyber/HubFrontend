"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { FileText, Timer, CheckCircle, Package, ClockCounterClockwise } from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";
import { Badge } from "@/shared/components/Badge";
import {
  useVendorPrescriptionOrders,
  useVendorPrescriptionHistory,
  useAcceptPrescriptionOrder,
  useDeclinePrescriptionOrder,
  useConfirmPrescriptionStock,
  useMarkPrescriptionPacked,
} from "@/lib/hooks/useApi";
import { PRESCRIPTION_STATUS_LABELS } from "@/lib/mappers/prescriptionOrder";

function Countdown({ deadline, onExpire }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!deadline) return undefined;
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((new Date(deadline).getTime() - Date.now()) / 1000));
      setSeconds(remaining);
      if (remaining === 0) onExpire?.();
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [deadline, onExpire]);

  return <span className="font-mono text-status-warning">{seconds}s</span>;
}

function AssignmentHistoryCompact({ history = [] }) {
  if (!history.length) return null;

  return (
    <div className="mt-4 pt-4 border-t border-neutral-100">
      <p className="text-[12px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Your involvement</p>
      <div className="space-y-1">
        {history.map((entry) => (
          <div key={entry.id} className="flex items-center justify-between text-[12px]">
            <span className="text-neutral-600">{entry.actionLabel}</span>
            <span className="text-neutral-400">{entry.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PrescriptionOrderCard({ order, showActions = true }) {
  const acceptOrder = useAcceptPrescriptionOrder();
  const declineOrder = useDeclinePrescriptionOrder();
  const confirmStock = useConfirmPrescriptionStock();
  const markPacked = useMarkPrescriptionPacked();
  const [itemAvailability, setItemAvailability] = useState(() =>
    Object.fromEntries((order.items || []).map((item) => [item.id, item.availability || "available"]))
  );

  const isAwaiting = order.status === "awaiting_accept";

  const handlePartialStock = async () => {
    const items = Object.entries(itemAvailability).map(([id, availability]) => ({ id, availability }));
    const hasUnavailable = items.some((item) => item.availability === "unavailable");
    try {
      await confirmStock.mutateAsync({
        id: order.id,
        stock_status: hasUnavailable ? "partial" : "all_available",
        items,
      });
      toast.success("Stock updated");
    } catch (error) {
      toast.error(error.message || "Could not update stock");
    }
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-[16px] p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-[18px] font-black text-ink-headline">{order.shortId}</p>
          <p className="text-[13px] text-neutral-500 mt-1">
            {PRESCRIPTION_STATUS_LABELS[order.status] || order.status} · {order.createdAtLabel}
          </p>
          <p className="text-[13px] text-neutral-500 mt-1">
            Medicines: {order.medicineCount} · ETA: {order.etaMinutes || 40} min
          </p>
        </div>
        <Badge status={order.status} />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div className="rounded-[12px] bg-neutral-50 p-3">
          <p className="text-neutral-400 text-[11px] uppercase font-bold">Order value</p>
          <p className="font-black text-[18px]">Rs {Number(order.estimatedValue || 0).toLocaleString()}</p>
        </div>
        <div className="rounded-[12px] bg-neutral-50 p-3">
          <p className="text-neutral-400 text-[11px] uppercase font-bold">Distance</p>
          <p className="font-black text-[18px]">{order.distanceKm != null ? `${order.distanceKm.toFixed(1)} km` : "—"}</p>
        </div>
      </div>

      {showActions && isAwaiting && (
        <div className="flex items-center justify-between gap-3 mb-4 p-3 rounded-[12px] bg-warning-50 border border-warning-200">
          <div className="flex items-center gap-2 text-[13px] font-semibold">
            <Timer size={18} /> Accept within <Countdown deadline={order.acceptDeadline} />
          </div>
          <div className="flex gap-2">
            <Button size="sm" isLoading={acceptOrder.isPending} onClick={() => acceptOrder.mutate(order.id)}>Accept</Button>
            <Button size="sm" variant="secondary" isLoading={declineOrder.isPending} onClick={() => declineOrder.mutate(order.id)}>Reject</Button>
          </div>
        </div>
      )}

      {showActions && order.status === "accepted" && (
        <div className="space-y-3">
          <p className="text-[13px] font-bold text-ink-headline">Confirm stock</p>
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3 text-[13px]">
              <span>{item.name}</span>
              <select
                value={itemAvailability[item.id]}
                onChange={(event) => setItemAvailability((prev) => ({ ...prev, [item.id]: event.target.value }))}
                className="border border-neutral-200 rounded-md px-2 py-1 text-[12px]"
              >
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
          ))}
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => confirmStock.mutateAsync({ id: order.id, stock_status: "all_available" })}>All Available</Button>
            <Button size="sm" variant="secondary" onClick={handlePartialStock}>Mark Partial</Button>
            <Button size="sm" variant="secondary" onClick={() => confirmStock.mutateAsync({ id: order.id, stock_status: "unavailable" })}>Unavailable</Button>
          </div>
        </div>
      )}

      {showActions && order.status === "confirmed" && (
        <Button leftIcon={<Package size={16} />} isLoading={markPacked.isPending} onClick={() => markPacked.mutate(order.id)}>
          Mark Packed
        </Button>
      )}

      {order.fileUrl && (
        <a href={order.fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[13px] text-brand-primary font-semibold mt-4">
          <FileText size={16} /> View prescription
        </a>
      )}

      <AssignmentHistoryCompact history={order.assignmentHistory} />
    </div>
  );
}

export default function VendorPrescriptionOrdersPage() {
  const [tab, setTab] = useState("active");
  const { data: activeOrders = [], isLoading: activeLoading } = useVendorPrescriptionOrders();
  const { data: historyOrders = [], isLoading: historyLoading } = useVendorPrescriptionHistory();

  const activeIds = useMemo(() => new Set(activeOrders.map((order) => order.id)), [activeOrders]);

  const historyOnly = useMemo(
    () => historyOrders.filter((order) => !activeIds.has(order.id)),
    [historyOrders, activeIds]
  );

  const sortedActive = useMemo(
    () => [...activeOrders].sort((a, b) => (a.status === "awaiting_accept" ? -1 : 0)),
    [activeOrders]
  );

  const isLoading = tab === "active" ? activeLoading : historyLoading;
  const orders = tab === "active" ? sortedActive : historyOnly;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-[28px] font-heading font-extrabold text-ink-headline">Prescription Orders</h1>
        <p className="text-[14px] text-neutral-500 mt-1">Accept incoming prescriptions and review your order history.</p>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setTab("active")}
          className={`px-4 py-2 rounded-[10px] text-[13px] font-semibold ${tab === "active" ? "bg-brand-primary text-white" : "bg-white border border-neutral-200 text-neutral-600"}`}
        >
          Active ({activeOrders.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("history")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-[10px] text-[13px] font-semibold ${tab === "history" ? "bg-brand-primary text-white" : "bg-white border border-neutral-200 text-neutral-600"}`}
        >
          <ClockCounterClockwise size={16} />
          History ({historyOnly.length})
        </button>
      </div>

      {isLoading ? (
        <div className="text-sm text-neutral-500">Loading prescription orders...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-[16px] p-10 text-center text-neutral-500">
          <CheckCircle size={32} className="mx-auto mb-3 text-neutral-300" />
          {tab === "active" ? "No active prescription orders right now." : "No prescription order history yet."}
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <PrescriptionOrderCard key={order.id} order={order} showActions={tab === "active"} />
          ))}
        </div>
      )}
    </div>
  );
}
