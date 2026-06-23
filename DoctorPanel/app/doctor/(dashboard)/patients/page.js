"use client";

import { useState } from "react";
import { PatientDetailModal } from "@/features/doctor-panel/components/PatientDetailModal";
import { useDoctorPortalPatients } from "@/lib/hooks/usePartnerPortal";

export default function DoctorPatientsPage() {
  const { data: patients = [], isLoading } = useDoctorPortalPatients();
  const [selectedPatient, setSelectedPatient] = useState(null);

  if (isLoading) {
    return <div className="text-neutral-500 text-sm">Loading patients...</div>;
  }

  return (
    <>
      <div className="animate-in fade-in zoom-in-95 duration-500">
        <div className="mb-8">
          <h1 className="text-[28px] font-heading font-extrabold text-ink-headline tracking-tight">Patients</h1>
          <p className="text-[14px] text-neutral-500 mt-1">View your patient records and history.</p>
        </div>

        <div className="bg-white rounded-[16px] border border-neutral-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-[12px] font-bold text-neutral-500 uppercase tracking-wider">
                  <th className="p-4 pl-6">Patient</th>
                  <th className="p-4">Visits</th>
                  <th className="p-4">Last Visit</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {patients.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-neutral-500 text-sm">
                      No patients yet.
                    </td>
                  </tr>
                ) : (
                  patients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand-light text-brand-primary flex items-center justify-center font-bold text-xs">
                            {patient.name.charAt(0)}
                          </div>
                          <span className="text-[14px] font-medium text-neutral-700">{patient.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-[13px] text-neutral-600">{patient.appointmentsCount}</td>
                      <td className="p-4 text-[13px] text-neutral-600">{patient.lastVisit}</td>
                      <td className="p-4 text-[13px] font-medium text-neutral-700">{patient.condition}</td>
                      <td className="p-4 pr-6 text-right">
                        <button
                          onClick={() => setSelectedPatient(patient)}
                          className="px-3 py-1.5 text-[12px] font-semibold text-brand-primary border border-brand-primary/30 rounded-md hover:bg-brand-light transition-colors"
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <PatientDetailModal patient={selectedPatient} onClose={() => setSelectedPatient(null)} />
    </>
  );
}
