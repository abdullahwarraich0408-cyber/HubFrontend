"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Printer,
  Pill,
  CalendarBlank,
  User,
  Stethoscope,
  Buildings,
  CheckCircle,
  FileText,
  ShoppingCart,
  MagnifyingGlass,
  Flask,
} from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";
import { formatDoctorDisplayName } from "@/lib/hooks/useTelehealth";
import { usePrescriptionModal } from "@/features/prescription/context/PrescriptionModalContext";

export function createVirtualRxFile(appointment) {
  if (!appointment) return null;
  const rx = appointment.prescription || {};
  const doctorName = (appointment.doctorName || "Doctor").replace(/^Dr\.\s*/i, "");
  const items = Array.isArray(rx.items) ? rx.items : [];
  const labOrders = appointment.labOrders || appointment.lab_orders || appointment.raw?.lab_orders || rx.labOrders || [];

  const textContent = `=====================================================
            MEDZOOS DIGITAL PRESCRIPTION
=====================================================
Doctor: Dr. ${doctorName}
Specialty: ${appointment.specialty || "General Physician"}
Hospital/Clinic: ${appointment.hospital || "MedZoos Telehealth"}

PATIENT DETAILS:
Patient Name: ${appointment.patient || "Patient"}
Appointment Date: ${appointment.date || new Date().toLocaleDateString()}
Slot: ${appointment.slot || "Online"}
Reason for Visit: ${appointment.reason || "Consultation"}

PRESCRIBED MEDICATIONS:
-----------------------------------------------------
${
  items.length > 0
    ? items
        .map(
          (it, idx) =>
            `${idx + 1}. ${it.name || it.medicine || "Medication"}
   Dosage: ${it.dose || "Standard Dose"}
   Frequency: ${it.frequency || "1-0-1"}
   Duration: ${it.duration || "5 days"}
   Instructions: ${it.instructions || "Take after meals"}`
        )
        .join("\n\n")
    : "Refer to doctor advice below."
}

${
  labOrders.length > 0
    ? `PRESCRIBED LAB TESTS:
-----------------------------------------------------
` +
      labOrders
        .map(
          (lab, idx) =>
            `${idx + 1}. ${lab.lab_test?.name || lab.name || "Lab Test"} (${
              lab.lab_test?.category || lab.category || "Diagnostic"
            })`
        )
        .join("\n") +
      "\n"
    : ""
}
DOCTOR ADVICE & INSTRUCTIONS:
-----------------------------------------------------
${rx.notes || "None"}

-----------------------------------------------------
Digitally Signed & Issued via MedZoos Telehealth Platform
Prescription ID: ${rx.id || appointment.id}
Date Signed: ${rx.signed_at || rx.created_at || appointment.dateIso || new Date().toISOString()}
=====================================================`;

  const blob = new Blob([textContent], { type: "application/pdf" });
  const cleanName = doctorName.replace(/[^a-zA-Z0-9]/g, "_");
  return new File([blob], `Prescription_Dr_${cleanName}.pdf`, {
    type: "application/pdf",
    lastModified: Date.now(),
  });
}

