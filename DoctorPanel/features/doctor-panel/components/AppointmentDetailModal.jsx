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
  CheckCircle2,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  DollarSign
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
      className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/70 backdrop-blur-md transition-all duration-300 animate-in fade-in"
      onClick={onClose}
    >
      {/* Side Drawer Panel */}
      <div
        className="bg-white h-full w-full max-w-xl shadow-2xl flex flex-col border-l border-slate-200/80 transform transition-all duration-300 animate-in slide-in-from-right overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-[#0A0F1D] text-white border-b border-white/10 flex items-center justify-between shrink-0 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white font-extrabold text-lg flex items-center justify-center shadow-lg shadow-teal-500/20 border border-white/20 shrink-0">
              {appointment.patient ? appointment.patient.charAt(0).toUpperCase() : "P"}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-lg font-bold tracking-tight text-white">{appointment.patient}</h3>
                <Badge status={appointment.status} />
              </div>
              <p className="text-xs text-slate-400 font-mono mt-1 flex items-center gap-2">
                <span>ID: {appointment.id}</span>
                <span>•</span>
                <span className="text-teal-400 font-sans font-medium flex items-center gap-1">
                  <Clock size={12} /> {appointment.time || "Scheduled"}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all relative z-10"
            title="Close Drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/40">
          {/* Main Action Bar */}
          <div className="bg-gradient-to-br from-teal-900/5 via-slate-900/5 to-emerald-900/5 p-4 rounded-2xl border border-teal-500/20 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono font-bold text-teal-800 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles size={13} className="text-teal-600" /> RECOMMENDED NEXT ACTION
              </span>
              {isOnline && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                  Virtual Visit
                </span>
              )}
            </div>

            {appointment.status === "pending" && (
              <button
                onClick={() => onStatusChange?.(appointment.id, "confirmed")}
                className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <CheckCircle2 size={17} />
                <span>Confirm Appointment Slot</span>
              </button>
            )}

            {appointment.status === "confirmed" && isOnline && meetingPath && (
              <Link href={meetingPath} className="w-full block">
                <button className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99]">
                  <Play size={17} className="fill-white" />
                  <span>Start Video Consultation Room</span>
                </button>
              </Link>
            )}

            {appointment.status === "confirmed" && !isOnline && (
              <button
                onClick={() => onStatusChange?.(appointment.id, "in_progress")}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md shadow-slate-900/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <UserCheck size={17} />
                <span>Check In In-Clinic Patient</span>
              </button>
            )}

            {appointment.status === "in_progress" && (
              <Link href={meetingPath || partnerRoutes.doctor.appointments} className="w-full block">
                <button className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99]">
                  <Play size={17} className="fill-white" />
                  <span>Continue Live Consultation</span>
                </button>
              </Link>
            )}

            {appointment.status === "completed" && (
              <div className="p-3.5 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200 text-xs flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <span className="font-bold block">Consultation Completed</span>
                  <span className="text-[11px] text-emerald-700">All session records and prescription data have been stored.</span>
                </div>
              </div>
            )}
          </div>

          {/* Section 1: Appointment Details */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Calendar size={15} className="text-teal-600" />
              <span>Appointment Information</span>
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <DetailRow icon={Calendar} label="Scheduled Date" value={appointment.date || "Today"} />
              <DetailRow icon={Clock} label="Time Slot" value={appointment.time || "Not provided"} />
              <DetailRow
                icon={isOnline ? Video : MapPin}
                label="Visit Type"
                value={isOnline ? "Video Consultation" : "In Clinic Visit"}
              />
              <DetailRow icon={Stethoscope} label="Status" value={appointment.status?.toUpperCase() || "PENDING"} />
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs">
              <span className="font-semibold text-slate-700 block mb-1">Reason for Visit:</span>
              <p className="text-slate-600 leading-relaxed font-normal">{appointment.reason || "General health consultation"}</p>
            </div>
          </div>

          {/* Section 2: Patient Info & Communication */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <User size={15} className="text-teal-600" />
              <span>Patient Profile</span>
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <DetailRow icon={User} label="Full Name" value={appointment.patient || "Not provided"} />
              <DetailRow icon={Phone} label="Phone Number" value={appointment.phone || "Not provided"} />
            </div>
            {isOnline && ["confirmed", "in_progress", "completed"].includes(appointment.status) && (
              <Link href={chatPath} className="block pt-1">
                <button className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-200 hover:border-slate-300">
                  <MessageSquare size={15} className="text-teal-600" />
                  <span>Open Direct Patient Chat</span>
                  <ChevronRight size={14} className="text-slate-400" />
                </button>
              </Link>
            )}
          </div>

          {/* Section 3: Payment Details */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <CreditCard size={15} className="text-teal-600" />
              <span>Payment Details</span>
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <DetailRow
                icon={ShieldCheck}
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

          {/* Section 4: Clinical Record */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <FileText size={15} className="text-teal-600" />
              <span>Clinical Record & Notes</span>
            </h4>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs">
              <span className="font-semibold text-slate-700 block mb-1">Doctor Notes:</span>
              <p className="text-slate-600 italic leading-relaxed">
                {appointment.notes || "No clinical notes documented yet."}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-slate-200/80 shrink-0 flex items-center justify-between gap-3 shadow-lg">
          {["pending", "confirmed"].includes(appointment.status) ? (
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-4 py-2.5 rounded-xl transition-all border border-rose-200/60"
            >
              Cancel Appointment
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#0A0F1D] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            Close Panel
          </button>
        </div>

        {/* Cancellation Dialog Overlay */}
        {showCancelConfirm && (
          <div className="fixed inset-0 z-60 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-5 border border-slate-200 animate-in zoom-in-95">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900 leading-tight">Cancel Appointment?</h4>
                  <span className="text-[11px] text-slate-400">Action cannot be undone</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                Are you sure you want to cancel the appointment with <strong className="text-slate-900">{appointment.patient}</strong>? The patient will be notified automatically.
              </p>
              <div className="flex items-center justify-end gap-2.5 pt-1">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
                >
                  Keep Visit
                </button>
                <button
                  onClick={handleConfirmCancel}
                  className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-rose-600/20"
                >
                  Yes, Cancel
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
    <div className="flex items-start gap-2.5">
      <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={14} />
      </div>
      <div>
        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">{label}</span>
        <span className="font-bold text-slate-900">{value}</span>
      </div>
    </div>
  );
}


