"use client";

import { useState } from "react";
import {
  X,
  User,
  Phone,
  Mail,
  FlaskConical,
  CreditCard,
  MapPin,
  Calendar,
  Clock,
  FileText,
  Truck,
  CheckCircle2,
  AlertCircle,
  Download,
  ExternalLink,
  ShieldCheck,
  Eye,
} from "lucide-react";
import { Badge } from "@/shared/components/Badge";
import { ReportViewerModal } from "./ReportViewerModal";
import {
  BOOKING_STATUSES,
  STATUS_LABELS,
  normalizeStatus,
} from "@/lib/constants/lab";

const TIMELINE_STEPS = [
  { key: BOOKING_STATUSES.NEW, label: "Placed" },
  { key: BOOKING_STATUSES.ACCEPTED, label: "Accepted" },
  { key: BOOKING_STATUSES.COLLECTOR_ASSIGNED, label: "Dispatched" },
  { key: BOOKING_STATUSES.SAMPLE_COLLECTED, label: "Sample Collected" },
  { key: BOOKING_STATUSES.PROCESSING, label: "Processing" },
  { key: BOOKING_STATUSES.REPORT_READY, label: "Report Ready" },
  { key: BOOKING_STATUSES.COMPLETED, label: "Completed" },
];

export function BookingDetailsModal({ booking, isOpen, onClose }) {
  const [reportViewerOpen, setReportViewerOpen] = useState(false);

  if (!isOpen || !booking) return null;

  const norm = normalizeStatus(booking.status);
  const isCancelled = norm === BOOKING_STATUSES.CANCELLED;
  const isRejected = norm === BOOKING_STATUSES.REJECTED;

  const currentStep = TIMELINE_STEPS.findIndex((s) => s.key === norm);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
        <div
          className="bg-white rounded-[20px] border border-[#D9DEE5] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden my-auto animate-in zoom-in-95 duration-150"
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="px-7 py-5 border-b border-[#D9DEE5] flex items-center justify-between bg-neutral-50/60 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E6F4F5] text-[#087F82] flex items-center justify-center font-bold">
                <FlaskConical size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-[19px] font-bold text-[#07172E]">
                    {booking.patient_name || booking.patient}
                  </h2>
                  <span className="text-[12px] font-mono font-bold text-[#087F82] bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                    {booking.booking_number}
                  </span>
                </div>
                <p className="text-[12px] text-[#667085] mt-0.5">
                  {booking.test_name || booking.test} · PKR {(Number(booking.test_price) || 0).toLocaleString()}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-[#667085] hover:text-[#07172E] p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-7 overflow-y-auto space-y-6 flex-1 bg-neutral-50/30">
            {/* Status Timeline Stepper */}
            {!isCancelled && !isRejected ? (
              <div className="bg-white p-5 rounded-xl border border-[#D9DEE5]">
                <h4 className="text-[13px] font-bold text-[#07172E] mb-4">
                  Lifecycle Progress
                </h4>
                <div className="flex items-center justify-between relative">
                  {/* Connecting Line */}
                  <div className="absolute left-4 right-4 top-3.5 h-[2px] bg-neutral-200 -z-0" />
                  <div
                    className="absolute left-4 top-3.5 h-[2px] bg-[#087F82] -z-0 transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        100,
                        (currentStep / (TIMELINE_STEPS.length - 1)) * 100
                      )}%`,
                    }}
                  />

                  {TIMELINE_STEPS.map((step, idx) => {
                    const isDone = idx <= currentStep;
                    const isCurrent = idx === currentStep;

                    return (
                      <div
                        key={step.key}
                        className="flex flex-col items-center relative z-10"
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold transition-all shadow-xs ${
                            isDone
                              ? "bg-[#087F82] text-white"
                              : "bg-white text-[#667085] border-2 border-neutral-300"
                          } ${isCurrent ? "ring-4 ring-[#087F82]/20" : ""}`}
                        >
                          {isDone ? <CheckCircle2 size={15} /> : idx + 1}
                        </div>
                        <span
                          className={`text-[10px] mt-2 font-semibold text-center whitespace-nowrap hidden sm:block ${
                            isCurrent
                              ? "text-[#087F82]"
                              : isDone
                              ? "text-[#07172E]"
                              : "text-[#667085]"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-800">
                <AlertCircle size={20} className="text-[#EF233C]" />
                <div>
                  <span className="font-bold text-[14px]">
                    Booking {isCancelled ? "Cancelled" : "Rejected"}
                  </span>
                  <p className="text-[12px] text-rose-700 mt-0.5">
                    This booking has been closed and is no longer actively processing.
                  </p>
                </div>
              </div>
            )}

            {/* 2-Column Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Patient Information */}
              <div className="bg-white p-5 rounded-xl border border-[#D9DEE5] space-y-3">
                <div className="flex items-center gap-2 text-[#07172E] font-bold text-[14px] pb-2 border-b border-neutral-100">
                  <User size={16} className="text-[#087F82]" />
                  <span>Patient Information</span>
                </div>
                <div className="text-[13px] space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#667085]">Name:</span>
                    <span className="font-semibold text-[#07172E]">
                      {booking.patient_name || booking.patient}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#667085]">Phone:</span>
                    <span className="font-medium text-[#07172E]">
                      {booking.patient_phone || "Not provided"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#667085]">Email:</span>
                    <span className="font-medium text-[#07172E]">
                      {booking.patient_email || "Not provided"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#667085]">Gender / Age:</span>
                    <span className="font-medium text-[#07172E]">
                      {booking.patient_gender || "—"} / {booking.patient_age ? `${booking.patient_age} yrs` : "—"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Test Information */}
              <div className="bg-white p-5 rounded-xl border border-[#D9DEE5] space-y-3">
                <div className="flex items-center gap-2 text-[#07172E] font-bold text-[14px] pb-2 border-b border-neutral-100">
                  <FlaskConical size={16} className="text-[#087F82]" />
                  <span>Test Details</span>
                </div>
                <div className="text-[13px] space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#667085]">Test Name:</span>
                    <span className="font-semibold text-[#07172E] text-right">
                      {booking.test_name || booking.test}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#667085]">Category:</span>
                    <span className="font-medium text-[#07172E]">
                      {booking.test_category || "General"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#667085]">Price:</span>
                    <span className="font-bold text-[#087F82]">
                      PKR {(Number(booking.test_price) || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#667085]">Turnaround:</span>
                    <span className="font-medium text-[#07172E]">
                      {booking.turnaround || "24 hours"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Collection Details */}
              <div className="bg-white p-5 rounded-xl border border-[#D9DEE5] space-y-3">
                <div className="flex items-center gap-2 text-[#07172E] font-bold text-[14px] pb-2 border-b border-neutral-100">
                  <MapPin size={16} className="text-[#087F82]" />
                  <span>Collection Details</span>
                </div>
                <div className="text-[13px] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[#667085]">Method:</span>
                    <Badge status={booking.collection_type || booking.collection} type="collection" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#667085]">Date & Time:</span>
                    <span className="font-medium text-[#07172E] text-right">
                      {booking.date} · {booking.time}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#667085]">Address:</span>
                    <span className="font-medium text-[#07172E] text-right max-w-[200px] leading-snug">
                      {booking.address || "IDC Main Lab, Islamabad"}
                    </span>
                  </div>
                  {booking.collection_city && (
                    <div className="flex justify-between">
                      <span className="text-[#667085]">City:</span>
                      <span className="font-medium text-[#07172E]">
                        {booking.collection_city}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Billing & Collector Information */}
              <div className="bg-white p-5 rounded-xl border border-[#D9DEE5] space-y-3">
                <div className="flex items-center gap-2 text-[#07172E] font-bold text-[14px] pb-2 border-b border-neutral-100">
                  <CreditCard size={16} className="text-[#087F82]" />
                  <span>Billing & Collector</span>
                </div>
                <div className="text-[13px] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[#667085]">Payment Status:</span>
                    <Badge status={booking.payment_status} type="payment" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#667085]">Payment Method:</span>
                    <span className="font-medium text-[#07172E]">
                      {booking.payment_method || "Cash"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#667085]">Collector:</span>
                    <span className="font-medium text-[#07172E]">
                      {booking.collector_name ? (
                        <span className="flex items-center gap-1 text-[#087F82]">
                          <Truck size={13} />
                          {booking.collector_name}
                        </span>
                      ) : (
                        "Not Assigned"
                      )}
                    </span>
                  </div>
                  {booking.collector_phone && (
                    <div className="flex justify-between">
                      <span className="text-[#667085]">Collector Phone:</span>
                      <span className="font-medium text-[#07172E]">
                        {booking.collector_phone}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Diagnostic Report Section (if uploaded or report ready) */}
            {(booking.report_url || norm === BOOKING_STATUSES.REPORT_READY || norm === BOOKING_STATUSES.COMPLETED) && (
              <div className="bg-emerald-50/80 p-5 rounded-xl border border-emerald-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-[#07172E]">
                        {booking.report_file_name || `${booking.booking_number}_Diagnostic_Report.pdf`}
                      </h4>
                      <p className="text-[12px] text-[#667085]">
                        Verified diagnostic parameters ready for electronic view and printing.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setReportViewerOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-emerald-300 text-[12px] font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors shadow-2xs"
                    >
                      <Eye size={14} />
                      <span>View Report</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setReportViewerOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#087F82] text-white text-[12px] font-semibold hover:bg-[#076B6E] transition-colors shadow-2xs"
                    >
                      <Download size={14} />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Status Change History */}
            {booking.history && booking.history.length > 0 && (
              <div className="bg-white p-5 rounded-xl border border-[#D9DEE5]">
                <h4 className="text-[13px] font-bold text-[#07172E] mb-3">
                  Audit Status History
                </h4>
                <div className="space-y-3">
                  {booking.history.map((h, i) => (
                    <div
                      key={i}
                      className="flex items-start justify-between text-[12px] py-1.5 border-b border-neutral-100 last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        <Badge status={h.status} />
                        <span className="text-[#667085]">{h.note}</span>
                      </div>
                      <span className="text-[#667085]/80 font-mono">
                        {h.changed_at ? new Date(h.changed_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-7 py-4 border-t border-[#D9DEE5] flex items-center justify-between bg-neutral-50/60 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-[#667085]">Current Status:</span>
              <Badge status={booking.status} />
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-[13px] font-semibold text-[#07172E] bg-white border border-[#D9DEE5] hover:bg-neutral-100 rounded-lg transition-colors shadow-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Diagnostic Report Viewer Modal */}
      {reportViewerOpen && (
        <ReportViewerModal
          booking={booking}
          isOpen={reportViewerOpen}
          onClose={() => setReportViewerOpen(false)}
        />
      )}
    </>
  );
}
