"use client";

import { useMemo, useState } from "react";
import {
  X,
  Phone,
  Calendar,
  Clock,
  Activity,
  Pill,
  Shield,
  Video,
  MapPin,
  Stethoscope,
  Download,
  Loader2,
  Mail,
} from "lucide-react";
import { useDoctorPortalAppointments } from "@/lib/hooks/usePartnerPortal";
import { DoctorPrescriptionModal } from "./DoctorPrescriptionModal";

function matchesPatient(appointment, patient) {
  if (!patient) return false;
  const customerId = appointment.customerId || appointment.raw?.customer_id || appointment.raw?.customer?.id;
  if (patient.id && customerId && String(customerId) === String(patient.id)) return true;
  if (patient.phone && appointment.phone && String(patient.phone) === String(appointment.phone)) {
    return true;
  }
  if (
    patient.email &&
    appointment.patientEmail &&
    String(patient.email).toLowerCase() === String(appointment.patientEmail).toLowerCase()
  ) {
    return true;
  }
  if (
    patient.name &&
    appointment.patient &&
    String(patient.name).toLowerCase() === String(appointment.patient).toLowerCase()
  ) {
    return true;
  }
  return false;
}

function hasPrescription(appointment) {
  const rx = appointment?.prescription;
  if (!rx) return false;
  if (Array.isArray(rx.items) && rx.items.length > 0) return true;
  if (rx.notes) return true;
  if (rx.id) return true;
  return false;
}

function VisitTypeBadge({ appointment }) {
  if (appointment.isInPerson) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200">
        <MapPin size={12} /> In-Person
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-teal-50 text-teal-800 px-2.5 py-1 rounded-full border border-teal-200">
      <Video size={12} className="text-teal-600" /> {appointment.type || "Video"}
    </span>
  );
}

function PrescriptionRow({ appointment, onView }) {
  const rx = appointment.prescription;
  const issued =
    rx?.signed_at || rx?.created_at || rx?.createdAt || appointment.date || "Recent";
  const issuedLabel =
    typeof issued === "string" && issued.includes("T")
      ? new Date(issued).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : issued;

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200/60 shrink-0">
          <Pill size={20} />
        </div>
        <div className="min-w-0">
          <h5 className="font-bold text-slate-900 text-sm truncate">
            Rx · {appointment.date || "Visit"} {appointment.time ? `· ${appointment.time}` : ""}
          </h5>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {hasPrescription(appointment) ? `Issued ${issuedLabel}` : "Tap to load prescription"}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onView(appointment)}
        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 shrink-0"
      >
        <Download size={14} />
        <span>View Prescription</span>
      </button>
    </div>
  );
}

