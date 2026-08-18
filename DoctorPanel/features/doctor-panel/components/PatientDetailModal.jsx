"use client";

import { useState } from "react";
import {
  X,
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  FileText,
  Activity,
  Pill,
  ChevronRight,
  Shield,
  Video,
  MapPin,
  Stethoscope,
  Sparkles,
  Download,
  CheckCircle2
} from "lucide-react";

export function PatientDetailModal({ patient, onClose }) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!patient) return null;

  const conditionsList = Array.isArray(patient.conditions)
    ? patient.conditions
    : patient.condition
      ? patient.condition.split(",").map((c) => c.trim())
      : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/70 backdrop-blur-md transition-all duration-300 animate-in fade-in"
      onClick={onClose}
    >
      {/* 640px Right-side Drawer Panel */}
      <div
        className="bg-white h-full w-full max-w-[640px] shadow-2xl flex flex-col border-l border-slate-200/80 transform transition-all duration-300 animate-in slide-in-from-right overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-6 bg-[#0A0F1D] text-white border-b border-white/10 flex items-center justify-between shrink-0 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white font-extrabold text-lg flex items-center justify-center shadow-lg shadow-teal-500/20 border border-white/20 shrink-0">
              {patient.name ? patient.name.charAt(0).toUpperCase() : "P"}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight leading-tight">{patient.name}</h3>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mt-1">
                {patient.phone && <span className="font-mono text-teal-400">{patient.phone}</span>}
                {patient.phone && <span>•</span>}
                <span className="bg-white/10 px-2 py-0.5 rounded-full text-[10px] font-bold text-white border border-white/10">
                  {patient.appointmentsCount || 1} Total Visits
                </span>
                <span>•</span>
                <span>Last visit: {patient.lastVisit || "Recent"}</span>
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

        {/* Segmented Tab Bar */}
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

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs bg-slate-50/40">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-5">
              {/* Structured Medical Info Rows */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[10px] text-slate-400 flex items-center gap-1.5">
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
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[10px] text-slate-400 flex items-center gap-1.5">
                  <Shield size={13} className="text-teal-600" /> PATIENT RECORD SUMMARY
                </h4>
                <div className="divide-y divide-slate-100 border border-slate-200/70 rounded-xl bg-slate-50/50 overflow-hidden">
                  <div className="p-3.5 flex items-center justify-between">
                    <span className="text-slate-500 font-medium flex items-center gap-2">
                      <Stethoscope size={14} className="text-slate-400" />
                      <span>Total Consultations Attended:</span>
                    </span>
                    <span className="font-bold text-slate-900 font-mono bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-md border border-teal-200">
                      {patient.appointmentsCount || 1}
                    </span>
                  </div>
                  <div className="p-3.5 flex items-center justify-between">
                    <span className="text-slate-500 font-medium flex items-center gap-2">
                      <Phone size={14} className="text-slate-400" />
                      <span>Primary Contact Phone:</span>
                    </span>
                    <span className="font-bold text-slate-900 font-mono">{patient.phone || "Not provided"}</span>
                  </div>
                  <div className="p-3.5 flex items-center justify-between">
                    <span className="text-slate-500 font-medium flex items-center gap-2">
                      <Calendar size={14} className="text-slate-400" />
                      <span>Most Recent Visit Date:</span>
                    </span>
                    <span className="font-bold text-slate-900">{patient.lastVisit || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONSULTATIONS VERTICAL TIMELINE */}
          {activeTab === "consultations" && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[10px] text-slate-400 flex items-center gap-1.5">
                <Clock size={13} className="text-teal-600" /> CONSULTATION HISTORY TIMELINE
              </h4>
              <div className="relative pl-6 border-l-2 border-teal-500/30 space-y-6">
                <div className="relative">
                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-teal-600 border-2 border-white ring-4 ring-teal-100" />
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">{patient.lastVisit || "Recent Visit"}</span>
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-teal-50 text-teal-800 px-2.5 py-1 rounded-full border border-teal-200">
                        <Video size={12} className="text-teal-600" /> Video Consultation
                      </span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                      <strong className="text-slate-700 block mb-0.5">Primary Concern / Reason:</strong>
                      <p className="text-slate-600">{patient.condition || "Routine health checkup and consultation."}</p>
                    </div>
                    <p className="text-slate-500 text-[11px] italic bg-amber-50/50 border border-amber-100 p-2.5 rounded-xl">
                      <strong>Doctor Clinical Notes:</strong> Patient responded well to initial guidance. Follow-up suggested if symptoms persist.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRESCRIPTIONS LIST */}
          {activeTab === "prescriptions" && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[10px] text-slate-400 flex items-center gap-1.5">
                <Pill size={13} className="text-teal-600" /> ISSUED DIGITAL PRESCRIPTIONS
              </h4>
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200/60 shrink-0">
                    <Pill size={20} />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">Rx Record #{patient.id || "1"}</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">Issued on {patient.lastVisit || "Recent Date"}</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2">
                  <Download size={14} />
                  <span>View Prescription</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
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
  );
}


