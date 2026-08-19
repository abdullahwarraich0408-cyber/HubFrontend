"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  Truck,
  FlaskConical,
  FileUp,
  FileText,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  Building2,
  Calendar,
  Clock,
  Phone,
  User,
  ArrowUpDown,
  SlidersHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/shared/components/Badge";
import { SearchInput } from "@/shared/components/SearchInput";
import { Pagination } from "@/shared/components/Pagination";
import { EmptyState } from "@/shared/components/EmptyState";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { BookingDetailsModal } from "@/features/bookings/components/BookingDetailsModal";
import { AssignCollectorModal } from "@/features/bookings/components/AssignCollectorModal";
import { UploadReportModal } from "@/features/bookings/components/UploadReportModal";
import { ReportViewerModal } from "@/features/bookings/components/ReportViewerModal";
import {
  useLabPortalBookings,
  useUpdateLabBookingStatus,
  useAssignLabCollector,
  useUploadLabReport,
} from "@/lib/hooks/usePartnerPortal";
import {
  BOOKING_STATUSES,
  STATUS_LABELS,
  normalizeStatus,
} from "@/lib/constants/lab";

export default function LabBookingsPage() {
  const { data: bookings = [], isLoading, refetch } = useLabPortalBookings();
  const updateStatusMutation = useUpdateLabBookingStatus();
  const assignCollectorMutation = useAssignLabCollector();
  const uploadReportMutation = useUploadLabReport();

  // Search, Filter & Sort State
  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState("ALL");
  const [collectionFilter, setCollectionFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [copiedId, setCopiedId] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals & Action State
  const [detailsBooking, setDetailsBooking] = useState(null);
  const [assignModalBooking, setAssignModalBooking] = useState(null);
  const [uploadModalBooking, setUploadModalBooking] = useState(null);
  const [reportViewerBooking, setReportViewerBooking] = useState(null);
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: "",
    description: "",
    confirmText: "Confirm",
    variant: "danger",
    onConfirm: () => {},
  });

  // Calculate live counts for filter tabs
  const statusCounts = useMemo(() => {
    const counts = {
      ALL: bookings.length,
      NEW: 0,
      ACCEPTED: 0,
      IN_PROGRESS: 0,
      REPORT_READY: 0,
      COMPLETED: 0,
    };

    bookings.forEach((b) => {
      const norm = normalizeStatus(b.status);
      if (norm === BOOKING_STATUSES.NEW) counts.NEW += 1;
      else if (norm === BOOKING_STATUSES.ACCEPTED) counts.ACCEPTED += 1;
      else if (
        [
          BOOKING_STATUSES.COLLECTOR_ASSIGNED,
          BOOKING_STATUSES.SAMPLE_COLLECTED,
          BOOKING_STATUSES.PROCESSING,
        ].includes(norm)
      ) {
        counts.IN_PROGRESS += 1;
      } else if (norm === BOOKING_STATUSES.REPORT_READY) counts.REPORT_READY += 1;
      else if (norm === BOOKING_STATUSES.COMPLETED) counts.COMPLETED += 1;
    });

    return counts;
  }, [bookings]);

  // Filtered & Sorted Bookings
  const filteredBookings = useMemo(() => {
    let list = bookings.filter((b) => {
      const norm = normalizeStatus(b.status);

      // Status Tab filter
      if (statusTab === "NEW" && norm !== BOOKING_STATUSES.NEW) return false;
      if (statusTab === "ACCEPTED" && norm !== BOOKING_STATUSES.ACCEPTED) return false;
      if (
        statusTab === "IN_PROGRESS" &&
        ![
          BOOKING_STATUSES.COLLECTOR_ASSIGNED,
          BOOKING_STATUSES.SAMPLE_COLLECTED,
          BOOKING_STATUSES.PROCESSING,
        ].includes(norm)
      ) {
        return false;
      }
      if (statusTab === "REPORT_READY" && norm !== BOOKING_STATUSES.REPORT_READY) return false;
      if (statusTab === "COMPLETED" && norm !== BOOKING_STATUSES.COMPLETED) return false;

      // Collection Channel filter
      if (collectionFilter !== "ALL") {
        const isHome =
          b.collection_type === "Home Collection" ||
          b.collection === "Home Collection" ||
          b.collection === "Home";
        if (collectionFilter === "HOME" && !isHome) return false;
        if (collectionFilter === "VISIT" && isHome) return false;
      }

      // Search Query
      if (search.trim()) {
        const q = search.toLowerCase();
        const patientMatch = (b.patient_name || b.patient || "").toLowerCase().includes(q);
        const testMatch = (b.test_name || b.test || "").toLowerCase().includes(q);
        const numberMatch = (b.booking_number || "").toLowerCase().includes(q);
        const phoneMatch = (b.patient_phone || "").toLowerCase().includes(q);
        if (!patientMatch && !testMatch && !numberMatch && !phoneMatch) return false;
      }

      return true;
    });

    // Sorting
    if (sortBy === "price-desc") {
      list.sort((a, b) => (Number(b.test_price) || 0) - (Number(a.test_price) || 0));
    } else if (sortBy === "price-asc") {
      list.sort((a, b) => (Number(a.test_price) || 0) - (Number(b.test_price) || 0));
    } else if (sortBy === "oldest") {
      list.sort((a, b) => (new Date(a.created_at || 0).getTime()) - (new Date(b.created_at || 0).getTime()));
    } else {
      // Default: newest
      list.sort((a, b) => (new Date(b.created_at || 0).getTime()) - (new Date(a.created_at || 0).getTime()));
    }

    return list;
  }, [bookings, search, statusTab, collectionFilter, sortBy]);

  const totalPages = Math.ceil(filteredBookings.length / pageSize) || 1;
  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredBookings.slice(start, start + pageSize);
  }, [filteredBookings, currentPage, pageSize]);

  // Copy ID to clipboard
  const handleCopyId = (id) => {
    if (!navigator?.clipboard) return;
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success(`Copied ID ${id}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Manual Refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Bookings refreshed");
    }, 400);
  };

  // Status Action Handlers
  const handleStatusChange = async (id, nextStatus, note = "") => {
    try {
      await updateStatusMutation.mutateAsync({ id, status: nextStatus, note });
      toast.success(`Booking marked as ${STATUS_LABELS[nextStatus] || nextStatus}`);
    } catch (err) {
      toast.error(err.message || "Failed to update booking status");
    }
  };

  const handleAssignCollector = async (payload) => {
    try {
      await assignCollectorMutation.mutateAsync(payload);
      toast.success(`Collector ${payload.collector_name} assigned successfully`);
      setAssignModalBooking(null);
    } catch (err) {
      toast.error(err.message || "Failed to assign collector");
    }
  };

  const handleUploadReport = async (payload) => {
    try {
      await uploadReportMutation.mutateAsync(payload);
      toast.success("Diagnostic report uploaded and marked as Ready");
      setUploadModalBooking(null);
    } catch (err) {
      toast.error(err.message || "Failed to upload report");
    }
  };

  const openConfirm = (title, description, confirmText, variant, onConfirm) => {
    setConfirmState({
      isOpen: true,
      title,
      description,
      confirmText,
      variant,
      onConfirm: async () => {
        await onConfirm();
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Render Cohesive, Clinical Action Buttons
  const renderActionButtons = (b) => {
    const norm = normalizeStatus(b.status);

    switch (norm) {
      case BOOKING_STATUSES.NEW:
        return (
          <div className="flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={() => handleStatusChange(b.id, BOOKING_STATUSES.ACCEPTED)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#087F82] hover:bg-[#076B6E] text-white text-[12px] font-semibold transition-all shadow-xs"
            >
              <Check size={14} />
              <span>Accept</span>
            </button>
            <button
              type="button"
              onClick={() =>
                openConfirm(
                  "Reject Booking?",
                  `Are you sure you want to reject booking ${b.booking_number}? The patient will be notified.`,
                  "Reject Booking",
                  "danger",
                  () => handleStatusChange(b.id, BOOKING_STATUSES.REJECTED, "Rejected by lab")
                )
              }
              className="px-2.5 py-1.5 rounded-lg border border-red-200 text-[#EF233C] hover:bg-red-50 text-[12px] font-semibold transition-colors"
            >
              Reject
            </button>
            <button
              type="button"
              onClick={() => setDetailsBooking(b)}
              className="p-1.5 rounded-lg text-[#64748B] hover:text-[#07172E] hover:bg-neutral-100 transition-colors"
              title="View Details"
            >
              <Eye size={16} />
            </button>
          </div>
        );

      case BOOKING_STATUSES.ACCEPTED:
        return (
          <div className="flex items-center justify-end gap-1.5">
            {b.collection_type === "Home Collection" ||
            b.collection === "Home Collection" ||
            b.collection === "Home" ? (
              <button
                type="button"
                onClick={() => setAssignModalBooking(b)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-[12px] font-semibold transition-all shadow-xs"
              >
                <Truck size={13} />
                <span>Assign Collector</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  handleStatusChange(
                    b.id,
                    BOOKING_STATUSES.SAMPLE_COLLECTED,
                    "Sample collected at laboratory"
                  )
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#087F82] hover:bg-[#076B6E] text-white text-[12px] font-semibold transition-all shadow-xs"
              >
                <Check size={14} />
                <span>Sample Collected</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setDetailsBooking(b)}
              className="p-1.5 rounded-lg text-[#64748B] hover:text-[#07172E] hover:bg-neutral-100 transition-colors"
              title="View Details"
            >
              <Eye size={16} />
            </button>
          </div>
        );

      case BOOKING_STATUSES.COLLECTOR_ASSIGNED:
        return (
          <div className="flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={() =>
                handleStatusChange(
                  b.id,
                  BOOKING_STATUSES.SAMPLE_COLLECTED,
                  "Sample collected by phlebotomist"
                )
              }
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#EA580C] hover:bg-[#C2410C] text-white text-[12px] font-semibold transition-all shadow-xs"
            >
              <Check size={13} />
              <span>Mark Collected</span>
            </button>
            <button
              type="button"
              onClick={() => setAssignModalBooking(b)}
              className="px-2 py-1.5 rounded-lg text-[#64748B] hover:text-[#07172E] hover:bg-neutral-100 text-[12px] font-medium"
              title="Reassign Collector"
            >
              Reassign
            </button>
            <button
              type="button"
              onClick={() => setDetailsBooking(b)}
              className="p-1.5 rounded-lg text-[#64748B] hover:text-[#07172E] hover:bg-neutral-100 transition-colors"
              title="View Details"
            >
              <Eye size={16} />
            </button>
          </div>
        );

      case BOOKING_STATUSES.SAMPLE_COLLECTED:
        return (
          <div className="flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={() =>
                handleStatusChange(
                  b.id,
                  BOOKING_STATUSES.PROCESSING,
                  "Sample analysis initiated"
                )
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[12px] font-semibold transition-all shadow-xs"
            >
              <FlaskConical size={13} />
              <span>Start Processing</span>
            </button>
            <button
              type="button"
              onClick={() => setDetailsBooking(b)}
              className="p-1.5 rounded-lg text-[#64748B] hover:text-[#07172E] hover:bg-neutral-100 transition-colors"
              title="View Details"
            >
              <Eye size={16} />
            </button>
          </div>
        );

      case BOOKING_STATUSES.PROCESSING:
        return (
          <div className="flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={() => setUploadModalBooking(b)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#087F82] hover:bg-[#076B6E] text-white text-[12px] font-semibold transition-all shadow-xs"
            >
              <FileUp size={13} />
              <span>Upload Report</span>
            </button>
            <button
              type="button"
              onClick={() => setDetailsBooking(b)}
              className="p-1.5 rounded-lg text-[#64748B] hover:text-[#07172E] hover:bg-neutral-100 transition-colors"
              title="View Details"
            >
              <Eye size={16} />
            </button>
          </div>
        );

      case BOOKING_STATUSES.REPORT_READY:
        return (
          <div className="flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={() =>
                openConfirm(
                  "Complete Booking?",
                  `Mark booking ${b.booking_number} as Completed? This confirms report delivery to patient.`,
                  "Complete Booking",
                  "success",
                  () =>
                    handleStatusChange(
                      b.id,
                      BOOKING_STATUSES.COMPLETED,
                      "Booking finalized & report delivered"
                    )
                )
              }
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#079455] hover:bg-[#067A46] text-white text-[12px] font-semibold transition-all shadow-xs"
            >
              <CheckCircle2 size={13} />
              <span>Complete</span>
            </button>
            <button
              type="button"
              onClick={() => setUploadModalBooking(b)}
              className="px-2 py-1.5 rounded-lg text-[#64748B] hover:text-[#07172E] hover:bg-neutral-100 text-[12px] font-medium"
              title="Replace Report"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => setDetailsBooking(b)}
              className="p-1.5 rounded-lg text-[#64748B] hover:text-[#07172E] hover:bg-neutral-100 transition-colors"
              title="View Details"
            >
              <Eye size={16} />
            </button>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={() => setDetailsBooking(b)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D9DEE5] text-[#087F82] hover:bg-[#E6F4F5] hover:border-[#087F82]/30 text-[12px] font-semibold transition-colors"
            >
              <Eye size={13} />
              <span>Details</span>
            </button>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[30px] md:text-[34px] font-heading font-bold text-[#07172E] tracking-tight">
              Bookings
            </h1>
            <span className="text-[12px] font-bold text-[#087F82] bg-teal-50 border border-teal-200/80 px-2.5 py-0.5 rounded-full">
              {bookings.length} Total
            </span>
          </div>
          <p className="text-[14px] text-[#667085] mt-1 font-normal">
            Accept patient test orders, dispatch sample collectors, and deliver verified reports.
          </p>
        </div>

        {/* Quick Action Button */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#D9DEE5] text-[#07172E] text-[13px] font-semibold hover:bg-neutral-50 shadow-2xs transition-colors"
            title="Refresh Bookings"
          >
            <RefreshCw
              size={15}
              className={`text-[#667085] ${isRefreshing ? "animate-spin text-[#087F82]" : ""}`}
            />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Metric Status Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: "ALL", label: "All Orders", count: statusCounts.ALL },
          {
            id: "NEW",
            label: "New Orders",
            count: statusCounts.NEW,
            badge: "bg-blue-500",
            alert: statusCounts.NEW > 0,
          },
          {
            id: "ACCEPTED",
            label: "Accepted",
            count: statusCounts.ACCEPTED,
            badge: "bg-[#087F82]",
          },
          {
            id: "IN_PROGRESS",
            label: "In Progress",
            count: statusCounts.IN_PROGRESS,
            badge: "bg-[#7C3AED]",
          },
          {
            id: "REPORT_READY",
            label: "Report Ready",
            count: statusCounts.REPORT_READY,
            badge: "bg-emerald-500",
          },
          {
            id: "COMPLETED",
            label: "Completed",
            count: statusCounts.COMPLETED,
            badge: "bg-[#079455]",
          },
        ].map((tab) => {
          const isActive = statusTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setStatusTab(tab.id);
                setCurrentPage(1);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px] font-semibold transition-all whitespace-nowrap border ${
                isActive
                  ? "bg-[#07172E] text-white border-[#07172E] shadow-xs"
                  : "bg-white text-[#667085] border-[#D9DEE5] hover:bg-neutral-50 hover:text-[#07172E]"
              }`}
            >
              {tab.badge && (
                <span
                  className={`w-2 h-2 rounded-full ${tab.badge} ${
                    tab.alert ? "animate-ping" : ""
                  }`}
                />
              )}
              <span>{tab.label}</span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-neutral-100 text-[#07172E]"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Table Card Container */}
      <div className="bg-white rounded-[18px] border border-[#D9DEE5] shadow-[0_2px_12px_rgba(7,23,46,0.04)] overflow-hidden">
        {/* Integrated Toolbar */}
        <div className="p-4 bg-white border-b border-[#D9DEE5] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5">
          {/* Search Input */}
          <SearchInput
            value={search}
            onChange={(val) => {
              setSearch(val);
              setCurrentPage(1);
            }}
            placeholder="Search patient, phone, test or ID..."
            className="w-full md:w-80"
          />

          {/* Controls: Filter & Sort */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Collection Filter */}
            <div className="flex items-center gap-1.5 bg-neutral-50 border border-[#D9DEE5] rounded-xl px-2.5 h-[40px]">
              <span className="text-[12px] font-medium text-[#667085]">Channel:</span>
              <select
                value={collectionFilter}
                onChange={(e) => {
                  setCollectionFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-[13px] font-semibold text-[#07172E] focus:outline-none cursor-pointer pr-1"
              >
                <option value="ALL">All Channels</option>
                <option value="HOME">Home Collection</option>
                <option value="VISIT">Lab Visit</option>
              </select>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-1.5 bg-neutral-50 border border-[#D9DEE5] rounded-xl px-2.5 h-[40px]">
              <ArrowUpDown size={14} className="text-[#667085]" />
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-[13px] font-semibold text-[#07172E] focus:outline-none cursor-pointer pr-1"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="price-asc">Price: Low to High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#D9DEE5] text-[11px] font-bold text-[#64748B] uppercase tracking-wider select-none">
                <th className="py-4 px-6">Patient</th>
                <th className="py-4 px-5">Test Details</th>
                <th className="py-4 px-5">Collection Channel</th>
                <th className="py-4 px-5">Date / Slot</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-[13px]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-[#667085]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw size={24} className="animate-spin text-[#087F82]" />
                      <span className="text-[14px] font-medium">Loading bookings...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedBookings.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState
                      message="No bookings yet."
                      description={
                        search || statusTab !== "ALL" || collectionFilter !== "ALL"
                          ? "No bookings match the selected search and filter criteria."
                          : "Incoming patient bookings will appear here."
                      }
                      action={
                        search || statusTab !== "ALL" || collectionFilter !== "ALL" ? (
                          <button
                            type="button"
                            onClick={() => {
                              setSearch("");
                              setStatusTab("ALL");
                              setCollectionFilter("ALL");
                              setCurrentPage(1);
                            }}
                            className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-[#07172E] text-[12px] font-semibold transition-colors"
                          >
                            Clear Filters
                          </button>
                        ) : null
                      }
                    />
                  </td>
                </tr>
              ) : (
                paginatedBookings.map((b) => {
                  const initial = (b.patient_name || b.patient || "P")
                    .charAt(0)
                    .toUpperCase();
                  const isHome =
                    b.collection_type === "Home Collection" ||
                    b.collection === "Home Collection" ||
                    b.collection === "Home";

                  return (
                    <tr
                      key={b.id}
                      className="hover:bg-[#F8FAFC]/80 transition-colors group cursor-default"
                    >
                      {/* Patient Profile */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-[#07172E] flex items-center justify-center font-bold text-[14px] shrink-0 group-hover:border-[#087F82]/40 transition-colors shadow-2xs">
                            {initial}
                          </div>
                          <div>
                            <div className="font-bold text-[#07172E] text-[14px] tracking-tight leading-snug">
                              {b.patient_name || b.patient}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              {/* Booking Number with click to copy */}
                              <button
                                type="button"
                                onClick={() => handleCopyId(b.booking_number)}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#64748B] hover:text-[#087F82] transition-colors"
                                title="Click to copy ID"
                              >
                                <span>{b.booking_number}</span>
                                {copiedId === b.booking_number ? (
                                  <Check size={11} className="text-emerald-600" />
                                ) : (
                                  <Copy size={11} className="opacity-0 group-hover:opacity-100" />
                                )}
                              </button>
                              {b.patient_phone && (
                                <span className="text-[11px] text-[#64748B]">
                                  · {b.patient_phone}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Test Name, Category & Price */}
                      <td className="py-4 px-5">
                        <div className="font-semibold text-[#07172E] text-[13px] max-w-xs truncate leading-snug">
                          {b.test_name || b.test}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[12px] font-bold text-[#087F82]">
                            PKR {(Number(b.test_price) || 0).toLocaleString()}
                          </span>
                          {b.test_category && (
                            <span className="text-[10px] font-semibold text-[#64748B] bg-slate-100 px-2 py-0.5 rounded">
                              {b.test_category}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Collection Channel & Collector */}
                      <td className="py-4 px-5">
                        <div className="flex flex-col items-start gap-1">
                          <div
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-semibold tracking-tight border ${
                              isHome
                                ? "bg-[#E6F4F5] text-[#087F82] border-[#087F82]/20"
                                : "bg-slate-100 text-slate-700 border-slate-200"
                            }`}
                          >
                            {isHome ? (
                              <Truck size={13} className="shrink-0 text-[#087F82]" />
                            ) : (
                              <Building2 size={13} className="shrink-0 text-slate-600" />
                            )}
                            <span>{isHome ? "Home Collection" : "Lab Visit"}</span>
                          </div>

                          {/* Assigned Collector Badge */}
                          {b.collector_name && (
                            <div className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200/80 mt-0.5">
                              <User size={11} />
                              <span>{b.collector_name}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Date & Time Slot */}
                      <td className="py-4 px-5 text-[#64748B]">
                        <div className="font-semibold text-[#07172E] text-[13px] flex items-center gap-1.5">
                          <Calendar size={13} className="text-[#64748B]" />
                          <span>{b.date}</span>
                        </div>
                        <div className="text-[12px] text-[#64748B] flex items-center gap-1.5 mt-0.5">
                          <Clock size={12} className="text-[#64748B]" />
                          <span>{b.time}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5">
                        <Badge status={b.status} />
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        {renderActionButtons(b)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredBookings.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(sz) => {
            setPageSize(sz);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Booking Details Modal */}
      {detailsBooking && (
        <BookingDetailsModal
          booking={detailsBooking}
          isOpen={Boolean(detailsBooking)}
          onClose={() => setDetailsBooking(null)}
        />
      )}

      {/* Assign Collector Modal */}
      {assignModalBooking && (
        <AssignCollectorModal
          booking={assignModalBooking}
          isOpen={Boolean(assignModalBooking)}
          onClose={() => setAssignModalBooking(null)}
          onAssign={handleAssignCollector}
          isLoading={assignCollectorMutation.isPending}
        />
      )}

      {/* Upload Report Modal */}
      {uploadModalBooking && (
        <UploadReportModal
          booking={uploadModalBooking}
          isOpen={Boolean(uploadModalBooking)}
          onClose={() => setUploadModalBooking(null)}
          onUpload={handleUploadReport}
          isLoading={uploadReportMutation.isPending}
        />
      )}

      {/* Interactive Diagnostic Report Viewer Modal */}
      {reportViewerBooking && (
        <ReportViewerModal
          booking={reportViewerBooking}
          isOpen={Boolean(reportViewerBooking)}
          onClose={() => setReportViewerBooking(null)}
        />
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmState.onConfirm}
        title={confirmState.title}
        description={confirmState.description}
        confirmText={confirmState.confirmText}
        variant={confirmState.variant}
        isLoading={updateStatusMutation.isPending}
      />
    </div>
  );
}
