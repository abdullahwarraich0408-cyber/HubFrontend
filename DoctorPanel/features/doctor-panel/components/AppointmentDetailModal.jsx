"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
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
  DollarSign,
  FolderOpen,
} from "lucide-react";
import { Badge } from "@/shared/components/Badge";
import { partnerRoutes } from "@/lib/constants/partnerRoutes";
import { doctorPortalApi } from "@/lib/api/index";
import { toast } from "sonner";

const FOLLOW_UP_PRESETS = [
  { id: "none", label: "No follow-up", days: null },
  { id: "3", label: "3 days", days: 3 },
  { id: "7", label: "7 days", days: 7 },
  { id: "14", label: "14 days", days: 14 },
  { id: "30", label: "30 days", days: 30 },
];

export function AppointmentDetailModal({ appointment, onClose, onStatusChange, onMarkPaid }) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [followUpPreset, setFollowUpPreset] = useState("none");
  const [followUpMode, setFollowUpMode] = useState("either");
  const [followUpReason, setFollowUpReason] = useState("");
  const [savingFollowUp, setSavingFollowUp] = useState(false);

  const sharedQuery = useQuery({
    queryKey: ["doctor-shared-history", appointment?.id],
    enabled: Boolean(appointment?.id),
    queryFn: () => doctorPortalApi.getAppointmentSharedHistory(appointment.id),
  });
  const sharedHistory = sharedQuery.data?.sharedHistory;

  if (!appointment) return null;

  const meetingPath = appointment.meetingId
    ? `/consultation/${appointment.meetingId}?appointment=${appointment.id}`
    : null;
  const chatPath = `${partnerRoutes.doctor.appointments}/${appointment.id}/chat`;

  const isOnline = appointment.isOnline || appointment.type === "Video Call";
  const consultationId =
    appointment.raw?.consultation?.id ||
    appointment.consultationId ||
    appointment.raw?.consultation_id ||
    null;

  const handleCompleteWithFollowUp = async () => {
    try {
      setSavingFollowUp(true);
      onStatusChange?.(appointment.id, "completed");
      const preset = FOLLOW_UP_PRESETS.find((p) => p.id === followUpPreset);
      if (preset?.days && consultationId) {
        const recommended = new Date();
        recommended.setDate(recommended.getDate() + preset.days);
        await doctorPortalApi.upsertConsultationFollowUp(consultationId, {
          recommended_date: recommended.toISOString().slice(0, 10),
          preferred_mode: followUpMode,
          reason: followUpReason || undefined,
        });
        toast.success("Visit completed with follow-up recommendation");
      } else if (preset?.days && !consultationId) {
        toast.message("Visit completed. Open consultation notes to attach follow-up if needed.");
      } else {
        toast.success("Visit completed");
      }
    } catch (err) {
      toast.error(err?.message || "Could not save follow-up");
    } finally {
      setSavingFollowUp(false);
    }
  };

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
                onClick={() => onStatusChange?.(appointment.id, "checked_in")}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md shadow-slate-900/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <UserCheck size={17} />
                <span>Check In Patient</span>
              </button>
            )}

            {appointment.status === "checked_in" && !isOnline && (
              <div className="space-y-2">
                <p className="text-[12px] text-teal-800 font-semibold text-center">
                  Patient Checked In
                  {appointment.raw?.checked_in_at
                    ? ` · ${new Date(appointment.raw.checked_in_at).toLocaleTimeString()}`
                    : ""}
                </p>
                <button
                  onClick={() => onStatusChange?.(appointment.id, "in_progress")}
                  className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
                >
                  <Play size={17} className="fill-white" />
                  <span>Start Visit</span>
                </button>
              </div>
            )}

            {appointment.status === "in_progress" && isOnline && meetingPath && (
              <Link href={meetingPath} className="w-full block">
                <button className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99]">
                  <Play size={17} className="fill-white" />
                  <span>Continue Live Consultation</span>
                </button>
              </Link>
            )}

            {appointment.status === "in_progress" && !isOnline && (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    Follow-up
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {FOLLOW_UP_PRESETS.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setFollowUpPreset(p.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${
                          followUpPreset === p.id
                            ? "bg-teal-700 text-white border-teal-700"
                            : "bg-slate-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                  {followUpPreset !== "none" ? (
                    <>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { id: "online", label: "Online" },
                          { id: "in_person", label: "In-clinic" },
                          { id: "either", label: "Either" },
                        ].map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setFollowUpMode(m.id)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${
                              followUpMode === m.id
                                ? "bg-slate-900 text-white border-slate-900"
                                : "bg-white text-slate-600 border-slate-200"
                            }`}
                          >
                            {m.label}
                          </button>
                        ))}
                      </div>
                      <input
                        value={followUpReason}
                        onChange={(e) => setFollowUpReason(e.target.value)}
                        placeholder="Reason / instructions (optional)"
                        className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2"
                      />
                    </>
                  ) : null}
                </div>
                <button
                  onClick={handleCompleteWithFollowUp}
                  disabled={savingFollowUp}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md shadow-slate-900/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-60"
                >
                  <CheckCircle2 size={17} />
                  <span>{savingFollowUp ? "Saving…" : "Complete In-Clinic Visit"}</span>
                </button>
              </div>
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

          {/* Pre-visit snapshot */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Pre-visit Snapshot
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <DetailRow icon={User} label="Patient" value={appointment.patient || "—"} />
              <DetailRow
                icon={isOnline ? Video : MapPin}
                label="Mode"
                value={isOnline ? "Online" : "In-clinic"}
              />
              <DetailRow icon={Calendar} label="When" value={`${appointment.date || "—"} · ${appointment.time || ""}`} />
              <DetailRow
                icon={CreditCard}
                label="Payment"
                value={
                  String(appointment.paymentStatus || "").toLowerCase() === "paid"
                    ? appointment.paymentMethod === "pay_at_clinic" ||
                      appointment.raw?.payment_method === "pay_at_clinic"
                      ? "Paid at Clinic"
                      : "Paid Online"
                    : String(appointment.paymentStatus || "").toLowerCase() === "pay_at_clinic"
                      ? "Pay at Clinic"
                      : appointment.paymentStatus || "Payment Pending"
                }
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {String(appointment.appointmentType || appointment.raw?.appointment_type || "new")
                  .toLowerCase()
                  .includes("follow")
                  ? "FOLLOW-UP"
                  : "NEW"}
              </span>
              <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-100">
                {sharedHistory?.share_state === "revoked"
                  ? "Sharing access revoked"
                  : sharedHistory?.grant_count
                    ? `${sharedHistory.grant_count} shared records`
                    : "No medical history shared"}
              </span>
            </div>
            <p className="text-xs text-slate-600">
              <span className="font-semibold">Reason:</span>{" "}
              {appointment.reason || "General health consultation"}
            </p>
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
                value={appointment.paymentStatus || "pending"}
              />
              <DetailRow
                icon={CreditCard}
                label="Method"
                value={appointment.paymentMethod || appointment.raw?.payment_method || "—"}
              />
            </div>
            {(String(appointment.paymentStatus || "").toLowerCase() === "pay_at_clinic" ||
              ["cod", "pay_at_clinic"].includes(
                String(appointment.paymentMethod || appointment.raw?.payment_method || "").toLowerCase(),
              )) &&
              String(appointment.paymentStatus || "").toLowerCase() !== "paid" && (
                <button
                  type="button"
                  onClick={() => onMarkPaid?.(appointment.id)}
                  className="w-full py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-amber-200"
                >
                  <DollarSign size={15} />
                  Mark Cash Paid at Clinic
                </button>
              )}
          </div>

          {/* Shared Medical History (patient-selected, read-only) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <FolderOpen size={15} className="text-teal-600" />
              <span>Shared Medical History</span>
            </h4>
            {sharedQuery.isLoading ? (
              <p className="text-[12px] text-slate-500">Loading shared records…</p>
            ) : sharedHistory?.share_state === "revoked" ? (
              <p className="text-[12px] text-amber-800 font-medium">
                Sharing access revoked — previously shared records are no longer available.
              </p>
            ) : !sharedHistory?.grant_count ? (
              <p className="text-[12px] text-slate-500">
                No medical records were shared for this appointment.
              </p>
            ) : (
              <div className="space-y-3 text-xs">
                <p className="text-[12px] font-semibold text-teal-800">
                  {sharedHistory.grant_count} shared record
                  {sharedHistory.grant_count === 1 ? "" : "s"} available
                </p>
                {(sharedHistory.visit_summaries || []).map((item) => (
                  <div key={item.record_id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <p className="font-bold text-slate-900">
                      Previous Visit{item.doctor_name ? ` · Dr. ${item.doctor_name}` : ""}
                    </p>
                    <p className="text-slate-700 mt-1">
                      Diagnosis: {item.diagnosis || "—"}
                    </p>
                    {item.summary ? (
                      <p className="text-slate-600 mt-1 leading-relaxed">{item.summary}</p>
                    ) : null}
                  </div>
                ))}
                {(sharedHistory.prescriptions || []).length > 0 && (
                  <div>
                    <p className="font-semibold text-slate-700 mb-1">Prescriptions</p>
                    <ul className="space-y-1 text-slate-600">
                      {(sharedHistory.prescriptions || []).map((item) => (
                        <li key={item.record_id}>
                          {item.doctor_name ? `Dr. ${item.doctor_name}` : "Prescription"}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {(sharedHistory.lab_reports || []).length > 0 && (
                  <div>
                    <p className="font-semibold text-slate-700 mb-1">Lab Reports</p>
                    <ul className="space-y-1 text-slate-600">
                      {(sharedHistory.lab_reports || []).map((item) => (
                        <li key={item.record_id}>
                          {item.file_url ? (
                            <a href={item.file_url} target="_blank" rel="noreferrer" className="text-teal-700 font-medium">
                              {item.title || "Lab report"}
                            </a>
                          ) : (
                            item.title || "Lab report"
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {(sharedHistory.medical_documents || []).concat(sharedHistory.visit_documents || []).length >
                  0 && (
                  <div>
                    <p className="font-semibold text-slate-700 mb-1">Documents</p>
                    <ul className="space-y-1 text-slate-600">
                      {(sharedHistory.medical_documents || [])
                        .concat(sharedHistory.visit_documents || [])
                        .map((item) => (
                          <li key={`${item.record_type}-${item.record_id}`}>
                            {item.file_url ? (
                              <a href={item.file_url} target="_blank" rel="noreferrer" className="text-teal-700 font-medium">
                                {item.title || "Document"}
                              </a>
                            ) : (
                              item.title || "Document"
                            )}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
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
          {["pending", "confirmed", "checked_in"].includes(appointment.status) ? (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-4 py-2.5 rounded-xl transition-all border border-rose-200/60"
              >
                Cancel Appointment
              </button>
              <button
                onClick={() => {
                  if (window.confirm("Mark this patient as no-show?")) {
                    onStatusChange?.(appointment.id, "no_show");
                  }
                }}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 hover:bg-amber-50 px-4 py-2.5 rounded-xl transition-all border border-amber-200/60"
              >
                Mark No-show
              </button>
            </div>
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


