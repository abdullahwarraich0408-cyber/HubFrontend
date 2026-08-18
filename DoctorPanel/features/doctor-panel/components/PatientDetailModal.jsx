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
  Stethoscope
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
      className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200"
      onClick={onClose}
    >
      {/* 640px Right-side Drawer Panel */}
      <div
        className="bg-white h-full w-full max-w-[640px] shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-teal-50 text-teal-700 font-bold text-base flex items-center justify-center border border-teal-200/80">
              {patient.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">{patient.name}</h3>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-0.5">
                {patient.phone && <span>{patient.phone}</span>}
                <span>•</span>
                <span>{patient.appointmentsCount || 1} Total Visits</span>
                <span>•</span>
                <span>Last visit: {patient.lastVisit || "Recent"}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Segmented Tab Bar */}
        <div className="flex border-b border-slate-200 bg-white px-5 gap-4 shrink-0 text-xs font-semibold">
          {[
            { id: "overview", label: "Overview", icon: Activity },
            { id: "consultations", label: "Consultations", icon: Stethoscope },
            { id: "prescriptions", label: "Prescriptions", icon: Pill },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 flex items-center gap-1.5 border-b-2 transition-all ${
                  isActive
                    ? "border-teal-600 text-teal-700 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-5">
              {/* Structured Medical Info Rows */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[10px] text-slate-400">
                  Known Medical Conditions
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {conditionsList.length > 0 ? (
                    conditionsList.map((cond, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-teal-50 text-teal-800 rounded-md border border-teal-200/80 font-semibold"
                      >
                        {cond}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 italic">No specific medical conditions logged.</span>
                  )}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[10px] text-slate-400">
                  Patient Summary Records
                </h4>
                <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-xl bg-slate-50/50 overflow-hidden">
                  <div className="p-3.5 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Total Consultations Attended:</span>
                    <span className="font-bold text-slate-900 font-mono">{patient.appointmentsCount || 1}</span>
                  </div>
                  <div className="p-3.5 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Primary Contact Number:</span>
                    <span className="font-bold text-slate-900">{patient.phone || "Not provided"}</span>
                  </div>
                  <div className="p-3.5 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Most Recent Visit Date:</span>
                    <span className="font-bold text-slate-900">{patient.lastVisit || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONSULTATIONS VERTICAL TIMELINE */}
          {activeTab === "consultations" && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[10px] text-slate-400">
                Consultation History Timeline
              </h4>
              <div className="relative pl-6 border-l-2 border-teal-500/30 space-y-6">
                <div className="relative">
                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-teal-600 border-2 border-white" />
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{patient.lastVisit || "Recent Visit"}</span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-200/60">
                        <Video size={10} /> Video Consultation
                      </span>
                    </div>
                    <p className="text-slate-600">
                      <strong>Reason:</strong> {patient.condition || "Routine health checkup"}
                    </p>
                    <p className="text-slate-500 text-[11px] italic">
                      Doctor Notes: Patient responded well to initial guidance. Follow-up suggested if symptoms persist.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRESCRIPTIONS LIST */}
          {activeTab === "prescriptions" && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[10px] text-slate-400">
                Issued Prescriptions
              </h4>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-slate-900">Prescription Record #{patient.id || "1"}</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">Issued on {patient.lastVisit || "Recent Date"}</p>
                </div>
                <button className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors">
                  View Prescription
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Close Record
          </button>
        </div>
      </div>
    </div>
  );
}

