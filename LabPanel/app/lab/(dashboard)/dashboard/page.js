"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  FlaskConical,
  BarChart3,
  CircleDollarSign,
  ArrowRight,
  Eye,
  Clock,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { MetricCard } from "@/shared/components/MetricCard";
import { Badge } from "@/shared/components/Badge";
import { EmptyState } from "@/shared/components/EmptyState";
import { BookingDetailsModal } from "@/features/bookings/components/BookingDetailsModal";
import {
  useLabPortalBookings,
  useLabPortalReports,
  useSimulateIncomingOrder,
} from "@/lib/hooks/usePartnerPortal";
import { partnerRoutes } from "@/lib/constants/partnerRoutes";
import { BOOKING_STATUSES, normalizeStatus } from "@/lib/constants/lab";
import { toast } from "sonner";

export default function LabDashboardPage() {
  const { data: bookings = [], isLoading: loadingBookings, refetch } = useLabPortalBookings();
  const { data: summary, isLoading: loadingSummary } = useLabPortalReports();
  const simulateMutation = useSimulateIncomingOrder();

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Real database-calculated stats
  const newOrdersCount = bookings.filter(
    (b) => normalizeStatus(b.status) === BOOKING_STATUSES.NEW
  ).length;

  const runningCount = bookings.filter((b) =>
    [
      BOOKING_STATUSES.ACCEPTED,
      BOOKING_STATUSES.COLLECTOR_ASSIGNED,
      BOOKING_STATUSES.SAMPLE_COLLECTED,
      BOOKING_STATUSES.PROCESSING,
      BOOKING_STATUSES.REPORT_READY,
    ].includes(normalizeStatus(b.status))
  ).length;

  const completedCount = bookings.filter(
    (b) => normalizeStatus(b.status) === BOOKING_STATUSES.COMPLETED
  ).length;

  const totalRevenue =
    summary?.revenue !== undefined
      ? summary.revenue
      : bookings
          .filter(
            (b) =>
              [BOOKING_STATUSES.COMPLETED, BOOKING_STATUSES.REPORT_READY].includes(
                normalizeStatus(b.status)
              ) || b.payment_status === "PAID"
          )
          .reduce((sum, b) => sum + (Number(b.test_price) || 0), 0);

  const stats = [
    {
      label: "NEW ORDERS",
      value: loadingBookings ? "..." : String(newOrdersCount),
      icon: CalendarCheck,
      color: "teal",
      subtitle: newOrdersCount > 0 ? "Requires action" : "All orders caught up",
    },
    {
      label: "RUNNING",
      value: loadingBookings ? "..." : String(runningCount),
      icon: FlaskConical,
      color: "blue",
      subtitle: "In collection or processing",
    },
    {
      label: "COMPLETED",
      value: loadingBookings ? "..." : String(completedCount),
      icon: BarChart3,
      color: "green",
      subtitle: "Successfully fulfilled",
    },
    {
      label: "REVENUE",
      value: loadingSummary
        ? "..."
        : `PKR ${totalRevenue.toLocaleString()}`,
      icon: CircleDollarSign,
      color: "navy",
      subtitle: "From paid & completed tests",
    },
  ];

  const recentBookings = bookings.slice(0, 7);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Dashboard metrics refreshed");
    }, 400);
  };

  const handleSimulateOrder = async () => {
    try {
      const newOrder = await simulateMutation.mutateAsync();
      toast.success(`Simulated New Order: ${newOrder.booking_number} for ${newOrder.patient_name}`);
    } catch {
      toast.error("Failed to simulate order");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[30px] md:text-[34px] font-heading font-bold text-[#082B3F] tracking-tight">
            Dashboard
          </h1>
          <p className="text-[14px] text-[#667085] mt-1.5 font-normal">
            Real-time live overview of diagnostic lab operations and revenue velocity.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#D9DEE5] text-[#082B3F] text-[13px] font-semibold hover:bg-neutral-50 shadow-2xs transition-colors"
            title="Refresh Dashboard"
          >
            <RefreshCw
              size={15}
              className={`text-[#667085] ${isRefreshing ? "animate-spin text-[#17618E]" : ""}`}
            />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={handleSimulateOrder}
            disabled={simulateMutation.isPending}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#17618E] hover:bg-[#124362] text-white text-[13px] font-semibold transition-all shadow-xs"
          >
            <Sparkles size={15} className={simulateMutation.isPending ? "animate-spin" : ""} />
            <span>+ Simulate Order</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <MetricCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            subtitle={stat.subtitle}
          />
        ))}
      </div>

      {/* Recent Bookings Section */}
      <div className="bg-white rounded-[18px] border border-[#D9DEE5] shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-[#D9DEE5] flex items-center justify-between">
          <div>
            <h2 className="text-[17px] font-bold text-[#082B3F] tracking-tight">
              Recent Bookings
            </h2>
            <p className="text-[13px] text-[#667085] mt-0.5">
              Latest patient diagnostic appointments and sample requests
            </p>
          </div>
          <Link
            href={partnerRoutes.lab.bookings}
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#17618E] hover:text-[#124362] hover:underline"
          >
            <span>View all bookings</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Bookings Table */}
        <div className="overflow-x-auto">
          {recentBookings.length === 0 ? (
            <EmptyState message="No bookings yet." />
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#D9DEE5] text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                  <th className="py-3.5 px-6 font-bold">Patient</th>
                  <th className="py-3.5 px-4 font-bold">Test</th>
                  <th className="py-3.5 px-4 font-bold">Collection</th>
                  <th className="py-3.5 px-4 font-bold">Date / Slot</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-6 text-right font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-[13px]">
                {recentBookings.map((b) => (
                  <tr
                    key={b.id}
                    className="hover:bg-neutral-50/70 transition-colors group cursor-pointer"
                    onClick={() => setSelectedBooking(b)}
                  >
                    <td className="py-4 px-6">
                      <div className="font-semibold text-[#082B3F]">
                        {b.patient_name || b.patient}
                      </div>
                      <div className="text-[11px] text-[#667085] font-mono mt-0.5">
                        {b.booking_number}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-[#082B3F] max-w-xs truncate">
                        {b.test_name || b.test}
                      </div>
                      <div className="text-[12px] font-bold text-[#17618E] mt-0.5">
                        PKR {(Number(b.test_price) || 0).toLocaleString()}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge status={b.collection_type || b.collection} type="collection" />
                    </td>
                    <td className="py-4 px-4 text-[#667085]">
                      <div className="font-medium text-[#082B3F]">{b.date}</div>
                      <div className="text-[12px] text-[#667085]">{b.time}</div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge status={b.status} />
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBooking(b);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#D9DEE5] text-[12px] font-semibold text-[#17618E] hover:bg-[#DEEEF9] hover:border-[#17618E]/40 transition-colors"
                      >
                        <Eye size={13} />
                        <span>Manage</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          isOpen={Boolean(selectedBooking)}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
}
