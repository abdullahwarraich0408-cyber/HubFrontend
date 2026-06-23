"use client";

import { Fragment, useState } from "react";
import { useAdminPrescriptionOrders } from "@/lib/hooks/useApi";
import { PRESCRIPTION_STATUS_LABELS, ASSIGNMENT_ACTION_LABELS } from "@/lib/mappers/prescriptionOrder";
import { MagnifyingGlass, CaretDown, CaretUp } from "@phosphor-icons/react";

function StatusBadge({ status }) {
  const label = PRESCRIPTION_STATUS_LABELS[status] || status;
  const tone =
    status === "delivered"
      ? "bg-[#0F9D58]/10 text-[#0F9D58]"
      : status === "cancelled" || status === "no_vendor"
        ? "bg-[#DC2626]/10 text-[#DC2626]"
        : "bg-[#D97706]/10 text-[#D97706]";

  return <span className={`px-2.5 py-1 text-xs font-bold rounded-md capitalize ${tone}`}>{label}</span>;
}

function AssignmentHistoryRow({ history }) {
  if (!history?.length) {
    return <p className="text-[13px] text-neutral-500">No pharmacies contacted yet.</p>;
  }

  return (
    <div className="space-y-2">
      {history.map((entry) => (
        <div key={entry.id} className="flex items-center justify-between gap-4 text-[13px] py-2 border-b border-neutral-100 last:border-0">
          <div>
            <p className="font-semibold text-ink-headline">{entry.vendorName}</p>
            <p className="text-neutral-500">{entry.actionLabel || ASSIGNMENT_ACTION_LABELS[entry.action]}</p>
          </div>
          <p className="text-neutral-400 shrink-0">{entry.time}</p>
        </div>
      ))}
    </div>
  );
}

export default function AdminPrescriptionOrdersPage() {
  const { data: orders = [], isLoading } = useAdminPrescriptionOrders();
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const filtered = orders.filter((order) => {
    const query = search.toLowerCase();
    return (
      order.shortId.toLowerCase().includes(query) ||
      order.customer?.name?.toLowerCase().includes(query) ||
      order.assignedVendor?.name?.toLowerCase().includes(query) ||
      order.currentVendor?.name?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <div className="mb-8">
        <h1 className="text-[28px] font-heading font-extrabold text-ink-headline tracking-tight">Prescription Orders</h1>
        <p className="text-[14px] text-neutral-500 mt-1">
          Track prescription uploads, pharmacy matching, and assignment history across the platform.
        </p>
      </div>

      <div className="bg-white rounded-[16px] border border-neutral-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-4 border-b border-neutral-200 bg-neutral-50">
          <div className="relative w-full sm:w-[360px]">
            <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by order ID, customer, or pharmacy..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-[40px] pl-10 pr-4 rounded-lg border border-neutral-200 bg-white text-sm outline-none focus:border-[#0B6E72] focus:ring-1 focus:ring-[#0B6E72]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                <th className="p-4 pl-6">Order</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Assigned Pharmacy</th>
                <th className="p-4">Attempts</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4">History</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-neutral-400">Loading prescription orders...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-neutral-400">No prescription orders found.</td>
                </tr>
              ) : (
                filtered.map((order) => {
                  const isExpanded = expandedId === order.id;
                  return (
                    <Fragment key={order.id}>
                      <tr className="hover:bg-neutral-50 transition-colors">
                        <td className="p-4 pl-6 font-mono text-sm font-bold text-ink-headline">{order.shortId}</td>
                        <td className="p-4 text-sm">{order.customer?.name || "—"}</td>
                        <td className="p-4 text-sm">
                          {order.assignedVendor?.name || order.currentVendor?.name || "—"}
                        </td>
                        <td className="p-4 text-sm">{order.assignmentAttempts || order.assignmentHistory?.length || 0}</td>
                        <td className="p-4"><StatusBadge status={order.status} /></td>
                        <td className="p-4 text-sm text-neutral-500">{order.createdAtLabel}</td>
                        <td className="p-4">
                          <button
                            type="button"
                            onClick={() => setExpandedId(isExpanded ? null : order.id)}
                            className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#0B6E72]"
                          >
                            {isExpanded ? "Hide" : "View"}
                            {isExpanded ? <CaretUp size={14} /> : <CaretDown size={14} />}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-neutral-50/70">
                          <td colSpan="7" className="p-4 pl-6 pr-6">
                            <div className="rounded-[12px] border border-neutral-200 bg-white p-4">
                              <p className="text-[13px] font-bold text-ink-headline mb-3">Pharmacy assignment history</p>
                              <AssignmentHistoryRow history={order.assignmentHistory} />
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
