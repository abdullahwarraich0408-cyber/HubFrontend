"use client";

import { useMemo, useState } from "react";
import { Users, Search, ChevronRight, Eye, Phone } from "lucide-react";
import { PatientDetailModal } from "@/features/doctor-panel/components/PatientDetailModal";
import { useDoctorPortalPatients } from "@/lib/hooks/usePartnerPortal";

export default function DoctorPatientsPage() {
  const { data: patients = [], isLoading } = useDoctorPortalPatients();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [search, setSearch] = useState("");

  const filteredPatients = useMemo(() => {
    if (!search.trim()) return patients;
    const q = search.toLowerCase();
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.phone && p.phone.toLowerCase().includes(q)) ||
        (p.condition && p.condition.toLowerCase().includes(q))
    );
  }, [patients, search]);

  const totalPatientsCount = patients.length;
  const seenThisMonthCount = useMemo(
    () => patients.filter((p) => (p.appointmentsCount || 0) > 0).length,
    [patients]
  );
  const followUpsDueCount = Math.min(4, totalPatientsCount);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-slate-500 text-xs font-medium">
        Loading patient directory...
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 animate-in fade-in duration-200">
        {/* Header & Small Text Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Patient Directory</h1>
            {/* Small text summary */}
            <p className="text-xs text-slate-600 mt-1 font-medium flex items-center gap-2">
              <span className="font-bold text-slate-900">{totalPatientsCount} Patients</span>
              <span className="text-slate-300">•</span>
              <span>{seenThisMonthCount} seen this month</span>
              <span className="text-slate-300">•</span>
              <span className="text-teal-700 font-semibold">{followUpsDueCount} follow-ups due</span>
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search patient name, phone or condition..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition-colors"
            />
          </div>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
            >
              Reset Search
            </button>
          )}
        </div>

        {/* DESKTOP TABLE VIEW */}
        <div className="hidden md:block bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
          {filteredPatients.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <Users size={28} className="mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-bold text-slate-900">No patients found</p>
              <p className="text-[11px] text-slate-500 mt-1">Try adjusting your search parameters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th scope="col" className="py-3 px-4 pl-6">Patient</th>
                    <th scope="col" className="py-3 px-4">Contact</th>
                    <th scope="col" className="py-3 px-4">Last Visit</th>
                    <th scope="col" className="py-3 px-4">Visits</th>
                    <th scope="col" className="py-3 px-4">Conditions</th>
                    <th scope="col" className="py-3 px-4 pr-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredPatients.map((patient) => {
                    const condList = patient.condition
                      ? patient.condition.split(",").map((c) => c.trim())
                      : ["General"];
                    const visibleConds = condList.slice(0, 2);
                    const remainingCount = condList.length - 2;

                    return (
                      <tr
                        key={patient.id}
                        onClick={() => setSelectedPatient(patient)}
                        className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                      >
                        <td className="py-3.5 px-4 pl-6">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-200">
                              {patient.name.charAt(0)}
                            </div>
                            <span className="font-semibold text-slate-900 group-hover:text-teal-700 transition-colors">
                              {patient.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-mono">
                          {patient.phone || "Not provided"}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {patient.lastVisit || "Recent"}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-900 font-mono">
                          {patient.appointmentsCount || 1}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {visibleConds.map((c, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                              >
                                {c}
                              </span>
                            ))}
                            {remainingCount > 0 && (
                              <span className="text-[10px] text-slate-400 font-medium">
                                +{remainingCount} more
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 pr-6 text-right whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPatient(patient);
                            }}
                            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold transition-colors shadow-2xs inline-flex items-center gap-1"
                          >
                            <Eye size={13} />
                            <span>View Record</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* MOBILE COMPACT LIST ROWS */}
        <div className="md:hidden space-y-2">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              onClick={() => setSelectedPatient(patient)}
              className="bg-white rounded-xl border border-slate-200/80 p-3.5 flex items-center justify-between gap-3 shadow-2xs active:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200">
                  {patient.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-xs text-slate-900 truncate">{patient.name}</h4>
                  <p className="text-[11px] text-slate-500 truncate">
                    Last visit: {patient.lastVisit || "Recent"} • {patient.appointmentsCount || 1} visits
                  </p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-400 shrink-0" />
            </div>
          ))}
        </div>
      </div>

      <PatientDetailModal patient={selectedPatient} onClose={() => setSelectedPatient(null)} />
    </>
  );
}
