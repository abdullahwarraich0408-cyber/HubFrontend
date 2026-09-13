"use client";

import { useEffect, useState } from "react";
import {
  X,
  Pill,
  Printer,
  FileText,
  Loader2,
  Calendar,
  User,
  Stethoscope,
} from "lucide-react";
import { useDoctorPrescription } from "@/lib/hooks/usePartnerPortal";

function normalizeItems(prescription) {
  if (!prescription) return [];
  if (Array.isArray(prescription.items)) return prescription.items;
  return [];
}

export function DoctorPrescriptionModal({ appointment, patientName, onClose }) {
  const appointmentId = appointment?.id;
  const embedded = appointment?.prescription || null;
  const needsFetch = Boolean(appointmentId) && !embedded;
  const { data: fetched, isLoading, isError, error } = useDoctorPrescription(appointmentId, {
    enabled: needsFetch,
  });
  const [localError, setLocalError] = useState("");

  const prescription = embedded || fetched || null;
  const items = normalizeItems(prescription);
  const notes = prescription?.notes || "";
  const hasContent = items.length > 0 || Boolean(notes);

  useEffect(() => {
    if (isError) {
      setLocalError(error?.message || "Could not load prescription");
    }
  }, [isError, error]);

  if (!appointment) return null;

  const issuedAt =
    prescription?.signed_at ||
    prescription?.created_at ||
    prescription?.createdAt ||
    appointment.dateIso ||
    appointment.date;

  const formattedDate = issuedAt
    ? new Date(issuedAt).toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : appointment.date || "N/A";

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Pill size={16} className="text-teal-600" />
              Digital Prescription
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Rx #{String(prescription?.id || appointmentId || "").slice(0, 8).toUpperCase() || "—"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-white rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {needsFetch && isLoading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-slate-500">
              <Loader2 size={18} className="animate-spin" />
              Loading prescription…
            </div>
          ) : localError && !hasContent ? (
            <div className="py-10 text-center text-slate-500">
              <FileText size={28} className="mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-700">No prescription found</p>
              <p className="text-[11px] mt-1">{localError}</p>
            </div>
          ) : !hasContent ? (
            <div className="py-10 text-center text-slate-500">
              <FileText size={28} className="mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-700">No prescription issued yet</p>
              <p className="text-[11px] mt-1">Save an e-prescription during consultation to view it here.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Patient</p>
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    <User size={14} className="text-teal-600" />
                    {patientName || appointment.patient || "Patient"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Visit</p>
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Calendar size={14} className="text-teal-600" />
                    {formattedDate}
                    {appointment.time ? ` · ${appointment.time}` : ""}
                  </p>
                  <p className="text-slate-500 flex items-center gap-1">
                    <Stethoscope size={12} />
                    {appointment.type || "Consultation"}
                  </p>
                </div>
              </div>

              {appointment.reason && (
                <p className="text-slate-600">
                  <strong className="text-slate-800">Reason:</strong> {appointment.reason}
                </p>
              )}

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <Pill size={14} className="text-teal-600" />
                  Medications ({items.length})
                </h4>
                {items.length === 0 ? (
                  <p className="text-slate-500 italic">No medications listed — see notes below.</p>
                ) : (
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                    {items.map((item, idx) => {
                      const medName = item.name || item.medicine || "Medication";
                      return (
                        <div key={idx} className="p-3 bg-white space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-slate-900">
                              {idx + 1}. {medName}
                            </span>
                            {item.dose && (
                              <span className="text-[10px] font-semibold bg-teal-50 text-teal-800 px-2 py-0.5 rounded border border-teal-200">
                                {item.dose}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-slate-600">
                            {item.frequency && (
                              <span>
                                <strong>Frequency:</strong> {item.frequency}
                              </span>
                            )}
                            {item.duration && (
                              <span>
                                <strong>Duration:</strong> {item.duration}
                              </span>
                            )}
                            {item.instructions && (
                              <span className="italic text-slate-500">({item.instructions})</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {notes && (
                <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-3.5 space-y-1">
                  <p className="font-bold text-amber-900 flex items-center gap-1.5">
                    <FileText size={14} />
                    Clinical notes / advice
                  </p>
                  <p className="text-amber-950 whitespace-pre-line leading-relaxed">{notes}</p>
                </div>
              )}
            </>
          )}
        </div>

        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
          {hasContent && (
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2 text-xs font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5"
            >
              <Printer size={14} />
              Print
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