export function PatientDetailModal({ patient, onClose }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [rxTarget, setRxTarget] = useState(null);
  const { data: appointments = [], isLoading: appointmentsLoading } = useDoctorPortalAppointments({
    enabled: Boolean(patient),
  });

  const patientAppointments = useMemo(() => {
    if (!patient) return [];
    return appointments
      .filter((apt) => matchesPatient(apt, patient))
      .sort((a, b) => {
        const da = new Date(a.dateIso || a.raw?.appointment_date || 0).getTime();
        const db = new Date(b.dateIso || b.raw?.appointment_date || 0).getTime();
        return db - da;
      });
  }, [appointments, patient]);

  const prescriptionAppointments = useMemo(
    () => patientAppointments.filter((apt) => hasPrescription(apt) || apt.status === "completed"),
    [patientAppointments]
  );

  const conditionsList = useMemo(() => {
    if (!patient) return [];
    if (Array.isArray(patient.conditions) && patient.conditions.length) return patient.conditions;
    if (patient.condition) {
      return String(patient.condition)
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);
    }
    const fromReasons = [
      ...new Set(
        patientAppointments
          .map((a) => a.reason)
          .filter((r) => r && String(r).toLowerCase() !== "general")
      ),
    ];
    return fromReasons.length ? fromReasons : [];
  }, [patient, patientAppointments]);

  if (!patient) return null;

  const visitCount = patient.appointmentsCount || patientAppointments.length || 1;
  const lastVisit =
    patient.lastVisit ||
    patientAppointments[0]?.date ||
    "N/A";

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/70 backdrop-blur-md transition-all duration-300 animate-in fade-in"
        onClick={onClose}
      >
        <div
          className="bg-white h-full w-full max-w-[640px] shadow-2xl flex flex-col border-l border-slate-200/80 transform transition-all duration-300 animate-in slide-in-from-right overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 bg-[#0A0F1D] text-white border-b border-white/10 flex items-center justify-between shrink-0 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white font-extrabold text-lg flex items-center justify-center shadow-lg shadow-teal-500/20 border border-white/20 shrink-0">
                {patient.name ? patient.name.charAt(0).toUpperCase() : "P"}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight leading-tight">{patient.name}</h3>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mt-1 flex-wrap">
                  {patient.phone && <span className="font-mono text-teal-400">{patient.phone}</span>}
                  {patient.phone && <span>•</span>}
                  <span className="bg-white/10 px-2 py-0.5 rounded-full text-[10px] font-bold text-white border border-white/10">
                    {visitCount} Total Visits
                  </span>
                  <span>•</span>
                  <span>Last visit: {lastVisit}</span>
                </div>
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

          <div className="flex border-b border-slate-200/80 bg-slate-50/60 p-3 gap-2 shrink-0">
            {[
              { id: "overview", label: "Medical Overview", icon: Activity },
              { id: "consultations", label: "Consultation History", icon: Stethoscope },
              { id: "prescriptions", label: "Prescriptions", icon: Pill },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                    isActive
                      ? "bg-[#0A0F1D] text-white shadow-md shadow-slate-900/10"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/80"
                  }`}
                >
                  <Icon size={14} className={isActive ? "text-teal-400" : "text-slate-400"} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs bg-slate-50/40">
            {activeTab === "overview" && (
              <div className="space-y-5">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                  <h4 className="font-bold uppercase tracking-wider text-[10px] text-slate-400 flex items-center gap-1.5">
                    <Activity size={13} className="text-teal-600" /> KNOWN MEDICAL CONDITIONS
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {conditionsList.length > 0 ? (
                      conditionsList.map((cond, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-900 rounded-xl border border-teal-200/80 font-bold text-xs shadow-2xs flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                          {cond}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 italic">No specific medical conditions logged.</span>
                    )}
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                  <h4 className="font-bold uppercase tracking-wider text-[10px] text-slate-400 flex items-center gap-1.5">
                    <Shield size={13} className="text-teal-600" /> PATIENT RECORD SUMMARY
                  </h4>
                  <div className="divide-y divide-slate-100 border border-slate-200/70 rounded-xl bg-slate-50/50 overflow-hidden">
                    <div className="p-3.5 flex items-center justify-between">
                      <span className="text-slate-500 font-medium flex items-center gap-2">
                        <Stethoscope size={14} className="text-slate-400" />
                        <span>Total Consultations:</span>
                      </span>
                      <span className="font-bold text-slate-900 font-mono bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-md border border-teal-200">
                        {visitCount}
                      </span>
                    </div>
                    <div className="p-3.5 flex items-center justify-between">
                      <span className="text-slate-500 font-medium flex items-center gap-2">
                        <Phone size={14} className="text-slate-400" />
                        <span>Primary Contact Phone:</span>
                      </span>
                      <span className="font-bold text-slate-900 font-mono">{patient.phone || "Not provided"}</span>
                    </div>
                    {patient.email && (
                      <div className="p-3.5 flex items-center justify-between">
                        <span className="text-slate-500 font-medium flex items-center gap-2">
                          <Mail size={14} className="text-slate-400" />
                          <span>Email:</span>
                        </span>
                        <span className="font-bold text-slate-900 truncate max-w-[220px]">{patient.email}</span>
                      </div>
                    )}
                    <div className="p-3.5 flex items-center justify-between">
                      <span className="text-slate-500 font-medium flex items-center gap-2">
                        <Calendar size={14} className="text-slate-400" />
                        <span>Most Recent Visit Date:</span>
                      </span>
                      <span className="font-bold text-slate-900">{lastVisit}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "consultations" && (
              <div className="space-y-4">
                <h4 className="font-bold uppercase tracking-wider text-[10px] text-slate-400 flex items-center gap-1.5">
                  <Clock size={13} className="text-teal-600" /> CONSULTATION HISTORY TIMELINE
                </h4>
                {appointmentsLoading ? (
                  <div className="flex items-center gap-2 text-slate-500 py-8 justify-center">
                    <Loader2 size={16} className="animate-spin" /> Loading consultation history…
                  </div>
                ) : patientAppointments.length === 0 ? (
                  <div className="bg-white p-8 rounded-2xl border border-slate-200/80 text-center text-slate-500">
                    <Stethoscope size={24} className="mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-700">No consultations found</p>
                    <p className="text-[11px] mt-1">Past visits with this patient will appear here.</p>
                  </div>
                ) : (
                  <div className="relative pl-6 border-l-2 border-teal-500/30 space-y-6">
                    {patientAppointments.map((apt) => (
                      <div key={apt.id} className="relative">
                        <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-teal-600 border-2 border-white ring-4 ring-teal-100" />
                        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <span className="font-bold text-slate-900 text-sm">
                              {apt.date || "Visit"}
                              {apt.time ? ` · ${apt.time}` : ""}
                            </span>
                            <div className="flex items-center gap-2">
                              <VisitTypeBadge appointment={apt} />
                              <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                                {apt.status}
                              </span>
                            </div>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                            <strong className="text-slate-700 block mb-0.5">Primary Concern / Reason:</strong>
                            <p className="text-slate-600">{apt.reason || "Consultation"}</p>
                          </div>
                          {apt.consultationNotes ? (
                            <p className="text-slate-600 text-[11px] bg-amber-50/50 border border-amber-100 p-2.5 rounded-xl whitespace-pre-line">
                              <strong className="text-slate-800">Doctor Clinical Notes:</strong>{" "}
                              {apt.consultationNotes}
                            </p>
                          ) : (
                            <p className="text-slate-400 text-[11px] italic">No clinical notes recorded for this visit.</p>
                          )}
                          {hasPrescription(apt) && (
                            <button
                              type="button"
                              onClick={() => setRxTarget(apt)}
                              className="text-teal-700 font-bold text-[11px] hover:underline inline-flex items-center gap-1"
                            >
                              <Pill size={12} /> View prescription for this visit
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "prescriptions" && (
              <div className="space-y-4">
                <h4 className="font-bold uppercase tracking-wider text-[10px] text-slate-400 flex items-center gap-1.5">
                  <Pill size={13} className="text-teal-600" /> ISSUED DIGITAL PRESCRIPTIONS
                </h4>
                {appointmentsLoading ? (
                  <div className="flex items-center gap-2 text-slate-500 py-8 justify-center">
                    <Loader2 size={16} className="animate-spin" /> Loading prescriptions…
                  </div>
                ) : prescriptionAppointments.length === 0 ? (
                  <div className="bg-white p-8 rounded-2xl border border-slate-200/80 text-center text-slate-500">
                    <Pill size={24} className="mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-700">No prescriptions yet</p>
                    <p className="text-[11px] mt-1">
                      Prescriptions saved during consultations will show up here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {prescriptionAppointments.map((apt) => (
                      <PrescriptionRow key={apt.id} appointment={apt} onView={setRxTarget} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-slate-200/80 flex justify-end shrink-0 shadow-lg">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-[#0A0F1D] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              Close Record
            </button>
          </div>
        </div>
      </div>

      {rxTarget && (
        <DoctorPrescriptionModal
          appointment={rxTarget}
          patientName={patient.name}
          onClose={() => setRxTarget(null)}
        />
      )}
    </>
  );
}
