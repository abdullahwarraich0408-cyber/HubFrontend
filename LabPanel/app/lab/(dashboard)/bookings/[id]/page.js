"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, FlaskConical, MapPin, CreditCard, FileText, Download, ExternalLink, Truck, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/shared/components/Badge";
import { useLabBookingById } from "@/lib/hooks/usePartnerPortal";
import { partnerRoutes } from "@/lib/constants/partnerRoutes";
import { BOOKING_STATUSES, normalizeStatus } from "@/lib/constants/lab";

export default function LabBookingDetailsPage({ params }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const { data: booking, isLoading } = useLabBookingById(unwrappedParams.id);

  if (isLoading) {
    return (
      <div className="py-12 text-center text-[#667085]">
        Loading booking details...
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="py-12 text-center space-y-4">
        <p className="text-[15px] font-semibold text-[#07172E]">
          Booking not found or has been removed.
        </p>
        <Link
          href={partnerRoutes.lab.bookings}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#087F82] text-white rounded-lg text-[13px] font-semibold"
        >
          <ArrowLeft size={16} />
          <span>Back to Bookings</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#667085] hover:text-[#07172E] transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Bookings</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#667085]">Status:</span>
          <Badge status={booking.status} />
        </div>
      </div>

      <div className="bg-white rounded-[20px] border border-[#D9DEE5] shadow-sm p-7 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#D9DEE5]">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[22px] font-bold text-[#07172E]">
                {booking.patient_name || booking.patient}
              </h1>
              <span className="text-[12px] font-mono font-bold text-[#087F82] bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
                {booking.booking_number}
              </span>
            </div>
            <p className="text-[13px] text-[#667085] mt-1">
              Test: <strong className="text-[#07172E] font-semibold">{booking.test_name || booking.test}</strong> · {booking.collection_type || booking.collection}
            </p>
          </div>
        </div>

        {/* 2-Column Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Patient Details */}
          <div className="p-4 bg-neutral-50/60 rounded-xl border border-neutral-200/80 space-y-2.5 text-[13px]">
            <div className="font-bold text-[#07172E] flex items-center gap-2 mb-2 pb-1 border-b border-neutral-200/60">
              <User size={15} className="text-[#087F82]" />
              <span>Patient Profile</span>
            </div>
            <div className="flex justify-between"><span className="text-[#667085]">Name:</span><span className="font-medium text-[#07172E]">{booking.patient_name || booking.patient}</span></div>
            <div className="flex justify-between"><span className="text-[#667085]">Phone:</span><span className="font-medium text-[#07172E]">{booking.patient_phone || "Not provided"}</span></div>
            <div className="flex justify-between"><span className="text-[#667085]">Email:</span><span className="font-medium text-[#07172E]">{booking.patient_email || "Not provided"}</span></div>
            <div className="flex justify-between"><span className="text-[#667085]">Gender / Age:</span><span className="font-medium text-[#07172E]">{booking.patient_gender || "—"} / {booking.patient_age ? `${booking.patient_age} yrs` : "—"}</span></div>
          </div>

          {/* Test & Collection */}
          <div className="p-4 bg-neutral-50/60 rounded-xl border border-neutral-200/80 space-y-2.5 text-[13px]">
            <div className="font-bold text-[#07172E] flex items-center gap-2 mb-2 pb-1 border-b border-neutral-200/60">
              <FlaskConical size={15} className="text-[#087F82]" />
              <span>Test & Collection Info</span>
            </div>
            <div className="flex justify-between"><span className="text-[#667085]">Test Name:</span><span className="font-semibold text-[#07172E]">{booking.test_name || booking.test}</span></div>
            <div className="flex justify-between"><span className="text-[#667085]">Price:</span><span className="font-bold text-[#087F82]">PKR {(Number(booking.test_price) || 0).toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-[#667085]">Slot:</span><span className="font-medium text-[#07172E]">{booking.date} ({booking.time})</span></div>
            <div className="flex justify-between"><span className="text-[#667085]">Address:</span><span className="font-medium text-[#07172E] max-w-[200px] text-right">{booking.address || "Main Lab"}</span></div>
          </div>
        </div>

        {/* Diagnostic Report Section */}
        {booking.report_url && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-[14px] font-bold text-[#07172E]">
                  {booking.report_file_name || "Diagnostic_Report.pdf"}
                </p>
                <p className="text-[12px] text-[#667085]">
                  Diagnostic report verified and available for download.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={booking.report_url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-white border border-emerald-300 rounded-lg text-emerald-800 text-[12px] font-semibold hover:bg-emerald-100 flex items-center gap-1.5"
              >
                <ExternalLink size={14} />
                <span>View</span>
              </a>
              <a
                href={booking.report_url}
                download
                className="px-4 py-2 bg-[#087F82] text-white rounded-lg text-[12px] font-semibold hover:bg-[#076B6E] flex items-center gap-1.5"
              >
                <Download size={14} />
                <span>Download</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