export function ViewPrescriptionModal({ appointment, onClose }) {
  const printRef = useRef(null);
  const { openPrescriptionModal } = usePrescriptionModal();

  if (!appointment) return null;

  const rx = appointment.prescription || {};
  const items = Array.isArray(rx.items) ? rx.items : [];
  const labOrders = appointment.labOrders || appointment.lab_orders || appointment.raw?.lab_orders || rx.labOrders || [];

  if (items.length === 0 && labOrders.length === 0 && !rx.notes) return null;

  const doctorName = formatDoctorDisplayName(appointment.doctorName);
  const rxDate = rx.signed_at || rx.created_at || appointment.dateIso || appointment.date;
  const formattedDate = rxDate
    ? new Date(rxDate).toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : appointment.date || "N/A";

  const handlePrint = () => {
    window.print();
  };

  const handleOrderPrescription = () => {
    const rxFile = createVirtualRxFile(appointment);
    onClose?.();
    openPrescriptionModal(rxFile);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
        {/* Printable Rx Card Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Printable Area Target */}
          <div ref={printRef} className="print-rx-content p-6 sm:p-8 space-y-6">
            {/* Header: Branding + Verified Badge */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black tracking-tight text-[#073B4C]">
                    MED<span className="text-[#0B6E99]">ZOOS</span>
                  </span>
                  <span className="bg-[#E8F4F8] text-[#0B6E99] text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wide border border-[#0B6E99]/20">
                    Official Rx
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Digital Telehealth Medical Prescription
                </p>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <CheckCircle size={14} weight="fill" /> Verified & Signed
                </span>
                <p className="text-[11px] text-slate-400 font-mono mt-1">
                  Rx ID: {rx.id ? rx.id.slice(0, 8).toUpperCase() : "RX-ONLINE"}
                </p>
              </div>
            </div>

            {/* Meta Row: Doctor Info & Patient Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs">
              <div className="space-y-1.5">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Stethoscope size={16} className="text-[#0B6E99]" />
                  {doctorName}
                </div>
                {appointment.specialty && (
                  <p className="text-slate-600 font-medium">{appointment.specialty}</p>
                )}
                {appointment.hospital && (
                  <p className="text-slate-500 flex items-center gap-1">
                    <Buildings size={13} /> {appointment.hospital}
                  </p>
                )}
              </div>

              <div className="space-y-1.5 sm:border-l sm:border-slate-200 sm:pl-4">
                <p className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  Patient Information
                </p>
                <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <User size={16} className="text-[#0B6E99]" />
                  {appointment.patient || "Patient"}
                </p>
                <p className="text-slate-600 flex items-center gap-1">
                  <CalendarBlank size={13} /> Date: {formattedDate}
                </p>
                {appointment.reason && (
                  <p className="text-slate-500 italic">
                    Reason: {appointment.reason}
                  </p>
                )}
              </div>
            </div>

            {/* Prescribed Medicines Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
                <Pill size={18} className="text-[#0B6E99]" />
                <span>Prescribed Medications ({items.length})</span>
              </div>

              {items.length === 0 ? (
                <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-lg">
                  No specific medications listed. Refer to doctor's notes below.
                </p>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
                  {items.map((item, idx) => {
                    const medName = item.name || item.medicine || "Medication";
                    return (
                      <div key={idx} className="p-3 bg-white hover:bg-slate-50/50 space-y-1">
                        <div className="flex items-center justify-between font-bold text-slate-900 text-sm">
                          <span className="flex items-center gap-2">
                            <span>{idx + 1}. {medName}</span>
                            <Link
                              href={`/medicines?q=${encodeURIComponent(medName)}`}
                              onClick={onClose}
                              className="no-print inline-flex items-center gap-1 text-[11px] font-medium text-[#0B6E99] hover:underline bg-[#E8F4F8] px-2 py-0.5 rounded"
                              title="Search this medicine in store"
                            >
                              <MagnifyingGlass size={12} /> Search Store
                            </Link>
                          </span>
                          {item.dose && (
                            <span className="text-xs bg-[#E8F4F8] text-[#0B6E99] px-2 py-0.5 rounded font-semibold">
                              {item.dose}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-600 text-xs pt-0.5">
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
                            <span className="text-slate-500 font-medium italic">
                              ({item.instructions})
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Prescribed Lab Tests Section */}
            {labOrders.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
                  <Flask size={18} className="text-[#0B6E99]" />
                  <span>Prescribed Lab Tests ({labOrders.length})</span>
                </div>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
                  {labOrders.map((lab, idx) => {
                    const labName = lab.lab_test?.name || lab.name || "Lab Test";
                    const labCat = lab.lab_test?.category || lab.category || "Diagnostic Test";
                    const price = lab.lab_test?.price || lab.price;
                    return (
                      <div key={idx} className="p-3 bg-white flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{idx + 1}. {labName}</p>
                          <p className="text-slate-500 text-xs">{labCat}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          {price && (
                            <span className="font-extrabold text-[#0B6E99] text-xs">PKR {price}</span>
                          )}
                          <Link
                            href={`/lab-tests?search=${encodeURIComponent(labName)}`}
                            onClick={onClose}
                            className="no-print inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-lg border border-teal-200"
                          >
                            Book Test ➔
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Doctor Notes & Clinical Advice */}
            {rx.notes && (
              <div className="space-y-1.5 bg-amber-50/60 p-4 rounded-xl border border-amber-200/70 text-xs">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <FileText size={15} className="text-amber-700" />
                  Doctor Advice & Instructions
                </div>
                <p className="text-amber-950 whitespace-pre-line leading-relaxed font-medium">
                  {rx.notes}
                </p>
              </div>
            )}

            {/* Footer Signature */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
              <div>
                <p className="font-medium text-slate-600">MedZoos Digital Telehealth Services</p>
                <p>This is an electronically generated medical prescription.</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-700">{doctorName}</p>
                <p className="text-slate-400 font-mono">Electronically Signed</p>
              </div>
            </div>
          </div>

          {/* Modal Action Buttons (Hidden when printing) */}
          <div className="no-print bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <Button
                  onClick={handleOrderPrescription}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <ShoppingCart size={16} className="mr-2" />
                  Order Prescribed Medicines
                </Button>
              )}
              {labOrders.length > 0 && (
                <Link
                  href={`/lab-tests?search=${encodeURIComponent(labOrders[0]?.lab_test?.name || labOrders[0]?.name || "")}`}
                  onClick={onClose}
                  className="inline-flex items-center justify-center font-bold text-xs bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-lg shadow-sm transition-colors"
                >
                  <Flask size={16} className="mr-2" />
                  Book Prescribed Lab Tests
                </Link>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={onClose}>
                Close
              </Button>
              <Button onClick={handlePrint}>
                <Printer size={16} className="mr-2" />
                Print / Save PDF
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Global Print Stylesheet overlay for Rx sheet printing */}
        <style jsx global>{`
          @media print {
            body * {
              visibility: hidden !important;
            }
            .print-rx-content,
            .print-rx-content * {
              visibility: visible !important;
            }
            .print-rx-content {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              padding: 20px !important;
              box-shadow: none !important;
              border: none !important;
            }
            .no-print {
              display: none !important;
            }
          }
        `}</style>
      </div>
    </AnimatePresence>
  );
}
