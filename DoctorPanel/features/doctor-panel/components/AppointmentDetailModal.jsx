"use client";

import { useState } from "react";
import Link from "next/link";
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  Video,
  MapPin,
  MessageSquare,
  Play,
  UserCheck,
  FileText,
  AlertTriangle,
  CreditCard,
  Stethoscope,
  CheckCircle2
} from "lucide-react";
import { Badge } from "@/shared/components/Badge";
import { partnerRoutes } from "@/lib/constants/partnerRoutes";

export function AppointmentDetailModal({ appointment, onClose, onStatusChange }) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  if (!appointment) return null;

  const meetingPath = appointment.meetingId
    ? `/consultation/${appointment.meetingId}?appointment=${appointment.id}`
    : null;
  const chatPath = `${partnerRoutes.doctor.appointments}/${appointment.id}/chat`;

  const isOnline = appointment.isOnline || appointment.type === "Video Call";

  const handleConfirmCancel = () => {
    onStatusChange?.(appointment.id, "cancelled");
    setShowCancelConfirm(false);
    onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200"
      onClick={onClose}
    >
      {/* Side Drawer Panel */}
      <div
        className="bg-white h-full w-full max-w-lg shadow-2xl flex flex-col border-l border-slate-200/80 animate-in slide-in-from-right duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-sm border border-teal-200/60">
              {appointment.patient.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 leading-tight">{appointment.patient}</h3>
                <Badge status={appointment.status} />
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                ID: {appointment.id} • {appointment.time}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
            title="Close Drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 divide-y divide-slate-100">
          {/* Main Action Bar */}
          <div className="pb-4">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Next Step</p>

            {appointment.status === "pending" && (
              <button
                onClick={() => onStatusChange?.(appointment.id, "confirmed")}
                className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={16} />
                <span>Confirm Appointment</span>
              </button>
            )}

            {appointment.status === "confirmed" && isOnline && meetingPath && (
              <Link href={meetingPath} className="w-full block">
                <button className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center justify-center gap-2">
                  <Play size={16} className="fill-white" />
                  <span>Start Video Consultation</span>
                </button>
              </Link>
            )}

            {appointment.status === "confirmed" && !isOnline && (
              <button
                onClick={() => onStatusChange?.(appointment.id, "in_progress")}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center justify-center gap-2"
              >
                <UserCheck size={16} />
                <span>Check In Patient</span>
              </button>
            )}

            {appointment.status === "in_progress" && (
              <Link href={meetingPath || partnerRoutes.doctor.appointments} className="w-full block">
                <button className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center justify-center gap-2">
                  <Play size={16} className="fill-white" />
                  <span>Continue Consultation</span>
                </button>
              </Link>
            )}

            {appointment.status === "completed" && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200/80 text-xs flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span className="font-semibold">Consultation finished. Record stored in patient history.</span>
              </div>
            )}
          </div>

          {/* Section: Appointment */}
          <div className="pt-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-slate-400">
              Appointment Details
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <DetailRow icon={Calendar} label="Date" value={appointment.date || "Today"} />
              <DetailRow icon={Clock} label="Time" value={appointment.time || "Not provided"} />
              <DetailRow
                icon={isOnline ? Video : MapPin}
                label="Consultation"
                value={isOnline ? "Video Consultation" : "In Clinic Visit"}
              />
              <DetailRow icon={Stethoscope} label="Status" value={appointment.status || "Not provided"} />
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 text-xs">
              <span className="font-semibold text-slate-700 block mb-0.5">Visit Reason:</span>
              <p className="text-slate-600 leading-relaxed">{appointment.reason || "Not provided"}</p>
            </div>
          </div>

          {/* Section: Patient Details */}
          <div className="pt-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-slate-400">
              Patient Details
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <DetailRow icon={User} label="Full Name" value={appointment.patient || "Not provided"} />
              <DetailRow icon={Phone} label="Phone" value={appointment.phone || "Not provided"} />
            </div>
            {isOnline && ["confirmed", "in_progress", "completed"].includes(appointment.status) && (
              <Link href={chatPath} className="block pt-1">
                <button className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 border border-slate-200">
                  <MessageSquare size={14} className="text-slate-600" />
                  <span>Chat with {appointment.patient}</span>
                </button>
              </Link>
            )}
          </div>

          {/* Section: Payment */}
          <div className="pt-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-slate-400">
              Payment Information
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <DetailRow
                icon={CreditCard}
                label="Payment Status"
                value={appointment.paymentStatus || "Paid"}
              />
              <DetailRow
                icon={CreditCard}
                label="Method"
                value={appointment.paymentMethod || "Online Payment"}
              />
            </div>
          </div>

          {/* Section: Clinical Record */}
          <div className="pt-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-slate-400">
              Clinical Record
            </h4>
            <div className="space-y-2 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                <span className="font-semibold text-slate-700 block mb-1">Doctor Notes:</span>
                <p className="text-slate-600 italic">
                  {appointment.notes || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200/80 bg-slate-50/80 shrink-0 flex items-center justify-between gap-3">
          {["pending", "confirmed"].includes(appointment.status) ? (
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-2 rounded-lg transition-colors"
            >
              Cancel Appointment
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Close Panel
          </button>
        </div>

        {/* Cancellation Dialog Overlay */}
        {showCancelConfirm && (
          <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-2xl space-y-4 border border-slate-200">
              <div className="flex items-center gap-3 text-rose-600">
                <AlertTriangle size={24} />
                <h4 className="font-bold text-base text-slate-900">Cancel Appointment?</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to cancel the appointment with <strong>{appointment.patient}</strong>? This action will notify the patient.
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                >
                  Keep Appointment
                </button>
                <button
                  onClick={handleConfirmCancel}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs"
                >
                  Yes, Cancel Visit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2">
      <Icon size={14} className="text-slate-400 mt-0.5 shrink-0" />
      <div>
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">{label}</span>
        <span className="font-medium text-slate-800">{value}</span>
      </div>
    </div>
  );
}

