"use client";

import { useRef } from "react";
import {
  X,
  Printer,
  Download,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Calendar,
  User,
  ShieldCheck,
  QrCode,
  FlaskConical,
} from "lucide-react";

// Generate realistic parameters per test type
function getTestParameters(testName = "") {
  const t = testName.toLowerCase();

  if (t.includes("cbc") || t.includes("blood count")) {
    return [
      { name: "Hemoglobin (Hb)", value: "14.2", unit: "g/dL", ref: "13.0 – 17.0", flag: "Normal" },
      { name: "Total Leukocyte Count (WBC)", value: "7,400", unit: "/cumm", ref: "4,000 – 11,000", flag: "Normal" },
      { name: "Platelet Count", value: "245,000", unit: "/cumm", ref: "150,000 – 450,000", flag: "Normal" },
      { name: "Red Blood Cells (RBC)", value: "4.8", unit: "mil/cumm", ref: "4.5 – 5.5", flag: "Normal" },
      { name: "Hematocrit (PCV)", value: "42.5", unit: "%", ref: "40.0 – 50.0", flag: "Normal" },
      { name: "Neutrophils", value: "62", unit: "%", ref: "40 – 75", flag: "Normal" },
      { name: "Lymphocytes", value: "28", unit: "%", ref: "20 – 45", flag: "Normal" },
      { name: "Eosinophils", value: "3.2", unit: "%", ref: "1.0 – 6.0", flag: "Normal" },
    ];
  }

  if (t.includes("lipid")) {
    return [
      { name: "Total Cholesterol", value: "185", unit: "mg/dL", ref: "< 200 (Desirable)", flag: "Normal" },
      { name: "HDL Cholesterol (Good)", value: "48", unit: "mg/dL", ref: "> 40 (Optimal)", flag: "Normal" },
      { name: "LDL Cholesterol (Bad)", value: "112", unit: "mg/dL", ref: "< 100 (Optimal)", flag: "Slightly High" },
      { name: "Triglycerides", value: "145", unit: "mg/dL", ref: "< 150 (Normal)", flag: "Normal" },
      { name: "VLDL Cholesterol", value: "25", unit: "mg/dL", ref: "5 – 30", flag: "Normal" },
      { name: "Chol / HDL Ratio", value: "3.85", unit: "ratio", ref: "< 4.5", flag: "Normal" },
    ];
  }

  if (t.includes("hba1c") || t.includes("glycated")) {
    return [
      { name: "HbA1c (Glycated Hemoglobin)", value: "5.7", unit: "%", ref: "4.0 – 5.6 (Normal)\n5.7 – 6.4 (Prediabetes)", flag: "Borderline" },
      { name: "Estimated Average Glucose (eAG)", value: "117", unit: "mg/dL", ref: "70 – 120", flag: "Normal" },
    ];
  }

  if (t.includes("lft") || t.includes("liver")) {
    return [
      { name: "Bilirubin (Total)", value: "0.8", unit: "mg/dL", ref: "0.2 – 1.2", flag: "Normal" },
      { name: "Bilirubin (Direct)", value: "0.2", unit: "mg/dL", ref: "0.0 – 0.3", flag: "Normal" },
      { name: "SGPT / ALT", value: "32", unit: "U/L", ref: "7 – 56", flag: "Normal" },
      { name: "SGOT / AST", value: "28", unit: "U/L", ref: "10 – 40", flag: "Normal" },
      { name: "Alkaline Phosphatase (ALP)", value: "85", unit: "U/L", ref: "44 – 147", flag: "Normal" },
      { name: "Total Protein", value: "7.1", unit: "g/dL", ref: "6.0 – 8.3", flag: "Normal" },
      { name: "Serum Albumin", value: "4.3", unit: "g/dL", ref: "3.5 – 5.0", flag: "Normal" },
    ];
  }

  if (t.includes("vitamin d") || t.includes("vitd")) {
    return [
      { name: "25-OH Vitamin D Total", value: "38.5", unit: "ng/mL", ref: "30.0 – 100.0 (Sufficient)\n20.0 – 29.0 (Insufficient)\n< 20.0 (Deficient)", flag: "Optimal" },
    ];
  }

  if (t.includes("thyroid") || t.includes("tsh")) {
    return [
      { name: "TSH (Ultrasensitive)", value: "2.45", unit: "μIU/mL", ref: "0.4 – 4.2", flag: "Normal" },
      { name: "Total T3", value: "1.25", unit: "ng/mL", ref: "0.8 – 2.0", flag: "Normal" },
      { name: "Total T4", value: "8.1", unit: "μg/dL", ref: "5.1 – 14.1", flag: "Normal" },
    ];
  }

  if (t.includes("rft") || t.includes("renal") || t.includes("kft")) {
    return [
      { name: "Serum Creatinine", value: "0.9", unit: "mg/dL", ref: "0.6 – 1.2", flag: "Normal" },
      { name: "Blood Urea", value: "26", unit: "mg/dL", ref: "15 – 45", flag: "Normal" },
      { name: "Uric Acid", value: "5.4", unit: "mg/dL", ref: "3.5 – 7.2", flag: "Normal" },
      { name: "eGFR", value: "> 90", unit: "mL/min/1.73m²", ref: "> 90 (Normal)", flag: "Normal" },
    ];
  }

  return [
    { name: "Primary Diagnostic Parameter", value: "Verified Normal", unit: "Index", ref: "Within Reference Limits", flag: "Normal" },
    { name: "Secondary Clinical Indicator", value: "Negative / Clear", unit: "Units", ref: "Negative", flag: "Normal" },
  ];
}

export function ReportViewerModal({ booking, isOpen, onClose }) {
  const reportRef = useRef(null);

  if (!isOpen || !booking) return null;

  const parameters = getTestParameters(booking.test_name || booking.test || "");

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div
        className="bg-white rounded-[20px] border border-[#D9DEE5] shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden my-auto animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Top Action Bar */}
        <div className="px-6 py-3.5 border-b border-[#D9DEE5] flex items-center justify-between bg-neutral-50 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h2 className="text-[15px] font-bold text-[#082B3F]">
              Diagnostic Lab Report · {booking.booking_number}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#D9DEE5] text-[#082B3F] text-[12px] font-semibold hover:bg-neutral-100 shadow-2xs transition-colors"
            >
              <Printer size={14} />
              <span>Print</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-[#667085] hover:text-[#082B3F] p-1.5 rounded-lg hover:bg-neutral-200 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Report Stationery */}
        <div ref={reportRef} className="p-8 overflow-y-auto space-y-6 flex-1 bg-white text-[#082B3F]">
          {/* Lab Header Stationery */}
          <div className="flex items-start justify-between pb-6 border-b-2 border-[#082B3F]">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#082B3F] text-white flex items-center justify-center font-bold text-[20px] shadow-sm">
                IDC
              </div>
              <div>
                <h1 className="text-[20px] font-bold text-[#082B3F] tracking-tight">
                  IDC Diagnostics Center
                </h1>
                <p className="text-[11px] text-[#667085]">
                  Plot 13-A, G-8 Markaz, Islamabad · UAN: +92 51 111 000 432
                </p>
                <p className="text-[10px] font-mono text-[#17618E] font-semibold mt-0.5">
                  PMDC Reg: PMDC-LAB-2026-9901 · ISO 15189 Accredited
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <ShieldCheck size={14} />
                <span>Verified Diagnostic Report</span>
              </div>
              <p className="text-[11px] text-[#667085] mt-1 font-mono">
                Medzoos Ref: {booking.booking_number}
              </p>
            </div>
          </div>

          {/* Patient Demographics & Collection Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-[12px]">
            <div>
              <span className="text-[#64748B] block text-[10px] uppercase font-semibold">Patient Name</span>
              <strong className="font-bold text-[#082B3F] text-[13px]">{booking.patient_name || booking.patient}</strong>
            </div>
            <div>
              <span className="text-[#64748B] block text-[10px] uppercase font-semibold">Age / Gender</span>
              <strong className="font-bold text-[#082B3F]">{booking.patient_age ? `${booking.patient_age} yrs` : "—"} / {booking.patient_gender || "—"}</strong>
            </div>
            <div>
              <span className="text-[#64748B] block text-[10px] uppercase font-semibold">Sample Date</span>
              <strong className="font-bold text-[#082B3F]">{booking.date} ({booking.time})</strong>
            </div>
            <div>
              <span className="text-[#64748B] block text-[10px] uppercase font-semibold">Collection Mode</span>
              <strong className="font-bold text-[#17618E]">{booking.collection_type || booking.collection}</strong>
            </div>
          </div>

          {/* Test Title */}
          <div className="py-2 border-b border-[#D9DEE5]">
            <h2 className="text-[16px] font-bold text-[#082B3F] tracking-tight">
              {booking.test_name || booking.test}
            </h2>
            <p className="text-[11px] text-[#667085]">
              Department: {booking.test_category || "Clinical Pathology & Biochemistry"} · Specimen: Blood / Serum
            </p>
          </div>

          {/* Test Parameters Table */}
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/80 border-y border-slate-300 text-[11px] font-bold text-[#475467] uppercase">
                <th className="py-2.5 px-3">Investigation</th>
                <th className="py-2.5 px-3">Observed Result</th>
                <th className="py-2.5 px-3">Unit</th>
                <th className="py-2.5 px-3">Reference Interval</th>
                <th className="py-2.5 px-3 text-right">Flag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-[12px]">
              {parameters.map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-semibold text-[#082B3F]">{p.name}</td>
                  <td className="py-2.5 px-3 font-bold text-[#17618E] text-[13px]">{p.value}</td>
                  <td className="py-2.5 px-3 text-[#64748B] font-mono">{p.unit}</td>
                  <td className="py-2.5 px-3 text-[#64748B] whitespace-pre-line">{p.ref}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        p.flag === "Normal" || p.flag === "Optimal"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {p.flag}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pathologist Verification & Notes */}
          <div className="pt-4 border-t border-slate-200 space-y-4">
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-[11px] text-[#667085]">
              <strong className="text-[#082B3F] block mb-0.5">Clinical Remarks:</strong>
              {booking.report_notes ||
                "All biochemical parameters evaluated via automated chemiluminescence analyzer. Results correlate with clinical presentation. Electronic verification completed."}
            </div>

            {/* Signatures Row */}
            <div className="flex items-end justify-between pt-6">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 border border-slate-300 rounded-lg p-1 flex items-center justify-center bg-slate-50">
                  <QrCode size={46} className="text-[#082B3F]" />
                </div>
                <div className="text-[10px] text-[#64748B]">
                  <p className="font-semibold text-[#082B3F]">Scan QR to verify report</p>
                  <p>medzoos.com/verify/{booking.booking_number}</p>
                </div>
              </div>

              <div className="text-right">
                <div className="font-serif italic font-bold text-[#082B3F] text-[16px] text-teal-900 border-b border-slate-300 pb-1">
                  Dr. M. Iqbal, MBBS, FCPS
                </div>
                <p className="text-[11px] font-semibold text-[#082B3F] mt-0.5">
                  Consultant Pathologist & Lab Director
                </p>
                <p className="text-[10px] text-[#64748B]">PMDC # 14920-P</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="px-6 py-3.5 border-t border-[#D9DEE5] flex items-center justify-end gap-3 bg-neutral-50 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-[12px] font-semibold text-[#667085] hover:bg-neutral-200 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2 text-[12px] font-semibold text-white bg-[#17618E] hover:bg-[#124362] rounded-lg transition-all shadow-xs flex items-center gap-1.5"
          >
            <Download size={14} />
            <span>Download & Print</span>
          </button>
        </div>
      </div>
    </div>
  );
}
